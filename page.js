// ─────────────────────────────────────────────────────────
// CONFIG — edit these values
// ─────────────────────────────────────────────────────────
const CONFIG = {
  // From your Google Sheet's URL: docs.google.com/spreadsheets/d/THIS_PART/edit#gid=THAT_PART
  SHEET_ID: "1g-WNjrLxEmLLx_iFH-IjdopP-n4na6kc0xiWloDWxnQ",
  SHEET_GID: "0", // the gid= number for the specific tab (0 is usually the first tab)

  TARGET_DATE_ISO: "2027-01-09T07:55:00+08:00", // 9 Jan 2027, 7:55am SGT — when you meet again
  START_DATE_ISO: "2026-09-11T00:00:00+08:00",  // the day the countdown "starts" — used for the progress bar

  // Free, no-signup shared counter for the "send love" button.
  // Change LOVE_NAMESPACE to something unique to you two so your count
  // doesn't mix with anyone else's — e.g. "yourname-bfname-2026".
  LOVE_NAMESPACE: "seeing-you-again-soon-CHANGE-ME",
  LOVE_COUNTER: "send-love",

  // Push notification when either of you taps "send love" — uses ntfy.sh,
  // a free no-signup push service. Change this to something unique to you
  // two (nobody else should be able to guess it), then both of you install
  // the ntfy app (iOS/Android) and subscribe to this exact topic name.
  NTFY_TOPIC: "seeing-you-again-soon-love-CHANGE-ME",

  // His location, for the timezone clock and weather widget — change all
  // four of these to match his actual city.
  HIS_CITY_NAME: "his city",
  HIS_TIMEZONE: "America/Los_Angeles", // pick from: https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  HIS_LAT: 34.0522,
  HIS_LON: -118.2437
};

// Mood icon artwork + display labels. Swap paths for your own image
// files (e.g. icons/moods/penguin-angry.jpeg) if you'd like to use
// real Pingu screenshots you already have saved — just make sure the
// filenames below match exactly (including .jpeg vs .jpg).
const MOOD_ICONS = {
  surprise: { src: "icons/moods/penguin-angry.jpeg",    alt: "a mystery penguin",                      label: "surprise me" },
  sad:      { src: "icons/moods/penguin-sad.jpeg",       alt: "a sad little penguin",                   label: "sad" },
  homesick: { src: "icons/moods/penguin-homesick.jpeg", alt: "a wistful penguin looking toward home",  label: "homesick" },
  happy:    { src: "icons/moods/penguin-happy.jpg",     alt: "a cheerful penguin with open flippers",  label: "happy hehe" },
  general:  { src: "icons/moods/seal-general.jpeg",      alt: "a seal, just like Robby",                label: "i love you!" }
};

// ───────────────────────── Timezone clock + weather ─────────────────────────
function updateClocks(){
  const now = new Date();
  const sgTime = now.toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit' });
  const hisTime = now.toLocaleTimeString('en-US', { timeZone: CONFIG.HIS_TIMEZONE, hour: '2-digit', minute: '2-digit' });
  document.getElementById('tz-time-sg').textContent = sgTime;
  document.getElementById('tz-time-his').textContent = hisTime;
}
document.getElementById('his-city-label').textContent = CONFIG.HIS_CITY_NAME;
updateClocks();
setInterval(updateClocks, 30 * 1000);

function weatherCodeToText(code){
  const map = {
    0: '\u2600\ufe0f clear', 1: '\ud83c\udf24\ufe0f mostly clear', 2: '\u26c5 partly cloudy', 3: '\u2601\ufe0f cloudy',
    45: '\ud83c\udf2b\ufe0f foggy', 48: '\ud83c\udf2b\ufe0f foggy',
    51: '\ud83c\udf26\ufe0f light drizzle', 53: '\ud83c\udf26\ufe0f drizzle', 55: '\ud83c\udf27\ufe0f heavy drizzle',
    61: '\ud83c\udf27\ufe0f light rain', 63: '\ud83c\udf27\ufe0f rain', 65: '\ud83c\udf27\ufe0f heavy rain',
    71: '\ud83c\udf28\ufe0f light snow', 73: '\ud83c\udf28\ufe0f snow', 75: '\u2744\ufe0f heavy snow',
    80: '\ud83c\udf26\ufe0f showers', 81: '\ud83c\udf27\ufe0f showers', 82: '\u26c8\ufe0f violent showers',
    95: '\u26c8\ufe0f thunderstorm'
  };
  return map[code] || '\ud83c\udf21\ufe0f';
}

async function loadHisWeather(){
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${CONFIG.HIS_LAT}&longitude=${CONFIG.HIS_LON}&current_weather=true&temperature_unit=fahrenheit`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('weather fetch failed');
    const data = await res.json();
    const cw = data.current_weather;
    document.getElementById('his-weather').textContent = `${Math.round(cw.temperature)}\u00b0F ${weatherCodeToText(cw.weathercode)}`;
  } catch (err){
    console.error('Could not load weather:', err);
    document.getElementById('his-weather').textContent = 'weather unavailable';
  }
}
loadHisWeather();
setInterval(loadHisWeather, 15 * 60 * 1000);

// ───────────────────────── Countdown + progress bar ─────────────────────────
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

  // progress bar: % of the total wait that has already passed
  const totalSpan = target - start;
  let pct = totalSpan > 0 ? ((now - start) / totalSpan) * 100 : 100;
  pct = Math.min(100, Math.max(0, pct));
  document.getElementById('progress-fill').style.width = pct.toFixed(1) + '%';
  document.getElementById('progress-pct').textContent = pct.toFixed(1) + '% of the wait done';
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ───────────────────────── Daily note from Google Sheet ─────────────────────────
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

// notes with parsed JS Date objects, kept for the calendar view
let ALL_NOTES = [];

function parseNoteDate(str){
  if (!str) return null;
  str = str.trim();
  // try a direct parse first (handles "2027-01-05", "Jan 5 2027", etc.)
  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // fall back to "14 Aug" / "Aug 14" style with no year — infer the year
  // from the START_DATE_ISO / TARGET_DATE_ISO window in CONFIG
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const m = str.toLowerCase().match(/(\d{1,2})[a-z]*\s+([a-z]{3,})|([a-z]{3,})\s+(\d{1,2})/);
  if (!m) return null;
  const day = parseInt(m[1] || m[4], 10);
  const monStr = m[2] || m[3];
  const monIdx = months.findIndex(mo => monStr.startsWith(mo));
  if (monIdx < 0 || !day) return null;

  const start = new Date(CONFIG.START_DATE_ISO);
  const target = new Date(CONFIG.TARGET_DATE_ISO);
  let year = start.getFullYear();
  // only bump to the target's year if this month matches the target's month
  // (e.g. a January note during a Sept–Jan exchange) — anything else stays
  // in the start year, even if its month number is numerically smaller
  if (monIdx === target.getMonth() && target.getFullYear() !== start.getFullYear()){
    year = target.getFullYear();
  }
  return new Date(year, monIdx, day);
}

function renderNotes(rows){
  const dataRows = rows.slice(1).filter(r => r[1] && r[1].trim());
  ALL_NOTES = dataRows.map(r => ({
    dateStr: r[0] || '',
    message: r[1],
    date: parseNoteDate(r[0])
  }));

  if (!dataRows.length){
    document.getElementById('note-body').textContent = "No notes yet — add one to your sheet!";
    document.getElementById('note-date').textContent = "";
    return;
  }
  const latest = dataRows[dataRows.length - 1];
  document.getElementById('note-body').textContent = latest[1];
  document.getElementById('note-date').textContent = latest[0] || "";
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
      // Google returns an HTML error/login page instead of CSV when the
      // sheet isn't shared publicly, or the ID/gid is wrong.
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
loadNotes();
setInterval(loadNotes, 60 * 1000); // recheck the sheet every minute without needing a refresh

document.getElementById('view-calendar-btn').addEventListener('click', () => {
  calendarMonth = latestNotesMonth();
  transitionToView('view-calendar');
  renderCalendar();
});

// ───────────────────────── Calendar view ─────────────────────────
let calendarMonth = new Date(); // first-of-month Date currently displayed

function latestNotesMonth(){
  const dated = ALL_NOTES.filter(n => n.date);
  if (!dated.length) return new Date();
  const latest = dated[dated.length - 1].date;
  return new Date(latest.getFullYear(), latest.getMonth(), 1);
}

function dateKey(d){
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
}

function renderCalendar(){
  const label = calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  document.getElementById('cal-month-label').textContent = label;

  // group notes for this month by day
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
        const rect = cell.getBoundingClientRect();
        tip.style.left = Math.min(rect.left, window.innerWidth - 260) + 'px';
        tip.style.top = (rect.bottom + 8) + 'px';
        tip.hidden = false;
      };
      const hideTooltip = () => { document.getElementById('calendar-tooltip').hidden = true; };

      cell.addEventListener('mouseenter', showTooltip);
      cell.addEventListener('mouseleave', hideTooltip);
      cell.addEventListener('click', (e) => {
        e.stopPropagation();
        const alreadyActive = cell.classList.contains('is-active');
        document.querySelectorAll('.cal-day.is-active').forEach(el => el.classList.remove('is-active'));
        if (alreadyActive){ hideTooltip(); }
        else { cell.classList.add('is-active'); showTooltip(); }
      });
    }

    grid.appendChild(cell);
  }
}

document.addEventListener('click', () => {
  document.getElementById('calendar-tooltip').hidden = true;
  document.querySelectorAll('.cal-day.is-active').forEach(el => el.classList.remove('is-active'));
});

document.getElementById('cal-prev').addEventListener('click', () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1);
  renderCalendar();
});
document.getElementById('cal-next').addEventListener('click', () => {
  calendarMonth = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1);
  renderCalendar();
});

// ───────────────────────── Send love counter ─────────────────────────
function loveApiUrl(action){
  // action: "up" to increment, "" to just read the current count
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

function sendLoveNotification(){
  // fire-and-forget push notification via ntfy.sh — both of you need the
  // ntfy app installed and subscribed to CONFIG.NTFY_TOPIC for this to
  // actually reach your phones
  fetch(`https://ntfy.sh/${CONFIG.NTFY_TOPIC}`, {
    method: 'POST',
    body: 'sent you some love \ud83d\udc9b',
    headers: { 'Title': 'seeing you again soon' }
  }).catch(err => console.error('Could not send push notification:', err));
}

document.getElementById('send-love-btn').addEventListener('click', async () => {
  const btn = document.getElementById('send-love-btn');
  btn.classList.add('is-sending');
  setTimeout(() => btn.classList.remove('is-sending'), 400);
  sendLoveNotification();
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
    // fall back to a local-only tally so the button still feels responsive
    const local = parseInt(localStorage.getItem('lastLoveCount') || '0', 10) + 1;
    setLoveDisplay(local);
    localStorage.setItem('lastLoveCount', String(local));
  }
});

// ───────────────────────── View switching (with golf-ball transition) ─────────────────────────
function showView(id){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('is-active'));
  document.getElementById(id).classList.add('is-active');
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function transitionToView(id){
  if (prefersReducedMotion){
    showView(id);
    return;
  }
  const overlay = document.getElementById('transition-overlay');
  const ball = document.getElementById('golf-ball');
  const club = document.getElementById('golf-club');

  overlay.hidden = false;
  // restart both animations from scratch each time
  overlay.classList.remove('is-playing');
  ball.style.animation = 'none';
  club.style.animation = 'none';
  void ball.offsetWidth; // force reflow
  ball.style.animation = '';
  club.style.animation = '';
  overlay.classList.add('is-playing');

  setTimeout(() => {
    showView(id);
    overlay.classList.remove('is-playing');
    overlay.hidden = true;
  }, 1100);
}

document.getElementById('open-letterbox').addEventListener('click', () => transitionToView('view-mood'));
document.querySelectorAll('[data-back]').forEach(btn => {
  btn.addEventListener('click', () => transitionToView(btn.dataset.back));
});

// ───────────────────────── Mood grid ─────────────────────────
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

// picks one random letter from every mood combined and reveals it right away
function openSurprise(){
  const allLetters = (typeof MOOD_MESSAGES !== 'undefined')
    ? Object.values(MOOD_MESSAGES).flat()
    : [];
  if (!allLetters.length) return;

  const pick = allLetters[Math.floor(Math.random() * allLetters.length)];

  document.getElementById('envelopes-title').textContent = `surprise! here's one for you \u2014`;
  const bubble = document.getElementById('mood-speech-bubble');
  if (bubble) bubble.hidden = true;

  const grid = document.getElementById('envelope-grid');
  grid.innerHTML = '';

  document.getElementById('letter-text').innerHTML = formatLetterText(pick.text);
  renderLetterMedia(pick);
  document.getElementById('letter-reveal').hidden = false;

  if (pick.effect === 'hearts') spawnHearts();
  if (pick.effect === 'fireworks') spawnFireworks();

  transitionToView('view-envelopes');
}

// ───────────────────────── Letter content helpers ─────────────────────────
function escapeHTML(str){
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// turns plain message text into safe HTML: escapes it, auto-links any URLs,
// and turns blank-line breaks into paragraphs (single line breaks into <br>)
function formatLetterText(text){
  const escaped = escapeHTML(text);
  const urlRegex = /(https?:\/\/[^\s<]+)/g;
  const linked = escaped.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
  return linked
    .split(/\n{2,}/)
    .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function renderLetterMedia(env){
  const wrap = document.getElementById('letter-media');
  wrap.innerHTML = '';
  if (env.photo){
    const img = document.createElement('img');
    img.src = env.photo;
    img.alt = 'a photo for you';
    img.className = 'letter-photo';
    wrap.appendChild(img);
  }
  if (env.audio){
    const audio = document.createElement('audio');
    audio.src = env.audio;
    audio.controls = true;
    audio.className = 'letter-audio';
    wrap.appendChild(audio);
  }
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
  playSealSplash(() => {
    document.getElementById('letter-reveal').hidden = true;
  });
});

// ───────────────────────── Special letter effects ─────────────────────────
function spawnHearts(){
  const container = document.createElement('div');
  container.className = 'hearts-burst';
  const count = 20;
  for (let i = 0; i < count; i++){
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

// ───────────────────────── Seal-splash close animation ─────────────────────────
function spawnSplashDroplets(){
  const marker = document.getElementById('splash-point');
  if (!marker) return;
  const rect = marker.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  const count = 12;
  for (let i = 0; i < count; i++){
    const d = document.createElement('span');
    d.className = 'splash-droplet';
    // spread mostly upward and outward, like water kicked up on impact
    const theta = -Math.PI * (0.12 + Math.random() * 0.76);
    const dist = 16 + Math.random() * 36;
    const dx = Math.cos(theta) * dist;
    const dy = Math.sin(theta) * dist;
    const size = 4 + Math.random() * 5;
    d.style.left = x + 'px';
    d.style.top = y + 'px';
    d.style.width = size + 'px';
    d.style.height = size + 'px';
    d.style.setProperty('--dx', dx.toFixed(1) + 'px');
    d.style.setProperty('--dy', dy.toFixed(1) + 'px');
    document.body.appendChild(d);
    setTimeout(() => d.remove(), 750);
  }
}

function playSealSplash(callback){
  if (prefersReducedMotion){
    callback();
    return;
  }
  const overlay = document.getElementById('seal-splash-overlay');
  const seal = document.getElementById('seal-diver');
  const ripples = ['ripple-1', 'ripple-2', 'ripple-3'].map(id => document.getElementById(id));

  overlay.hidden = false;
  overlay.classList.remove('is-playing');
  seal.style.animation = 'none';
  ripples.forEach(r => { if (r) r.style.animation = 'none'; });
  void seal.offsetWidth; // force reflow
  seal.style.animation = '';
  ripples.forEach(r => { if (r) r.style.animation = ''; });
  overlay.classList.add('is-playing');

  setTimeout(spawnSplashDroplets, 420);

  setTimeout(() => {
    callback();
    overlay.classList.remove('is-playing');
    overlay.hidden = true;
  }, 900);
}
