// IV end time helper. Pure functions, no DOM access.
// Assumes the device time zone is Philippine time (UTC+8). No daylight saving time.
(function (root) {
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const DATETIME_LOCAL = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;

  // Empty input and non-numeric text become NaN.
  function toNumber(value) {
    if (value === null || value === undefined || String(value).trim() === '') return NaN;
    return Number(value);
  }

  // value: the string from <input type="datetime-local">, for example "2026-10-12T10:17".
  // Returns a local Date, or null when the value is blank or not a real date and time.
  function parseStart(value) {
    const match = DATETIME_LOCAL.exec(String(value || ''));
    if (!match) return null;
    const [year, month, day, hour, minute] = match.slice(1).map(Number);
    const date = new Date(year, month - 1, day, hour, minute, 0, 0);
    // Reject values that the Date constructor silently rolled over, such as 31 Feb.
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return null;
    if (date.getHours() !== hour || date.getMinutes() !== minute) return null;
    return date;
  }

  // startValue: the datetime-local string. runHours: total run time in hours.
  // Returns the end Date, or null when any input is invalid.
  function computeIvEndTime(startValue, runHours) {
    const start = parseStart(startValue);
    const hours = toNumber(runHours);
    if (!start) return null;
    if (!Number.isFinite(hours) || hours < 0) return null;

    const runMinutes = Math.round(hours * 60);
    return new Date(start.getTime() + runMinutes * 60000);
  }

  // Returns "Mon 13 Oct, 2:30 PM". Manual formatting keeps output the same on every device.
  function formatIvEndTime(date) {
    const h24 = date.getHours();
    const h12 = h24 % 12 || 12;
    const mm = String(date.getMinutes()).padStart(2, '0');
    const period = h24 >= 12 ? 'PM' : 'AM';
    return `${DAYS[date.getDay()]} ${date.getDate()} ${MONTHS[date.getMonth()]}, ${h12}:${mm} ${period}`;
  }

  const api = { computeIvEndTime, formatIvEndTime };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = api;
  } else {
    root.IvEndTime = api;
  }
})(typeof window !== 'undefined' ? window : globalThis);
