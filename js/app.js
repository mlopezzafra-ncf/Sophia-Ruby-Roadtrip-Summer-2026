// ================= INIT (multi-page aware) =================
// Each init function checks for its target element. Missing element = skip.
document.addEventListener('DOMContentLoaded', () => {
  initMeter();
  initCountdown();
  initStates();
  initParks();
  initReading();
  initListening();
  initDays();
  initMap();
  initBudget();
  initPacking();
  initLodgingTotalsOnDays(); // re-renders day lodging cells with full detail if present
  initReveals();
  initExportImport();
});

function escapeHTML(s){ return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function storageGet(k){ try { return localStorage.getItem(k); } catch { return null; } }
function storageSet(k,v){ try { localStorage.setItem(k,v); } catch(e){} }
function fmtMoney(n){ if(n==null||isNaN(n)) return ''; return '$'+Number(n).toFixed(2).replace(/\.00$/,''); }

// Returns the 0-indexed trip day number for today, or null if pre/post-trip.
// Trip starts 2026-05-29 (Day 0) and runs 19 days through 2026-06-16 (Day 18).
function currentTripDayIndex(){
  const start = new Date('2026-05-29T00:00:00');
  const today = new Date();
  today.setHours(0,0,0,0);
  const diff = Math.floor((today - start) / 86400000);
  if (diff < 0 || diff > 18) return null;
  return diff;
}

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  TRIP METER  ·  CONFIG  (edit these values whenever needed)             ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║  The meter on the home page sums daily MILES / GALLONS / GAS $ from a   ║
// ║  Google Sheet so the girls can update it from the road without any code ║
// ║  changes or rebuilds.                                                   ║
// ║                                                                          ║
// ║  HOW TO HOOK UP THE SHEET (one-time):                                   ║
// ║   1.  Open the Google Sheet.                                            ║
// ║   2.  File → Share → Publish to web                                     ║
// ║   3.  Pick the daily-totals tab. Choose format = CSV. Click Publish.    ║
// ║   4.  Copy the URL it gives you and paste it into `publishedCsvUrl`     ║
// ║       below.  It will look like:                                        ║
// ║       https://docs.google.com/spreadsheets/d/e/.../pub?gid=0&output=csv ║
// ║                                                                          ║
// ║  EXPECTED SHEET LAYOUT (1 row per day, first row is the header):        ║
// ║   | Date        | Miles today | Gallons today | Gas $ today |           ║
// ║   | 2026-05-30  |       464   |     14.5      |      50.80  |           ║
// ║   | 2026-05-31  |       437   |     13.7      |      46.40  |           ║
// ║                                                                          ║
// ║  Extra columns are ignored. Blank rows are skipped. Currency symbols    ║
// ║  ($, commas) are stripped from values automatically.                    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
const METER_CONFIG = {
  // PASTE the Google Sheets "Publish to web" CSV URL here once it exists.
  // Leave blank to use the fallback totals below.
  publishedCsvUrl: '',

  // Optional: link to the editable sheet, shown as "Update the sheet ↗"
  // under the meter so the girls can jump straight to data entry.
  sheetEditUrl: 'https://docs.google.com/spreadsheets/d/1CQc1tZBKmu5vxMcTdc5BwIlwGiw3pou4gAnm8RJFwI4/edit?usp=sharing',

  // Trip basics — rarely change.
  tripStart:     '2026-05-29',  // Day 0 = Ruby arrives in Hamilton
  tripTotalDays: 19,            // 19 days, numbered 0–18

  // Fallback totals — shown if the CSV fetch fails, the sheet is empty,
  // or `publishedCsvUrl` is blank. Update these to the last-known good
  // numbers so the meter never sits at zero by accident.
  fallback: { miles: 0, gallons: 0, spend: 0 }
};

// ================= TRIP METER =================
async function initMeter(){
  const milesEl = document.getElementById('meterMiles');
  if (!milesEl) return; // home-page only
  const gallonsEl = document.getElementById('meterGallons');
  const spendEl   = document.getElementById('meterSpend');
  const dayEl     = document.getElementById('meterDayNum');
  const statusEl  = document.getElementById('meterStatus');
  const sheetLink = document.getElementById('meterSheetLink');

  // Build the digit drums for each odometer
  buildOdometerDrums(milesEl,   6, 0);            // 6 integer digits, e.g. 004,454
  buildOdometerDrums(gallonsEl, 5, 1);            // 4 integer + 1 decimal, e.g. 142.0
  buildOdometerDrums(spendEl,   5, 0, '$');       // 5 integer digits with $ prefix

  // Day X of 19 — start with date-math; CSV may refine it below
  if (dayEl) dayEl.textContent = computeDayNumber();

  // Wire the "Update the sheet" link if a URL is configured
  if (sheetLink && METER_CONFIG.sheetEditUrl){
    sheetLink.href = METER_CONFIG.sheetEditUrl;
    sheetLink.style.display = '';
  }

  // Pull live totals from the published-CSV; fall back gracefully on failure
  let totals = { ...METER_CONFIG.fallback };
  let source = 'fallback values';
  let loggedDays = 0;
  if (METER_CONFIG.publishedCsvUrl){
    try {
      const resp = await fetch(METER_CONFIG.publishedCsvUrl, {cache:'no-store'});
      if (!resp.ok) throw new Error('HTTP ' + resp.status);
      const text = await resp.text();
      const parsed = parseSheetCsv(text);
      if (parsed.rowCount > 0){
        totals = { miles: parsed.miles, gallons: parsed.gallons, spend: parsed.spend };
        loggedDays = parsed.rowCount;
        source = `${loggedDays} day${loggedDays===1?'':'s'} logged`;
      } else {
        source = 'sheet is empty — using fallback';
      }
    } catch (e){
      console.warn('Meter: sheet fetch failed,', e);
      source = 'sheet unreachable — using fallback';
    }
  } else {
    source = 'CSV URL not configured — using fallback';
  }

  // If the sheet has data, prefer logged-days for "Day X of 19" (more accurate
  // to actual progress than a pure date calculation, especially mid-trip).
  if (loggedDays > 0 && dayEl){
    // Logged days = number of completed days. Display 1-indexed for users.
    dayEl.textContent = Math.min(loggedDays, METER_CONFIG.tripTotalDays);
  }

  // Status footer line
  if (statusEl){
    const stamp = new Date().toLocaleTimeString([], {hour:'numeric', minute:'2-digit'});
    statusEl.textContent = `Updated ${stamp} · ${source}`;
  }

  // Animate the counters up from 0 (staggered)
  animateOdometer(milesEl,   totals.miles,   1800,   0, 0);
  animateOdometer(gallonsEl, totals.gallons, 1800, 200, 1);
  animateOdometer(spendEl,   totals.spend,   1800, 400, 0);
}

function computeDayNumber(){
  // Returns 1-indexed day-of-trip, or 0 if pre-trip, or tripTotalDays if past end.
  const today = new Date();
  const start = new Date(METER_CONFIG.tripStart + 'T00:00:00');
  const diffDays = Math.floor((today - start) / 86400000);
  if (diffDays < 0) return 0;
  return Math.min(diffDays + 1, METER_CONFIG.tripTotalDays);
}

function buildOdometerDrums(el, totalDigits, decimals, prefix){
  if (!el) return;
  el.innerHTML = '';
  if (prefix){
    const p = document.createElement('span');
    p.className = 'od-prefix';
    p.textContent = prefix;
    el.appendChild(p);
  }
  const integerDigits = decimals > 0 ? totalDigits - decimals : totalDigits;
  // Integer part with comma separators every 3 from the right
  for (let i = 0; i < integerDigits; i++){
    el.appendChild(makeOdometerCell());
    const fromRight = integerDigits - 1 - i;
    if (fromRight > 0 && fromRight % 3 === 0){
      const sep = document.createElement('span');
      sep.className = 'od-sep';
      sep.textContent = ',';
      el.appendChild(sep);
    }
  }
  // Decimal part
  if (decimals > 0){
    const dot = document.createElement('span');
    dot.className = 'od-sep';
    dot.textContent = '.';
    el.appendChild(dot);
    for (let i = 0; i < decimals; i++){
      el.appendChild(makeOdometerCell());
    }
  }
  // Stash decimals on the element so setOdometer() can read it
  el.dataset.decimals = String(decimals || 0);
}

function makeOdometerCell(){
  const cell = document.createElement('span');
  cell.className = 'od-cell';
  const drum = document.createElement('span');
  drum.className = 'od-drum';
  for (let d = 0; d <= 9; d++){
    const dig = document.createElement('span');
    dig.textContent = String(d);
    drum.appendChild(dig);
  }
  // Duplicate 0 at end so wrap-around (9 → 0) animates smoothly downward
  const wrap = document.createElement('span');
  wrap.textContent = '0';
  drum.appendChild(wrap);
  cell.appendChild(drum);
  return cell;
}

function setOdometer(el, value){
  if (!el) return;
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const cells = el.querySelectorAll('.od-cell');
  if (!cells.length) return;
  // Build the digit string (no separators) padded to the cell count
  let digitsStr;
  if (decimals > 0){
    digitsStr = Math.max(0, value).toFixed(decimals).replace('.', '');
  } else {
    digitsStr = String(Math.max(0, Math.floor(value)));
  }
  digitsStr = digitsStr.padStart(cells.length, '0').slice(-cells.length);
  cells.forEach((cell, i) => {
    const d = parseInt(digitsStr[i], 10) || 0;
    const drum = cell.querySelector('.od-drum');
    const h = cell.clientHeight;
    if (h > 0 && drum){
      drum.style.transform = `translateY(-${d * h}px)`;
    }
  });
}

function animateOdometer(el, target, durationMs, delayMs, decimals){
  if (!el) return;
  // decimals param kept for API compat — actual value is stored on the element
  void decimals;
  const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const run = () => {
    if (reduced){
      setOdometer(el, target);
      return;
    }
    const startTime = performance.now();
    function tick(now){
      const t = Math.min(1, (now - startTime) / durationMs);
      const ease = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setOdometer(el, target * ease);
      if (t < 1) requestAnimationFrame(tick);
      else setOdometer(el, target);
    }
    requestAnimationFrame(tick);
  };
  if (delayMs > 0) setTimeout(run, delayMs);
  else run();
}

function parseSheetCsv(text){
  // Sums columns 2/3/4 (Miles / Gallons / Gas $) of every row with a non-blank
  // first column. Header row is auto-detected and skipped.
  const lines = String(text || '').replace(/^﻿/, '').trim().split(/\r?\n/);
  let miles = 0, gallons = 0, spend = 0, rowCount = 0;
  let startIdx = 0;
  if (lines.length > 0){
    const first = parseCsvLine(lines[0]).map(c => c.trim().toLowerCase());
    // Header detected if no numeric values in cols 2/3/4
    const looksNumeric = (s) => s && !isNaN(parseFloat(s.replace(/[$,\s]/g,'')));
    if (!(looksNumeric(first[1]) || looksNumeric(first[2]) || looksNumeric(first[3]))){
      startIdx = 1;
    }
  }
  for (let i = startIdx; i < lines.length; i++){
    const cells = parseCsvLine(lines[i]);
    if (cells.length < 2) continue;
    if (!cells[0] || !cells[0].trim()) continue;
    const m = parseFloat((cells[1]||'').replace(/[$,\s]/g,'')) || 0;
    const g = parseFloat((cells[2]||'').replace(/[$,\s]/g,'')) || 0;
    const s = parseFloat((cells[3]||'').replace(/[$,\s]/g,'')) || 0;
    miles += m; gallons += g; spend += s; rowCount++;
  }
  return { miles, gallons, spend, rowCount };
}

function parseCsvLine(line){
  const cells = [];
  let cur = '', inQuotes = false;
  for (let i = 0; i < line.length; i++){
    const ch = line[i];
    if (ch === '"'){
      if (inQuotes && line[i+1] === '"'){ cur += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes){
      cells.push(cur); cur = '';
    } else {
      cur += ch;
    }
  }
  cells.push(cur);
  return cells;
}

// ================= COUNTDOWN =================
function initCountdown(){
  const el = document.getElementById('countdown');
  if (!el) return;
  const update = () => {
    const diff = TRIP_START - new Date();
    el.textContent = Math.max(0, Math.ceil(diff / (1000*60*60*24)));
  };
  update(); setInterval(update, 60000);
}

// ================= STATES =================
function initStates(){
  const grid = document.getElementById('statesGrid');
  if (!grid) return;
  STATES.forEach(s => {
    const el = document.createElement('div');
    el.className = 'state-poster reveal';
    const album = s.album ? (() => {
      const a = s.album;
      const albumQ  = encodeURIComponent(`${a.title} ${a.artist}`);
      const artistQ = encodeURIComponent(a.artist);
      const spotifyAlbum  = a.spotify       || `https://open.spotify.com/search/${albumQ}`;
      const appleAlbum    = a.apple         || `https://music.apple.com/us/search?term=${albumQ}`;
      const spotifyArtist = a.spotifyArtist || `https://open.spotify.com/search/${artistQ}/artists`;
      const appleArtist   = a.appleArtist   || `https://music.apple.com/us/search?term=${artistQ}`;
      return `
      <div class="state-album">
        <div class="album-label">♪ ${escapeHTML(String(a.year))} · ALBUM</div>
        <div class="album-title">${escapeHTML(a.title)}</div>
        <div class="album-artist">${escapeHTML(a.artist)}</div>
        <div class="album-note">${escapeHTML(a.note)}</div>
        <div class="album-links">
          <span class="al-row-label">Album</span>
          <a class="al-spotify" href="${spotifyAlbum}" target="_blank" rel="noopener" title="Listen to ${escapeHTML(a.title)} on Spotify" aria-label="Listen to ${escapeHTML(a.title)} on Spotify">${ICON_SPOTIFY_HTML}</a>
          <a class="al-apple"   href="${appleAlbum}"   target="_blank" rel="noopener" title="Listen to ${escapeHTML(a.title)} on Apple Music" aria-label="Listen to ${escapeHTML(a.title)} on Apple Music">${ICON_APPLE_HTML}</a>
        </div>
        <div class="album-links">
          <span class="al-row-label">Artist</span>
          <a class="al-spotify" href="${spotifyArtist}" target="_blank" rel="noopener" title="${escapeHTML(a.artist)} on Spotify" aria-label="${escapeHTML(a.artist)} on Spotify">${ICON_SPOTIFY_HTML}</a>
          <a class="al-apple"   href="${appleArtist}"   target="_blank" rel="noopener" title="${escapeHTML(a.artist)} on Apple Music" aria-label="${escapeHTML(a.artist)} on Apple Music">${ICON_APPLE_HTML}</a>
        </div>
      </div>`;
    })() : '';
    el.innerHTML = `
      <div class="poster-wrap">
        <img src="${s.img}" alt="${escapeHTML(s.name)} vintage travel poster" loading="lazy">
      </div>
      <div class="poster-caption">
        <span class="pc-title">${escapeHTML(s.name)}</span>
        <span class="pc-tagline">${escapeHTML(s.subtitle)}</span>
        <span class="pc-detail">${escapeHTML(s.detail)}</span>
      </div>
      ${album}`;
    grid.appendChild(el);
  });
}

// ================= PARKS =================
function initParks(){
  const grid = document.getElementById('parksGrid');
  if (!grid) return;
  NATIONAL_PARKS.forEach((p, idx) => {
    const el = document.createElement('div');
    el.className = 'park-poster reveal' + (p.img ? '' : ' no-image');
    el.setAttribute('role','button');
    el.setAttribute('tabindex','0');
    el.setAttribute('aria-label', 'Open info about ' + p.name + ' National Park');
    const posterInner = p.img
      ? `<img src="${p.img}" alt="${escapeHTML(p.name)} National Park poster" loading="lazy">
         <div class="park-hint">↗ Tap for park info</div>`
      : `<span class="pp-stamp">${escapeHTML(p.state)}</span>
         <span class="pp-name">${escapeHTML(p.name)}</span>
         <span class="pp-sub">${escapeHTML(p.detail)}</span>
         <div class="park-hint">↗ Tap for park info</div>`;
    el.innerHTML = `
      <div class="poster-wrap">${posterInner}</div>
      <div class="poster-caption">
        <span class="pc-title">${escapeHTML(p.name)}</span>
        <span class="pc-tagline">${escapeHTML(p.state)}</span>
        <span class="pc-detail">${escapeHTML(p.detail)}</span>
        ${p.onTrip ? `<div class="park-badge">★ ON THE TRIP · ${escapeHTML(p.days)}</div>` : ''}
      </div>`;
    el.addEventListener('click', () => openParkModal(idx));
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openParkModal(idx); }
    });
    grid.appendChild(el);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeParkModal();
  });
}

function openParkModal(idx){
  const p = NATIONAL_PARKS[idx];
  if (!p || !p.info) return;
  const i = p.info;
  const factChips = [
    i.established ? `<span class="pm-fact"><strong>Established</strong> · ${escapeHTML(i.established)}</span>` : '',
    i.area        ? `<span class="pm-fact"><strong>Area</strong> · ${escapeHTML(i.area)}</span>` : '',
    `<span class="pm-fact"><strong>State</strong> · ${escapeHTML(p.state)}</span>`,
    p.onTrip      ? `<span class="pm-fact" style="background:var(--gold);color:var(--navy);border-color:var(--gold-deep)"><strong>★ On the trip</strong> · ${escapeHTML(p.days)}</span>` : ''
  ].join('');
  const routes = (i.routes||[]).map(r =>
    `<div class="pm-route"><span class="rn">${escapeHTML(r.name)}</span><span class="rd">${r.detail}</span></div>`
  ).join('');
  const things = (i.things||[]).map(t =>
    `<div class="pm-thing"><span class="tag">${escapeHTML(t.tag)}</span>${t.text}</div>`
  ).join('');
  const content = document.getElementById('parkModalContent');
  if (!content) return;
  const posterHTML = p.img
    ? `<img class="park-modal-poster" src="${p.img}" alt="${escapeHTML(p.name)} poster">`
    : `<div class="park-modal-poster placeholder"><span class="pp-name">${escapeHTML(p.name)}</span><span class="pp-sub">${escapeHTML(p.detail)}</span></div>`;
  content.innerHTML = `
    <div class="park-modal-header">
      ${posterHTML}
      <div class="park-modal-titlebox">
        <span class="pm-kicker">America's Best Idea</span>
        <h2 id="parkModalTitle">${escapeHTML(p.name)}</h2>
        <div class="park-modal-facts">${factChips}</div>
        ${i.link ? `<a class="park-modal-link" href="${i.link}" target="_blank" rel="noopener">Official NPS page ↗</a>` : ''}
      </div>
    </div>
    <div class="park-modal-body">
      <h3 class="pm-section-title">A bit of history</h3>
      <div class="pm-history">${i.history}</div>
      <h3 class="pm-section-title">Good routes</h3>
      <div class="pm-routes">${routes}</div>
      <h3 class="pm-section-title">Things to do</h3>
      <div class="pm-things">${things}</div>
    </div>`;
  const modal = document.getElementById('parkModal');
  if (!modal) return;
  modal.classList.add('open');
  document.body.classList.add('park-modal-open');
  modal.scrollTop = 0;
  const closeBtn = modal.querySelector('.park-modal-close');
  if (closeBtn) closeBtn.focus();
}

function closeParkModal(event){
  if (event && event.target && event.target.id !== 'parkModal' && event.type === 'click') return;
  const modal = document.getElementById('parkModal');
  if (!modal) return;
  modal.classList.remove('open');
  document.body.classList.remove('park-modal-open');
}

// ================= READING =================
function initReading(){
  const ess = document.getElementById('booksEssentials');
  if (ess) ess.innerHTML = BOOKS.essentials.map(b => `
    <div class="book-card reveal">
      <div class="book-title">${escapeHTML(b.title)}</div>
      <div class="book-author">by ${escapeHTML(b.author)}</div>
      <div class="book-note">${escapeHTML(b.note)}</div>
    </div>`).join('');

  const reg = document.getElementById('booksRegions');
  if (reg) reg.innerHTML = BOOKS.regions.map(r => `
    <div class="region-block reveal">
      <div class="region-header">
        <h4>${escapeHTML(r.name)}</h4>
        <span class="rdays">${escapeHTML(r.days)}</span>
      </div>
      <div class="book-grid">
        ${r.books.map(b => `
          <div class="book-card">
            <div class="book-title">${escapeHTML(b.title)}</div>
            <div class="book-author">by ${escapeHTML(b.author)}</div>
            <div class="book-note">${escapeHTML(b.note)}</div>
          </div>`).join('')}
      </div>
    </div>`).join('');

  const st = document.getElementById('booksStories');
  if (st) st.innerHTML = BOOKS.stories.map(s => `
    <div class="book-card reveal">
      <span class="book-pages">${escapeHTML(s.pages)}</span>
      <div class="book-title">${escapeHTML(s.title)}</div>
      <div class="book-author">by ${escapeHTML(s.author)}</div>
      <div class="book-note">${escapeHTML(s.note)}</div>
    </div>`).join('');
}

// ================= LISTENING (podcasts) =================
function initListening(){
  if (typeof PODCASTS === 'undefined') return;
  const renderGroup = (containerId, items) => {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = items.map(p => {
      const q = encodeURIComponent(`${p.title} ${p.podcast||''}`.trim());
      const spotifyUrl = p.spotify || `https://open.spotify.com/search/${q}/podcasts`;
      const appleUrl   = p.apple   || `https://podcasts.apple.com/us/search?term=${q}`;
      return `
        <div class="podcast-card reveal">
          <div class="podcast-title">${escapeHTML(p.title)}</div>
          ${p.podcast ? `<div class="podcast-show">${escapeHTML(p.podcast)}</div>` : ''}
          <div class="podcast-note">${escapeHTML(p.note)}</div>
          <div class="album-links" style="margin-top:auto">
            <span class="al-row-label">Listen</span>
            <a class="al-spotify" href="${spotifyUrl}" target="_blank" rel="noopener" title="Find “${escapeHTML(p.title)}” on Spotify" aria-label="Find “${escapeHTML(p.title)}” on Spotify">${ICON_SPOTIFY_HTML}</a>
            <a class="al-apple"   href="${appleUrl}"   target="_blank" rel="noopener" title="Find “${escapeHTML(p.title)}” on Apple Podcasts" aria-label="Find “${escapeHTML(p.title)}” on Apple Podcasts">${ICON_APPLE_HTML}</a>
          </div>
        </div>`;
    }).join('');
  };
  renderGroup('podcastsNps',     PODCASTS.nps     || []);
  renderGroup('podcastsOutside', PODCASTS.outside || []);
}

// Shared brand mark SVGs (also used by initStates)
const ICON_SPOTIFY_HTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12C24 5.4 18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/></svg>';
const ICON_APPLE_HTML   = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M16.5 0 8.5 1.6v11.6c-.4-.2-.9-.3-1.4-.3a3.3 3.3 0 1 0 3.3 3.3V4.6l4.7-.9v6.7c-.4-.2-.9-.3-1.4-.3a3.3 3.3 0 1 0 3.3 3.3V0z"/></svg>';

// ================= DAYS =================
function initDays(){
  const grid = document.getElementById('daysGrid');
  if (!grid) return;
  const todayIdx = currentTripDayIndex();
  DAYS.forEach(d => {
    const lodgingForDay = (typeof LODGING !== 'undefined') ? LODGING.find(l => l.dayNum === d.n) : null;
    const flightsForDay = (typeof FLIGHTS !== 'undefined') ? FLIGHTS.filter(f => f.dayNum === d.n) : [];
    const foodForDay    = (typeof DAILY_FOOD !== 'undefined') ? DAILY_FOOD.find(f => f.dayNum === d.n) : null;
    const weatherForDay = (typeof WEATHER !== 'undefined') ? WEATHER.find(w => w.dayNum === d.n) : null;

    const weatherHTML = weatherForDay ? `
      <div class="day-weather">
        <span class="wx-loc">☀ ${escapeHTML(weatherForDay.location)}</span>
        <span class="wx-temp">High <strong>${escapeHTML(weatherForDay.high)}</strong></span>
        <span class="wx-temp">Low <strong>${escapeHTML(weatherForDay.low)}</strong></span>
        <span class="wx-note">${escapeHTML(weatherForDay.note)}</span>
      </div>` : '';

    const flightHTML = flightsForDay.length ? `
      <div class="day-flights">
        <div class="hd">✈ Flights today</div>
        ${flightsForDay.map(f => {
          const seg = [f.from, f.to].filter(Boolean).join(' → ');
          const route = (f.airline && f.flight) ? `${escapeHTML(f.airline)} ${escapeHTML(f.flight)}` : '';
          const times = [f.dep && `dep ${escapeHTML(f.dep)}`, f.arr && `arr ${escapeHTML(f.arr)}`].filter(Boolean).join(' · ');
          return `<div class="flight-row">
            <span class="who">${escapeHTML(f.who)}</span>
            <span class="seg">${escapeHTML(seg)}</span>
            ${route ? `<span class="ref">${route}</span>` : ''}
            ${times ? `<span class="times">${times}</span>` : ''}
            ${f.duration ? `<span class="dur">${escapeHTML(f.duration)}</span>` : ''}
            ${f.layover  ? `<span class="lay">${escapeHTML(f.layover)}</span>` : ''}
            ${f.cost     ? `<span class="cost">${escapeHTML(f.cost)}</span>` : ''}
            ${f.note     ? `<span class="note">${escapeHTML(f.note)}</span>` : ''}
          </div>`;
        }).join('')}
      </div>` : '';

    const lodgingMeta = lodgingForDay ? [
      lodgingForDay.address     ? `📍 ${escapeHTML(lodgingForDay.address)}` : '',
      lodgingForDay.booked      ? escapeHTML(lodgingForDay.booked) : '',
      lodgingForDay.cost        ? `${fmtMoney(lodgingForDay.cost)}${lodgingForDay.costTotal ? ' (S&R share)' : ''}` : (lodgingForDay.cost === 0 ? 'Free' : ''),
      lodgingForDay.confirmation? `Conf · ${escapeHTML(lodgingForDay.confirmation)}` : '',
      lodgingForDay.notes       ? escapeHTML(lodgingForDay.notes) : '',
      lodgingForDay.link        ? `<a href="${lodgingForDay.link}" target="_blank" rel="noopener">↗ link</a>` : ''
    ].filter(Boolean).join(' · ') : (d.lodging && d.lodging.meta ? escapeHTML(d.lodging.meta) : '');
    const lodgingName = lodgingForDay ? lodgingForDay.name : (d.lodging && d.lodging.name ? d.lodging.name : '');

    const foodLineHTML = foodForDay && foodForDay.total > 0 ? `
      <div class="food-detail">
        <span class="food-chip">B ${fmtMoney(foodForDay.breakfast)}</span>
        <span class="food-chip">L ${fmtMoney(foodForDay.lunch)}</span>
        <span class="food-chip">D ${fmtMoney(foodForDay.dinner)}</span>
        <span class="food-chip">S ${fmtMoney(foodForDay.snacks)}</span>
        <span class="food-chip total">Total ${fmtMoney(foodForDay.total)}</span>
        ${foodForDay.notes ? `<span class="food-note">${escapeHTML(foodForDay.notes)}</span>` : ''}
      </div>` : '';

    const isToday = (d.n === todayIdx);
    const card = document.createElement('article');
    card.className = 'day-card reveal' + (isToday ? ' today' : '');
    card.id = `day-${d.n}`;
    card.innerHTML = `
      <div class="day-header" onclick="toggleDay(${d.n})">
        <div class="day-num-badge">
          <span class="lbl">Day</span><span class="num">${d.n}</span>
        </div>
        <div class="day-title">
          ${isToday ? '<div class="today-badge">★ TODAY</div>' : ''}
          <div class="date">${d.date}</div>
          <h3>${d.title}</h3>
          <div class="route">${d.subroute}</div>
        </div>
        <div class="day-toggle">+</div>
      </div>
      <div class="day-body">
        <div class="day-mini-map" id="map-day-${d.n}"></div>
        <div class="day-stats-row">
          <span class="day-chip primary">🚗 <strong>${d.miles}</strong> ${d.miles.match(/^[<\d]/) ? 'mi' : ''}</span>
          <span class="day-chip">⏱ ${d.drive}</span>
          <span class="day-chip">🌙 ${d.sleep}</span>
        </div>
        ${weatherHTML}
        ${flightHTML}
        <div class="day-main">
          <div class="day-content-split">
            <div>
              <h4 class="day-section-title">Timeline</h4>
              <ul class="day-timeline">${d.timeline.map(t => `<li>${t}</li>`).join('')}</ul>
            </div>
            <div>
              <h4 class="day-section-title">The basics</h4>
              <div class="day-info-box" style="margin-bottom:10px">
                <div class="hd">🏠 Sleep</div>
                <div class="bd">${escapeHTML(lodgingName)}</div>
                <div class="meta">${lodgingMeta}</div>
              </div>
              <div class="day-info-box">
                <div class="hd">🍽 Food</div>
                <div class="bd">${d.food.name}</div>
                <div class="meta">${d.food.meta}</div>
                ${foodLineHTML}
              </div>
            </div>
          </div>
          <h4 class="day-section-title">Ideas for the day</h4>
          <div class="suggestions">
            ${d.suggestions.map(s => `<div class="suggestion"><span class="tag">${s.tag}</span>${s.text}</div>`).join('')}
          </div>
          <div class="protip">${d.protip}</div>
          <h4 class="day-section-title">🎵 Daily playlist</h4>
          <div class="playlist-add">
            <input type="text" id="pl-title-${d.n}" placeholder="Song title">
            <input type="text" id="pl-artist-${d.n}" placeholder="Artist">
            <button onclick="addSong(${d.n})">+ Add</button>
          </div>
          <ul class="playlist-list" id="playlist-${d.n}"></ul>
          <div class="spotify-embed">
            <label for="spotify-${d.n}">Spotify playlist URL (optional)</label>
            <input type="text" id="spotify-${d.n}" placeholder="https://open.spotify.com/playlist/..."
                   oninput="updateSpotify(${d.n})" onblur="updateSpotify(${d.n})">
            <div id="spotify-frame-${d.n}"></div>
          </div>
        </div>
      </div>
    `;
    grid.appendChild(card);
    renderPlaylist(d.n);
    loadSpotify(d.n);
  });
  // Auto-open today's card and scroll it into view (unless URL already targets a day)
  if (todayIdx != null && !location.hash){
    const todayCard = document.getElementById('day-' + todayIdx);
    if (todayCard){
      setTimeout(() => {
        toggleDay(todayIdx);
        todayCard.scrollIntoView({behavior:'smooth', block:'start'});
      }, 200);
    }
  }
}

function initLodgingTotalsOnDays(){} // placeholder for future use

function toggleDay(n){
  const card = document.getElementById(`day-${n}`);
  if (!card) return;
  const wasOpen = card.classList.contains('open');
  card.classList.toggle('open');
  if (!wasOpen) setTimeout(() => initMiniMap(n), 120);
}

// ================= MAP =================
let mainMap = null, currentLayer = null;
const tileLayers = {
  street:{url:'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', attr:'© OpenStreetMap © CARTO', maxZoom:18},
  terrain:{url:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', attr:'© OpenStreetMap © OpenTopoMap', maxZoom:17},
  satellite:{url:'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attr:'© Esri, Maxar', maxZoom:18}
};

function initMap(){
  const mapEl = document.getElementById('mainMap');
  if (!mapEl || typeof L === 'undefined') return;
  mainMap = L.map('mainMap', {
    scrollWheelZoom:false, zoomControl:true,
    tap:true, tapTolerance:15, touchZoom:true,
    doubleClickZoom:true, dragging:true, bounceAtZoomLimits:false
  }).setView([41.5,-98],4);
  switchLayer('street');

  for (let i=0; i<STOPS.length-1; i++){
    const a=STOPS[i], b=STOPS[i+1];
    L.polyline([[a.lat,a.lng],[b.lat,b.lng]], {color:DAY_COLORS[i%DAY_COLORS.length], weight:3, opacity:.4, dashArray:'6,8'})
      .addTo(mainMap)
      .bindTooltip(`Leg ${i+1}: ${a.name} → ${b.name}`, {sticky:true});
  }

  fetchOSRM(STOPS.map(s => [s.lng, s.lat])).then(coords => {
    if (coords && coords.length) {
      L.polyline(coords.map(c => [c[1], c[0]]), {
        color:'#C34A2C', weight:5, opacity:.85, lineCap:'round', lineJoin:'round'
      }).addTo(mainMap).bringToBack();
    }
  });

  const rubyIn=[[27.3954,-82.5544],[35.2144,-80.9473],[43.1119,-76.1063],[42.8270,-75.5446]];
  L.polyline(rubyIn,{color:'#6B4423',weight:2.5,opacity:.7,dashArray:'6,6'}).addTo(mainMap).bindTooltip("Ruby's flight in: SRQ → CLT → SYR");
  L.polyline([[37.6213,-122.3790],[27.3954,-82.5544]],{color:'#6B4423',weight:2.5,opacity:.7,dashArray:'6,6'}).addTo(mainMap).bindTooltip("Ruby's flight home: SFO → SRQ");

  STOPS.forEach(s => {
    const cls = s.type==='start' ? 'start' : s.type==='end' ? 'end' : s.type==='park' ? 'park' : 'sleep';
    const icon = L.divIcon({
      className:'stop-marker',
      html:`<div class="stop-num ${cls}">${s.n}</div>`,
      iconSize:[32,32], iconAnchor:[16,16]
    });
    L.marker([s.lat,s.lng],{icon, zIndexOffset:1000}).addTo(mainMap)
     .bindPopup(`
       <div style="font-family:'Alfa Slab One';color:#1A3A4F;font-size:13px;letter-spacing:.04em">STOP ${s.n}</div>
       <strong style="font-family:'Alfa Slab One';color:#C34A2C;font-size:15px">${s.name.toUpperCase()}</strong>
       <br><span style="font-size:12px;color:#666">${s.label || s.type}</span>
       ${s.day ? `<br><span style="font-size:11px;color:#2D5A3D;font-weight:600">DAY ${s.day}</span>` : ''}
     `,{closeButton:false});
  });

  mainMap.fitBounds(L.latLngBounds(STOPS.map(s=>[s.lat,s.lng])),{padding:[40,40]});

  document.querySelectorAll('.map-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-tab').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      switchLayer(btn.dataset.layer);
    });
  });

  const legend = document.getElementById('mapLegend');
  if (legend) legend.innerHTML = `
    <span class="legend-chip"><span class="legend-dot" style="background:#2D5A3D"></span>Start</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#1A3A4F"></span>Overnight stop</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#1E4030"></span>National park</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#C34A2C"></span>Finish line</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#C34A2C;border-radius:0;width:20px;height:3px"></span>Driving route</span>
    <span class="legend-chip"><span class="legend-dot" style="background:#6B4423;border-radius:0;width:20px;height:3px"></span>Ruby's flights</span>
    <span class="legend-chip" style="margin-left:auto;background:var(--paper);border:1px solid var(--wood)">Stops numbered in order · scroll to zoom</span>
  `;
}

function switchLayer(key){
  if (!mainMap) return;
  if (currentLayer) mainMap.removeLayer(currentLayer);
  const cfg = tileLayers[key];
  currentLayer = L.tileLayer(cfg.url,{attribution:cfg.attr,maxZoom:cfg.maxZoom,subdomains:'abcd'}).addTo(mainMap);
}

async function fetchOSRM(coords){
  if (!coords || coords.length < 2) return null;
  try {
    const coordStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const data = await resp.json();
    if (data.code !== 'Ok' || !data.routes || !data.routes.length) return null;
    return data.routes[0].geometry.coordinates;
  } catch (e) { return null; }
}

async function initMiniMap(dayNum){
  const el = document.getElementById(`map-day-${dayNum}`);
  if (!el || el.dataset.init || typeof L === 'undefined') return;
  el.dataset.init = '1';

  const day = DAYS.find(d => d.n === dayNum);
  const mini = L.map(`map-day-${dayNum}`, {
    scrollWheelZoom:false, zoomControl:false,
    dragging:true, tap:true, tapTolerance:15,
    touchZoom:true, doubleClickZoom:true,
    attributionControl:false
  });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',{subdomains:'abcd',maxZoom:14}).addTo(mini);

  const route = day && day.route;
  const color = DAY_COLORS[dayNum % DAY_COLORS.length];

  if (route && route.length >= 2) {
    const placeholder = L.polyline(route, {color, weight:3, opacity:.4, dashArray:'5,8'}).addTo(mini);
    route.forEach((pt, i) => {
      const isFirst = i === 0, isLast = i === route.length-1;
      const markerColor = isFirst ? '#2D5A3D' : isLast ? '#C34A2C' : '#E8B44C';
      L.circleMarker(pt, {
        radius: (isFirst||isLast) ? 7 : 5,
        fillColor: markerColor, color:'#F5E6C8', weight:2, fillOpacity:1
      }).addTo(mini);
    });
    mini.fitBounds(L.latLngBounds(route),{padding:[30,30]});
    const lngLat = route.map(p => [p[1], p[0]]);
    const osrmCoords = await fetchOSRM(lngLat);
    if (osrmCoords && osrmCoords.length) {
      mini.removeLayer(placeholder);
      L.polyline(osrmCoords.map(c => [c[1], c[0]]), {
        color, weight:4, opacity:.9, lineCap:'round', lineJoin:'round'
      }).addTo(mini);
    }
  } else {
    const nearStop = STOPS.find(s => s.day === dayNum) || STOPS.find(s => Math.abs(s.day - dayNum) <= 1);
    if (nearStop) {
      mini.setView([nearStop.lat, nearStop.lng], 10);
      L.circleMarker([nearStop.lat, nearStop.lng], {
        radius:8, fillColor:'#C34A2C', color:'#F5E6C8', weight:2, fillOpacity:1
      }).addTo(mini).bindTooltip(nearStop.name);
    } else {
      mini.setView([39.8,-98.5],4);
    }
  }
}

// ================= PLAYLIST =================
function addSong(dayNum){
  const tEl=document.getElementById(`pl-title-${dayNum}`), aEl=document.getElementById(`pl-artist-${dayNum}`);
  const title=tEl.value.trim(), artist=aEl.value.trim();
  if (!title) return;
  const key=`playlist-day-${dayNum}`;
  const songs=JSON.parse(storageGet(key)||'[]');
  songs.push({title,artist,ts:Date.now()});
  storageSet(key,JSON.stringify(songs));
  tEl.value=''; aEl.value='';
  renderPlaylist(dayNum);
}
function renderPlaylist(dayNum){
  const list=document.getElementById(`playlist-${dayNum}`);
  if (!list) return;
  const songs=JSON.parse(storageGet(`playlist-day-${dayNum}`)||'[]');
  if (!songs.length){ list.innerHTML='<div class="playlist-empty">No songs yet. What was stuck in your head today?</div>'; return; }
  list.innerHTML=songs.map((s,i)=>`
    <li class="playlist-song">
      <div class="info"><div class="title">♪ ${escapeHTML(s.title)}</div><div class="artist">${escapeHTML(s.artist||'unknown artist')}</div></div>
      <button onclick="deleteSong(${dayNum},${i})" title="Remove">×</button>
    </li>`).join('');
}
function deleteSong(dayNum,idx){
  const songs=JSON.parse(storageGet(`playlist-day-${dayNum}`)||'[]');
  songs.splice(idx,1);
  storageSet(`playlist-day-${dayNum}`,JSON.stringify(songs));
  renderPlaylist(dayNum);
}
function loadSpotify(dayNum){
  const url=storageGet(`spotify-day-${dayNum}`);
  if (url){ const input=document.getElementById(`spotify-${dayNum}`); if(input) input.value=url; renderSpotifyFrame(dayNum,url); }
}
function updateSpotify(dayNum){
  const input=document.getElementById(`spotify-${dayNum}`), url=input.value.trim();
  storageSet(`spotify-day-${dayNum}`,url);
  renderSpotifyFrame(dayNum,url);
}
function renderSpotifyFrame(dayNum,url){
  const frame=document.getElementById(`spotify-frame-${dayNum}`);
  if (!frame) return;
  if (!url){ frame.innerHTML=''; return; }
  const match=url.match(/spotify\.com\/(playlist|track|album|episode|show)\/([a-zA-Z0-9]+)/);
  if (!match){ frame.innerHTML='<div style="font-size:12px;color:var(--ink-soft);padding:8px">Enter a valid Spotify link to embed.</div>'; return; }
  const [,type,id]=match;
  frame.innerHTML=`<iframe src="https://open.spotify.com/embed/${type}/${id}" height="152" allow="encrypted-media" loading="lazy"></iframe>`;
}

// ================= BUDGET =================
function initBudget(){
  renderExpenses();
  const planned = document.getElementById('plannedBudget');
  if (planned) planned.textContent = '$' + Object.values(PLANNED).reduce((a,b)=>a+b,0).toFixed(0);
  renderAuntRanges();
  renderEstimateBreakdown();
  renderRubyPaid();
  renderKnownMisc();
  renderGasByDay();
}
function renderAuntRanges(){
  const el = document.getElementById('budgetAuntRanges');
  if (!el || typeof BUDGET_AUNT_RANGES === 'undefined') return;
  const r = BUDGET_AUNT_RANGES;
  el.innerHTML = `
    <div class="budget-row"><span class="bcat">Food</span><span class="brange">${fmtMoney(r.food.low)} – ${fmtMoney(r.food.high)}</span></div>
    <div class="budget-row"><span class="bcat">Hotels</span><span class="brange">${fmtMoney(r.hotels.low)} – ${fmtMoney(r.hotels.high)}</span></div>
    <div class="budget-row"><span class="bcat">Gas</span><span class="brange">${fmtMoney(r.gas.low)} – ${fmtMoney(r.gas.high)}</span></div>
    <div class="budget-row total"><span class="bcat">Total range</span><span class="brange">${fmtMoney(r.total.low)} – ${fmtMoney(r.total.high)}</span></div>
  `;
}
function renderEstimateBreakdown(){
  const el = document.getElementById('budgetEstimates');
  if (!el || typeof BUDGET_TOTALS === 'undefined') return;
  const t = BUDGET_TOTALS;
  el.innerHTML = `
    <div class="budget-row"><span class="bcat">Food</span><span class="bval">${fmtMoney(t.food)}</span></div>
    <div class="budget-row"><span class="bcat">Gas</span><span class="bval">${fmtMoney(t.gas)}</span></div>
    <div class="budget-row"><span class="bcat">Misc / Setup</span><span class="bval">${fmtMoney(t.miscSetup)}</span></div>
    <div class="budget-row"><span class="bcat">Lodging</span><span class="bval">${fmtMoney(t.lodging)}</span></div>
    <div class="budget-row"><span class="bcat">Travel / Flights</span><span class="bval">${fmtMoney(t.flights)}</span></div>
    <div class="budget-row total"><span class="bcat">Estimated total</span><span class="bval">${fmtMoney(t.grandTotal)}</span></div>
  `;
}
function renderRubyPaid(){
  const el = document.getElementById('budgetRubyPaid');
  if (!el || typeof BUDGET_RUBY_PAID === 'undefined') return;
  el.innerHTML = BUDGET_RUBY_PAID.map(r =>
    `<div class="budget-row${r.total?' total':''}"><span class="bcat">${escapeHTML(r.item)}</span><span class="bval">${fmtMoney(r.amount)}</span></div>`
  ).join('');
}
function renderKnownMisc(){
  const el = document.getElementById('budgetMiscList');
  if (!el || typeof BUDGET_KNOWN_MISC === 'undefined') return;
  el.innerHTML = BUDGET_KNOWN_MISC.map(m => `
    <div class="misc-row">
      <span class="m-item">${escapeHTML(m.item)}</span>
      ${m.notes ? `<span class="m-notes">${escapeHTML(m.notes)}</span>` : '<span></span>'}
      <span class="m-cost">${fmtMoney(m.cost)}</span>
    </div>
  `).join('');
  const sum = BUDGET_KNOWN_MISC.reduce((a,m)=>a+(m.cost||0),0);
  const totalEl = document.getElementById('budgetMiscTotal');
  if (totalEl) totalEl.textContent = fmtMoney(sum);
}
function renderGasByDay(){
  const el = document.getElementById('budgetGasList');
  if (!el || typeof BUDGET_GAS_BY_DAY === 'undefined') return;
  el.innerHTML = `
    <div class="gas-row gas-head">
      <span>Day</span><span>Route</span><span>Miles</span><span>Gal</span><span>$/gal</span><span>Cost</span>
    </div>
    ${BUDGET_GAS_BY_DAY.map(g => `
      <div class="gas-row">
        <span>${g.dayNum}</span>
        <span>${escapeHTML(g.route)}</span>
        <span>${g.miles}</span>
        <span>${g.gallons.toFixed(1)}</span>
        <span>${fmtMoney(g.pricePerGal)}</span>
        <span>${fmtMoney(g.cost)}</span>
      </div>
    `).join('')}
  `;
  const totalMiles = BUDGET_GAS_BY_DAY.reduce((a,g)=>a+g.miles,0);
  const totalCost  = BUDGET_GAS_BY_DAY.reduce((a,g)=>a+g.cost,0);
  const miles = document.getElementById('budgetGasMiles');
  const cost  = document.getElementById('budgetGasTotal');
  if (miles) miles.textContent = totalMiles.toLocaleString();
  if (cost)  cost.textContent  = fmtMoney(totalCost);
}
function addExpense(){
  const desc=document.getElementById('expDesc').value.trim(), cat=document.getElementById('expCat').value, amt=parseFloat(document.getElementById('expAmt').value);
  if (!desc||!amt||isNaN(amt)) return;
  const expenses=JSON.parse(storageGet('expenses')||'[]');
  expenses.push({desc,cat,amt,ts:Date.now()});
  storageSet('expenses',JSON.stringify(expenses));
  document.getElementById('expDesc').value=''; document.getElementById('expAmt').value='';
  renderExpenses();
}
function deleteExpense(idx){
  const expenses=JSON.parse(storageGet('expenses')||'[]');
  expenses.splice(idx,1);
  storageSet('expenses',JSON.stringify(expenses));
  renderExpenses();
}
function renderExpenses(){
  const list=document.getElementById('expenseList');
  if (!list) return;
  const expenses=JSON.parse(storageGet('expenses')||'[]');
  if (!expenses.length){ list.innerHTML='<div class="empty-msg">No expenses logged yet.</div>'; }
  else {
    list.innerHTML=expenses.slice().reverse().map((e,revIdx)=>{
      const i=expenses.length-1-revIdx;
      return `<div class="expense-item"><span class="cat-pill cat-${e.cat}">${e.cat}</span><span>${escapeHTML(e.desc)}</span><span class="amount">$${e.amt.toFixed(2)}</span><button onclick="deleteExpense(${i})" title="Remove">×</button></div>`;
    }).join('');
  }
  const total=expenses.reduce((s,e)=>s+e.amt,0);
  const totalEl=document.getElementById('totalSpent');
  if (totalEl) totalEl.textContent='$'+total.toFixed(2);
  renderProgress(expenses);
}
function renderProgress(expenses){
  const list=document.getElementById('progressList');
  if (!list) return;
  const totals={};
  Object.keys(PLANNED).forEach(k=>totals[k]=0);
  expenses.forEach(e=>{ totals[e.cat]=(totals[e.cat]||0)+e.amt; });
  const catColors={food:'#C34A2C',gas:'#1A3A4F',lodging:'#2D5A3D',activities:'#D97A3A',misc:'#6B4423'};
  list.innerHTML=Object.keys(PLANNED).map(cat=>{
    const actual=totals[cat]||0, plan=PLANNED[cat], pct=Math.min(100,(actual/plan)*100), over=actual>plan;
    return `<div class="progress-item">
      <div class="row"><span class="cat">${cat}</span><span>$${actual.toFixed(0)} <span style="color:var(--ink-soft);font-weight:400">/ $${plan.toFixed(0)}</span></span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${over?'#8B3A3A':catColors[cat]}"></div></div>
    </div>`;
  }).join('');
}

// ================= PACKING =================
function initPacking(){
  const grid=document.getElementById('packingGrid');
  if (!grid) return;
  const checked=JSON.parse(storageGet('packing')||'{}');
  Object.entries(PACKING).forEach(([cat,items])=>{
    const card=document.createElement('div');
    card.className='pack-cat reveal';
    card.innerHTML=`<h4>${cat}</h4>`+items.map(it=>{
      // Handle both legacy string format and structured object format
      if (typeof it === 'string'){
        const key=`${cat}::${it}`;
        return `<label><input type="checkbox" ${checked[key]?'checked':''} onchange="togglePack('${key.replace(/'/g,"\\'")}',this.checked)"><span>${escapeHTML(it)}</span></label>`;
      }
      const key=`${cat}::${it.item}`;
      const tags=[
        it.buy   ? '<span class="pack-tag tag-buy">BUY</span>'   : '',
        it.pack  ? '<span class="pack-tag tag-pack">PACK</span>' : '',
        it.both  ? '<span class="pack-tag tag-both">×2 for both</span>' : '',
        it.qty   ? `<span class="pack-tag tag-qty">${escapeHTML(it.qty)}</span>` : '',
        it.who   ? `<span class="pack-tag tag-who">${escapeHTML(it.who)}</span>` : ''
      ].filter(Boolean).join('');
      const note = it.note ? `<div class="pack-note">${escapeHTML(it.note)}${it.link?` · <a href="${it.link}" target="_blank" rel="noopener">↗ link</a>`:''}</div>` : (it.link ? `<div class="pack-note"><a href="${it.link}" target="_blank" rel="noopener">↗ link</a></div>` : '');
      return `<label class="pack-item-row">
        <input type="checkbox" ${checked[key]?'checked':''} onchange="togglePack('${key.replace(/'/g,"\\'")}',this.checked)">
        <span class="pack-item-body">
          <span class="pack-item-name">${escapeHTML(it.item)}</span>
          ${tags ? `<span class="pack-tags">${tags}</span>` : ''}
          ${note}
        </span>
      </label>`;
    }).join('');
    grid.appendChild(card);
  });
}
function togglePack(key,val){
  const checked=JSON.parse(storageGet('packing')||'{}');
  checked[key]=val;
  storageSet('packing',JSON.stringify(checked));
}

// ================= REVEAL =================
function initReveals(){
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); obs.unobserve(e.target); } });
  },{threshold:0.1});
  document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
}

// ================= EXPORT/IMPORT =================
function exportData(){
  const data={};
  const keys=['expenses','packing'];
  for(let i=0;i<19;i++){ keys.push(`playlist-day-${i}`,`spotify-day-${i}`); }
  for(const k of keys){ const v=storageGet(k); if(v) data[k]=v; }
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const a=document.createElement('a');
  a.href=URL.createObjectURL(blob);
  a.download=`roadtrip-data-${new Date().toISOString().slice(0,10)}.json`;
  a.click();
}
function initExportImport(){
  const f = document.getElementById('importFile');
  if (!f) return;
  f.addEventListener('change', async(e)=>{
    const file=e.target.files[0]; if(!file) return;
    try {
      const data=JSON.parse(await file.text());
      for(const [k,v] of Object.entries(data)) storageSet(k,v);
      location.reload();
    } catch(err){ alert('Could not import — invalid file.'); }
  });
}
function importData(){ document.getElementById('importFile').click(); }
