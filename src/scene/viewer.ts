import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { buildModel, info, clipPlane, exVec, wallNormal, StepModel, Label, MeshInfo, ToolAction } from './model';
import { makeDrill, makeStapler, makeTape, makeLevel } from './tools';
import { PASI } from '../data/pasi';

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const CUT_FROM = 18; // de la pasul 19 se ascunde automat peretele din față și placa de sus

// ---------- cronologie simplă pentru animații ----------
interface Seg { t0: number; dur: number; f?: (p: number) => void; start?: () => void; end?: () => void; s?: boolean; d?: boolean }
class Timeline {
  segs: Seg[] = []; t = 0; cursor = 0;
  add(dur: number, f?: (p: number) => void, o: { at?: number; start?: () => void; end?: () => void } = {}) {
    const t0 = o.at ?? this.cursor;
    this.segs.push({ t0, dur, f, start: o.start, end: o.end });
    this.cursor = Math.max(this.cursor, t0 + dur);
    return t0 + dur;
  }
  wait(d: number) { this.cursor += d; }
  get active() { return this.segs.some(s => !s.d); }
  update(dt: number) {
    this.t += dt;
    for (const s of this.segs) {
      if (s.d || this.t < s.t0) continue;
      if (!s.s) { s.s = true; s.start?.(); }
      const p = s.dur > 0 ? clamp01((this.t - s.t0) / s.dur) : 1;
      s.f?.(p);
      if (p >= 1) { s.d = true; s.end?.(); }
    }
  }
  finish() { this.segs.sort((a, b) => a.t0 - b.t0); for (const s of this.segs) { if (s.d) continue; if (!s.s) s.start?.(); s.f?.(1); s.end?.(); s.s = s.d = true; } }
}

export interface ViewerEvents {
  onPick: (m: MeshInfo | null) => void;
  onAnim: (playing: boolean) => void;
}

export class Viewer {
  renderer: THREE.WebGLRenderer;
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(40, 1, 0.05, 80);
  controls: OrbitControls;
  steps: StepModel[];
  allMeshes: THREE.Mesh[] = [];
  cur = 0;
  speed = 1;
  explode = 0; explodeTarget = 0;
  fade = false;
  hideFront = false; hideRoof = false; hideCeil = false;
  autoCut = true;
  section: { axis: 'z' | 'x' | null; v: number } = { axis: null, v: 0 };
  showLabels = true;
  tl: Timeline | null = null;
  dirty = true;
  private clock = new THREE.Clock();
  private groundMat: THREE.MeshStandardMaterial;
  private paverMat: THREE.MeshStandardMaterial;
  private accent = new THREE.Color(0x2E6B57);
  private drill = makeDrill();
  private stapler = makeStapler();
  private tape = makeTape();
  private level = makeLevel();
  private labelEls: { el: HTMLDivElement; l: Label }[] = [];
  private toolText = { text: '', pos: new THREE.Vector3(), on: false };
  private camTween: { t: number; dur: number; ft: THREE.Vector3; tt: THREE.Vector3; fs: THREE.Spherical; ts: THREE.Spherical } | null = null;
  private hl: { meshes: THREE.Mesh[]; orig: THREE.Material[]; timer: number } = { meshes: [], orig: [], timer: 0 };
  private hlMat = new THREE.MeshStandardMaterial({ color: 0x2E6B57, emissive: 0x2E6B57, emissiveIntensity: 0.5, roughness: 0.5, clippingPlanes: [clipPlane] });
  private pulse = { t: -1, mats: [] as THREE.MeshStandardMaterial[] };

  constructor(private stage: HTMLElement, private labelBox: HTMLElement, private toolTip: HTMLElement, private ev: ViewerEvents) {
    const r = this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    r.shadowMap.enabled = true;
    r.shadowMap.type = THREE.PCFSoftShadowMap;
    r.toneMapping = THREE.NeutralToneMapping;
    r.toneMappingExposure = 1.05;
    stage.prepend(r.domElement);

    const pm = new THREE.PMREMGenerator(r);
    this.scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.55;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x8a8070, 0.9));
    const sun = new THREE.DirectionalLight(0xfff3e2, 1.9);
    sun.position.set(5, 7.5, 5.5); sun.target.position.set(1, 1, 1);
    sun.castShadow = true;
    const big = Math.min(window.innerWidth, window.innerHeight) > 700;
    sun.shadow.mapSize.set(big ? 2048 : 1024, big ? 2048 : 1024);
    Object.assign(sun.shadow.camera, { left: -2.6, right: 2.6, top: 2.6, bottom: -2.6, near: 2, far: 18 });
    sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.01;
    this.scene.add(sun, sun.target);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.5); fill.position.set(-4, 3, 4); this.scene.add(fill);

    this.groundMat = new THREE.MeshStandardMaterial({ color: 0xB9C3AC, roughness: 1 });
    const ground = new THREE.Mesh(new THREE.CircleGeometry(7, 64), this.groundMat);
    ground.rotation.x = -Math.PI / 2; ground.position.set(1, -0.062, 1); ground.receiveShadow = true; this.scene.add(ground);
    this.paverMat = new THREE.MeshStandardMaterial({ color: 0xB3ADA4, roughness: .95 });
    const pav = new THREE.InstancedMesh(new THREE.BoxGeometry(0.294, 0.062, 0.294), this.paverMat, 169);
    const mm = new THREE.Matrix4(); let k = 0;
    for (let x = -0.9; x < 2.9; x += 0.3) for (let z = -0.9; z < 2.9; z += 0.3) { mm.makeTranslation(x + 0.15, -0.029, z + 0.15); pav.setMatrixAt(k++, mm); }
    pav.count = k; pav.receiveShadow = true; this.scene.add(pav);

    const root = new THREE.Group(); this.scene.add(root);
    const built = buildModel(root);
    this.steps = built.steps;
    this.steps.forEach(s => s.group.traverse(o => { if ((o as THREE.Mesh).isMesh) this.allMeshes.push(o as THREE.Mesh); }));
    this.scene.add(this.drill.root, this.stapler, this.tape.root, this.level.root);

    this.controls = new OrbitControls(this.camera, r.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.09;
    this.controls.minDistance = 0.8;
    this.controls.maxDistance = 12;
    this.controls.maxPolarAngle = Math.PI * 0.53;
    this.controls.target.set(1, 1.1, 1);
    this.controls.addEventListener('change', () => (this.dirty = true));
    this.controls.addEventListener('start', () => (this.camTween = null));

    this.resetView(false);
    new ResizeObserver(() => this.resize()).observe(stage);
    this.resize();
    this.setupPicking();
    this.applyTheme();
    requestAnimationFrame(this.loop);
  }

  // ---------- vizibilitate și poziții ----------
  private tagOK(tag: string) {
    if (tag === 'front' && this.hideFront) return false;
    if (tag === 'roof' && (this.hideRoof || this.hideCeil)) return false;
    if (tag === 'ceil' && this.hideCeil) return false;
    return true;
  }
  private place(m: THREE.Mesh) {
    const d = info(m);
    m.position.copy(d.base).addScaledVector(d.ex, this.explode);
    if (d.p < 1) m.position.addScaledVector(d.arr, 1 - ease(d.p));
    m.visible = d.shown && this.tagOK(d.tag);
  }
  private refreshAll() { this.allMeshes.forEach(m => this.place(m)); this.dirty = true; }

  setHidden(front: boolean, ceil: boolean) { this.autoCut = false; this.hideFront = front; this.hideCeil = ceil; this.hideRoof = front && this.hideRoof; this.refreshAll(); this.buildLabels(); }
  setExplode(on: boolean) {
    if (!!this.explodeTarget === on) return;
    this.explodeTarget = on ? 1 : 0;
    const s = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
    s.radius = Math.min(11, s.radius * (on ? 1.4 : 1 / 1.4));
    this.tweenCam(this.controls.target.clone(), s, 0.7);
  }
  setFade(on: boolean) { this.fade = on; this.applyFade(); }
  setLabels(on: boolean) { this.showLabels = on; this.labelBox.hidden = !on; this.dirty = true; }
  setSection(axis: 'z' | 'x' | null, v: number) {
    this.section = { axis, v };
    const on = !!axis && v > 0.001;
    this.renderer.localClippingEnabled = on;
    if (axis === 'z') { clipPlane.normal.set(0, 0, -1); clipPlane.constant = 2.06 - v * 1.95; }
    if (axis === 'x') { clipPlane.normal.set(-1, 0, 0); clipPlane.constant = 2.06 - v * 1.95; }
    this.dirty = true;
  }
  private clipped(p: THREE.Vector3) { return this.renderer.localClippingEnabled && clipPlane.distanceToPoint(p) < 0; }

  private applyFade() {
    this.steps.forEach((s, i) => s.mats.forEach(m => {
      const faded = this.fade && i < this.cur;
      const u = m.userData;
      const tr = faded || u.baseTransparent, op = faded ? Math.min(u.baseOpacity, 0.16) : u.baseOpacity;
      if (m.transparent !== tr) { m.transparent = tr; m.needsUpdate = true; }
      m.opacity = op; m.depthWrite = !faded;
    }));
    this.dirty = true;
  }

  // ---------- pași ----------
  go(i: number, animate = true) {
    this.tl?.finish();
    this.tl = null;
    this.clearHighlight();
    this.cur = Math.max(0, Math.min(this.steps.length - 1, i));
    if (this.autoCut) { const c = this.cur >= CUT_FROM; this.hideFront = c; this.hideRoof = c; }
    this.steps.forEach((s, k) => {
      s.group.visible = k <= this.cur;
      s.group.traverse(o => { if ((o as THREE.Mesh).isMesh) { const d = info(o); d.p = 1; d.shown = d.kind !== 'capsa' || k < this.cur || !animate; } });
    });
    this.applyFade();
    this.refreshAll();
    this.buildLabels();
    this.hideTools();
    this.focusStep(this.cur);
    if (animate) this.play(); else this.ev.onAnim(false);
  }
  autoCutOn() { this.autoCut = true; }

  replay() { this.go(this.cur, true); }
  skip() { if (this.tl) { this.tl.finish(); this.tl = null; this.hideTools(); this.refreshAll(); this.ev.onAnim(false); } }

  private play() {
    const s = this.steps[this.cur];
    const tl = new Timeline();
    this.tl = tl;
    this.ev.onAnim(true);
    tl.t = -0.15;
    // 1. unelte înainte de piese
    s.tools.filter(a => a.cand === 'pre').forEach(a => this.addTool(tl, a));
    // 2. piesele vin la locul lor
    const pieces = s.pieces;
    pieces.forEach(m => { const d = info(m); d.p = 0; d.shown = false; this.place(m); });
    s.screws.forEach(m => { const d = info(m); d.shown = false; d.p = 0; this.place(m); });
    const n = pieces.length, st = n > 1 ? Math.min(0.11, 2.6 / n) : 0, dur = 0.6;
    const base = tl.cursor;
    pieces.forEach((m, k) => tl.add(dur, p => { info(m).p = p; this.place(m); }, { at: base + k * st, start: () => { info(m).shown = true; } }));
    tl.cursor = base + (n ? (n - 1) * st + dur : 0);
    // 3. bormașina pune câteva șuruburi, restul apar
    const sc = s.screws;
    if (sc.length) {
      const K = Math.min(sc.length, sc.length > 30 ? 6 : 8);
      const pick = new Set<number>();
      for (let j = 0; j < K; j++) pick.add(Math.round((j * (sc.length - 1)) / Math.max(1, K - 1)));
      const chosen = [...pick].map(j => sc[j]).filter(m => this.tagOK(info(m).tag));
      const label = (PASI[this.cur].prinderi || [])[0] || '';
      let prev: THREE.Vector3 | null = null;
      chosen.forEach((m, j) => { prev = this.addDrill(tl, m, prev, `Șurub ${j + 1} din ${chosen.length}${label ? ' · ' + label : ''}`); });
      tl.add(0.25, undefined, { end: () => { this.drill.root.visible = false; this.toolText.on = false; } });
      const rest = sc.filter(m => !chosen.includes(m));
      const b2 = tl.cursor, st2 = rest.length ? Math.min(0.03, 0.9 / rest.length) : 0;
      rest.forEach((m, k) => tl.add(0.25, p => { info(m).p = p; this.place(m); }, { at: b2 + k * st2, start: () => { info(m).shown = true; } }));
      tl.cursor = b2 + (rest.length ? (rest.length - 1) * st2 + 0.25 : 0);
    }
    // 4. capsator, ruletă, nivelă după piese
    s.tools.filter(a => a.cand === 'post').forEach(a => this.addTool(tl, a));
    // 5. evidențiere la final
    tl.add(0.01, undefined, { end: () => { this.pulse = { t: 0, mats: s.mats.filter(m => m.userData.key !== 'lamp') }; } });
  }

  private addDrill(tl: Timeline, m: THREE.Mesh, prev: THREE.Vector3 | null, text: string) {
    const d = info(m), dir = d.dir!.clone();
    const target = () => d.base.clone().addScaledVector(d.ex, this.explode);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const from = prev ? prev.clone() : target().addScaledVector(dir, 0.5).add(new THREE.Vector3(0, 0.25, 0));
    const above = () => target().addScaledVector(dir, 0.16);
    const dr = this.drill;
    tl.add(0.38, p => {
      dr.root.visible = true; dr.root.quaternion.copy(q);
      dr.root.position.lerpVectors(from, above(), easeIO(p));
      this.toolText = { text, pos: above(), on: true };
    });
    tl.add(0.55, p => {
      const t = target();
      dr.root.position.copy(t).addScaledVector(dir, 0.055 * (1 - p) + 0.004);
      dr.spin.rotation.y += 0.9;
      d.p = Math.min(1, p * 1.1); this.place(m);
    }, { start: () => { d.shown = true; d.p = 0; } });
    tl.add(0.22, p => { dr.root.position.copy(target()).addScaledVector(dir, 0.004 + 0.16 * ease(p)); });
    return above();
  }

  private addTool(tl: Timeline, a: ToolAction) {

    if (a.tip === 'ruleta') {
      const L = a.din.distanceTo(a.la);
      const x = a.la.clone().sub(a.din).normalize();
      const up = Math.abs(x.y) > 0.9 ? (wallNormal(a.din) || new THREE.Vector3(0, 0, 1)) : new THREE.Vector3(0, 1, 0);
      const z = new THREE.Vector3().crossVectors(x, up).normalize();
      const y = new THREE.Vector3().crossVectors(z, x).normalize();
      const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x, y, z));
      const mid = a.din.clone().lerp(a.la, 0.5).add(new THREE.Vector3(0, 0.06, 0));
      const t = this.tape;
      const setL = (l: number) => { t.blade.scale.x = Math.max(0.001, l); t.hook.position.x = l; };
      tl.add(0.25, () => { t.root.visible = true; t.root.position.copy(a.din); t.root.quaternion.copy(q); setL(0); });
      tl.add(Math.min(1.4, 0.5 + L * 0.35), p => setL(L * easeIO(p)));
      tl.add(1.0, () => { this.toolText = { text: a.text, pos: mid, on: true }; });
      tl.add(0.35, p => setL(L * (1 - easeIO(p))), { start: () => (this.toolText.on = false), end: () => (t.root.visible = false) });
    } else if (a.tip === 'nivela') {
      const ax = a.axa === 'x' ? new THREE.Vector3(1, 0, 0) : a.axa === 'y' ? new THREE.Vector3(0, 1, 0) : new THREE.Vector3(0, 0, 1);
      let zz = a.axa === 'y' ? (wallNormal(a.poz) || new THREE.Vector3(0, 0, 1)) : new THREE.Vector3(0, 0, 1);
      if (a.axa === 'z') zz = new THREE.Vector3(1, 0, 0);
      const yy = new THREE.Vector3().crossVectors(zz, ax).normalize();
      const q0 = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(ax, yy, zz));
      const lv = this.level;
      const drop = a.axa === 'y' ? zz.clone().multiplyScalar(0.12) : new THREE.Vector3(0, 0.15, 0);
      tl.add(0.35, p => { lv.root.visible = true; lv.root.position.copy(a.poz).addScaledVector(drop, 1 - ease(p)); lv.root.quaternion.copy(q0); });
      tl.add(1.0, p => {
        const ang = 0.06 * Math.sin(p * 22) * (1 - p);
        lv.root.quaternion.copy(q0).multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 0, 1), ang));
        lv.bubble.position.x = -ang * 0.4;
        this.toolText = { text: a.axa === 'y' ? '✓ vertical' : '✓ la nivel', pos: a.poz.clone().add(new THREE.Vector3(0, 0.12, 0)), on: p > 0.7 };
      });
      tl.add(0.6);
      tl.add(0.25, p => { lv.root.position.copy(a.poz).addScaledVector(drop, ease(p)); }, { end: () => { lv.root.visible = false; this.toolText.on = false; } });
    } else if (a.tip === 'capsator') {
      const stp = this.stapler;
      a.puncte.forEach(({ p: pt, n, mark }, j) => {
        const zAx = Math.abs(n.y) > 0.9 ? new THREE.Vector3(0, 0, 1) : new THREE.Vector3(0, -1, 0);
        const xAx = new THREE.Vector3().crossVectors(n, zAx).normalize();
        const q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(xAx, n, zAx));
        const target = () => pt.clone().addScaledVector(exVec(this.cur, pt), this.explode);
        tl.add(0.28, p => {
          stp.visible = true; stp.quaternion.copy(q);
          stp.position.copy(target()).addScaledVector(n, 0.04 + 0.12 * (1 - ease(p)));
          this.toolText = { text: `Capsă ${j + 1} din ${a.puncte.length}`, pos: target().addScaledVector(n, 0.2), on: true };
        });
        tl.add(0.18, p => { stp.position.copy(target()).addScaledVector(n, 0.04 * (1 - Math.sin(p * Math.PI))); },
          { end: () => { info(mark).shown = true; this.place(mark); } });
      });
      tl.add(0.25, undefined, { end: () => { stp.visible = false; this.toolText.on = false; } });
    }
  }
  private hideTools() {
    this.drill.root.visible = false; this.stapler.visible = false; this.tape.root.visible = false; this.level.root.visible = false;
    this.toolText.on = false; this.toolTip.style.display = 'none';
  }

  // ---------- cameră ----------
  resetView(anim = true) {
    const a = this.aspect();
    const sph = new THREE.Spherical(a < 0.8 ? 7.8 : a < 1.4 ? 6.4 : 5.6, Math.PI / 2 - 0.4, 0.72);
    this.tweenCam(new THREE.Vector3(1, 1.1, 1), sph, anim ? 0.8 : 0);
  }
  private aspect() { return this.stage.clientWidth / Math.max(1, this.stage.clientHeight); }
  private focusStep(i: number) {
    const s = this.steps[i];
    const box = new THREE.Box3();
    [...s.pieces, ...s.screws].forEach(m => {
      if (!this.tagOK(info(m).tag)) return;
      if (!m.geometry.boundingBox) m.geometry.computeBoundingBox();
      box.union(m.geometry.boundingBox!.clone().translate(info(m).base));
    });
    s.tools.forEach(t => { if (t.tip === 'ruleta') box.expandByPoint(t.din).expandByPoint(t.la); if (t.tip === 'nivela') box.expandByPoint(t.poz); });
    if (box.isEmpty()) box.set(new THREE.Vector3(0, 0, 0), new THREE.Vector3(2, 2.3, 2));
    const c = box.getCenter(new THREE.Vector3()), size = box.getSize(new THREE.Vector3()).length();
    const house = new THREE.Vector3(1, 1.1, 1);
    const target = house.lerp(c, 0.55);
    const a = this.aspect();
    const inside = this.hideFront && i >= CUT_FROM;
    const r = Math.min(7.2, Math.max(inside ? 4.8 : 3.2, size * 1.2 + 1.7)) * (a < 0.8 ? 1.3 : 1) * (this.explodeTarget ? 1.4 : 1);
    const cur = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
    const sph = new THREE.Spherical(r, cur.phi, cur.theta);
    if (inside) { // vedem interiorul prin peretele din față, ascuns: venim aproape din față și puțin de sus
      const th = Math.atan2(Math.sin(cur.theta), Math.cos(cur.theta));
      if (Math.abs(th) > 0.55) sph.theta = 0.32 * Math.sign(th || 1);
      sph.phi = Math.min(Math.max(cur.phi, 1.12), 1.3);
    }
    if (i <= 6) sph.phi = Math.min(sph.phi, Math.PI / 2 - 0.55);
    this.tweenCam(target, sph, 0.9);
  }
  private tweenCam(t: THREE.Vector3, s: THREE.Spherical, dur: number) {
    const fs = new THREE.Spherical().setFromVector3(this.camera.position.clone().sub(this.controls.target));
    let dth = s.theta - fs.theta; dth = Math.atan2(Math.sin(dth), Math.cos(dth));
    const ts = new THREE.Spherical(s.radius, s.phi, fs.theta + dth);
    if (dur <= 0) { this.controls.target.copy(t); this.camera.position.setFromSpherical(ts).add(t); this.controls.update(); this.dirty = true; return; }
    this.camTween = { t: 0, dur, ft: this.controls.target.clone(), tt: t.clone(), fs, ts };
  }

  // ---------- etichete ----------
  buildLabels() {
    this.labelBox.innerHTML = '';
    this.labelEls = this.steps[this.cur].labels.map(l => {
      const el = document.createElement('div'); el.className = 'lbl'; el.textContent = l.code;
      this.labelBox.appendChild(el); return { el, l };
    });
    this.dirty = true;
  }
  private tmp = new THREE.Vector3();
  private updateOverlays() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight;
    if (this.showLabels) for (const { el, l } of this.labelEls) {
      const p = this.tmp.copy(l.pos).addScaledVector(exVec(l.step, l.pos), this.explode);
      if (!this.tagOK(l.tag) || this.clipped(p) || (this.tl && this.tl.active)) { el.style.display = 'none'; continue; }
      p.project(this.camera);
      if (p.z > 1) { el.style.display = 'none'; continue; }
      el.style.display = ''; el.style.transform = `translate(${((p.x + 1) / 2) * w}px,${((1 - p.y) / 2) * h}px) translate(-50%,-50%)`;
    }
    const tt = this.toolText;
    if (tt.on && tt.text) {
      const p = this.tmp.copy(tt.pos).project(this.camera);
      this.toolTip.textContent = tt.text; this.toolTip.style.display = '';
      this.toolTip.style.transform = `translate(${((p.x + 1) / 2) * w}px,${((1 - p.y) / 2) * h}px) translate(-50%,-140%)`;
    } else this.toolTip.style.display = 'none';
  }

  // ---------- selecție ----------
  private setupPicking() {
    const el = this.renderer.domElement;
    let down: { x: number; y: number; t: number } | null = null;
    el.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY, t: performance.now() }; });
    el.addEventListener('pointerup', e => {
      if (!down) return;
      const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y), dt = performance.now() - down.t;
      down = null;
      if (moved > 8 || dt > 600) return;
      const r = el.getBoundingClientRect();
      const ndc = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      const rc = new THREE.Raycaster(); rc.setFromCamera(ndc, this.camera);
      const cand = this.allMeshes.filter(m => m.visible && info(m).step <= this.cur && (!this.fade || info(m).step === this.cur));
      const hit = rc.intersectObjects(cand, false).find(h => !this.clipped(h.point));
      if (!hit) { this.clearHighlight(); this.ev.onPick(null); return; }
      const m = hit.object as THREE.Mesh;
      this.highlight([m], 0);
      this.ev.onPick(info(m));
    });
  }
  highlight(meshes: THREE.Mesh[], ms: number) {
    this.clearHighlight();
    this.hlMat.color.copy(this.accent); this.hlMat.emissive.copy(this.accent);
    this.hl.meshes = meshes; this.hl.orig = meshes.map(m => m.material as THREE.Material);
    meshes.forEach(m => (m.material = this.hlMat));
    if (ms) this.hl.timer = window.setTimeout(() => this.clearHighlight(), ms);
    this.dirty = true;
  }
  highlightCode(code: string) {
    const ms = this.allMeshes.filter(m => info(m).code === code && info(m).step <= this.cur);
    const curOnly = ms.filter(m => info(m).step === this.cur);
    this.highlight(curOnly.length ? curOnly : ms, 2600);
  }
  clearHighlight() {
    clearTimeout(this.hl.timer);
    this.hl.meshes.forEach((m, i) => (m.material = this.hl.orig[i]));
    this.hl = { meshes: [], orig: [], timer: 0 };
    this.dirty = true;
  }

  // ---------- temă și buclă ----------
  applyTheme() {
    const cs = getComputedStyle(document.documentElement);
    const v = (n: string, d: string) => cs.getPropertyValue(n).trim() || d;
    this.scene.background = new THREE.Color(v('--scene', '#DCE4E7'));
    this.groundMat.color.set(v('--ground', '#B9C3AC'));
    this.paverMat.color.set(v('--paver', '#B3ADA4'));
    this.accent.set(v('--accent', '#2E6B57'));
    this.dirty = true;
  }
  private resize() {
    const w = this.stage.clientWidth, h = this.stage.clientHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / Math.max(h, 1); this.camera.updateProjectionMatrix();
    this.dirty = true;
  }
  private loop = () => {
    requestAnimationFrame(this.loop);
    const dt = Math.min(0.05, this.clock.getDelta());
    let busy = false;
    if (this.camTween) {
      const c = this.camTween; c.t += dt; const p = easeIO(clamp01(c.t / c.dur));
      this.controls.target.lerpVectors(c.ft, c.tt, p);
      const s = new THREE.Spherical(c.fs.radius + (c.ts.radius - c.fs.radius) * p, c.fs.phi + (c.ts.phi - c.fs.phi) * p, c.fs.theta + (c.ts.theta - c.fs.theta) * p);
      this.camera.position.setFromSpherical(s).add(this.controls.target);
      if (p >= 1) this.camTween = null;
      busy = true;
    }
    if (this.controls.update()) busy = true;
    if (Math.abs(this.explode - this.explodeTarget) > 1e-4) {
      this.explode += (this.explodeTarget - this.explode) * Math.min(1, dt * 6);
      if (Math.abs(this.explode - this.explodeTarget) < 0.002) this.explode = this.explodeTarget;
      this.refreshAll(); busy = true;
    }
    if (this.tl) {
      this.tl.update(dt * this.speed);
      busy = true;
      if (!this.tl.active) { this.tl = null; this.hideTools(); this.ev.onAnim(false); }
    }
    if (this.pulse.t >= 0) {
      this.pulse.t += dt;
      const t = this.pulse.t / 1.3, k = 0.5 * (1 - t) * (1 - t);
      this.pulse.mats.forEach(m => { m.emissive.copy(this.accent); m.emissiveIntensity = t < 1 ? k : 0; });
      if (t >= 1) this.pulse.t = -1;
      busy = true;
    }
    const fl = this.steps[this.cur].flicker;
    if (fl && this.steps[this.cur].group.visible) {
      fl.intensity = 1.6 + 0.5 * Math.sin(performance.now() / 90) + 0.3 * Math.sin(performance.now() / 37);
      busy = true;
    }
    if (busy || this.dirty) {
      this.renderer.render(this.scene, this.camera);
      this.updateOverlays();
      this.dirty = false;
    }
  };
}
