// Generează iconițele PNG ale aplicației (fără dependențe): o căsuță de saună albă pe fond verde.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const crcT = new Uint32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = b => { let c = 0xffffffff; for (const x of b) c = crcT[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
function chunk(type, data) {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc(td));
  return Buffer.concat([len, td, c]);
}
function png(size, px) {
  const raw = Buffer.alloc((size * 4 + 1) * size);
  for (let y = 0; y < size; y++) { raw[y * (size * 4 + 1)] = 0; px.copy(raw, y * (size * 4 + 1) + 1, y * size * 4, (y + 1) * size * 4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

// forma în coordonate 0..1 (cu supraeșantionare pentru margini netede)
function shade(u, v, pad) {
  const s = (t) => (t - pad) / (1 - 2 * pad);
  const x = s(u), y = s(v);
  const inside = (px, py) => px >= 0 && px <= 1 && py >= 0 && py <= 1;
  if (!inside(x, y)) return 'bg';
  // acoperiș
  const roofTop = 0.14, roofBase = 0.42;
  if (y >= roofTop && y <= roofBase) { const half = 0.08 + ((y - roofTop) / (roofBase - roofTop)) * 0.40; if (Math.abs(x - 0.5) <= half) return 'fg'; }
  // corpul
  if (y > roofBase - 0.001 && y <= 0.86 && x >= 0.18 && x <= 0.82) {
    if (x >= 0.56 && x <= 0.72 && y >= 0.56) return 'door';   // ușa
    if (y > 0.47 && y < 0.53 && x > 0.24 && x < 0.5) return 'board';
    if (y > 0.61 && y < 0.67 && x > 0.24 && x < 0.5) return 'board';
    if (y > 0.75 && y < 0.81 && x > 0.24 && x < 0.5) return 'board';
    return 'fg';
  }
  // abur
  for (const cx of [0.36, 0.5, 0.64]) {
    const dy = y - 0.06, dx = x - cx - Math.sin(y * 40) * 0.012;
    if (y < 0.12 && y > 0.0 && Math.abs(dx) < 0.018) return 'fg';
  }
  return 'bg';
}
const COL = { bg: [46, 107, 87], fg: [250, 246, 238], door: [46, 107, 87], board: [214, 172, 114] };

function icon(size, { pad = 0.16, round = true } = {}) {
  const px = Buffer.alloc(size * size * 4), S = 3;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let r = 0, g = 0, b = 0, a = 0;
    for (let sy = 0; sy < S; sy++) for (let sx = 0; sx < S; sx++) {
      const u = (x + (sx + .5) / S) / size, v = (y + (sy + .5) / S) / size;
      let alpha = 1;
      if (round) { const R = 0.22, cx = Math.min(Math.max(u, R), 1 - R), cy = Math.min(Math.max(v, R), 1 - R); if (Math.hypot(u - cx, v - cy) > R) alpha = 0; }
      const c = COL[shade(u, v, pad)];
      r += c[0] * alpha; g += c[1] * alpha; b += c[2] * alpha; a += alpha;
    }
    const n = S * S, i = (y * size + x) * 4;
    px[i] = a ? r / a : 0; px[i + 1] = a ? g / a : 0; px[i + 2] = a ? b / a : 0; px[i + 3] = (a / n) * 255;
  }
  return png(size, px);
}

mkdirSync('public/icons', { recursive: true });
writeFileSync('public/icons/icon-192.png', icon(192));
writeFileSync('public/icons/icon-512.png', icon(512));
writeFileSync('public/icons/icon-maskable-512.png', icon(512, { pad: 0.24, round: false }));
writeFileSync('public/icons/apple-touch-icon.png', icon(180, { pad: 0.16, round: false }));
writeFileSync('public/icons/icon.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" rx="22" fill="#2E6B57"/><path d="M50 27 L23 50 H77 Z" fill="#FAF6EE"/><rect x="29" y="49" width="42" height="29" fill="#FAF6EE"/><rect x="58" y="58" width="9" height="20" fill="#2E6B57"/></svg>`);
console.log('iconițe generate');
