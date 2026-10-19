// Catalogul pieselor: cod → denumire, dimensiune, din ce bucată cumpărată se taie și de unde o cumperi.
export interface Piesa {
  nume: string;
  dim: string;
  taieDin?: string;
  magazin?: string;      // unde se cumpără
  link?: string;         // pagina produsului
}

// linkuri folosite de mai multe piese (aceleași ca în lista de cumpărături)
const L = {
  cherestea: ['Dedeman', 'https://www.dedeman.ro/ro/cherestea-nerindeluita-detroit-city-lemn-molid-a/b-4000-x-100-x-50-mm/p/6060472'],
  vata: ['Dedeman', 'https://www.dedeman.ro/ro/vata-minerala-bazaltica-baudeman-sw38-1000-x-600-x-100-mm/p/6061835'],
  placaj: ['Dedeman', 'https://www.dedeman.ro/ro/placaj-cofraj-interior/-exterior-maro-18-x-2500-x-1250-mm/p/6071101'],
  osb: ['Dedeman', 'https://www.dedeman.ro/ro/osb-3-18-x-2500-x-1250-mm/p/4007527'],
  difuzie: ['Dedeman', 'https://www.dedeman.ro/ro/folie-anticondens-baudeman-air-110-g/mp-3-straturi-1-5-x-50-m-75-mp/p/6033802'],
  rigla3000: ['Leroy Merlin', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html'],
  rigla4000: ['Dedeman', 'https://www.dedeman.ro/ro/rigla-nerindeluita-lemn-molid-a/b-4000-x-48-x-24-mm-zg/p/6068501'],
  rigla48: ['Leroy Merlin', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html'],
  lambExt: ['Dedeman', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-zc-interior-4000-x-96-x-12-5-mm/p/4026441'],
  lambInt: ['Dedeman', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-interior-2500-x-96-x-12-5-mm/p/4026439'],
  colt: ['Dedeman', 'https://www.dedeman.ro/ro/sipci-lemn-accesorii-lambriu/c/3371'],
  folie: ['Nordic Sauna', 'https://nordicsauna.ro/product/folie-de-aluminiu/'],
  plop: ['Depozitul de Saune', 'https://depozituldesaune.ro/cp/materiale-saune/lemn-constructie-sauna/'],
  usa: ['SaunaBee', 'https://saunabee.ro/usi-sauna'],
  soba: ['Depozitul de Saune', 'https://depozituldesaune.ro/p/incalzitor-sauna-harvia-vega-bc60-inox-6kw-comanda-incorporata/'],
  grila: ['Piscine Service', 'https://www.piscineservice.ro/30-sauna/53-cabine-sauna-uscata/125-materiale-constructie-sauna/1277-grila-aerisire-sauna-harvia'],
  fibrociment: ['Dedeman', 'https://www.dedeman.ro/ro/placa-fibrociment-a1-10-x-1250-x-2500-mm/p/6050041'],
  hidro: ['Dedeman', 'https://www.dedeman.ro/ro/hidroizolatie-flexibila-ceresit-cr-166-32-kg/p/5006178'],
  gresie: ['Dedeman', 'https://www.dedeman.ro/ro/gresie-exterior/-interior-portelanata-veranda-bone-30-x-60-cm-crem-mata-antiderapanta-imitatie-lemn/p/4020912'],
  sifon: ['Dedeman', 'https://www.dedeman.ro/ro/sifon-pardoseala-polipropilena-gratar-inox-alca-apv26c-105-x-105-mm-iesire-laterala-d-50-mm-reglabil/p/2034706'],
  shellyPro: ['1smart.ro', 'https://www.1smart.ro/relee-wireless-inteligente/1020-releu-smart-shelly-pro-1'],
  shelly1: ['eMAG', 'https://www.emag.ro/releu-inteligent-shelly-1-gen3-1-canal-16a-wifi-contact-uscat-3800235261767/pd/DSWSZLYBM']
} as const;
const de = (k: keyof typeof L) => ({ magazin: L[k][0], link: L[k][1] });

export const PIESE: Record<string, Piesa> = {
  SR: { nume: 'Suport reglabil sau plăcuță de cauciuc', dim: 'aprox. 25 mm', taieDin: 'cumpărat gata', magazin: 'Dedeman sau Leroy Merlin, raionul de grădină' },
  MB: { nume: 'Membrană bitumată', dim: '110 × 110 mm', taieDin: 'tăiat din rola de membrană bitumată', magazin: 'Dedeman sau Leroy Merlin' },
  P1: { nume: 'Grindă podea, față și spate', dim: '50 × 100 × 1925', taieDin: 'R10 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  P2: { nume: 'Grindă podea', dim: '50 × 100 × 1825', taieDin: 'R15–R18 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  V: { nume: 'Vată bazaltică 100 mm', dim: 'tăiată pe gol', taieDin: 'pachete Baudeman SW38, 100 mm', ...de('vata') },
  TS: { nume: 'Țeavă de scurgere PP Ø 50 mm', dim: 'aprox. 0,6 m în podea, plus cât e nevoie afară', taieDin: 'țeavă PP Ø 50 cu un cot de 45°', magazin: 'Dedeman, raionul de instalații sanitare' },
  O1: { nume: 'Placaj filmat 18 mm', dim: '1925 × 1250', taieDin: 'Placa 1, placaj 18 mm 2500 × 1250', ...de('placaj') },
  O2: { nume: 'Placaj filmat 18 mm', dim: '1925 × 675', taieDin: 'Placa 2, placaj 18 mm 2500 × 1250', ...de('placaj') },
  M: { nume: 'Montant', dim: '50 × 100 × 1960', taieDin: 'R1–R9 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  T1: { nume: 'Talpă perete spate și față', dim: '50 × 100 × 1925', taieDin: 'R11, R12 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  T2a: { nume: 'Talpă jos față, stânga', dim: '50 × 100 × 982', taieDin: 'R14 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  T2b: { nume: 'Talpă jos față, dreapta', dim: '50 × 100 × 222', taieDin: 'R14 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  T3: { nume: 'Talpă perete lateral', dim: '50 × 100 × 1725', taieDin: 'R15–R18 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  B: { nume: 'Buiandrug ușă', dim: '50 × 100 × 720', taieDin: 'R14 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  G: { nume: 'Grindă tavan', dim: '50 × 100 × 1925', taieDin: 'R12, R13, R14 (riglă 50 × 100 × 4000)', ...de('cherestea') },
  MD: { nume: 'Membrană de difuzie', dim: 'aprox. 19 m²', taieDin: 'rola Baudeman Air 110', ...de('difuzie') },
  S1: { nume: 'Șipcă exterioară', dim: '24 × 48 × 2276', taieDin: 'riglă 24 × 48 × 3000 (17 buc.)', ...de('rigla3000') },
  LE: { nume: 'Lambriu exterior', dim: '2000, 1975, 1020 și 260 mm', taieDin: 'lambriu exterior 4000 mm', ...de('lambExt') },
  CL: { nume: 'Șipcă de colț tip L', dim: '2 buc. pe colț', taieDin: 'șipcă de colț 40 × 40, 2 m', ...de('colt') },
  O3: { nume: 'OSB 12 mm', dim: '1975 × 1250', taieDin: 'Placa 3, OSB 12 mm 2500 × 1250', ...de('osb'), magazin: 'Dedeman (alegi grosimea 12 mm pe pagină)' },
  O4: { nume: 'OSB 12 mm', dim: '1975 × 725', taieDin: 'Placa 4, OSB 12 mm 2500 × 1250', ...de('osb'), magazin: 'Dedeman (alegi grosimea 12 mm pe pagină)' },
  S4: { nume: 'Șipcă deasupra', dim: '24 × 48 × 1975', taieDin: 'riglă 24 × 48 × 4000 (2 buc.)', ...de('rigla4000') },
  LS: { nume: 'Lambriu deasupra', dim: '1975 mm', taieDin: 'lambriu exterior 4000 mm', ...de('lambExt') },
  BS: { nume: 'Bordură deasupra, din lambriu', dim: '2000 × 40 mm', taieDin: 'lambriu exterior 4000 mm, tăiat pe lungime', ...de('lambExt') },
  CB: { nume: 'Cablu siliconic în tub', dim: 'de la electrician', taieDin: 'de la electrician' },
  GA: { nume: 'Gol de aerisire', dim: '100 × 120 mm', taieDin: 'tăiat în perete' },
  FA: { nume: 'Folie de aluminiu pentru saună', dim: 'aprox. 18 m²', taieDin: 'rola Harvia de 30 m²', ...de('folie') },
  FC: { nume: 'Placă de fibrociment 10 mm', dim: '1649 × 1250 și 1649 × 399', taieDin: 'Placa 5 și Placa 6, fibrociment 10 mm 2500 × 1250', ...de('fibrociment') },
  FP: { nume: 'Fâșie de fibrociment pe perete', dim: '100 × 1649 (la față 845 și 85)', taieDin: 'restul din Placa 6', ...de('fibrociment') },
  SF: { nume: 'Sifon de pardoseală, ieșire laterală Ø 50', dim: 'grătar inox 105 × 105', taieDin: 'cumpărat gata', ...de('sifon') },
  HI: { nume: 'Hidroizolație flexibilă Ceresit CR 166', dim: '2 straturi, plus bandă în colțuri', taieDin: 'set de 32 kg', ...de('hidro') },
  GS: { nume: 'Gresie antiderapantă', dim: '30 × 60 cm, aprox. 3 m²', taieDin: 'tăiată pe loc', ...de('gresie') },
  S3: { nume: 'Șipcă tavan', dim: '24 × 48 × 1649', taieDin: 'riglă 24 × 48 × 4000 (3 buc.)', ...de('rigla4000') },
  S2: { nume: 'Șipcă perete', dim: '24 × 48 × 1994', taieDin: 'riglă 24 × 48 × 3000 (17 buc.)', ...de('rigla3000') },
  LI: { nume: 'Lambriu interior', dim: '1649, 845 și 85 mm', taieDin: 'lambriu interior 2500 mm', ...de('lambInt') },
  L1: { nume: 'Riglă bancă sus', dim: '48 × 48 × 1649', taieDin: 'LA (riglă 48 × 48 × 4000)', ...de('rigla48') },
  L2: { nume: 'Traversă bancă sus', dim: '48 × 48 × 504', taieDin: 'LA, LC (riglă 48 × 48 × 4000)', ...de('rigla48') },
  L3: { nume: 'Picior bancă sus', dim: '48 × 48 × 924', taieDin: 'LB (riglă 48 × 48 × 4000)', ...de('rigla48') },
  L4: { nume: 'Riglă bancă jos', dim: '48 × 48 × 1025', taieDin: 'LB, LC (riglă 48 × 48 × 4000)', ...de('rigla48') },
  L5: { nume: 'Traversă bancă jos', dim: '48 × 48 × 304', taieDin: 'LC (riglă 48 × 48 × 4000)', ...de('rigla48') },
  L6: { nume: 'Picior bancă jos', dim: '48 × 48 × 424', taieDin: 'LC (riglă 48 × 48 × 4000)', ...de('rigla48') },
  'Ș1': { nume: 'Șipcă bancă sus, plop', dim: '28 × 90 × 1649', taieDin: 'PL1–PL6 (plop 28 × 90 × 2700)', ...de('plop') },
  'Ș2': { nume: 'Șipcă bancă jos, plop', dim: '28 × 90 × 1025', taieDin: 'PL1–PL4 (plop 28 × 90 × 2700)', ...de('plop') },
  'Ș3': { nume: 'Spătar, plop', dim: '28 × 90 × 1649', taieDin: 'PL7–PL8 (plop 28 × 90 × 2700)', ...de('plop') },
  'Ș4': { nume: 'Bară parapet, plop', dim: '28 × 90 × 600', taieDin: 'PL5–PL6 (plop 28 × 90 × 2700)', ...de('plop') },
  'Ș5': { nume: 'Bară laterală parapet, plop', dim: '28 × 90 × 380', taieDin: 'PL5–PL6 (plop 28 × 90 × 2700)', ...de('plop') },
  'Ș6': { nume: 'Stâlp parapet, plop', dim: '28 × 90 × 850', taieDin: 'PL7–PL8 (plop 28 × 90 × 2700)', ...de('plop') },
  U: { nume: 'Ușă de saună', dim: 'toc 700 × 1900', taieDin: 'cumpărată gata', ...de('usa') },
  SB: { nume: 'Sobă Harvia Vega BC60', dim: '480 × 310 × 540', taieDin: 'cumpărată gata', ...de('soba') },
  PT: { nume: 'Pietre pentru saună', dim: 'max. 20 kg', taieDin: 'cumpărate gata', magazin: 'același magazin cu soba' },
  GT: { nume: 'Grătar de lemn detașabil, plop', dim: '2 panouri 590 × 600', taieDin: 'PL9–PL12 (plop 28 × 90 × 2700)', ...de('plop') },
  GR: { nume: 'Grilă de aerisire din lemn', dim: '2 buc.', taieDin: 'cumpărată gata', ...de('grila') },
  LP: { nume: 'Lampă pentru saună', dim: 'rezistentă la căldură', taieDin: 'cumpărată gata', magazin: 'același magazin cu soba' },
  SH: { nume: 'Releu smart Shelly Pro 1 pentru sobă', dim: 'pe șină DIN, în tablou, comandă un contactor de 40 A', taieDin: 'cumpărat gata; contactorul îl aduce electricianul', ...de('shellyPro') },
  SL: { nume: 'Releu smart Shelly 1 Gen3 pentru lampă', dim: '16 A, în doza întrerupătorului, în afara saunei', taieDin: 'cumpărat gata', ...de('shelly1') }
};
