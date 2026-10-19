import * as THREE from 'three';
import { E, FB, FT, F, FF, SFX, SFZ, HT, YJ, YT, I0, I1, CI, DX0, DX1, DY0, DY1, JX, PZ, GZ, ST } from '../data/dimensiuni';
import { PASI } from '../data/pasi';
import { makeTextures, fixBoxUV, TexSet } from './textures';

export type Wall = 'back' | 'front' | 'left' | 'right';
export type Kind = 'piesa' | 'surub' | 'capsa';

export interface MeshInfo {
  step: number;
  code: string;
  kind: Kind;
  tag: string;            // 'front' | 'roof' | 'ceil' | ''
  base: THREE.Vector3;    // poziția finală
  ex: THREE.Vector3;      // deplasarea în vederea explodată
  arr: THREE.Vector3;     // de unde vine piesa în animație
  dir?: THREE.Vector3;    // pentru șuruburi: direcția din care intră
  p: number;              // 0 = încă nevenită, 1 = la locul ei
  shown: boolean;         // apare în scenă (separat de ascunderea pereților)
}

export interface Label { code: string; pos: THREE.Vector3; tag: string; step: number }

export type ToolAction =
  | { tip: 'ruleta'; din: THREE.Vector3; la: THREE.Vector3; text: string; cand: 'pre' | 'post' }
  | { tip: 'nivela'; poz: THREE.Vector3; axa: 'x' | 'y' | 'z'; cand: 'pre' | 'post' }
  | { tip: 'capsator'; puncte: { p: THREE.Vector3; n: THREE.Vector3; mark: THREE.Mesh }[]; cand: 'post' };

export interface StepModel {
  group: THREE.Group;
  pieces: THREE.Mesh[];
  screws: THREE.Mesh[];
  staples: THREE.Mesh[];
  labels: Label[];
  tools: ToolAction[];
  mats: THREE.MeshStandardMaterial[];
  flicker?: THREE.PointLight;
}

export const info = (o: THREE.Object3D) => o.userData as MeshInfo;

// ---------- materiale ----------
type MatKey = 'pad' | 'bitum' | 'treated' | 'timber' | 'osb' | 'insul' | 'foil' | 'lamb' | 'bench' | 'frame' | 'clad' | 'membrane'
  | 'plywood' | 'cement' | 'hidro' | 'tile' | 'pipe'
  | 'stove' | 'stoveDark' | 'stone' | 'cable' | 'vent' | 'glass' | 'lamp' | 'screw' | 'staple';
interface MatDef { c: number; r: number; mt?: number; op?: number; em?: number; tex?: keyof TexSet }
const BASE: Record<MatKey, MatDef> = {
  pad: { c: 0x2F3336, r: .9 }, bitum: { c: 0x34383C, r: .85 }, treated: { c: 0xB0AC74, r: .85, tex: 'grain' },
  timber: { c: 0xD6AC72, r: .8, tex: 'grain' }, osb: { c: 0xCBA466, r: .9, tex: 'osb' }, insul: { c: 0xE8C552, r: 1, tex: 'fibers' },
  foil: { c: 0xD2D8DC, r: .3, mt: .9 }, lamb: { c: 0xEED7AC, r: .75, tex: 'grainFine' }, bench: { c: 0xF4E6C8, r: .7, tex: 'grainFine' },
  frame: { c: 0xDDB680, r: .75, tex: 'grain' }, clad: { c: 0x8A5A37, r: .8, tex: 'grainFine' }, membrane: { c: 0xE9EDEF, r: .9, tex: 'fibers' },
  plywood: { c: 0x74503A, r: .45, tex: 'grainFine' }, cement: { c: 0xA7A8A2, r: .95 }, hidro: { c: 0x8C97A0, r: .9 },
  tile: { c: 0xE4D6BE, r: .55, tex: 'grainFine' }, pipe: { c: 0xB9BDC1, r: .5 },
  stove: { c: 0xA6ABB0, r: .3, mt: .85 }, stoveDark: { c: 0x2A2C2F, r: .5, mt: .5 }, stone: { c: 0x6E6B66, r: .95 },
  cable: { c: 0xE2782C, r: .6 }, vent: { c: 0x3A3F43, r: .8 }, glass: { c: 0x8A6A45, r: .1, op: .45 },
  lamp: { c: 0xFFE2B0, r: .5, em: 0xFFC878 }, screw: { c: 0x8C949B, r: .35, mt: .9 }, staple: { c: 0x5B6268, r: .4, mt: .8 }
};

export const clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, -1), 10);

// explodare pe pas: [în afară (m), în sus (m)]
const EXPL: [number, number][] = [
  [0, -0.75], [0, -0.6], [0, -0.42], [0, -0.42], [0, -0.3], [0, -0.22], [0, 0],
  [0, 0], [0, 0], [0, 0], [0, 0], [0, 0.35],
  [0.3, 0], [0.55, 0], [0.85, 0], [0, 0.75], [0, 1.0], [0, 0],
  [0, 0], [0, 0.35], [-0.1, -0.1], [0, 0.25], [0, -0.25], [0, -0.45],
  [-0.12, 0], [-0.22, 0], [-0.22, 0], [0, 0], [0, 0], [0, 0], [0, 0],
  [0, 0], [0, 0], [0, 0], [0, 0.3], [0, 0], [0, 0]
];

export function wallNormal(c: THREE.Vector3): THREE.Vector3 | null {
  const dx = c.x - 1, dz = c.z - 1;
  if (Math.max(Math.abs(dx), Math.abs(dz)) < 0.62) return null;
  return Math.abs(dx) > Math.abs(dz) ? new THREE.Vector3(Math.sign(dx), 0, 0) : new THREE.Vector3(0, 0, Math.sign(dz));
}
export function exVec(step: number, c: THREE.Vector3) {
  const [out, up] = EXPL[step] || [0, 0];
  const v = new THREE.Vector3(0, up, 0);
  const n = wallNormal(c);
  if (n && out) v.addScaledVector(n, out);
  return v;
}

// ---------- construcția modelului ----------
export function buildModel(root: THREE.Group) {
  const tex = makeTextures();
  const steps: StepModel[] = PASI.map(() => ({ group: new THREE.Group(), pieces: [], screws: [], staples: [], labels: [], tools: [], mats: [] }));
  steps.forEach((s, i) => { s.group.name = 'pas' + (i + 1); root.add(s.group); });
  const allMats: THREE.Material[] = [];

  let bs = 0;              // pasul curent în construcție
  let code = '';           // codul piesei curente
  const C = (c: string) => { code = c; };
  const matCache: Record<string, THREE.MeshStandardMaterial> = {};
  let seed = 1;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

  function mat(key: MatKey) {
    const id = key + '|' + bs;
    if (matCache[id]) return matCache[id];
    const b = BASE[key];
    const m = new THREE.MeshStandardMaterial({ color: b.c, roughness: b.r, metalness: b.mt || 0 });
    if (b.tex) m.map = tex[b.tex];
    if (b.op) { m.transparent = true; m.opacity = b.op; }
    if (b.em) { m.emissive = new THREE.Color(b.em); m.emissiveIntensity = 0.9; }
    m.clippingPlanes = [clipPlane];
    m.userData = { baseOpacity: m.opacity, baseTransparent: m.transparent, key };
    steps[bs].mats.push(m); allMats.push(m);
    return (matCache[id] = m);
  }

  function addMesh(geo: THREE.BufferGeometry, key: MatKey, tag = '', kind: Kind = 'piesa') {
    const m = new THREE.Mesh(geo, mat(key));
    m.castShadow = key !== 'glass' && kind === 'piesa';
    m.receiveShadow = true;
    const d: MeshInfo = { step: bs, code: kind === 'piesa' ? code : '', kind, tag, base: new THREE.Vector3(), ex: new THREE.Vector3(), arr: new THREE.Vector3(), p: 1, shown: true };
    m.userData = d;
    steps[bs].group.add(m);
    if (kind === 'piesa') steps[bs].pieces.push(m);
    return m;
  }
  function finish(m: THREE.Mesh) {
    const d = info(m);
    d.base.copy(m.position);
    d.ex = exVec(bs, m.position);
    const n = wallNormal(m.position);
    d.arr = n ? n.clone().multiplyScalar(0.7).add(new THREE.Vector3(0, 0.35, 0)) : new THREE.Vector3(0, 0.9, 0);
    if (d.step <= 1) d.arr.set(0, 0.6, 0);
    return m;
  }
  function box(x0: number, x1: number, y0: number, y1: number, z0: number, z1: number, key: MatKey, tag = '') {
    const g = new THREE.BoxGeometry(Math.abs(x1 - x0), Math.abs(y1 - y0), Math.abs(z1 - z0));
    if (BASE[key].tex) fixBoxUV(g, rnd() * 3, rnd() * 3, BASE[key].tex === 'osb' ? 0.6 : 0.8, BASE[key].tex === 'osb' ? 0.6 : 0.2);
    const m = addMesh(g, key, tag);
    m.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
    return finish(m);
  }
  const SCREW = new THREE.CylinderGeometry(0.0065, 0.0065, 0.004, 12);
  // dir: +1 = șurubul intră din partea pozitivă a axei (capul e spre +), -1 invers
  function screw(x: number, y: number, z: number, ax: 'x' | 'y' | 'z', tag = '', dir?: number) {
    const m = addMesh(SCREW, 'screw', tag, 'surub');
    m.position.set(x, y, z);
    if (ax === 'x') m.rotation.z = Math.PI / 2;
    if (ax === 'z') m.rotation.x = Math.PI / 2;
    const s = dir ?? (ax === 'y' ? 1 : Math.sign((ax === 'x' ? x : z) - 1) || 1);
    const d = info(m);
    d.dir = new THREE.Vector3(ax === 'x' ? s : 0, ax === 'y' ? s : 0, ax === 'z' ? s : 0);
    d.base.copy(m.position); d.ex = exVec(bs, m.position); d.arr = d.dir.clone().multiplyScalar(0.05);
    steps[bs].screws.push(m);
    return m;
  }
  function lab(c: string, x: number, y: number, z: number, tag = '') {
    steps[bs].labels.push({ code: c, pos: new THREE.Vector3(x, y, z), tag, step: bs });
  }
  const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);
  function tool(a: ToolAction) { steps[bs].tools.push(a); }
  const STAPLE = new THREE.BoxGeometry(0.014, 0.0025, 0.0025);
  function stapler(pts: [number, number, number, number, number, number][]) {
    const puncte = pts.map(([x, y, z, nx, ny, nz]) => {
      const m = addMesh(STAPLE, 'staple', '', 'capsa');
      const n = V(nx, ny, nz);
      m.position.set(x + nx * 0.0015, y, z + nz * 0.0015);
      if (Math.abs(nx) > 0) m.rotation.y = Math.PI / 2;
      const d = info(m); d.base.copy(m.position); d.ex = exVec(bs, m.position);
      steps[bs].staples.push(m);
      return { p: V(x, y, z), n, mark: m };
    });
    tool({ tip: 'capsator', puncte, cand: 'post' });
  }

  const WALLS: Wall[] = ['back', 'front', 'left', 'right'];
  const span = (w: Wall, d0: number, d1: number, inner = false): [number, number] =>
    (w === 'back' || w === 'front') && !inner ? [d0, 2 - d0] : [d1, 2 - d1];
  function wp(w: Wall, u: number, d: number): [number, number] { // punct pe perete: u de-a lungul lui, d adâncime de la exterior
    if (w === 'back') return [u, d]; if (w === 'front') return [u, 2 - d]; if (w === 'left') return [d, u]; return [2 - d, u];
  }
  const outDir = (w: Wall) => (w === 'back' || w === 'left' ? -1 : 1);
  const wAx = (w: Wall): 'x' | 'z' => (w === 'back' || w === 'front' ? 'z' : 'x');
  function wallRect(w: Wall, u0: number, u1: number, y0: number, y1: number, d0: number, d1: number, key: MatKey, tag = '') {
    if (u1 - u0 < 0.004 || y1 - y0 < 0.004) return;
    const t = tag || (w === 'front' ? 'front' : '');
    if (w === 'back') return box(u0, u1, y0, y1, d0, d1, key, t);
    if (w === 'front') return box(u0, u1, y0, y1, 2 - d1, 2 - d0, key, t);
    if (w === 'left') return box(d0, d1, y0, y1, u0, u1, key, t);
    return box(2 - d1, 2 - d0, y0, y1, u0, u1, key, t);
  }
  function minusDoor(u0: number, u1: number, ya: number, yb: number): [number, number, number, number][] {
    if (yb <= DY0 + 1e-6 || ya >= DY1 - 1e-6) return [[u0, u1, ya, yb]];
    const out: [number, number, number, number][] = [], oy0 = Math.max(ya, DY0), oy1 = Math.min(yb, DY1);
    if (ya < oy0) out.push([u0, u1, ya, oy0]); if (oy1 < yb) out.push([u0, u1, oy1, yb]);
    if (DX0 > u0) out.push([u0, Math.min(DX0, u1), oy0, oy1]); if (DX1 < u1) out.push([Math.max(DX1, u0), u1, oy0, oy1]);
    return out;
  }
  function layer(d0: number, d1: number, y0: number, y1: number, key: MatKey, board?: number, gap = 0.003, walls: Wall[] = WALLS, inner = false) {
    walls.forEach(w => {
      const [u0, u1] = span(w, d0, d1, inner), rows: [number, number][] = [];
      if (board) { for (let y = y0; y < y1 - 1e-6; y += board) rows.push([y, Math.min(y + board - gap, y1)]); } else rows.push([y0, y1]);
      rows.forEach(([ya, yb]) => { (w === 'front' ? minusDoor(u0, u1, ya, yb) : [[u0, u1, ya, yb] as [number, number, number, number]]).forEach(p => wallRect(w, p[0], p[1], p[2], p[3], d0, d1, key)); });
    });
  }
  function battens(pos: Record<Wall, number[]>, d0: number, d1: number, y0: number, y1: number, key: MatKey) {
    WALLS.forEach(w => pos[w].forEach(u => wallRect(w, u, u + 0.048, y0, y1, d0, d1, key)));
  }

  // pereți: tălpi, montanți, șuruburi
  function wallFrame(w: Wall) {
    const [u0, u1] = span(w, E, 0.1375);
    const side = w === 'left' || w === 'right';
    const tf = w === 'front' ? 'front' : '';
    if (w === 'front') {
      C('T2a'); wallRect(w, u0, DX0, F, F + 0.05, E, 0.1375, 'timber');
      C('T2b'); wallRect(w, DX1, u1, F, F + 0.05, E, 0.1375, 'timber');
    } else { C(side ? 'T3' : 'T1'); wallRect(w, u0, u1, F, F + 0.05, E, 0.1375, 'timber'); }
    C(side ? 'T3' : 'T1'); wallRect(w, u0, u1, HT - 0.05, HT, E, 0.1375, 'timber');
    C('M');
    ST[w].forEach(u => {
      wallRect(w, u, u + 0.05, F + 0.05, HT - 0.05, E, 0.1375, 'timber');
      [0.0625, 0.1125].forEach(d => { const [x, z] = wp(w, u + 0.025, d); screw(x, HT + 0.002, z, 'y', tf); });
    });
    const plateScrews = w === 'front' ? [0.2875, 0.6875, 0.93, 1.8875] : (() => { const a: number[] = []; for (let u = u0 + 0.25; u < u1 - 0.1; u += 0.4) a.push(u); return a; })();
    plateScrews.forEach(u => { const [x, z] = wp(w, u, 0.0875); screw(x, F + 0.052, z, 'y', tf); });
    const mid = (u0 + u1) / 2, [lx, lz] = wp(w, mid, 0.0875);
    lab(side ? 'T3' : 'T1', lx, HT + 0.06, lz, tf);
    ST[w].forEach((u, i) => { if (i === 1) { const [x, z] = wp(w, u + 0.025, 0.0875); lab('M', x, F + 1.0, z, tf); } });
    if (side) {
      const x = w === 'left' ? 0.0875 : 1.9125;
      [F + 0.4, F + 1.0, F + 1.6].forEach(y => { screw(x, y, 0.1895, 'z', '', 1); screw(x, y, 1.8105, 'z', '', -1); });
    }
  }

  const B: (() => void)[] = [];
  // 1 suporți
  B.push(() => {
    tool({ tip: 'ruleta', din: V(E, 0.004, E - 0.02), la: V(2 - E, 0.004, E - 0.02), text: '1925 mm', cand: 'pre' });
    tool({ tip: 'ruleta', din: V(E - 0.02, 0.004, E), la: V(E - 0.02, 0.004, 2 - E), text: '1925 mm', cand: 'pre' });
    tool({ tip: 'ruleta', din: V(E, 0.004, E), la: V(2 - E, 0.004, 2 - E), text: 'diagonala 2722 mm', cand: 'pre' });
    C('SR'); JX.forEach(x => PZ.forEach(z => box(x + 0.025 - 0.05, x + 0.025 + 0.05, 0.002, 0.025, z - 0.05, z + 0.05, 'pad')));
    lab('SR', JX[0] + 0.025, 0.06, PZ[2]); lab('SR', JX[3] + 0.025, 0.06, PZ[2]);
    tool({ tip: 'nivela', poz: V(1, 0.025, PZ[1]), axa: 'x', cand: 'post' });
  });
  // 2 membrană
  B.push(() => { C('MB'); JX.forEach(x => PZ.forEach(z => box(x + 0.025 - 0.055, x + 0.025 + 0.055, 0.025, FB, z - 0.055, z + 0.055, 'bitum'))); lab('MB', JX[1] + 0.025, 0.07, PZ[2]); });
  // 3 cadru exterior podea
  B.push(() => {
    C('P1'); box(E, 2 - E, FB, FT, E, E + 0.05, 'treated'); box(E, 2 - E, FB, FT, 2 - E - 0.05, 2 - E, 'treated');
    C('P2'); box(JX[0], JX[0] + 0.05, FB, FT, 0.0875, 1.9125, 'treated'); box(JX[3], JX[3] + 0.05, FB, FT, 0.0875, 1.9125, 'treated');
    [JX[0], JX[3]].forEach(x => [0.06, 0.10].forEach(y => { screw(x + 0.025, y, E - 0.002, 'z', '', -1); screw(x + 0.025, y, 2 - E + 0.002, 'z', '', 1); }));
    lab('P1', 1, 0.2, 2 - E); lab('P1', 1, 0.2, E); lab('P2', JX[0] + 0.025, 0.2, 1); lab('P2', JX[3] + 0.025, 0.2, 1);
  });
  // 4 grinzi mijloc
  B.push(() => {
    tool({ tip: 'ruleta', din: V(E, FT + 0.002, E + 0.025), la: V(JX[1], FT + 0.002, E + 0.025), text: '612 mm', cand: 'pre' });
    tool({ tip: 'ruleta', din: V(E, FT + 0.002, E + 0.025), la: V(JX[2], FT + 0.002, E + 0.025), text: '1225 mm', cand: 'pre' });
    C('P2');
    [JX[1], JX[2]].forEach(x => { box(x, x + 0.05, FB, FT, 0.0875, 1.9125, 'treated'); [0.06, 0.10].forEach(y => { screw(x + 0.025, y, E - 0.002, 'z', '', -1); screw(x + 0.025, y, 2 - E + 0.002, 'z', '', 1); }); lab('P2', x + 0.025, 0.2, 1); });
    tool({ tip: 'ruleta', din: V(E, FT + 0.004, E), la: V(2 - E, FT + 0.004, 2 - E), text: 'diagonala 2722 mm', cand: 'post' });
  });
  // țeava de scurgere
  B.push(() => {
    tool({ tip: 'ruleta', din: V(0, FT + 0.004, SFZ), la: V(SFX, FT + 0.004, SFZ), text: '980 mm', cand: 'pre' });
    tool({ tip: 'ruleta', din: V(SFX, FT + 0.004, 0), la: V(SFX, FT + 0.004, SFZ), text: '1550 mm', cand: 'pre' });
    C('TS');
    const r = 0.025, y = 0.08;
    const run = addMesh(new THREE.CylinderGeometry(r, r, 2.2 - SFZ, 16), 'pipe'); run.rotation.x = Math.PI / 2; run.position.set(SFX, y, (SFZ + 2.2) / 2); finish(run);
    const up = addMesh(new THREE.CylinderGeometry(r, r, FT - y, 16), 'pipe'); up.position.set(SFX, (y + FT) / 2, SFZ); finish(up);
    lab('TS', SFX, 0.2, 1.8);
  });
  // vată podea
  B.push(() => { C('V'); [[0.0875, 0.65], [0.70, 1.2625], [1.3125, 1.9125]].forEach(([a, b]) => box(a + 0.002, b - 0.002, 0.035, 0.127, 0.09, 1.91, 'insul')); lab('V', 0.37, 0.18, 1); });
  // 6 OSB podea
  B.push(() => {
    C('O1'); box(E, 1.2875, FT, F, E, 2 - E, 'plywood'); C('O2'); box(1.2875, 2 - E, FT, F, E, 2 - E, 'plywood');
    JX.forEach(x => { for (let z = 0.1; z < 1.95; z += 0.15) screw(x + 0.025, F + 0.002, z, 'y'); });
    for (let x = 0.15; x < 1.9; x += 0.15) { screw(x, F + 0.002, 0.0625, 'y'); screw(x, F + 0.002, 1.9375, 'y'); }
    lab('O1', 0.66, F + 0.08, 1); lab('O2', 1.62, F + 0.08, 1);
  });
  // 7–10 pereți
  B.push(() => { wallFrame('back'); tool({ tip: 'nivela', poz: V(ST.back[1] + 0.025, F + 1.0, E - 0.014), axa: 'y', cand: 'post' }); });
  B.push(() => wallFrame('left'));
  B.push(() => wallFrame('right'));
  B.push(() => {
    wallFrame('front');
    C('B'); wallRect('front', DX0, DX1, DY1, DY1 + 0.10, E, 0.1375, 'timber');
    [DY1 + 0.03, DY1 + 0.07].forEach(y => { screw(DX0 - 0.052, y, 2 - 0.0875, 'x', 'front', -1); screw(DX1 + 0.052, y, 2 - 0.0875, 'x', 'front', 1); });
    lab('B', (DX0 + DX1) / 2, DY1 + 0.05, 2 - 0.0875, 'front'); lab('T2a', 0.5, F + 0.1, 2 - 0.0875, 'front');
    tool({ tip: 'ruleta', din: V(DX0, F + 1.0, 2 - E + 0.01), la: V(DX1, F + 1.0, 2 - E + 0.01), text: 'golul ușii 720 mm', cand: 'post' });
    tool({ tip: 'ruleta', din: V(DX1 - 0.04, F, 2 - E + 0.01), la: V(DX1 - 0.04, DY1, 2 - E + 0.01), text: '1910 mm', cand: 'post' });
    tool({ tip: 'nivela', poz: V(DX1 + 0.025, F + 1.0, 2 - E + 0.014), axa: 'y', cand: 'post' });
  });
  // 11 grinzi tavan
  B.push(() => {
    C('G');
    GZ.forEach(z => { box(E, 2 - E, HT, YJ, z, z + 0.05, 'timber', 'ceil'); [0.0875, 1.9125].forEach(x => { screw(x - 0.012, YJ + 0.002, z + 0.025, 'y', 'ceil'); screw(x + 0.012, YJ + 0.002, z + 0.025, 'y', 'ceil'); }); });
    lab('G', 1, YJ + 0.06, GZ[1] + 0.025, 'ceil'); lab('G', 1, YJ + 0.06, GZ[2] + 0.025, 'ceil');
  });
  // 12 membrană difuzie
  B.push(() => {
    C('MD'); layer(0.0365, 0.0375, FB, YJ, 'membrane'); lab('MD', 1, 1.2, 0.03); lab('MD', 2 - 0.03, 1.2, 1);
    const pts: [number, number, number, number, number, number][] = [];
    [0.35, 1.0, 1.65].forEach(x => [0.55, 1.55].forEach(y => pts.push([x, y, 0.0365, 0, 0, -1])));
    [0.6, 1.4].forEach(z => [0.8, 1.8].forEach(y => pts.push([1.9635, y, z, 1, 0, 0])));
    stapler(pts);
  });
  // 13 șipci exterioare
  B.push(() => {
    C('S1');
    const pos: Record<Wall, number[]> = { back: [0.0375, 0.6675, 1.2975, 1.9125], left: [0.0365, 0.7675, 1.3975, 1.915], right: [0.0365, 0.7675, 1.3975, 1.915], front: [0.0375, 0.5, 0.97, 1.74, 1.9125] };
    battens(pos, 0.0125, 0.0365, FB, YJ, 'timber');
    WALLS.forEach(w => pos[w].forEach(u => [0.28, 0.78, 1.28, 1.78, 2.2].forEach(y => { const [x, z] = wp(w, u + 0.024, 0.0105); screw(x, y, z, wAx(w), w === 'front' ? 'front' : '', outDir(w)); })));
    lab('S1', 0.524, 1.2, 2 - 0.025, 'front'); lab('S1', 2 - 0.025, 1.2, 0.79);
  });
  // 14 lambriu exterior + colțuri
  B.push(() => {
    C('LE'); layer(0, 0.0125, FB, YT, 'clad', 0.088, 0.003);
    C('CL');
    ([[0, 0], [2, 0], [0, 2], [2, 2]] as [number, number][]).forEach(([cx, cz]) => {
      const sx = cx ? 1 : -1, sz = cz ? 1 : -1;
      box(cx + sx * 0.012, cx - sx * 0.03, FB, YT, cz + sz * 0.002, cz + sz * 0.012, 'clad', cz ? 'front' : '');
      box(cx + sx * 0.002, cx + sx * 0.012, FB, YT, cz + sz * 0.012, cz - sz * 0.03, 'clad', cz ? 'front' : '');
    });
    lab('LE', 0.5, 1.3, 2.01, 'front'); lab('LE', 2.01, 1.3, 1.2); lab('CL', 2.02, 0.6, 2.02, 'front');
  });
  // 15 OSB sus
  B.push(() => {
    C('O3'); box(0.0125, 1.9875, YJ, YT, 0.0125, 1.2625, 'osb', 'roof'); C('O4'); box(0.0125, 1.9875, YJ, YT, 1.2625, 1.9875, 'osb', 'roof');
    GZ.forEach(z => { for (let x = 0.1; x < 1.95; x += 0.2) screw(x, YT + 0.002, z + 0.025, 'y', 'roof'); });
    [0.0875, 1.9125].forEach(x => [0.35, 0.95, 1.55].forEach(z => screw(x, YT + 0.002, z, 'y', 'roof')));
    lab('O3', 1, YT + 0.06, 0.64, 'roof'); lab('O4', 1, YT + 0.06, 1.63, 'roof');
  });
  // lambriu deasupra
  B.push(() => {
    const y1 = YT + 0.024, y2 = y1 + 0.0125;
    C('S4'); GZ.forEach(z => { box(0.0125, 1.9875, YT, y1, z + 0.001, z + 0.049, 'timber', 'roof'); for (let x = 0.2; x < 1.9; x += 0.4) screw(x, y1 + 0.002, z + 0.025, 'y', 'roof'); });
    C('LS'); for (let x = 0.0125; x < 1.9875 - 1e-6; x += 0.088) box(x, Math.min(x + 0.086, 1.9875), y1, y2, 0.0125, 1.9875, 'clad', 'roof');
    C('BS');
    box(0, 2, YT, YT + 0.04, 0, 0.0125, 'clad', 'roof'); box(0, 2, YT, YT + 0.04, 1.9875, 2, 'clad', 'roof');
    box(0, 0.0125, YT, YT + 0.04, 0.0125, 1.9875, 'clad', 'roof'); box(1.9875, 2, YT, YT + 0.04, 0.0125, 1.9875, 'clad', 'roof');
    lab('LS', 1, y2 + 0.06, 1, 'roof'); lab('S4', 0.25, y2 + 0.05, GZ[0] + 0.025, 'roof'); lab('BS', 1, YT + 0.08, 2.01, 'roof');
  });
  // 16 electric + aerisire
  B.push(() => {
    const T = 0.018;
    C('CB');
    box(-0.06, -0.002, 0.9, 1.06, 0.3, 0.42, 'vent');
    box(-0.01, 0.096, 0.97, 0.97 + T, 0.35, 0.35 + T, 'cable');
    box(0.078, 0.096, F + 0.35, 0.97 + T, 0.35, 0.35 + T, 'cable');
    box(0.078, 0.096, F + 0.35, F + 0.35 + T, 0.35, 1.45, 'cable');
    box(0.078, 0.17, F + 0.35, F + 0.35 + T, 1.432, 1.45, 'cable');
    box(0.078, 0.096, 0.97, HT - 0.08, 0.35, 0.35 + T, 'cable');
    box(0.078, 0.096, HT - 0.098, HT - 0.08, 0.078, 0.368, 'cable');
    box(0.078, 1.922, HT - 0.098, HT - 0.08, 0.078, 0.096, 'cable');
    box(1.904, 1.922, HT - 0.098, HT - 0.08, 0.078, 1.0, 'cable');
    box(1.904, 1.922, F + 1.8, HT - 0.08, 0.982, 1.0, 'cable');
    box(1.83, 1.922, F + 1.8, F + 1.8 + T, 0.982, 1.0, 'cable');
    C('GA');
    box(-0.012, 0.18, F + 0.06, F + 0.18, 1.71, 1.81, 'vent');
    box(1.82, 2.012, F + 0.74, F + 0.86, 0.3, 0.45, 'vent');
    lab('CB', 0.09, F + 0.45, 1.0); lab('GA', 0.1, F + 0.25, 1.76); lab('GA', 1.9, F + 0.95, 0.375);
  });
  // 17 vată pereți
  B.push(() => { C('V'); layer(0.039, 0.136, F + 0.05, HT - 0.05, 'insul'); lab('V', 0.09, 1.2, 1.08); lab('V', 1, 1.2, 0.09); });
  // 18 vată tavan
  B.push(() => { C('V'); [[0.0875, 0.63], [0.68, 1.2375], [1.2875, 1.9125]].forEach(([a, b]) => box(0.04, 1.96, HT + 0.003, YJ - 0.003, a + 0.002, b - 0.002, 'insul', 'ceil')); lab('V', 1, HT + 0.02, 0.93, 'ceil'); });
  // 19 folie
  B.push(() => {
    C('FA'); layer(0.1375, 0.139, F, HT, 'foil'); box(0.139, 1.861, HT - 0.0015, HT, 0.139, 1.861, 'foil', 'ceil');
    lab('FA', 1, 1.2, 0.16); lab('FA', 1, HT - 0.05, 1, 'ceil');
    const pts: [number, number, number, number, number, number][] = [];
    [0.45, 1.0, 1.55].forEach(x => [0.7, 1.7].forEach(y => pts.push([x, y, 0.139, 0, 0, 1])));
    [0.6, 1.4].forEach(z => pts.push([0.139, 1.2, z, 1, 0, 0]));
    stapler(pts);
  });
  // pardoseala: fibrociment, hidroizolație, gresie, sifon
  B.push(() => {
    C('FC'); box(I0, I1, F, F + 0.01, I0, I0 + 1.25, 'cement'); box(I0, I1, F, F + 0.01, I0 + 1.25, I1, 'cement');
    for (let x = I0 + 0.1; x < I1 - 0.05; x += 0.2) for (let z = I0 + 0.1; z < I1 - 0.05; z += 0.2) screw(x, F + 0.012, z, 'y');
    C('FP'); layer(0.139, 0.149, F + 0.01, F + 0.11, 'cement', undefined, 0, WALLS, true);
    C('HI'); box(I0, I1, F + 0.01, F + 0.0185, I0, I1, 'hidro');
    C('GS');
    for (let x = I0; x < I1 - 1e-6; x += 0.3) for (let z = I0; z < I1 - 1e-6; z += 0.6)
      box(x + 0.0015, Math.min(x + 0.3, I1) - 0.0015, F + 0.0185, FF, z + 0.0015, Math.min(z + 0.6, I1) - 0.0015, 'tile');
    C('SF'); box(SFX - 0.0525, SFX + 0.0525, FF, FF + 0.002, SFZ - 0.0525, SFZ + 0.0525, 'stove');
    lab('GS', 1.35, FF + 0.06, 0.6); lab('SF', SFX, FF + 0.07, SFZ); lab('FP', 1.0, F + 0.14, 0.16);
    tool({ tip: 'nivela', poz: V(1.3, FF + 0.0175, 1.0), axa: 'x', cand: 'post' });
  });
  // 20 șipci tavan
  B.push(() => {
    C('S3'); [0.18, 0.55, 0.92, 1.29, 1.775].forEach(x => {
      box(x, x + 0.048, HT - 0.0255, HT - 0.0015, I0, I1, 'timber', 'ceil');
      [0.3, 0.655, 1.2625, 1.7].forEach(z => screw(x + 0.024, HT - 0.0275, z, 'y', 'ceil', -1));
    });
    lab('S3', 0.944, HT - 0.06, 1, 'ceil');
    tool({ tip: 'ruleta', din: V(I0, HT - 0.03, 1.0), la: V(1.775, HT - 0.03, 1.0), text: 'ultima șipcă la 1600 mm', cand: 'pre' });
  });
  // 21 lambriu tavan
  B.push(() => { C('LI'); for (let z = I0; z < I1 - 1e-6; z += 0.088) box(I0, I1, CI, HT - 0.0255, z, Math.min(z + 0.086, I1), 'lamb', 'ceil'); lab('LI', 1, CI - 0.04, 1, 'ceil'); });
  // 22 șipci pereți
  B.push(() => {
    const F = FF;
    C('S2');
    const pos: Record<Wall, number[]> = { back: [0.139, 0.6675, 1.2975, 1.813], left: [0.163, 0.7675, 1.3975, 1.789], right: [0.163, 0.7675, 1.3975, 1.789], front: [0.139, 0.5, 0.97, 1.74, 1.813] };
    battens(pos, 0.139, 0.163, F, CI, 'timber');
    WALLS.forEach(w => pos[w].forEach(u => [0.35, 0.85, 1.35, 1.85].forEach(y => { const [x, z] = wp(w, u + 0.024, 0.165); screw(x, F + y, z, wAx(w), w === 'front' ? 'front' : '', -outDir(w)); })));
    lab('S2', 0.69, 1.2, 0.15); lab('S2', 0.15, 1.2, 0.79);
  });
  // 23 lambriu pereți spate, stânga, dreapta
  B.push(() => { C('LI'); layer(0.163, 0.1755, FF + 0.005, CI, 'lamb', 0.088, 0.002, ['back', 'left', 'right'], true); lab('LI', 1, 1.2, 0.19); lab('LI', 0.19, 1.2, 0.6); });
  // 24 lambriu față
  B.push(() => { C('LI'); layer(0.163, 0.1755, FF + 0.005, CI, 'lamb', 0.088, 0.002, ['front'], true); lab('LI', 0.6, 1.2, 1.81, 'front'); });
  // 25 cadru bancă sus
  B.push(() => {
    const F = FF;
    const y0 = F + 0.924, y1 = F + 0.972;
    C('L1'); box(I0, I1, y0, y1, I0, I0 + 0.048, 'frame'); box(I0, I1, y0, y1, 0.7275, 0.7755, 'frame');
    [I0, 0.976, I1 - 0.048].forEach(x => { C('L2'); box(x, x + 0.048, y0, y1, I0 + 0.048, 0.7275, 'frame'); C('L3'); box(x, x + 0.048, F, y0, 0.7275, 0.7755, 'frame'); });
    [0.6675, 1.2975].forEach(x => screw(x + 0.025, F + 0.948, I0 + 0.05, 'z', '', 1));
    [I0 + 0.024, 1.0, I1 - 0.024].forEach(x => screw(x, F + 0.948, 0.7775, 'z', '', 1));
    lab('L1', 1.3, y1 + 0.05, 0.2); lab('L1', 1.3, y1 + 0.05, 0.75); lab('L2', 1.0, y1 + 0.05, 0.47); lab('L3', 0.976, F + 0.45, 0.75);
    tool({ tip: 'nivela', poz: V(1.0, y1 + 0.0175, 0.7515), axa: 'x', cand: 'post' });
  });
  // 26 șipci bancă sus
  B.push(() => { const F = FF; C('Ș1'); for (let i = 0; i < 6; i++) { const z = I0 + 0.01 + i * 0.1; box(I0, I1, F + 0.972, F + 1.0, z, z + 0.09, 'bench'); } lab('Ș1', 1.3, F + 1.06, 0.5); });
  // 27 bancă jos
  B.push(() => {
    const F = FF;
    tool({ tip: 'ruleta', din: V(I0, F + 0.51, 0.98), la: V(0.80, F + 0.51, 0.98), text: 'aprox. 625 mm', cand: 'pre' });
    const y0 = F + 0.424, y1 = F + 0.472;
    C('L4'); box(0.80, I1, y0, y1, 0.7755, 0.8235, 'frame'); box(0.80, I1, y0, y1, 1.1275, 1.1755, 'frame');
    [0.80, I1 - 0.048].forEach(x => { C('L5'); box(x, x + 0.048, y0, y1, 0.8235, 1.1275, 'frame'); C('L6'); box(x, x + 0.048, F, y0, 1.1275, 1.1755, 'frame'); });
    C('Ș2'); for (let i = 0; i < 4; i++) { const z = 0.7855 + i * 0.1; box(0.80, I1, F + 0.472, F + 0.5, z, z + 0.09, 'bench'); }
    lab('Ș2', 1.3, F + 0.56, 0.98); lab('L6', 0.824, F + 0.2, 1.15); lab('L4', 1.3, F + 0.44, 1.19);
  });
  // 28 spătar
  B.push(() => {
    const F = FF;
    C('Ș3'); [1.25, 1.42].forEach(h => { box(I0, I1, F + h, F + h + 0.09, I0, I0 + 0.028, 'bench'); [0.33, 0.69, 1.32, 1.68].forEach(x => screw(x, F + h + 0.045, I0 + 0.03, 'z', '', 1)); });
    lab('Ș3', 1.0, F + 1.38, 0.22);
  });
  // 29 ușa
  B.push(() => {
    C('U');
    box(1.03, 1.07, F, F + 1.90, 1.84, 1.93, 'frame'); box(1.69, 1.73, F, F + 1.90, 1.84, 1.93, 'frame'); box(1.03, 1.73, F + 1.86, F + 1.90, 1.84, 1.93, 'frame');
    box(1.07, 1.69, F + 0.01, F + 1.86, 1.88, 1.888, 'glass');
    box(1.10, 1.125, F + 0.85, F + 1.2, 1.888, 1.93, 'bench'); box(1.10, 1.125, F + 0.85, F + 1.2, 1.84, 1.88, 'bench');
    ([[1.0, 1.03], [1.73, 1.76]] as [number, number][]).forEach(([a, b]) => { box(a, b, F, F + 1.93, I1 - 0.01, I1, 'lamb'); box(a, b, F, F + 1.93, 2, 2.01, 'clad'); });
    box(1.0, 1.76, F + 1.90, F + 1.93, I1 - 0.01, I1, 'lamb'); box(1.0, 1.76, F + 1.90, F + 1.93, 2, 2.01, 'clad');
    lab('U', 1.38, F + 1.2, 1.95);
    tool({ tip: 'nivela', poz: V(1.05, F + 1.0, 1.945), axa: 'y', cand: 'post' });
  });
  // 30 soba
  B.push(() => {
    const F = FF;
    C('SB');
    box(I0 + 0.005, I0 + 0.03, F + 0.12, F + 0.62, 1.33, 1.57, 'stoveDark');
    box(I0 + 0.03, I0 + 0.31, F + 0.15, F + 0.69, 1.21, 1.69, 'stove');
    box(I0 + 0.06, I0 + 0.28, F + 0.69, F + 0.70, 1.24, 1.66, 'stoveDark');
    [1.33, 1.57].forEach(z => { const k = addMesh(new THREE.CylinderGeometry(0.022, 0.022, 0.025, 16), 'stoveDark'); k.rotation.z = Math.PI / 2; k.position.set(I0 + 0.322, F + 0.24, z); finish(k); });
    C('PT');
    let s = 7;
    for (let i = 0; i < 4; i++) for (let j = 0; j < 6; j++) { s = (s * 9301 + 49297) % 233280; const r = 0.03 + (s / 233280) * 0.014; const m = addMesh(new THREE.SphereGeometry(r, 12, 9), 'stone'); m.position.set(I0 + 0.08 + i * 0.055, F + 0.715 + (s % 5) * 0.006, 1.26 + j * 0.075); finish(m); }
    lab('SB', I0 + 0.17, F + 0.45, 1.45); lab('PT', I0 + 0.17, F + 0.80, 1.45);
  });
  // 31 parapet
  B.push(() => {
    const F = FF;
    C('Ș6'); box(0.56, 0.59, F, F + 0.85, 1.12, 1.21, 'bench'); box(0.56, 0.59, F, F + 0.85, 1.69, 1.78, 'bench');
    C('Ș4'); [0.35, 0.70].forEach(y => { box(0.59, 0.618, F + y, F + y + 0.09, 1.15, 1.75, 'bench'); [1.165, 1.735].forEach(z => screw(0.62, F + y + 0.045, z, 'x', '', 1)); });
    C('Ș5'); box(I0, 0.56, F + 0.70, F + 0.79, 1.12, 1.148, 'bench'); box(I0, 0.56, F + 0.70, F + 0.79, 1.752, 1.78, 'bench');
    lab('Ș6', 0.575, F + 0.2, 1.165); lab('Ș4', 0.61, F + 0.53, 1.45); lab('Ș5', 0.37, F + 0.84, 1.13);
  });
  // grătar de lemn
  B.push(() => {
    const F = FF;
    C('GT');
    [0.60, 1.20].forEach(x0 => {
      [0.04, 0.46].forEach(o => box(x0 + o, x0 + o + 0.09, F, F + 0.028, 1.20, 1.80, 'bench'));
      for (let i = 0; i < 6; i++) { const z = 1.20 + i * 0.102; box(x0, x0 + 0.59, F + 0.028, F + 0.056, z, z + 0.09, 'bench'); }
    });
    lab('GT', 0.9, F + 0.12, 1.5); lab('GT', 1.5, F + 0.12, 1.5);
  });
  // 32 grile, lampă
  B.push(() => {
    const F = FF;
    C('GR'); box(I0, I0 + 0.015, F + 0.04, F + 0.20, 1.70, 1.82, 'bench'); box(I1 - 0.015, I1, F + 0.72, F + 0.88, 0.29, 0.46, 'bench');
    C('LP'); box(1.765, I1, F + 1.74, F + 1.88, 0.94, 1.06, 'bench'); box(1.755, 1.77, F + 1.76, F + 1.86, 0.96, 1.04, 'lamp');
    const glow = new THREE.PointLight(0xffc078, 0.6, 3.2, 1.5); glow.position.set(1.6, F + 1.8, 1.0); steps[bs].group.add(glow);
    lab('GR', I0 + 0.03, F + 0.12, 1.76); lab('GR', I1 - 0.03, F + 0.8, 0.375); lab('LP', 1.74, F + 1.95, 1.0);
  });
  // 33 prima încălzire
  B.push(() => {
    const F = FF;
    const heat = new THREE.PointLight(0xff7a2a, 0, 2.2, 1.6); heat.position.set(I0 + 0.18, F + 0.85, 1.45);
    steps[bs].group.add(heat); steps[bs].flicker = heat;
  });

  B.forEach((f, i) => { bs = i; f(); });
  return { steps, allMats };
}
