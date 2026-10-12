const { test } = require('node:test');
const assert = require('node:assert/strict');

// The helper is a browser script with no module exports under the parent package.json ESM setting.
// Run it in an isolated VM context so it sets its global API the same way the browser does.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '..', 'iv-end-time.js'), 'utf8'), context);
const { computeIvEndTime, formatIvEndTime } = context.IvEndTime;

test('12 AM start maps to 00:00', () => {
  const end = computeIvEndTime('2026-10-12T00:00', 1);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 1:00 AM');
});

test('12 PM start maps to 12:00', () => {
  const end = computeIvEndTime('2026-10-12T12:00', 2);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 2:00 PM');
});

test('11:59 PM plus one hour rolls the date to the next day', () => {
  const end = computeIvEndTime('2026-10-12T23:59', 1);
  assert.equal(formatIvEndTime(end), 'Tue 13 Oct, 12:59 AM');
});

test('multi-day run moves the date several days ahead', () => {
  const end = computeIvEndTime('2026-10-12T14:30', 50);
  assert.equal(formatIvEndTime(end), 'Wed 14 Oct, 4:30 PM');
});

test('start date is taken from the input, not from today', () => {
  const end = computeIvEndTime('2026-12-31T22:00', 3);
  assert.equal(formatIvEndTime(end), 'Fri 1 Jan, 1:00 AM');
});

test('fractional hours round to the nearest minute', () => {
  // 1.005 h = 60.3 min, rounds to 60 min.
  const end = computeIvEndTime('2026-10-12T09:00', 1.005);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 10:00 AM');
  // 0.5 h = 30 min exactly.
  const half = computeIvEndTime('2026-10-12T09:15', 0.5);
  assert.equal(formatIvEndTime(half), 'Mon 12 Oct, 9:45 AM');
});

test('minute stays two digits', () => {
  const end = computeIvEndTime('2026-10-12T03:05', 0);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 3:05 AM');
});

test('zero run time returns the start time', () => {
  const end = computeIvEndTime('2026-10-12T16:20', 0);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 4:20 PM');
});

test('blank start returns null', () => {
  assert.equal(computeIvEndTime('', 2), null);
  assert.equal(computeIvEndTime(undefined, 2), null);
});

test('malformed or impossible start values return null', () => {
  assert.equal(computeIvEndTime('2026-10-12 10:17', 2), null);
  assert.equal(computeIvEndTime('2026-02-31T10:00', 2), null);
  assert.equal(computeIvEndTime('2026-10-12T25:00', 2), null);
  assert.equal(computeIvEndTime('2026-10-12T10:60', 2), null);
});

test('invalid run hours return null', () => {
  const start = '2026-10-12T05:00';
  assert.equal(computeIvEndTime(start, NaN), null);
  assert.equal(computeIvEndTime(start, ''), null);
  assert.equal(computeIvEndTime(start, -1), null);
  assert.equal(computeIvEndTime(start, Infinity), null);
});

test('mutation check: a 24-hour conversion bug would fail the PM case', () => {
  // Without the +12 for PM, 2:00 PM would give 2:00 AM. The helper now reads 24-hour input,
  // so the check is that 14:00 gives 2:00 PM.
  const end = computeIvEndTime('2026-10-12T14:00', 0);
  assert.equal(formatIvEndTime(end), 'Mon 12 Oct, 2:00 PM');
});
