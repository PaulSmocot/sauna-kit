import * as THREE from 'three';

// Texturi generate în cod (fără fișiere de descărcat), ca aplicația să meargă offline.
// Sunt aproape albe; culoarea vine din material.

function rand(seed: number) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}

function canvasTex(w: number, h: number, draw: (g: CanvasRenderingContext2D, r: () => number) => void, seed: number) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const g = c.getContext('2d')!;
  draw(g, rand(seed));
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

// fibra lemnului merge de-a lungul axei U (lățimea texturii = 0,8 m, înălțimea = 0,2 m)
function grain(fine: boolean, seed: number) {
  return canvasTex(512, 128, (g, r) => {
    g.fillStyle = '#f2f2f2';
    g.fillRect(0, 0, 512, 128);
    const lines = fine ? 70 : 46;
    for (let i = 0; i < lines; i++) {
      const y0 = r() * 128, amp = 1.5 + r() * 5, f = 0.004 + r() * 0.01, ph = r() * 6;
      const shade = 190 + Math.floor(r() * 50);
      g.strokeStyle = `rgba(${shade - 30},${shade - 45},${shade - 70},${0.18 + r() * 0.28})`;
      g.lineWidth = 0.6 + r() * (fine ? 1.2 : 2.2);
      g.beginPath();
      for (let x = 0; x <= 512; x += 8) {
        const y = y0 + Math.sin(x * f * 6.283 + ph) * amp + Math.sin(x * 0.05 + ph) * 0.6;
        x === 0 ? g.moveTo(x, y) : g.lineTo(x, y);
      }
      g.stroke();
    }
    if (!fine) {
      for (let k = 0; k < 3; k++) { // câteva noduri
        const x = r() * 512, y = 20 + r() * 88, rr = 3 + r() * 5;
        const grd = g.createRadialGradient(x, y, 0, x, y, rr * 2.2);
        grd.addColorStop(0, 'rgba(110,70,35,0.55)'); grd.addColorStop(1, 'rgba(110,70,35,0)');
        g.fillStyle = grd; g.beginPath(); g.ellipse(x, y, rr * 2.6, rr, 0, 0, 7); g.fill();
      }
    }
  }, seed);
}

function osb(seed: number) {
  return canvasTex(256, 256, (g, r) => {
    g.fillStyle = '#e9e2d4'; g.fillRect(0, 0, 256, 256);
    for (let i = 0; i < 420; i++) {
      const x = r() * 256, y = r() * 256, w = 14 + r() * 34, h = 4 + r() * 9, a = r() * Math.PI;
      const s = 170 + Math.floor(r() * 80);
      g.save(); g.translate(x, y); g.rotate(a);
      g.fillStyle = `rgba(${s},${s - 25},${s - 70},0.55)`;
      g.fillRect(-w / 2, -h / 2, w, h); g.restore();
    }
  }, seed);
}

function fibers(seed: number) { // vată, membrană
  return canvasTex(128, 128, (g, r) => {
    g.fillStyle = '#f0f0f0'; g.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 900; i++) {
      const s = 200 + Math.floor(r() * 55);
      g.fillStyle = `rgba(${s},${s},${s - 10},0.5)`;
      g.fillRect(r() * 128, r() * 128, 1 + r() * 3, 1);
    }
  }, seed);
}

export interface TexSet { grain: THREE.Texture; grainFine: THREE.Texture; osb: THREE.Texture; fibers: THREE.Texture }
export function makeTextures(): TexSet {
  return { grain: grain(false, 11), grainFine: grain(true, 23), osb: osb(5), fibers: fibers(9) };
}

// Rotește coordonatele UV ale fiecărei fețe a cutiei astfel încât fibra să meargă pe latura lungă,
// și le scalează în metri reali (textura acoperă 0,8 × 0,2 m).
export function fixBoxUV(geo: THREE.BoxGeometry, ou = 0, ov = 0, uLen = 0.8, vLen = 0.2) {
  const { width: w, height: h, depth: d } = geo.parameters;
  const uv = geo.attributes.uv as THREE.BufferAttribute;
  // ordinea fețelor în BoxGeometry: +x, -x, +y, -y, +z, -z (câte 4 vârfuri)
  const faces: [number, number][] = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
  for (let f = 0; f < 6; f++) {
    const [a, b] = faces[f];
    const swap = b > a;
    const L1 = Math.max(a, b), L2 = Math.min(a, b);
    for (let k = 0; k < 4; k++) {
      const i = f * 4 + k;
      let u = uv.getX(i), v = uv.getY(i);
      if (swap) [u, v] = [v, u];
      uv.setXY(i, (u * L1) / uLen + ou + f * 0.37, (v * L2) / vLen + ov + f * 0.21);
    }
  }
  uv.needsUpdate = true;
}
