import '@fontsource/barlow/400.css';
import '@fontsource/barlow/500.css';
import '@fontsource/barlow/600.css';
import '@fontsource/barlow-condensed/600.css';
import './style.css';
import { registerSW } from 'virtual:pwa-register';
import { Viewer } from './scene/viewer';
import { MeshInfo } from './scene/model';
import { PASI, TITLU, SUBTITLU } from './data/pasi';
import { PIESE } from './data/piese';
import { TAIERE, INTRO_TAIERE, NOTA_TAIERE } from './data/taiere';
import { MAGAZINE, INTRO_CUMPARATURI, NOTA_CUMPARATURI } from './data/magazine';
import { store } from './store';

const $ = <T extends HTMLElement = HTMLElement>(id: string) => document.getElementById(id) as T;
const esc = (s: string) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

// ---------- temă ----------
const mqDark = window.matchMedia('(prefers-color-scheme: dark)');
const TEME = { auto: 'Temă automată', light: 'Temă luminoasă', dark: 'Temă întunecată' } as const;
function applyTheme() {
  const t = store.tema;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  const dark = t === 'dark' || (t === 'auto' && mqDark.matches);
  $('theme').innerHTML = dark ? ICON.moon : t === 'auto' ? ICON.auto : ICON.sun;
  $('theme').setAttribute('aria-label', TEME[t] + ' (atinge ca să schimbi)');
  $('theme').title = TEME[t];
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', dark ? '#141C1F' : '#2E6B57');
  viewer?.applyTheme();
}

// ---------- iconițe ----------
const svg = (d: string) => `<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const ICON = {
  play: svg('<path d="M7 5l12 7-12 7z" fill="currentColor"/>'),
  skip: svg('<path d="M5 5l9 7-9 7zM17 5v14"/>'),
  explode: svg('<path d="M12 3v5M12 16v5M3 12h5M16 12h5M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2"/>'),
  section: svg('<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M12 4v16" stroke-dasharray="2 2"/><path d="M12 4h8v16h-8" fill="currentColor" opacity=".25"/>'),
  fade: svg('<circle cx="9" cy="12" r="6"/><circle cx="15" cy="12" r="6" fill="currentColor" opacity=".35"/>'),
  tag: svg('<path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.5"/>'),
  home: svg('<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/>'),
  sun: svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>'),
  moon: svg('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>'),
  auto: svg('<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 010 16z" fill="currentColor"/>'),
  close: svg('<path d="M6 6l12 12M18 6L6 18"/>'),
  print: svg('<path d="M6 9V3h12v6"/><rect x="3" y="9" width="18" height="8" rx="2"/><path d="M6 14h12v7H6z"/>'),
  check: svg('<path d="M5 12l5 5 9-10"/>')
};

// ---------- 3D ----------
let viewer: Viewer;
const card = $('card');
function showCard(d: MeshInfo | null) {
  if (!d) { card.hidden = true; return; }
  const pas = PASI[d.step];
  let h = `<button class="iconbtn close" id="cardx" aria-label="Închide">${ICON.close}</button>`;
  if (d.kind === 'surub') {
    h += `<div class="ccode">Șurub</div><div class="cname">${esc((pas.prinderi || []).join(' · ') || 'prindere')}</div>`;
  } else if (d.kind === 'capsa') {
    h += `<div class="ccode">Capsă</div><div class="cname">${esc((pas.prinderi || []).join(' · '))}</div>`;
  } else {
    const p = PIESE[d.code];
    h += `<div class="ccode">${esc(d.code)}</div><div class="cname">${esc(p?.nume || '')}</div>`;
    h += `<dl><dt>Dimensiune</dt><dd>${esc(p?.dim || '–')}</dd><dt>Se ia din</dt><dd>${esc(p?.taieDin || '–')}</dd></dl>`;
    if (p?.link) h += `<a class="buybtn" href="${esc(p.link)}" target="_blank" rel="noopener">Cumpără de la ${esc(p.magazin || 'magazin')} ↗</a>`;
    else if (p?.magazin) h += `<div class="muted cshop">Se cumpără de la: ${esc(p.magazin)}</div>`;
  }
  h += `<button class="linkbtn" id="cardgo">Pasul ${d.step + 1}: ${esc(pas.titlu)} ›</button>`;
  card.innerHTML = h; card.hidden = false;
  $('cardx').onclick = () => { card.hidden = true; viewer.clearHighlight(); };
  $('cardgo').onclick = () => { card.hidden = true; showTab('montaj'); if (d.step !== cur) go(d.step); };
}

// ---------- bara de unelte pe scenă ----------
const tools = $('tools');
let explodeOn = false, fadeOn = false, labelsOn = true, playing = false;
let secAxis: 'z' | 'x' = 'z', secV = 0, secOpen = false, hideFront: boolean | null = null, hideCeil = false;
function toolBtn(id: string, icon: string, text: string, pressed?: boolean) {
  return `<button class="tool" id="${id}" ${pressed !== undefined ? `aria-pressed="${pressed}"` : ''}>${icon}<span>${text}</span></button>`;
}
function renderTools() {
  tools.innerHTML =
    (playing ? toolBtn('t-play', ICON.skip, 'Sari peste') : toolBtn('t-play', ICON.play, 'Rulează')) +
    `<button class="tool small" id="t-speed" aria-label="Viteza animației">×${store.viteza}</button>` +
    toolBtn('t-explode', ICON.explode, 'Explodat', explodeOn) +
    toolBtn('t-section', ICON.section, 'Secțiune', secOpen) +
    toolBtn('t-fade', ICON.fade, 'Doar pasul', fadeOn) +
    toolBtn('t-tags', ICON.tag, 'Coduri', labelsOn) +
    toolBtn('t-home', ICON.home, 'Vedere');
  $('t-play').onclick = () => (playing ? viewer.skip() : viewer.replay());
  $('t-speed').onclick = () => { store.viteza = store.viteza === 1 ? 2 : store.viteza === 2 ? 0.5 : 1; viewer.speed = store.viteza; renderTools(); };
  $('t-explode').onclick = () => { explodeOn = !explodeOn; viewer.setExplode(explodeOn); renderTools(); };
  $('t-section').onclick = () => { secOpen = !secOpen; renderSec(); renderTools(); };
  $('t-fade').onclick = () => { fadeOn = !fadeOn; viewer.setFade(fadeOn); renderTools(); };
  $('t-tags').onclick = () => { labelsOn = !labelsOn; viewer.setLabels(labelsOn); renderTools(); };
  $('t-home').onclick = () => viewer.resetView();
}
const secbar = $('secbar');
function renderSec() {
  secbar.hidden = !secOpen;
  if (!secOpen) return;
  const hf = hideFront ?? viewer.hideFront;
  secbar.innerHTML = `
    <div class="secrow">
      <button class="chipbtn" id="s-front" aria-pressed="${hf}">Ascunde peretele din față</button>
      <button class="chipbtn" id="s-ceil" aria-pressed="${hideCeil}">Ascunde tavanul</button>
    </div>
    <div class="secrow">
      <div class="seg" role="radiogroup" aria-label="Direcția tăieturii">
        <button role="radio" id="s-z" aria-checked="${secAxis === 'z'}">Din față</button>
        <button role="radio" id="s-x" aria-checked="${secAxis === 'x'}">Din dreapta</button>
      </div>
      <input type="range" id="s-range" min="0" max="100" value="${Math.round(secV * 100)}" aria-label="Adâncimea tăieturii">
    </div>`;
  $('s-front').onclick = () => { hideFront = !(hideFront ?? viewer.hideFront); viewer.setHidden(hideFront, hideCeil); renderSec(); };
  $('s-ceil').onclick = () => { hideCeil = !hideCeil; hideFront = hideFront ?? viewer.hideFront; viewer.setHidden(hideFront, hideCeil); renderSec(); };
  $('s-z').onclick = () => { secAxis = 'z'; viewer.setSection(secAxis, secV); renderSec(); };
  $('s-x').onclick = () => { secAxis = 'x'; viewer.setSection(secAxis, secV); renderSec(); };
  $<HTMLInputElement>('s-range').oninput = e => { secV = +(e.target as HTMLInputElement).value / 100; viewer.setSection(secAxis, secV); };
}

// ---------- pași ----------
let cur = 0;
const strip = $('strip'), stepEl = $('step');
const chips = PASI.map((s, i) => {
  const b = document.createElement('button');
  b.className = 'chip'; b.textContent = String(i + 1);
  b.setAttribute('aria-label', `Pasul ${i + 1}: ${s.titlu}`);
  b.onclick = () => go(i);
  strip.appendChild(b); return b;
});
function updateChips() {
  chips.forEach((c, k) => { c.classList.toggle('on', k === cur); c.classList.toggle('done', store.get('pas:' + k)); });
  const n = store.count('pas:');
  $('bar').style.width = (100 * n / PASI.length) + '%';
  $('progtext').textContent = `${n} / ${PASI.length} pași terminați`;
}
function renderStep() {
  const s = PASI[cur];
  const done = store.get('pas:' + cur);
  let h = `<div class="head"><div class="num">${String(cur + 1).padStart(2, '0')}</div><div><small>${esc(s.faza)} · pasul ${cur + 1} din ${PASI.length}</small><h2>${esc(s.titlu)}</h2></div></div>`;
  h += `<button class="donebtn" id="done" aria-pressed="${done}">${ICON.check}<span>${done ? 'Pas terminat' : 'Marchează pasul ca terminat'}</span></button>`;
  if (s.nota && s.avertisment) h += `<p class="note warn"><b>Atenție.</b> ${esc(s.nota)}</p>`;
  h += s.text.map(x => `<p>${esc(x)}</p>`).join('');
  if (s.piese) {
    h += `<h3>Piese <small>atinge un rând ca să vezi piesa în 3D</small></h3><div class="wrap"><table class="pt"><tbody>` +
      s.piese.map(([c, q]) => `<tr data-code="${esc(c)}" tabindex="0"><td class="code">${esc(c)}</td><td>${esc(PIESE[c]?.nume || c)}<br><span class="muted">${esc(PIESE[c]?.dim || '')}</span></td><td class="q">${q} ×</td></tr>`).join('') +
      `</tbody></table></div>`;
  }
  if (s.prinderi) h += `<h3>Prinderi</h3><ul>${s.prinderi.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (s.nota && !s.avertisment) h += `<p class="note">${esc(s.nota)}</p>`;
  stepEl.innerHTML = h;
  $('done').onclick = () => { store.set('pas:' + cur, !store.get('pas:' + cur)); renderStep(); updateChips(); };
  stepEl.querySelectorAll<HTMLTableRowElement>('tr[data-code]').forEach(tr => {
    const act = () => { const c = tr.dataset.code!; viewer.highlightCode(c); showCard({ step: cur, code: c, kind: 'piesa' } as MeshInfo); };
    tr.onclick = act; tr.onkeydown = e => { if (e.key === 'Enter') act(); };
  });
}
function go(i: number) {
  cur = Math.max(0, Math.min(PASI.length - 1, i));
  store.pas = cur;
  card.hidden = true;
  hideFront = null; hideCeil = false; viewer.autoCutOn();
  viewer.go(cur, !matchMedia('(prefers-reduced-motion: reduce)').matches);
  renderStep(); updateChips(); renderSec();
  chips[cur].scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  $<HTMLButtonElement>('prev').disabled = cur === 0;
  $<HTMLButtonElement>('next').disabled = cur === PASI.length - 1;
  $('next').textContent = cur === PASI.length - 1 ? 'Sauna e gata' : 'Pasul următor ›';
  $('scroll').scrollTop = 0;
}

// ---------- tăiere și cumpărături ----------
function renderTaiere() {
  const total = TAIERE.reduce((a, g) => a + g.randuri.length, 0), n = store.count('taie:');
  $('v-taiere').innerHTML =
    `<div class="listhead"><span class="pill">${n} din ${total} rânduri tăiate</span><button class="btn small" id="print-t">${ICON.print}<span>Printează / PDF</span></button></div>` +
    `<p>${esc(INTRO_TAIERE)}</p><p class="note">${esc(NOTA_TAIERE)}</p>` +
    TAIERE.map((g, gi) => `<h3>${esc(g.titlu)}</h3><div class="wrap"><table class="ct"><thead><tr><th></th><th>Bucata</th><th>Tai</th><th>Lungimi, mm</th></tr></thead><tbody>` +
      g.randuri.map((r, ri) => {
        const k = `taie:${gi}:${ri}`, on = store.get(k);
        return `<tr class="${on ? 'checked' : ''}"><td class="cb"><input type="checkbox" data-k="${k}" ${on ? 'checked' : ''} aria-label="Tăiat: ${esc(r[0])}"></td><td class="code">${esc(r[0])}</td><td class="code">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`;
      }).join('') + `</tbody></table></div>`).join('') +
    `<p><button class="linkbtn" id="reset-t">Șterge bifele de tăiere</button></p>`;
  bindChecks('v-taiere', renderTaiere);
  $('print-t').onclick = () => printList('taiere');
  $('reset-t').onclick = () => { if (confirm('Ștergi toate bifele din lista de tăiere?')) { store.reset('taie:'); renderTaiere(); } };
}
function renderCump() {
  const total = MAGAZINE.reduce((a, m) => a + m.produse.length, 0), n = store.count('cump:');
  $('v-cumparaturi').innerHTML =
    `<div class="listhead"><span class="pill">${n} din ${total} produse cumpărate</span><button class="btn small" id="print-c">${ICON.print}<span>Printează / PDF</span></button></div>` +
    `<p>${esc(INTRO_CUMPARATURI)}</p><p class="note">${esc(NOTA_CUMPARATURI)}</p>` +
    MAGAZINE.map((m, mi) => `<div class="store">${esc(m.nume)}<small>${esc(m.descriere)}</small></div>` +
      m.produse.map((it, ii) => {
        const k = `cump:${mi}:${ii}`, on = store.get(k);
        return `<label class="item ${on ? 'checked' : ''}"><input type="checkbox" data-k="${k}" ${on ? 'checked' : ''}><span class="itxt"><b>${esc(it.nume)}</b><span class="meta">${esc(it.cantitate)} · ${it.pret === 'neverificat' ? '<span class="unv">neverificat</span>' : esc(it.pret)}${it.nota ? '<br>' + esc(it.nota) : ''}</span>${it.link ? `<a href="${esc(it.link)}" target="_blank" rel="noopener">Pagina produsului ↗</a>` : ''}</span></label>`;
      }).join('')).join('') +
    `<p><button class="linkbtn" id="reset-c">Șterge bifele de cumpărături</button></p>`;
  bindChecks('v-cumparaturi', renderCump);
  $('print-c').onclick = () => printList('cumparaturi');
  $('reset-c').onclick = () => { if (confirm('Ștergi toate bifele din lista de cumpărături?')) { store.reset('cump:'); renderCump(); } };
}
function bindChecks(id: string, rerender: () => void) {
  $(id).querySelectorAll<HTMLInputElement>('input[data-k]').forEach(cb => {
    cb.onchange = () => { store.set(cb.dataset.k!, cb.checked); const y = $('scroll').scrollTop; rerender(); $('scroll').scrollTop = y; };
  });
}
function printList(which: 'taiere' | 'cumparaturi') {
  const box = (k: string) => `<span class="pbox">${store.get(k) ? '✓' : ''}</span>`;
  const date = new Date().toLocaleDateString('ro-RO');
  let h = `<h1>${esc(TITLU)}</h1><p class="psub">${esc(SUBTITLU)} · ${date}</p>`;
  if (which === 'taiere') {
    h += `<h2>Lista de tăiere</h2><p>${esc(INTRO_TAIERE)}</p><p class="pnote">${esc(NOTA_TAIERE)}</p>`;
    h += TAIERE.map((g, gi) => `<h3>${esc(g.titlu)}</h3><table><thead><tr><th></th><th>Bucata</th><th>Tai</th><th>Lungimi, mm</th></tr></thead><tbody>` +
      g.randuri.map((r, ri) => `<tr><td>${box(`taie:${gi}:${ri}`)}</td><td><b>${esc(r[0])}</b></td><td><b>${esc(r[1])}</b></td><td>${esc(r[2])}</td></tr>`).join('') + '</tbody></table>').join('');
    h += `<h3>Piese, după cod</h3><table><thead><tr><th>Cod</th><th>Piesă</th><th>Dimensiune</th><th>Se ia din</th></tr></thead><tbody>` +
      Object.entries(PIESE).map(([c, p]) => `<tr><td><b>${esc(c)}</b></td><td>${esc(p.nume)}</td><td>${esc(p.dim)}</td><td>${esc(p.taieDin || '')}</td></tr>`).join('') + '</tbody></table>';
  } else {
    h += `<h2>Lista de cumpărături</h2><p>${esc(INTRO_CUMPARATURI)}</p><p class="pnote">${esc(NOTA_CUMPARATURI)}</p>`;
    h += MAGAZINE.map((m, mi) => `<h3>${esc(m.nume)}</h3><p class="pdesc">${esc(m.descriere)}</p><table><thead><tr><th></th><th>Produs</th><th>Cantitate</th><th>Preț</th><th>Note</th></tr></thead><tbody>` +
      m.produse.map((it, ii) => `<tr><td>${box(`cump:${mi}:${ii}`)}</td><td><b>${esc(it.nume)}</b>${it.link ? `<br><span class="plink">${esc(it.link)}</span>` : ''}</td><td>${esc(it.cantitate)}</td><td>${esc(it.pret)}</td><td>${esc(it.nota)}</td></tr>`).join('') + '</tbody></table>').join('');
  }
  $('print').innerHTML = h;
  setTimeout(() => window.print(), 50);
}

// ---------- tab-uri ----------
const views: Record<string, HTMLElement> = { montaj: $('v-montaj'), taiere: $('v-taiere'), cumparaturi: $('v-cumparaturi') };
function showTab(t: string) {
  document.querySelectorAll<HTMLButtonElement>('.tab').forEach(x => x.setAttribute('aria-selected', String(x.dataset.tab === t)));
  Object.entries(views).forEach(([k, v]) => (v.hidden = k !== t));
  $('nav').hidden = t !== 'montaj';
  $('app').classList.toggle('lists', t !== 'montaj');
  if (t !== 'montaj' && secOpen) { secOpen = false; renderSec(); renderTools(); }
  if (t === 'taiere') renderTaiere();
  if (t === 'cumparaturi') renderCump();
  $('scroll').scrollTop = 0;
}
document.querySelectorAll<HTMLButtonElement>('.tab').forEach(t => (t.onclick = () => showTab(t.dataset.tab!)));

// ---------- pornire ----------
$('title').textContent = TITLU;
$('subtitle').textContent = SUBTITLU;
$('theme').onclick = () => { store.tema = store.tema === 'auto' ? 'light' : store.tema === 'light' ? 'dark' : 'auto'; applyTheme(); toast(TEME[store.tema]); };
mqDark.addEventListener?.('change', applyTheme);
$('prev').onclick = () => go(cur - 1);
$('next').onclick = () => go(cur + 1);
document.addEventListener('keydown', e => {
  if ((e.target as HTMLElement).tagName === 'INPUT') return;
  if (e.key === 'ArrowRight') go(cur + 1);
  if (e.key === 'ArrowLeft') go(cur - 1);
});

function toast(msg: string) {
  const t = $('toast'); t.textContent = msg; t.hidden = false;
  setTimeout(() => (t.hidden = true), 3500);
}

try {
  viewer = new Viewer($('stage'), $('labels'), $('tooltip'), {
    onPick: d => showCard(d),
    onAnim: p => { playing = p; renderTools(); }
  });
  viewer.speed = store.viteza;
  (window as unknown as { __viewer: Viewer }).__viewer = viewer; // pentru depanare
} catch (err) {
  $('stage').innerHTML = '<div class="nogl">Modelul 3D nu poate porni pe acest dispozitiv (WebGL indisponibil). Pașii, lista de tăiere și cea de cumpărături merg în continuare.</div>';
  // obiect gol, ca restul interfeței să meargă
  viewer = new Proxy({}, { get: () => () => false }) as unknown as Viewer;
  console.error(err);
}
applyTheme();
renderTools();
go(Math.min(store.pas || 0, PASI.length - 1));

// sfat pentru iPhone: instalarea se face din Safari
const ua = navigator.userAgent;
const isIOS = /iPhone|iPad|iPod/.test(ua) || (ua.includes('Mac') && navigator.maxTouchPoints > 1);
const standalone = matchMedia('(display-mode: standalone)').matches || (navigator as unknown as { standalone?: boolean }).standalone;
if (isIOS && !standalone && !store.get('ui:iostip')) {
  const tip = $('iostip');
  tip.innerHTML = `<span>Ca să meargă și fără semnal, în Safari atinge <b>Partajare</b> → <b>Adaugă pe ecranul principal</b>.</span><button class="iconbtn" aria-label="Închide">${ICON.close}</button>`;
  tip.hidden = false;
  tip.querySelector('button')!.onclick = () => { tip.hidden = true; store.set('ui:iostip', true); };
}

registerSW({
  immediate: true,
  onOfflineReady() { toast('Aplicația e salvată pe dispozitiv și merge și fără internet.'); }
});
