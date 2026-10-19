import * as THREE from 'three';

// Unelte simple, făcute din forme de bază. Fiecare are vârful de lucru în origine.

const m = (c: number, r = 0.6, mt = 0) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: mt });

function part(g: THREE.Group, geo: THREE.BufferGeometry, mat: THREE.Material, x: number, y: number, z: number) {
  const o = new THREE.Mesh(geo, mat);
  o.position.set(x, y, z); o.castShadow = true;
  g.add(o); return o;
}

export interface Drill { root: THREE.Group; spin: THREE.Group }
// Bormașina: burghiul e pe axa -Y, vârful în origine
export function makeDrill(): Drill {
  const root = new THREE.Group();
  const body = m(0xE8641E, 0.45), dark = m(0x26292C, 0.7), steel = m(0xBFC6CC, 0.25, 0.9);
  const spin = new THREE.Group(); root.add(spin);
  part(spin, new THREE.CylinderGeometry(0.0028, 0.0028, 0.075, 8), steel, 0, 0.0375, 0);
  part(spin, new THREE.CylinderGeometry(0.0, 0.0028, 0.008, 8).rotateX(Math.PI), steel, 0, 0.002, 0);
  part(spin, new THREE.CylinderGeometry(0.016, 0.012, 0.038, 14), dark, 0, 0.094, 0);
  part(root, new THREE.CylinderGeometry(0.03, 0.026, 0.15, 18), body, 0, 0.188, 0);
  part(root, new THREE.CylinderGeometry(0.031, 0.031, 0.02, 18), dark, 0, 0.255, 0);
  part(root, new THREE.BoxGeometry(0.034, 0.046, 0.14), dark, 0, 0.235, 0.085);
  part(root, new THREE.BoxGeometry(0.075, 0.06, 0.085), body, 0, 0.235, 0.18);
  part(root, new THREE.BoxGeometry(0.012, 0.02, 0.012), dark, 0, 0.212, 0.035); // trăgaci
  root.visible = false;
  return { root, spin };
}

// Capsatorul: talpa apasă pe suprafață, normala suprafeței e +Y
export function makeStapler() {
  const root = new THREE.Group();
  const body = m(0xC62E2E, 0.5), dark = m(0x2B2E31, 0.6), steel = m(0xBFC6CC, 0.3, 0.8);
  part(root, new THREE.BoxGeometry(0.03, 0.012, 0.15), steel, 0, 0.006, 0.045);
  part(root, new THREE.BoxGeometry(0.034, 0.04, 0.16), body, 0, 0.034, 0.05);
  part(root, new THREE.BoxGeometry(0.028, 0.02, 0.13), dark, 0, 0.07, 0.07).rotation.x = -0.12;
  root.visible = false;
  return root;
}

// Ruleta: carcasa în origine, banda se întinde pe +X (scale.x = lungimea în metri)
export function makeTape() {
  const root = new THREE.Group();
  const yel = m(0xF4C21B, 0.5), dark = m(0x2B2E31, 0.6);
  part(root, new THREE.BoxGeometry(0.07, 0.07, 0.035), yel, -0.036, 0.036, 0);
  part(root, new THREE.CylinderGeometry(0.02, 0.02, 0.037, 16).rotateX(Math.PI / 2), dark, -0.036, 0.036, 0);
  const bladeGeo = new THREE.BoxGeometry(1, 0.0015, 0.024).translate(0.5, 0.001, 0);
  const blade = new THREE.Mesh(bladeGeo, m(0xF7D54A, 0.4, 0.2));
  root.add(blade);
  const hook = part(root, new THREE.BoxGeometry(0.004, 0.02, 0.026), m(0x9AA1A7, 0.3, 0.9), 0, 0.009, 0);
  root.visible = false;
  return { root, blade, hook };
}

// Nivela: bară lungă pe +X, centrată în origine, cu bula verde
export function makeLevel() {
  const root = new THREE.Group();
  const alu = m(0xC9CED2, 0.35, 0.7), green = new THREE.MeshStandardMaterial({ color: 0x6CF07A, emissive: 0x2ED14A, emissiveIntensity: 0.6, roughness: 0.2 });
  part(root, new THREE.BoxGeometry(0.6, 0.035, 0.024), alu, 0, 0, 0);
  part(root, new THREE.BoxGeometry(0.06, 0.016, 0.026), m(0x1F2326, 0.5), 0, 0.006, 0);
  const bubble = part(root, new THREE.SphereGeometry(0.006, 10, 8), green, 0, 0.008, 0.012);
  root.visible = false;
  return { root, bubble };
}
