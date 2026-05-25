// ================= INIT (multi-page aware) =================
// Each init function checks for its target element. Missing element = skip.
document.addEventListener('DOMContentLoaded', () => {
  initCountdown();
  initStates();
  initParks();
  initReading();
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
    const album = s.album ? `
      <div class="state-album">
        <div class="album-label">♪ ${escapeHTML(String(s.album.year))} · ALBUM</div>
        <div class="album-title">${escapeHTML(s.album.title)}</div>
        <div class="album-artist">${escapeHTML(s.album.artist)}</div>
        <div class="album-note">${escapeHTML(s.album.note)}</div>
      </div>` : '';
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

// ================= DAYS =================
function initDays(){
  const grid = document.getElementById('daysGrid');
  if (!grid) return;
  DAYS.forEach(d => {
    const lodgingForDay = (typeof LODGING !== 'undefined') ? LODGING.find(l => l.dayNum === d.n) : null;
    const flightsForDay = (typeof FLIGHTS !== 'undefined') ? FLIGHTS.filter(f => f.dayNum === d.n) : [];
    const foodForDay    = (typeof DAILY_FOOD !== 'undefined') ? DAILY_FOOD.find(f => f.dayNum === d.n) : null;

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

    const card = document.createElement('article');
    card.className = 'day-card reveal';
    card.id = `day-${d.n}`;
    card.innerHTML = `
      <div class="day-header" onclick="toggleDay(${d.n})">
        <div class="day-num-badge">
          <span class="lbl">Day</span><span class="num">${d.n}</span>
        </div>
        <div class="day-title">
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
