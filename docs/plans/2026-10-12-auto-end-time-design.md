# Design: Auto-Compute End Time in IV Flow Rate Card

Status: Accepted by the user on 2026-10-12. Not implemented.

## 1. Understanding Summary

- What: A start-time input and a computed end time in the IV Flow Rate card.
- Why: The nurse needs to know hours to run and the clock time a bag ends.
- Who: ICU nurses and clinical staff at the bedside.
- Key constraints: Vanilla HTML, CSS, and JavaScript. Runs offline in the browser. No server.
- Non-goals: No per-drug drip calculator change. No elapsed or remaining time tracking. No saved patient data. No change to the Drop Rate card.

## 2. Assumptions

- A1: The result updates live on every input change. No Calculate button.
- A2: Start time uses a 12-hour clock with AM and PM selects.
- A3: An end time past midnight moves the date to the next day.
- A4: The feature runs fully in the browser with no network.
- A5: The result shows only when hour, minute, AM/PM, volume, and rate are all valid.
- A6: The device time zone is Philippine time (UTC+8). The Philippines has no daylight saving time.

## 3. Open Questions

None.

## 4. Decision Log

- D1: Feature lives in the IV Flow Rate card only.
  - Alternatives: Flow Rate and Drop Rate cards both.
  - Why: Matches the request. Smallest change. Drop Rate card stays unchanged.
- D2: Start time uses a 12-hour clock.
  - Alternatives: 24-hour clock input.
  - Why: The user chose 12-hour clock (A2).
- D3: End time shows date and time.
  - Alternatives: Time only.
  - Why: A bag that runs past midnight needs the date.
- D4: Edit the root copy, then sync to all copies.
  - Copies: `wwwroot/`, `desktop-app/wwwroot/`, `android-apk/app/src/main/assets/`.
  - Why: All copies match today. The root is the source.
- D5: Start-time controls are hour select, minute select, and AM/PM select.
  - Alternatives: Free-text time field (`2:30 PM`).
  - Why: Selects prevent bad input. Free text needs parsing rules. The product principle is error-proofed input.
- D6: End time uses run hours from whichever mode is active.
  - Reverse mode: run hours = volume ÷ rate.
  - Forward mode: run hours = typed hours.
  - Why: Both modes then give an end time.

## 5. Final Design

### 5.1 Inputs

- Location: "2. Infusion Time Duration" block in the IV Flow Rate card (`app.js`, Flow Rate card, about line 1540).
- New controls below the hours input:
  - Hour select: 1 to 12. Blank by default.
  - Minute select: 00 to 59, one-minute steps. Blank by default.
  - AM/PM select. Blank by default.
- Start date: not shown. Uses today's date from the device clock at calculation time.
- Touch target: at least 44 px tall (`PRODUCT.md`).
- Style: existing `input-field` class and `preset-chip-btn` class.

### 5.2 Computation

- Run hours = volume ÷ rate in reverse mode. Reuse the existing calculation near line 3013.
- Run hours = typed hours in forward mode.
- Start instant = today, plus hour (12 AM = 00, 12 PM = 12), plus minute.
- End instant = start instant + run hours, rounded to the nearest minute.
- The computation is a pure function. Input: start hour, minute, AM/PM, run hours, start date. Output: end date and time. It has no DOM access.

### 5.3 Output

- Display line below the run hours result: "Ends: Mon 13 Oct, 2:30 PM".
- Weekday, day, month, 12-hour time.
- The line is hidden until A5 holds.

### 5.4 Error Handling

- Partial start input: no end line. No error banner.
- Rate of 0 or below: no end line.
- Blank volume: no end line.
- Switching forward and reverse keeps start-time values.

### 5.5 Edge Cases

- Run longer than 24 hours: end date moves several days ahead. Shown as-is.
- Very low rate: very long run time. Shown as-is, same as the current reverse mode.
- Values are not saved. No storage.

### 5.6 Testing

- Unit tests for the pure end-time function:
  - 12 AM start and 12 PM start.
  - 11:59 PM start plus one hour (date rolls over).
  - Multi-day run.
  - Fractional minutes and rounding.
  - Zero rate.
  - Blank input.
- Browser check at 390 px and 1280 px:
  - Select touch size.
  - Result line placement.
  - Live update on change.
- Byte-compare all four copies after the edit (D4).
- Check whether `test_table.js` or `full_system_check.js` runs in CI or locally. Decide at implementation time.

## 6. Risks

- R1: Device clock or time zone is wrong. End time is wrong. Mitigation: A6 states the assumption. The nurse checks the device clock.
- R2: Four copies drift apart. Mitigation: D4 and a byte-compare step after each edit.
- R3: No automated test runner is confirmed for the browser code. Mitigation: unit tests for the pure function plus manual browser checks.
