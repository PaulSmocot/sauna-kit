// Bife și preferințe salvate pe telefon (localStorage). Dacă stocarea nu e disponibilă, aplicația merge oricum.
const KEY = 'sauna-kit-v1';

interface State {
  bife: Record<string, boolean>;   // 'pas:3', 'taie:0:2', 'cump:1:4'
  pas: number;
  tema: 'auto' | 'light' | 'dark';
  viteza: number;
}

let st: State = { bife: {}, pas: 0, tema: 'auto', viteza: 1 };
try {
  const raw = localStorage.getItem(KEY);
  if (raw) st = { ...st, ...JSON.parse(raw) };
} catch { /* stocare blocată */ }

function save() { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch { /* ignor */ } }

export const store = {
  get: (k: string) => !!st.bife[k],
  set(k: string, v: boolean) { if (v) st.bife[k] = true; else delete st.bife[k]; save(); },
  count: (prefix: string) => Object.keys(st.bife).filter(k => k.startsWith(prefix)).length,
  get pas() { return st.pas; }, set pas(v: number) { st.pas = v; save(); },
  get tema() { return st.tema; }, set tema(v: State['tema']) { st.tema = v; save(); },
  get viteza() { return st.viteza; }, set viteza(v: number) { st.viteza = v; save(); },
  reset(prefix: string) { Object.keys(st.bife).forEach(k => { if (k.startsWith(prefix)) delete st.bife[k]; }); save(); }
};
