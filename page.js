// ─────────────────────────────────────────────────────────
// CONFIG — edit these values
// ─────────────────────────────────────────────────────────
const CONFIG = {
  // From your Google Sheet's URL: docs.google.com/spreadsheets/d/THIS_PART/edit#gid=THAT_PART
  SHEET_ID: "PASTE_YOUR_SHEET_ID_HERE",
  SHEET_GID: "0", // the gid= number for the specific tab (0 is usually the first tab)

  TARGET_DATE_ISO: "2027-01-09T07:55:00+08:00", // 9 Jan 2027, 7:55am SGT — when you meet again
  START_DATE_ISO: "2026-09-11T00:00:00+08:00",  // the day the countdown "starts" — used for the progress bar

  // Free, no-signup shared counter for the "send love" button.
  // Change LOVE_NAMESPACE to something unique to you two so your count
  // doesn't mix with anyone else's — e.g. "yourname-bfname-2026".
  LOVE_NAMESPACE: "seeing-you-again-soon-CHANGE-ME",
  LOVE_COUNTER: "send-love"
};

// Mood icon artwork + display labels. Swap paths for your own image
// files (e.g. icons/moods/penguin-angry.png) if you'd like to use
// real Pingu screenshots you already have saved.
const MOOD_ICONS = {
  angry:    { src: "icons/moods/penguin-angry.jpeg",    alt: "an annoyed little penguin",              label: "angry" },
  sad:      { src: "icons/moods/penguin-sad.jpeg",       alt: "a sad little penguin",                   label: "sad" },
  homesick: { src: "icons/moods/penguin-homesick.jpeg", alt: "a wistful penguin looking toward home",  label: "homesick" },
  happy:    { src: "icons/moods/penguin-happy.jpg",     alt: "a cheerful penguin with open flippers",  label: "happy hehe" },
  general:  { src: "icons/moods/seal-general.jpeg",      alt: "a seal, just like Robby",                label: "i love you!" }
};

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

function renderNotes(rows){
  const dataRows = rows.slice(1).filter(r => r[1] && r[1].trim());
  if (!dataRows.length){
    document.getElementById('note-body').textContent = "No notes yet — add one to your sheet!";
    document.getElementById('note-date').textContent = "";
    return;
  }
  const latest = dataRows[dataRows.length - 1];
  document.getElementById('note-body').textContent = latest[1];
  document.getElementById('note-date').textContent = latest[0] || "";

  const prevList = document.getElementById('prev-list');
  prevList.innerHTML = '';
  const earlier = dataRows.slice(0, -1).reverse();
  earlier.forEach(r => {
    const li = document.createElement('li');
    const dateSpan = document.createElement('span');
    dateSpan.className = 'pl-date';
    dateSpan.textContent = r[0] || '';
    li.appendChild(dateSpan);
    li.appendChild(document.createTextNode(r[1]));
    prevList.appendChild(li);
  });
  document.getElementById('prev-toggle').style.display = earlier.length ? '' : 'none';
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

document.getElementById('prev-toggle').addEventListener('click', (e) => {
  const list = document.getElementById('prev-list');
  const expanded = e.target.getAttribute('aria-expanded') === 'true';
  list.hidden = expanded;
  e.target.setAttribute('aria-expanded', String(!expanded));
  e.target.textContent = expanded ? 'earlier notes' : 'hide earlier notes';
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
const MOODS = ['angry', 'sad', 'homesick', 'happy', 'general'];
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
  btn.addEventListener('click', () => openMood(mood));
  moodGrid.appendChild(btn);
});

function openMood(mood){
  const moodLabel = MOOD_ICONS[mood] ? MOOD_ICONS[mood].label : mood;
  document.getElementById('envelopes-title').textContent = `for when you're feeling ${moodLabel} \u2014 pick one`;
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
      document.getElementById('letter-text').textContent = env.text;
      document.getElementById('letter-reveal').hidden = false;
      btn.classList.add('is-opened');
      document.getElementById('letter-reveal').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    grid.appendChild(btn);
  });

  transitionToView('view-envelopes');
}

document.getElementById('close-letter').addEventListener('click', () => {
  document.getElementById('letter-reveal').hidden = true;
});
