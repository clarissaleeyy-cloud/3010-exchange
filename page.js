// ─────────────────────────────────────────────────────────
// CONFIG — edit these values
// ─────────────────────────────────────────────────────────
const CONFIG = {
  // From your Google Sheet's URL: docs.google.com/spreadsheets/d/THIS_PART/edit#gid=THAT_PART
  SHEET_ID: "1g-WNjrLxEmLLx_iFH-IjdopP-n4na6kc0xiWloDWxnQ",
  SHEET_GID: "0", // the gid= number for the specific tab (0 is usually the first tab)

  TARGET_DATE_ISO: "2027-01-09T07:55:00+08:00", // 9 Jan 2027, 7:55am SGT — when you meet again
  START_DATE_ISO: "2026-09-11T00:00:00+08:00",  // the day the countdown "starts" — used for the progress bar

  // How to read an all-numeric date like 8/9/2026 in your sheet.
  // "day-first" reads it as 8 September. "month-first" reads it as 9 August.
  DATE_ORDER: "day-first",

  // Which month the calendar opens on. Months are 0-indexed: 7 = August.
  CALENDAR_START_YEAR: 2026,
  CALENDAR_START_MONTH: 7, // August

  // Free, no-signup shared counter for the "send love" button.
  // Change LOVE_NAMESPACE to something unique to you two so your count
  // doesn't mix with anyone else's — e.g. "yourname-bfname-2026".
  LOVE_NAMESPACE: "seeing-you-again-soon-CHANGE-ME",
  LOVE_COUNTER: "send-love",

  // His location, for the timezone clock and weather widget.
  HIS_CITY_NAME: "Irvine, California",
  HIS_TIMEZONE: "America/Los_Angeles",
  HIS_LAT: 33.6846,
  HIS_LON: -117.8265,

  YOUR_CITY_NAME: "Singapore",
  YOUR_TIMEZONE: "Asia/Singapore"
};

// Mood icon artwork + display labels. Swap paths for your own image
// files (e.g. icons/moods/penguin-angry.jpeg) if you'd like to use
// your own screenshots — just make sure the filenames below match
// exactly (including .jpeg vs .jpg). If a file is missing, the page
// quietly falls back to the bundled .svg version.
const MOOD_ICONS = {
  surprise: { src: "icons/moods/penguin-angry.jpeg",   alt: "a mystery penguin",                     label: "it's a surprise!" },
  sad:      { src: "icons/moods/penguin-sad.jpeg",     alt: "a sad little penguin",                  label: "sad" },
  homesick: { src: "icons/moods/penguin-homesick.jpeg",alt: "a wistful penguin looking toward home", label: "homesick" },
  happy:    { src: "icons/moods/penguin-happy.jpg",    alt: "a cheerful penguin with open flippers", label: "happy hehe" },
  general:  { src: "icons/moods/seal-general.jpeg",    alt: "a friendly little seal",                label: "i love you!" }
};

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ═════════════════════════ timezone clocks ═════════════════════════

// Reads the wall-clock time in a given IANA timezone.
function timePartsIn(timeZone){
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone, hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(new Date()).reduce((acc, p) => (acc[p.type] = p.value, acc), {});

  let h = parseInt(parts.hour, 10);
  if (h === 24) h = 0; // some engines report midnight as 24
  return { h, m: parseInt(parts.minute, 10), s: parseInt(parts.second, 10) };
}

// 12-hour display string, e.g. "9:42 pm"
function formatDigital({ h, m }){
  const suffix = h < 12 ? 'am' : 'pm';
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${suffix}`;
}

// How many hours a timezone sits ahead of UTC right now.
function utcOffsetHours(timeZone, date){
  const p = new Intl.DateTimeFormat('en-GB', {
    timeZone, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(date).reduce((acc, x) => (acc[x.type] = x.value, acc), {});

  let hour = parseInt(p.hour, 10);
  if (hour === 24) hour = 0;
  const asIfUTC = Date.UTC(+p.year, +p.month - 1, +p.day, hour, +p.minute, +p.second);
  return (asIfUTC - date.getTime()) / 3600000;
}

function setHand(id, degrees){
  const el = document.getElementById(id);
  if (el) el.setAttribute('transform', `rotate(${degrees} 50 50)`);
}

// Avoids the second hand spinning backwards through 359° → 0°.
const handRotation = { 'sg-sec': 0, 'his-sec': 0 };
function setSecondHand(id, seconds){
  const target = seconds * 6;
  let current = handRotation[id];
  const base = Math.floor(current / 360) * 360;
  let next = base + target;
  if (next < current) next += 360;
  handRotation[id] = next;
  setHand(id, next);
}

function updateClocks(){
  const sg  = timePartsIn(CONFIG.YOUR_TIMEZONE);
  const his = timePartsIn(CONFIG.HIS_TIMEZONE);

  document.getElementById('tz-time-sg').textContent  = formatDigital(sg);
  document.getElementById('tz-time-his').textContent = formatDigital(his);

  setHand('sg-hour',  (sg.h % 12) * 30 + sg.m * 0.5);
  setHand('sg-min',   sg.m * 6 + sg.s * 0.1);
  setSecondHand('sg-sec', sg.s);

  setHand('his-hour', (his.h % 12) * 30 + his.m * 0.5);
  setHand('his-min',  his.m * 6 + his.s * 0.1);
  setSecondHand('his-sec', his.s);

  // the gap between you two, written from HIS side of the world
  const now = new Date();
  // positive when Singapore is ahead of Irvine, which it always is
  const diff = utcOffsetHours(CONFIG.YOUR_TIMEZONE, now) - utcOffsetHours(CONFIG.HIS_TIMEZONE, now);
  const whole = Math.round(Math.abs(diff));
  const direction = diff >= 0 ? 'ahead of' : 'behind';

  // "same day" is judged from his calendar date, not hers
  const dayIn = tz => new Intl.DateTimeFormat('en-CA', {
    timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
  const sameDay = dayIn(CONFIG.HIS_TIMEZONE) === dayIn(CONFIG.YOUR_TIMEZONE);
  const dayNote = sameDay
    ? "you're both on the same date right now"
    : (diff >= 0 ? "she's already on tomorrow" : "she's still on yesterday");

  document.getElementById('tz-gap').textContent =
    `Singapore is ${whole} hours ${direction} you — ${dayNote}.`;
}

document.getElementById('his-city-label').textContent = 'your time \u2014 Irvine';
updateClocks();
setInterval(updateClocks, 1000);

// ═════════════════════════ weather ═════════════════════════

// Small hand-drawn-feeling weather icons, matched to the page palette.
const WEATHER_ART = {
  sun: `
    <svg viewBox="0 0 100 100">
      <g stroke="#e0a63a" stroke-width="5" stroke-linecap="round">
        <line x1="50" y1="8"  x2="50" y2="20"/>
        <line x1="50" y1="80" x2="50" y2="92"/>
        <line x1="8"  y1="50" x2="20" y2="50"/>
        <line x1="80" y1="50" x2="92" y2="50"/>
        <line x1="20" y1="20" x2="29" y2="29"/>
        <line x1="71" y1="71" x2="80" y2="80"/>
        <line x1="20" y1="80" x2="29" y2="71"/>
        <line x1="71" y1="29" x2="80" y2="20"/>
      </g>
      <circle cx="50" cy="50" r="21" fill="#f3c65c" stroke="#e0a63a" stroke-width="3"/>
    </svg>`,
  partly: `
    <svg viewBox="0 0 100 100">
      <g stroke="#e0a63a" stroke-width="4.5" stroke-linecap="round">
        <line x1="38" y1="6"  x2="38" y2="16"/>
        <line x1="8"  y1="36" x2="18" y2="36"/>
        <line x1="16" y1="14" x2="23" y2="21"/>
        <line x1="60" y1="14" x2="53" y2="21"/>
      </g>
      <circle cx="38" cy="36" r="16" fill="#f3c65c" stroke="#e0a63a" stroke-width="3"/>
      <g fill="#ffffff" stroke="#b9c9d8" stroke-width="3" stroke-linejoin="round">
        <path d="M34 78 A14 14 0 0 1 36 50 A17 17 0 0 1 68 52 A13 13 0 0 1 70 78 Z"/>
      </g>
    </svg>`,
  cloudy: `
    <svg viewBox="0 0 100 100">
      <g fill="#e6eef5" stroke="#b0c2d2" stroke-width="3" stroke-linejoin="round">
        <path d="M22 58 A12 12 0 0 1 24 34 A15 15 0 0 1 52 36 A11 11 0 0 1 54 58 Z"/>
      </g>
      <g fill="#ffffff" stroke="#b0c2d2" stroke-width="3.2" stroke-linejoin="round">
        <path d="M32 82 A15 15 0 0 1 34 52 A18 18 0 0 1 68 54 A14 14 0 0 1 70 82 Z"/>
      </g>
    </svg>`,
  fog: `
    <svg viewBox="0 0 100 100">
      <g fill="#ffffff" stroke="#b0c2d2" stroke-width="3.2" stroke-linejoin="round">
        <path d="M26 58 A15 15 0 0 1 28 28 A18 18 0 0 1 62 30 A14 14 0 0 1 64 58 Z"/>
      </g>
      <g stroke="#adc3d4" stroke-width="5" stroke-linecap="round">
        <line x1="20" y1="70" x2="76" y2="70"/>
        <line x1="28" y1="82" x2="68" y2="82"/>
        <line x1="24" y1="94" x2="60" y2="94"/>
      </g>
    </svg>`,
  drizzle: `
    <svg viewBox="0 0 100 100">
      <g fill="#ffffff" stroke="#adc3d4" stroke-width="3.2" stroke-linejoin="round">
        <path d="M24 56 A15 15 0 0 1 26 26 A18 18 0 0 1 60 28 A14 14 0 0 1 62 56 Z"/>
      </g>
      <g stroke="#7fb0d4" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="66" x2="28" y2="76"/>
        <line x1="48" y1="68" x2="44" y2="78"/>
        <line x1="64" y1="66" x2="60" y2="76"/>
      </g>
    </svg>`,
  rain: `
    <svg viewBox="0 0 100 100">
      <g fill="#e6eef5" stroke="#9db4c7" stroke-width="3" stroke-linejoin="round">
        <path d="M20 48 A11 11 0 0 1 22 26 A14 14 0 0 1 48 28 A10 10 0 0 1 50 48 Z"/>
      </g>
      <g fill="#ffffff" stroke="#9db4c7" stroke-width="3.2" stroke-linejoin="round">
        <path d="M28 62 A15 15 0 0 1 30 32 A18 18 0 0 1 64 34 A14 14 0 0 1 66 62 Z"/>
      </g>
      <g fill="#6ba6d0">
        <path d="M34 70 C34 70 29 78 29 82 A5 5 0 0 0 39 82 C39 78 34 70 34 70 Z"/>
        <path d="M50 74 C50 74 45 82 45 86 A5 5 0 0 0 55 86 C55 82 50 74 50 74 Z"/>
        <path d="M66 70 C66 70 61 78 61 82 A5 5 0 0 0 71 82 C71 78 66 70 66 70 Z"/>
      </g>
    </svg>`,
  storm: `
    <svg viewBox="0 0 100 100">
      <g fill="#dbe6ef" stroke="#8fa6ba" stroke-width="3.2" stroke-linejoin="round">
        <path d="M26 58 A15 15 0 0 1 28 28 A18 18 0 0 1 62 30 A14 14 0 0 1 64 58 Z"/>
      </g>
      <polygon points="48,60 32,84 44,84 36,98 62,72 48,72 58,60" fill="#e8b53c" stroke="#c9931f" stroke-width="2.5" stroke-linejoin="round"/>
    </svg>`,
  snow: `
    <svg viewBox="0 0 100 100">
      <g fill="#ffffff" stroke="#adc3d4" stroke-width="3.2" stroke-linejoin="round">
        <path d="M26 56 A15 15 0 0 1 28 26 A18 18 0 0 1 62 28 A14 14 0 0 1 64 56 Z"/>
      </g>
      <g stroke="#8ec2e0" stroke-width="3" stroke-linecap="round">
        <g transform="translate(32,74)">
          <line x1="-7" y1="0" x2="7" y2="0"/><line x1="0" y1="-7" x2="0" y2="7"/>
          <line x1="-5" y1="-5" x2="5" y2="5"/><line x1="-5" y1="5" x2="5" y2="-5"/>
        </g>
        <g transform="translate(58,80)">
          <line x1="-7" y1="0" x2="7" y2="0"/><line x1="0" y1="-7" x2="0" y2="7"/>
          <line x1="-5" y1="-5" x2="5" y2="5"/><line x1="-5" y1="5" x2="5" y2="-5"/>
        </g>
      </g>
    </svg>`
};

// Open-Meteo WMO weather codes → an icon and a plain description.
function describeWeather(code){
  const map = {
    0:  ['sun',     'clear and sunny'],
    1:  ['sun',     'mostly clear'],
    2:  ['partly',  'partly cloudy'],
    3:  ['cloudy',  'overcast and cloudy'],
    45: ['fog',     'foggy'],
    48: ['fog',     'freezing fog'],
    51: ['drizzle', 'light drizzle'],
    53: ['drizzle', 'drizzling'],
    55: ['drizzle', 'heavy drizzle'],
    56: ['drizzle', 'freezing drizzle'],
    57: ['drizzle', 'freezing drizzle'],
    61: ['rain',    'light rain'],
    63: ['rain',    'raining'],
    65: ['rain',    'heavy rain'],
    66: ['rain',    'freezing rain'],
    67: ['rain',    'freezing rain'],
    71: ['snow',    'light snow'],
    73: ['snow',    'snowing'],
    75: ['snow',    'heavy snow'],
    77: ['snow',    'snow grains'],
    80: ['rain',    'light showers'],
    81: ['rain',    'rain showers'],
    82: ['rain',    'heavy showers'],
    85: ['snow',    'snow showers'],
    86: ['snow',    'heavy snow showers'],
    95: ['storm',   'thunderstorm'],
    96: ['storm',   'thunderstorm with hail'],
    99: ['storm',   'heavy thunderstorm']
  };
  return map[code] || ['partly', 'hard to say right now'];
}

async function loadHisWeather(){
  const iconEl = document.getElementById('weather-icon');
  const tempEl = document.getElementById('weather-temp');
  const descEl = document.getElementById('weather-desc');
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.HIS_LAT}`
              + `&longitude=${CONFIG.HIS_LON}&current_weather=true`
              + `&temperature_unit=celsius&timezone=${encodeURIComponent(CONFIG.HIS_TIMEZONE)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather fetch failed');
    const data = await res.json();
    const cw = data.current_weather;
    const [iconKey, description] = describeWeather(cw.weathercode);

    iconEl.innerHTML = WEATHER_ART[iconKey] || WEATHER_ART.partly;
    tempEl.textContent = `${Math.round(cw.temperature)}\u00b0C`;
    descEl.textContent = description;
  } catch (err){
    console.error('Could not load weather:', err);
    iconEl.innerHTML = WEATHER_ART.cloudy;
    tempEl.textContent = '--\u00b0C';
    descEl.textContent = "can't reach the forecast right now";
  }
}
loadHisWeather();
setInterval(loadHisWeather, 15 * 60 * 1000);

// ═════════════════════════ countdown + progress bar ═════════════════════════
function updateCountdown(){
  const target = new Date(CONFIG.TARGET_DATE_ISO).getTime();
  const start = new Date(CONFIG.START_DATE_ISO).getTime();
  const now = Date.now();
  let diff = Math.max(0, target - now);

  const day = 24*60*60*1000, hr = 60*60*1000, min = 60*1000;
  const days = Math.floor(diff / day); diff -= days*day;
  const hours = Math.floor(diff / hr); diff -= hours*hr;
  const mins = Math.floor(diff / min); diff -= mins*min;
  const secs = Math.floor(diff / 1000);

  const pad = n => String(n).padStart(2,'0');
  document.getElementById('cd-days').textContent = days;
  document.getElementById('cd-hours').textContent = pad(hours);
  document.getElementById('cd-mins').textContent = pad(mins);
  document.getElementById('cd-secs').textContent = pad(secs);

  const totalSpan = target - start;
  let pct = totalSpan > 0 ? ((now - start) / totalSpan) * 100 : 100;
  pct = Math.min(100, Math.max(0, pct));
  document.getElementById('progress-fill').style.width = pct.toFixed(1) + '%';
  document.getElementById('progress-pct').textContent = pct.toFixed(1) + '% of the wait done';
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ═════════════════════════ daily note from Google Sheet ═════════════════════════
function parseCSV(text){
  const rows = [];
  let row = [], field = '', inQuotes = false;
  for (let i=0; i<text.length; i++){
    const c = text[i];
    if (inQuotes){
      if (c === '"'){
        if (text[i+1] === '"'){ field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ','){ row.push(field); field=''; }
      else if (c === '\n'){ row.push(field); rows.push(row); row=[]; field=''; }
      else if (c === '\r'){ /* skip */ }
      else field += c;
    }
  }
  if (field.length || row.length){ row.push(field); rows.push(row); }
  return rows.filter(r => r.some(cell => cell.trim() !== ''));
}

let ALL_NOTES = [];

const MONTH_NAMES = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];

// Works out which year a bare "14 Aug" belongs to, using the exchange window.
function inferYear(monthIdx){
  const start = new Date(CONFIG.START_DATE_ISO);
  const target = new Date(CONFIG.TARGET_DATE_ISO);
  if (target.getFullYear() === start.getFullYear()) return start.getFullYear();
  // only the months at or before the target's month have wrapped round into
  // the next year — e.g. a January note during a Sept-to-Jan exchange
  return monthIdx <= target.getMonth() ? target.getFullYear() : start.getFullYear();
}

// Accepts the formats a Google Sheet date column actually shows up as:
// 2026-08-14, 14/8/2026, 8/14/2026, 14 Aug, Aug 14, 14 August 2026, 14-8-26.
function parseNoteDate(str){
  if (str === undefined || str === null) return null;
  str = String(str).trim();
  if (!str) return null;

  // ISO first — built by hand so it lands on the local day, not UTC midnight
  let m = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // a month written in words, in either order
  const lower = str.toLowerCase();
  m = lower.match(/^(\d{1,2})\s*[a-z]{0,2}[\s.\-]+([a-z]{3,})[\s,.\-]*(\d{4})?/)
   || lower.match(/^([a-z]{3,})[\s.\-]+(\d{1,2})[a-z]{0,2}[\s,.\-]*(\d{4})?/);
  if (m){
    const dayFirst = /^\d/.test(m[1]);
    const day = parseInt(dayFirst ? m[1] : m[2], 10);
    const monStr = dayFirst ? m[2] : m[1];
    const monthIdx = MONTH_NAMES.findIndex(mo => monStr.startsWith(mo));
    if (monthIdx >= 0 && day >= 1 && day <= 31){
      return new Date(m[3] ? +m[3] : inferYear(monthIdx), monthIdx, day);
    }
  }

  // all-numeric: 14/8/2026, 14-8-26, 8/14/2026
  m = str.match(/^(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})?$/);
  if (m){
    let a = +m[1], b = +m[2];
    let year = m[3] ? +m[3] : null;
    if (year !== null && year < 100) year += 2000;
    // if one of them can't be a month, that one is the day
    let day, monthIdx;
    if (a > 12){ day = a; monthIdx = b - 1; }
    else if (b > 12){ day = b; monthIdx = a - 1; }
    else if (CONFIG.DATE_ORDER === 'month-first'){ monthIdx = a - 1; day = b; }
    else { day = a; monthIdx = b - 1; }
    if (monthIdx >= 0 && monthIdx <= 11 && day >= 1 && day <= 31){
      return new Date(year !== null ? year : inferYear(monthIdx), monthIdx, day);
    }
  }

  // last resort — let the browser try
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Finds the date and message columns from the header row, so it doesn't
// matter which order you put them in. Falls back to A = date, B = message.
function findColumns(rows){
  const first = (rows[0] || []).map(c => String(c).trim().toLowerCase());
  let dateCol = first.findIndex(h => /^(date|day|when)\b/.test(h));
  let msgCol  = first.findIndex(h => /^(message|note|text|content)s?\b/.test(h));

  // A real header row never has a readable date in its date cell. Without
  // this check a first note reading "1 Aug, first note" gets eaten as a header.
  const looksLikeHeader =
    (dateCol >= 0 || msgCol >= 0) && !parseNoteDate(first[dateCol >= 0 ? dateCol : 0]);

  if (dateCol < 0) dateCol = 0;
  if (msgCol < 0)  msgCol = dateCol === 0 ? 1 : 0;
  return { dateCol, msgCol, hasHeader: looksLikeHeader };
}

function renderNotes(rows){
  if (!rows.length){
    document.getElementById('note-body').textContent = "No notes yet — add one to your sheet!";
    document.getElementById('note-date').textContent = "";
    ALL_NOTES = [];
    renderCalendar();
    return;
  }

  const { dateCol, msgCol, hasHeader } = findColumns(rows);
  const dataRows = (hasHeader ? rows.slice(1) : rows)
    .filter(r => r[msgCol] && String(r[msgCol]).trim());

  ALL_NOTES = dataRows.map(r => ({
    dateStr: r[dateCol] || '',
    message: String(r[msgCol]),
    date: parseNoteDate(r[dateCol])
  }));

  // a readable report in the console, so a mis-formatted date column is
  // obvious instead of silently producing an empty calendar
  const unparsed = ALL_NOTES.filter(n => !n.date);
  console.log(`Notes loaded: ${ALL_NOTES.length} (date column ${dateCol}, message column ${msgCol}).`);
  if (unparsed.length){
    console.warn(
      `${unparsed.length} note(s) had a date this page couldn't read, so they won't appear on the calendar. ` +
      `First few: ${unparsed.slice(0, 5).map(n => JSON.stringify(n.dateStr)).join(', ')}`);
  }

  if (!dataRows.length){
    document.getElementById('note-body').textContent = "No notes yet — add one to your sheet!";
    document.getElementById('note-date').textContent = "";
  } else {
    const latest = ALL_NOTES[ALL_NOTES.length - 1];
    document.getElementById('note-body').textContent = latest.message;
    document.getElementById('note-date').textContent = latest.dateStr;
  }

  renderCalendar(); // the calendar lives on the home page now, so keep it in sync
}

function sheetCsvUrl(){
  return `https://docs.google.com/spreadsheets/d/${CONFIG.SHEET_ID}/gviz/tq?tqx=out:csv&gid=${CONFIG.SHEET_GID}`;
}

async function loadNotes(){
  if (!CONFIG.SHEET_ID || CONFIG.SHEET_ID.includes('PASTE_YOUR')){
    document.getElementById('note-body').textContent =
      "Set your Sheet ID in page.js to see daily notes here.";
    document.getElementById('note-date').textContent = "";
    return;
  }
  try {
    const res = await fetch(sheetCsvUrl(), { cache: 'no-store' });
    if (!res.ok) throw new Error('Sheet fetch returned status ' + res.status);
    const text = await res.text();
    if (text.trim().startsWith('<')) {
      throw new Error('Got an HTML page instead of CSV — check sharing settings and SHEET_ID/GID.');
    }
    const rows = parseCSV(text);
    renderNotes(rows);
    localStorage.setItem('lastNotesCSV', text);
  } catch (err){
    console.error('Could not load Google Sheet notes:', err);
    const cached = localStorage.getItem('lastNotesCSV');
    if (cached){
      renderNotes(parseCSV(cached));
    } else {
      document.getElementById('note-body').textContent =
        "Couldn't load your note — check the console (F12) for details, or see the setup steps.";
      document.getElementById('note-date').textContent = "";
    }
  }
}

// ═════════════════════════ calendar (now on the home page) ═════════════════════════
let calendarMonth = new Date(CONFIG.CALENDAR_START_YEAR, CONFIG.CALENDAR_START_MONTH, 1);

function dateKey(d){
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function renderCalendar(){
  const label = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('cal-month-label').textContent = label;

  const notesByDay = {};
  ALL_NOTES.forEach(n => {
    if (!n.date) return;
    if (n.date.getFullYear() === calendarMonth.getFullYear() && n.date.getMonth() === calendarMonth.getMonth()){
      const key = dateKey(n.date);
      if (!notesByDay[key]) notesByDay[key] = [];
      notesByDay[key].push(n);
    }
  });

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const grid = document.getElementById('calendar-grid');
  grid.innerHTML = '';

  for (let i = 0; i < firstWeekday; i++){
    const empty = document.createElement('div');
    empty.className = 'cal-day is-empty';
    grid.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++){
    const cell = document.createElement('div');
    cell.className = 'cal-day';
    cell.textContent = day;

    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
    if (isToday) cell.classList.add('is-today');

    const key = `${year}-${month}-${day}`;
    const notes = notesByDay[key];
    if (notes && notes.length){
      cell.classList.add('has-note');
      cell.setAttribute('role', 'button');
      cell.setAttribute('tabindex', '0');

      const showTooltip = () => {
        const tip = document.getElementById('calendar-tooltip');
        const dateLabel = new Date(year, month, day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        let html = `<p class="ct-date">${dateLabel}</p>`;
        notes.forEach((n, idx) => {
          if (idx > 0) html += `<hr class="ct-divider">`;
          html += `<p class="ct-message"></p>`;
        });
        tip.innerHTML = html;
        const msgEls = tip.querySelectorAll('.ct-message');
        notes.forEach((n, idx) => { msgEls[idx].textContent = n.message; });

        tip.hidden = false;
        const rect = cell.getBoundingClientRect();
        const tipRect = tip.getBoundingClientRect();
        let left = rect.left;
        if (left + tipRect.width > window.innerWidth - 12) left = window.innerWidth - tipRect.width - 12;
        let top = rect.bottom + 8;
        if (top + tipRect.height > window.innerHeight - 12) top = rect.top - tipRect.height - 8;
        tip.style.left = Math.max(12, left) + 'px';
        tip.style.top = Math.max(12, top) + 'px';
      };
      const hideTooltip = () => { document.getElementById('calendar-tooltip').hidden = true; };

      cell.addEventListener('mouseenter', showTooltip);
      cell.addEventListener('mouseleave', () => {
        if (!cell.classList.contains('is-active')) hideTooltip();
      });
      const toggle = (e) => {
        e.stopPropagation();
        const alreadyActive = cell.classList.contains('is-active');
        document.querySelectorAll('.cal-day.is-active').forEach(el => el.classList.remove('is-active'));
        if (alreadyActive){ hideTooltip(); }
        else { cell.classList.add('is-active'); showTooltip(); }
      };
      cell.addEventListener('click', toggle);
      cell.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); toggle(e); }
      });
    }

    grid.appendChild(cell);
  }

  updateCalendarHint(Object.keys(notesByDay).length);
}

// August 2026 is before the exchange starts, so it will usually be empty.
// Rather than looking broken, point at the month that actually has notes.
function updateCalendarHint(notesThisMonth){
  const hint = document.getElementById('calendar-hint');
  if (!hint) return;
  hint.innerHTML = '';

  if (notesThisMonth){
    hint.textContent = "tap a highlighted date to read that day's note";
    return;
  }

  const dated = ALL_NOTES.filter(n => n.date);
  if (!dated.length){
    hint.textContent = ALL_NOTES.length
      ? "notes are loading, but none of their dates could be read — see the console"
      : "no notes for this month yet";
    return;
  }

  const latest = dated.reduce((a, b) => (a.date > b.date ? a : b)).date;
  hint.appendChild(document.createTextNode('no notes this month — '));
  const link = document.createElement('button');
  link.type = 'button';
  link.className = 'cal-jump';
  link.textContent = `go to ${latest.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
  link.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarMonth = new Date(latest.getFullYear(), latest.getMonth(), 1);
    renderCalendar();
  });
  hint.appendChild(link);
}
renderCalendar();
loadNotes();
setInterval(loadNotes, 60 * 1000); // recheck the sheet every minute without needing a refresh

document.addEventListener('click', () => {
  document.getElementById('calendar-tooltip').hidden = true;
  document.querySelectorAll('.cal-day.is-active').forEach(el => el.classList.remove('is-active'));
});

document.getElementById('cal-prev').addEventListener('click', (e) => {
  e.stopPropagation();
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', (e) => {
  e.stopPropagation();
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderCalendar();
});

// ═════════════════════════ send love counter ═════════════════════════
function loveApiUrl(action){
  const suffix = action ? `/${action}` : '';
  return `https://api.counterapi.dev/v1/${CONFIG.LOVE_NAMESPACE}/${CONFIG.LOVE_COUNTER}${suffix}`;
}

function setLoveDisplay(count){
  document.getElementById('love-count').textContent = count;
}

async function loadLoveCount(){
  try {
    const res = await fetch(loveApiUrl(''));
    const data = await res.json();
    if (typeof data.count === 'number'){
      setLoveDisplay(data.count);
      localStorage.setItem('lastLoveCount', String(data.count));
      return;
    }
    throw new Error('unexpected response');
  } catch (err){
    console.error('Could not load love counter:', err);
    const cached = localStorage.getItem('lastLoveCount');
    setLoveDisplay(cached !== null ? cached : '—');
  }
}
loadLoveCount();

document.getElementById('send-love-btn').addEventListener('click', async () => {
  const btn = document.getElementById('send-love-btn');
  btn.classList.add('is-sending');
  setTimeout(() => btn.classList.remove('is-sending'), 400);
  try {
    const res = await fetch(loveApiUrl('up'));
    const data = await res.json();
    if (typeof data.count === 'number'){
      setLoveDisplay(data.count);
      localStorage.setItem('lastLoveCount', String(data.count));
      return;
    }
    throw new Error('unexpected response');
  } catch (err){
    console.error('Could not send love (counter service unreachable):', err);
    const local = parseInt(localStorage.getItem('lastLoveCount') || '0', 10) + 1;
    setLoveDisplay(local);
    localStorage.setItem('lastLoveCount', String(local));
  }
});

// ═════════════════════════ golf-ball transition ═════════════════════════
// The ball is simulated frame by frame with real projectile motion — a
// launch arc, gravity, two damped bounces off the fairway, backspin, and
// a shadow that tightens as it drops — rather than a fixed keyframe path.

const GOLF = {
  startX: 30,
  groundY: 122,     // y of the ball's centre when it's sitting on the turf
  holeX: 330,
  holeRadius: 13,
  gravity: 1500,    // svg units per second squared
  launchVX: 430,
  launchVY: -460,
  bounceVertical: 0.35,   // how much upward speed survives a bounce
  bounceHorizontal: 0.45, // how much forward speed survives a bounce
  rollFriction: 1.6,      // units/s lost per second while rolling
  impactDelay: 370,       // ms — lines up with the club reaching the ball
  sinkDuration: 300       // ms — the ball dropping into the cup
};

function spawnTurfSpray(){
  const layer = document.getElementById('turf-spray');
  if (!layer) return;
  layer.innerHTML = '';
  layer.setAttribute('opacity', '1');
  const ns = 'http://www.w3.org/2000/svg';
  for (let i = 0; i < 7; i++){
    const clod = document.createElementNS(ns, 'ellipse');
    clod.setAttribute('cx', String(38 + Math.random() * 10));
    clod.setAttribute('cy', String(128 + Math.random() * 3));
    clod.setAttribute('rx', String(1.6 + Math.random() * 2));
    clod.setAttribute('ry', String(1.2 + Math.random() * 1.4));
    clod.setAttribute('fill', i % 2 ? '#7d9160' : '#6b5a3a');
    clod.setAttribute('class', 'turf-clod');
    clod.style.setProperty('--tx', (14 + Math.random() * 34).toFixed(1) + 'px');
    clod.style.setProperty('--ty', (-(8 + Math.random() * 26)).toFixed(1) + 'px');
    layer.appendChild(clod);
  }
  setTimeout(() => { layer.innerHTML = ''; layer.setAttribute('opacity', '0'); }, 600);
}

function playGolfShot(onDone){
  const overlay = document.getElementById('transition-overlay');
  const ballG   = document.getElementById('golf-ball-g');
  const shadow  = document.getElementById('ball-shadow');
  const club    = document.getElementById('golf-club');

  overlay.hidden = false;
  overlay.classList.remove('is-playing');

  // reset the club animation so it replays from the top every time
  club.style.animation = 'none';
  ballG.setAttribute('transform', 'translate(0,0)');
  shadow.setAttribute('cx', String(GOLF.startX));
  shadow.setAttribute('rx', '8');
  shadow.setAttribute('opacity', '0.22');
  void ballG.getBoundingClientRect();
  club.style.animation = '';
  overlay.classList.add('is-playing');

  let x = GOLF.startX;
  let y = GOLF.groundY;
  let vx = 0, vy = 0;
  let spin = 0;
  let launched = false;
  let holed = false;
  let sinkStart = 0;

  const t0 = performance.now();
  let last = t0;

  function frame(now){
    const elapsed = now - t0;
    let dt = (now - last) / 1000;
    last = now;
    if (dt > 0.05) dt = 0.05; // don't let a dropped frame teleport the ball

    if (!launched && elapsed >= GOLF.impactDelay){
      launched = true;
      vx = GOLF.launchVX;
      vy = GOLF.launchVY;
      spawnTurfSpray();
    }

    if (launched && !holed){
      vy += GOLF.gravity * dt;
      x += vx * dt;
      y += vy * dt;
      spin += vx * dt * 1.7; // backspin, proportional to how fast it's travelling

      if (y >= GOLF.groundY){
        y = GOLF.groundY;
        // has it arrived at the cup?
        if (Math.abs(x - GOLF.holeX) <= GOLF.holeRadius){
          holed = true;
          sinkStart = now;
          vx = 0; vy = 0;
        } else if (Math.abs(vy) > 40){
          vy = -Math.abs(vy) * GOLF.bounceVertical;   // bounce
          vx *= GOLF.bounceHorizontal;
        } else {
          vy = 0;                                     // settled — now it rolls
          vx = Math.max(0, vx - GOLF.rollFriction * 60 * dt);
        }
      }
    }

    const height = Math.max(0, GOLF.groundY - y);
    const dx = x - GOLF.startX;

    if (holed){
      const p = Math.min(1, (now - sinkStart) / GOLF.sinkDuration);
      const eased = p * p;
      ballG.setAttribute('transform',
        `translate(${dx.toFixed(2)}, ${(eased * 9).toFixed(2)}) rotate(${spin.toFixed(1)}) scale(${(1 - eased).toFixed(3)})`);
      ballG.setAttribute('opacity', String(1 - eased));
      shadow.setAttribute('opacity', String(0.22 * (1 - eased)));
      if (p >= 1){
        finish();
        return;
      }
    } else {
      ballG.setAttribute('transform',
        `translate(${dx.toFixed(2)}, ${(y - GOLF.groundY).toFixed(2)}) rotate(${spin.toFixed(1)})`);
      shadow.setAttribute('cx', x.toFixed(2));
      shadow.setAttribute('rx', (8 * Math.max(0.35, 1 - height / 150)).toFixed(2));
      shadow.setAttribute('opacity', (0.22 * Math.max(0.3, 1 - height / 130)).toFixed(3));
    }

    // safety valve, in case the physics ever fails to hole out
    if (elapsed > 2600){ finish(); return; }
    requestAnimationFrame(frame);
  }

  function finish(){
    ballG.setAttribute('opacity', '1');
    overlay.classList.remove('is-playing');
    overlay.hidden = true;
    onDone();
  }

  requestAnimationFrame(frame);
}

// ═════════════════════════ view switching ═════════════════════════
function showView(id){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
  document.getElementById(id).classList.add('is-active');
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function transitionToView(id){
  if (prefersReducedMotion){
    showView(id);
    return;
  }
  playGolfShot(() => showView(id));
}

// the mailbox and its speech bubble both open the letters
['mailbox-hit', 'bubble-hit'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', () => transitionToView('view-mood'));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' '){
      e.preventDefault();
      transitionToView('view-mood');
    }
  });
});

document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => transitionToView(btn.dataset.back));
});

// the title in the corner always takes you home
document.getElementById('home-link').addEventListener('click', () => {
  if (document.getElementById('view-home').classList.contains('is-active')){
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    transitionToView('view-home');
  }
});

// ═════════════════════════ mood grid ═════════════════════════
const MOODS = ['surprise', 'sad', 'homesick', 'happy', 'general'];
const moodGrid = document.getElementById('mood-grid');
MOODS.forEach(mood => {
  const btn = document.createElement('button');
  btn.className = 'mood-seal';
  btn.dataset.mood = mood;

  const icon = MOOD_ICONS[mood];
  const img = document.createElement('img');
  img.src = icon.src;
  img.alt = icon.alt;
  // if your own .jpeg/.jpg isn't there, fall back to the bundled .svg
  img.addEventListener('error', () => {
    const svgFallback = icon.src.replace(/\.(jpe?g|png)$/i, '.svg');
    if (img.src.indexOf(svgFallback) === -1) img.src = svgFallback;
  }, { once: true });

  const label = document.createElement('span');
  label.textContent = icon.label;

  btn.appendChild(img);
  btn.appendChild(label);
  btn.addEventListener('click', () => {
    if (mood === 'surprise') openSurprise();
    else openMood(mood);
  });
  moodGrid.appendChild(btn);
});

function openSurprise(){
  // draws from the "surprise" list in messages.js; if that's empty it
  // falls back to picking any letter from any mood
  const pool = (typeof MOOD_MESSAGES === 'undefined') ? []
    : (MOOD_MESSAGES.surprise && MOOD_MESSAGES.surprise.length
        ? MOOD_MESSAGES.surprise
        : Object.values(MOOD_MESSAGES).flat());
  const allLetters = pool;
  if (!allLetters.length) return;

  const pick = allLetters[Math.floor(Math.random() * allLetters.length)];

  document.getElementById('envelopes-title').textContent = `surprise! here's one for you \u2014`;
  const bubble = document.getElementById('mood-speech-bubble');
  if (bubble) bubble.hidden = true;

  document.getElementById('envelope-grid').innerHTML = '';
  document.getElementById('letter-text').innerHTML = formatLetterText(pick.text);
  renderLetterMedia(pick);
  document.getElementById('letter-reveal').hidden = false;

  if (pick.effect === 'hearts') spawnHearts();
  if (pick.effect === 'fireworks') spawnFireworks();

  transitionToView('view-envelopes');
}

// ═════════════════════════ letter content helpers ═════════════════════════
function escapeHTML(str){
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatLetterText(text){
  const escaped = escapeHTML(text);
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const linked = escaped.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  return linked
    .split(/\n{2,}/)
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

// Attaches whatever media a letter carries. Every field takes either a single
// path or a list of paths, so a letter can hold as many photos as you like:
//   photo:  "media/one.png"
//   photo:  ["media/one.png", "media/two.png"]
//   video:  "media/clip.mov"
//   audio:  "media/voice-note.m4a"
function asList(value){
  if (!value) return [];
  return Array.isArray(value) ? value.filter(Boolean) : [value];
}

function renderLetterMedia(env){
  const wrap = document.getElementById('letter-media');
  wrap.innerHTML = '';

  asList(env.photo).concat(asList(env.photos)).forEach((src, i, all) => {
    const img = document.createElement('img');
    img.src = src;
    img.loading = 'lazy';
    img.alt = all.length > 1 ? `photo ${i + 1} of ${all.length} for you` : 'a photo for you';
    img.className = 'letter-photo';
    wrap.appendChild(img);
  });

  asList(env.video).concat(asList(env.videos)).forEach(src => {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.className = 'letter-video';
    wrap.appendChild(video);
  });

  asList(env.audio).concat(asList(env.audios)).forEach(src => {
    const audio = document.createElement('audio');
    audio.src = src;
    audio.controls = true;
    audio.preload = 'metadata';
    audio.className = 'letter-audio';
    wrap.appendChild(audio);
  });
}

function openMood(mood){
  const moodLabel = MOOD_ICONS[mood] ? MOOD_ICONS[mood].label : mood;
  const titleText = mood === 'general'
    ? `for when you love me (which should be always right)`
    : `for when you're feeling ${moodLabel} \u2014 pick one`;
  document.getElementById('envelopes-title').textContent = titleText;

  const bubble = document.getElementById('mood-speech-bubble');
  if (bubble) bubble.hidden = mood !== 'general';

  const grid = document.getElementById('envelope-grid');
  grid.innerHTML = '';
  document.getElementById('letter-reveal').hidden = true;

  const envelopes = (typeof MOOD_MESSAGES !== 'undefined' && MOOD_MESSAGES[mood]) || [];
  envelopes.forEach((env, idx) => {
    const btn = document.createElement('button');
    btn.className = 'envelope';

    const img = document.createElement('img');
    img.src = 'icons/envelope.svg';
    img.alt = 'a sealed envelope';

    const label = document.createElement('span');
    label.textContent = env.label || `Letter ${idx+1}`;

    btn.appendChild(img);
    btn.appendChild(label);
    btn.addEventListener('click', () => {
      document.getElementById('letter-text').innerHTML = formatLetterText(env.text);
      renderLetterMedia(env);
      document.getElementById('letter-reveal').hidden = false;
      btn.classList.add('is-opened');
      document.getElementById('letter-reveal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      if (env.effect === 'hearts') spawnHearts();
      if (env.effect === 'fireworks') spawnFireworks();
    });
    grid.appendChild(btn);
  });

  transitionToView('view-envelopes');
}

document.getElementById('close-letter').addEventListener('click', () => {
  playSealSwim(() => {
    document.getElementById('letter-reveal').hidden = true;
  });
});

// ═════════════════════════ special letter effects ═════════════════════════
function spawnHearts(){
  const container = document.createElement('div');
  container.className = 'hearts-burst';
  for (let i = 0; i < 20; i++){
    const heart = document.createElement('span');
    heart.className = 'heart-particle';
    heart.textContent = '❤️';
    heart.style.left = (Math.random() * 92 + 4) + '%';
    heart.style.fontSize = (14 + Math.random() * 18) + 'px';
    heart.style.animationDelay = (Math.random() * 0.7) + 's';
    heart.style.animationDuration = (3.6 + Math.random() * 1.4) + 's';
    container.appendChild(heart);
  }
  document.body.appendChild(container);
  setTimeout(() => container.remove(), 5000);
}

function spawnFireworks(){
  const container = document.createElement('div');
  container.className = 'fireworks-burst';
  document.body.appendChild(container);
  const colors = ['#d9a548', '#c15b4a', '#4a72a8', '#8faa73', '#fff2c4', '#e28fc0', '#5fc2c9', '#f2f2f2'];
  const bursts = 7;
  for (let b = 0; b < bursts; b++){
    setTimeout(() => {
      const originX = 10 + Math.random() * 80;
      const originY = 10 + Math.random() * 50;
      const sparkCount = 26;
      for (let i = 0; i < sparkCount; i++){
        const spark = document.createElement('span');
        spark.className = 'firework-spark';
        const angle = (Math.PI * 2 * i) / sparkCount + Math.random() * 0.2;
        const dist = 90 + Math.random() * 90;
        const size = 7 + Math.random() * 6;
        const color = colors[Math.floor(Math.random() * colors.length)];
        spark.style.setProperty('--dx', (Math.cos(angle) * dist) + 'px');
        spark.style.setProperty('--dy', (Math.sin(angle) * dist) + 'px');
        spark.style.left = originX + 'vw';
        spark.style.top = originY + 'vh';
        spark.style.width = size + 'px';
        spark.style.height = size + 'px';
        spark.style.background = color;
        spark.style.boxShadow = `0 0 10px 2px ${color}`;
        container.appendChild(spark);
      }
    }, b * 300);
  }
  setTimeout(() => container.remove(), bursts * 300 + 1300);
}

// ═════════════════════════ seal swim + splash ═════════════════════════
// The seal cruises through the water with a real swimming undulation,
// turns, comes back, then breaches and belly-flops back in — the arc
// out of the water is ballistic, so it slows at the top and accelerates
// on the way down the way a real jump does.

const SEA = {
  surfaceY: 78,
  scale: 0.78,
  swimEnd: 0.50,     // phase A ends (seconds)
  turnEnd: 0.88,     // phase B ends
  breachStart: 0.88,
  breachVX: 130,
  breachVY: -520,
  breachG: 1800,
  breachDuration: 0.578,
  sinkDuration: 0.30
};

const SVG_NS = 'http://www.w3.org/2000/svg';

function spawnRipple(cx, delay, maxScale){
  const layer = document.getElementById('ripple-layer');
  if (!layer) return;
  const ring = document.createElementNS(SVG_NS, 'ellipse');
  ring.setAttribute('cx', String(cx));
  ring.setAttribute('cy', String(SEA.surfaceY));
  ring.setAttribute('rx', '10');
  ring.setAttribute('ry', '3');
  ring.setAttribute('fill', 'none');
  ring.setAttribute('stroke', '#f2f9ff');
  ring.setAttribute('stroke-width', '2');
  ring.setAttribute('opacity', '0');
  layer.appendChild(ring);

  const start = performance.now() + delay;
  const life = 850;
  function step(now){
    const p = (now - start) / life;
    if (p < 0){ requestAnimationFrame(step); return; }
    if (p >= 1){ ring.remove(); return; }
    const scale = 1 + p * (maxScale - 1);
    ring.setAttribute('rx', String(10 * scale));
    ring.setAttribute('ry', String(3 * scale * 0.85));
    ring.setAttribute('opacity', String(0.85 * (1 - p)));
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function spawnBubble(x, y){
  const layer = document.getElementById('bubble-layer');
  if (!layer) return;
  const b = document.createElementNS(SVG_NS, 'circle');
  const r = 1.2 + Math.random() * 2.2;
  b.setAttribute('cx', String(x));
  b.setAttribute('cy', String(y));
  b.setAttribute('r', String(r));
  b.setAttribute('fill', '#ffffff');
  b.setAttribute('opacity', '0.6');
  layer.appendChild(b);

  const start = performance.now();
  const life = 700 + Math.random() * 400;
  const drift = (Math.random() - 0.5) * 14;
  function step(now){
    const p = (now - start) / life;
    if (p >= 1){ b.remove(); return; }
    b.setAttribute('cx', String(x + drift * p));
    b.setAttribute('cy', String(y - (y - SEA.surfaceY + 6) * p));
    b.setAttribute('opacity', String(0.6 * (1 - p)));
    requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

function spawnSplashDroplets(){
  const marker = document.getElementById('splash-point');
  if (!marker) return;
  const rect = marker.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < 18; i++){
    const d = document.createElement('span');
    d.className = 'splash-droplet';
    // thrown mostly upward and outward, the way water is displaced on impact
    const theta = -Math.PI * (0.08 + Math.random() * 0.84);
    const dist = 20 + Math.random() * 52;
    const size = 3 + Math.random() * 6;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.setProperty('--dx', (Math.cos(theta) * dist).toFixed(1) + 'px');
    d.style.setProperty('--dy', (Math.sin(theta) * dist).toFixed(1) + 'px');
    d.style.animationDelay = (Math.random() * 0.06) + 's';
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 900);
  }
}

function playSealSwim(callback){
  if (prefersReducedMotion){
    callback();
    return;
  }

  const overlay = document.getElementById('seal-splash-overlay');
  const seal = document.getElementById('seal-swimmer');
  const marker = document.getElementById('splash-point');
  overlay.hidden = false;
  document.getElementById('ripple-layer').innerHTML = '';
  document.getElementById('bubble-layer').innerHTML = '';

  const S = SEA.scale;
  const total = SEA.breachStart + SEA.breachDuration + SEA.sinkDuration;

  let splashed = false;
  let lastBubble = 0;
  const t0 = performance.now();

  function frame(now){
    const t = (now - t0) / 1000;
    let x, y, rot, dir = 1, opacity = 1;

    if (t < SEA.swimEnd){
      // ── cruising right, tail-driven undulation
      const p = t / SEA.swimEnd;
      x = 58 + p * 186;
      y = 130 + 11 * Math.sin(p * Math.PI * 3);
      rot = 13 * Math.cos(p * Math.PI * 3);
      dir = 1;
      opacity = 0.92;

    } else if (t < SEA.turnEnd){
      // ── banking round and coming back the other way
      const p = (t - SEA.swimEnd) / (SEA.turnEnd - SEA.swimEnd);
      x = 244 - p * 96;
      y = 130 + 24 * Math.sin(p * Math.PI);
      rot = -12 * Math.cos(p * Math.PI * 2);
      dir = -1;
      opacity = 0.92;

    } else if (t < SEA.breachStart + SEA.breachDuration){
      // ── the breach: a true ballistic arc up through the surface
      const tau = t - SEA.breachStart;
      x = 148 + SEA.breachVX * tau;
      y = 118 + SEA.breachVY * tau + 0.5 * SEA.breachG * tau * tau;
      const vyNow = SEA.breachVY + SEA.breachG * tau;
      // follow the flight path, but keep the tilt within a range that still
      // reads as a seal porpoising rather than a rocket taking off
      const pathAngle = Math.atan2(vyNow, SEA.breachVX) * 180 / Math.PI;
      rot = Math.max(-46, Math.min(46, pathAngle));
      dir = 1;
      opacity = y < SEA.surfaceY ? 1 : 0.94;

      // splash the instant it punches back down through the surface
      if (!splashed && vyNow > 0 && y >= SEA.surfaceY){
        splashed = true;
        marker.setAttribute('cx', String(x));
        spawnSplashDroplets();
        spawnRipple(x, 0,   3.4);
        spawnRipple(x, 110, 4.2);
        spawnRipple(x, 220, 5.0);
      }

    } else {
      // ── sinking away
      const p = (t - SEA.breachStart - SEA.breachDuration) / SEA.sinkDuration;
      x = 148 + SEA.breachVX * SEA.breachDuration;
      y = 118 + p * 26;
      rot = 30 - p * 30;
      dir = 1;
      opacity = 0.9 * (1 - p);
    }

    seal.setAttribute('transform',
      `translate(${x.toFixed(2)}, ${y.toFixed(2)}) rotate(${(rot * dir).toFixed(2)}) scale(${(dir * S).toFixed(3)}, ${S})`);
    seal.setAttribute('opacity', opacity.toFixed(3));

    // a light bubble trail while it's under
    if (y > SEA.surfaceY + 8 && now - lastBubble > 90){
      lastBubble = now;
      spawnBubble(x - 34 * dir, y + 4);
    }

    if (t >= total){
      callback();
      overlay.hidden = true;
      document.getElementById('ripple-layer').innerHTML = '';
      document.getElementById('bubble-layer').innerHTML = '';
      return;
    }
    requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}
