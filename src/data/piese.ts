// Catalogul pieselor: cod → denumire, dimensiune și din ce bucată cumpărată se taie.
export interface Piesa {
  nume: string;
  dim: string;
  taieDin?: string;
}

export const PIESE: Record<string, Piesa> = {
  SR: { nume: 'Suport reglabil sau plăcuță de cauciuc', dim: 'aprox. 25 mm', taieDin: 'cumpărat gata' },
  MB: { nume: 'Membrană bitumată', dim: '110 × 110 mm', taieDin: 'tăiat din rola de membrană bitumată' },
  P1: { nume: 'Grindă podea, față și spate', dim: '50 × 100 × 1925', taieDin: 'R10 (riglă 50 × 100 × 4000)' },
  P2: { nume: 'Grindă podea', dim: '50 × 100 × 1825', taieDin: 'R15–R18 (riglă 50 × 100 × 4000)' },
  V: { nume: 'Vată bazaltică 100 mm', dim: 'tăiată pe gol', taieDin: 'pachete Baudeman SW38, 100 mm' },
  O1: { nume: 'OSB 18 mm', dim: '1925 × 1250', taieDin: 'Placa 1, OSB 18 mm 2500 × 1250' },
  O2: { nume: 'OSB 18 mm', dim: '1925 × 675', taieDin: 'Placa 2, OSB 18 mm 2500 × 1250' },
  M: { nume: 'Montant', dim: '50 × 100 × 1960', taieDin: 'R1–R9 (riglă 50 × 100 × 4000)' },
  T1: { nume: 'Talpă perete spate și față', dim: '50 × 100 × 1925', taieDin: 'R11, R12 (riglă 50 × 100 × 4000)' },
  T2a: { nume: 'Talpă jos față, stânga', dim: '50 × 100 × 982', taieDin: 'R14 (riglă 50 × 100 × 4000)' },
  T2b: { nume: 'Talpă jos față, dreapta', dim: '50 × 100 × 222', taieDin: 'R14 (riglă 50 × 100 × 4000)' },
  T3: { nume: 'Talpă perete lateral', dim: '50 × 100 × 1725', taieDin: 'R15–R18 (riglă 50 × 100 × 4000)' },
  B: { nume: 'Buiandrug ușă', dim: '50 × 100 × 720', taieDin: 'R14 (riglă 50 × 100 × 4000)' },
  G: { nume: 'Grindă tavan', dim: '50 × 100 × 1925', taieDin: 'R12, R13, R14 (riglă 50 × 100 × 4000)' },
  MD: { nume: 'Membrană de difuzie', dim: 'aprox. 19 m²', taieDin: 'rola Baudeman Air 110' },
  S1: { nume: 'Șipcă exterioară', dim: '24 × 48 × 2276', taieDin: 'riglă 24 × 48 × 3000 (17 buc.)' },
  LE: { nume: 'Lambriu exterior', dim: '2000, 1975, 1020 și 260 mm', taieDin: 'lambriu exterior 4000 mm' },
  CL: { nume: 'Șipcă de colț tip L', dim: '2 buc. pe colț', taieDin: 'șipcă de colț 40 × 40, 2 m' },
  O3: { nume: 'OSB 12 mm', dim: '1975 × 1250', taieDin: 'Placa 3, OSB 12 mm 2500 × 1250' },
  O4: { nume: 'OSB 12 mm', dim: '1975 × 725', taieDin: 'Placa 4, OSB 12 mm 2500 × 1250' },
  CB: { nume: 'Cablu siliconic în tub', dim: 'de la electrician', taieDin: 'de la electrician' },
  GA: { nume: 'Gol de aerisire', dim: '100 × 120 mm', taieDin: 'tăiat în perete' },
  FA: { nume: 'Folie de aluminiu pentru saună', dim: 'aprox. 18 m²', taieDin: 'rola Harvia de 30 m²' },
  S3: { nume: 'Șipcă tavan', dim: '24 × 48 × 1649', taieDin: 'riglă 24 × 48 × 4000 (3 buc.)' },
  S2: { nume: 'Șipcă perete', dim: '24 × 48 × 2022', taieDin: 'riglă 24 × 48 × 3000 (17 buc.)' },
  LI: { nume: 'Lambriu interior', dim: '1649, 845 și 85 mm', taieDin: 'lambriu interior 2500 mm' },
  L1: { nume: 'Riglă bancă sus', dim: '48 × 48 × 1649', taieDin: 'LA (riglă 48 × 48 × 4000)' },
  L2: { nume: 'Traversă bancă sus', dim: '48 × 48 × 504', taieDin: 'LA, LC (riglă 48 × 48 × 4000)' },
  L3: { nume: 'Picior bancă sus', dim: '48 × 48 × 924', taieDin: 'LB (riglă 48 × 48 × 4000)' },
  L4: { nume: 'Riglă bancă jos', dim: '48 × 48 × 1025', taieDin: 'LB, LC (riglă 48 × 48 × 4000)' },
  L5: { nume: 'Traversă bancă jos', dim: '48 × 48 × 304', taieDin: 'LC (riglă 48 × 48 × 4000)' },
  L6: { nume: 'Picior bancă jos', dim: '48 × 48 × 424', taieDin: 'LC (riglă 48 × 48 × 4000)' },
  'Ș1': { nume: 'Șipcă bancă sus, plop', dim: '28 × 90 × 1649', taieDin: 'PL1–PL6 (plop 28 × 90 × 2700)' },
  'Ș2': { nume: 'Șipcă bancă jos, plop', dim: '28 × 90 × 1025', taieDin: 'PL1–PL4 (plop 28 × 90 × 2700)' },
  'Ș3': { nume: 'Spătar, plop', dim: '28 × 90 × 1649', taieDin: 'PL7–PL8 (plop 28 × 90 × 2700)' },
  'Ș4': { nume: 'Bară parapet, plop', dim: '28 × 90 × 600', taieDin: 'PL5–PL6 (plop 28 × 90 × 2700)' },
  'Ș5': { nume: 'Bară laterală parapet, plop', dim: '28 × 90 × 380', taieDin: 'PL5–PL6 (plop 28 × 90 × 2700)' },
  'Ș6': { nume: 'Stâlp parapet, plop', dim: '28 × 90 × 850', taieDin: 'PL7–PL8 (plop 28 × 90 × 2700)' },
  U: { nume: 'Ușă de saună', dim: 'toc 700 × 1900', taieDin: 'cumpărată gata' },
  SB: { nume: 'Sobă Harvia Vega BC60', dim: '480 × 310 × 540', taieDin: 'cumpărată gata' },
  PT: { nume: 'Pietre pentru saună', dim: 'max. 20 kg', taieDin: 'cumpărate gata' },
  GR: { nume: 'Grilă de aerisire din lemn', dim: '2 buc.', taieDin: 'cumpărată gata' },
  LP: { nume: 'Lampă pentru saună', dim: 'rezistentă la căldură', taieDin: 'cumpărată gata' }
};
