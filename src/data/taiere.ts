// Lista de tăiere: din ce bucată cumpărată tai ce piese.
export interface GrupTaiere {
  titlu: string;
  randuri: [bucata: string, tai: string, lungimi: string][];
}

export const TAIERE: GrupTaiere[] = [
  { titlu: 'Riglă 50 × 100 × 4000 mm, 20 bucăți plus 1 de rezervă', randuri: [
    ['R1–R8', 'M + M', '1995 + 1995, rest 10'],
    ['R9', 'M + NP', '1995 + 580 + 580 + 565 + 123'],
    ['R10', 'P1 + P1', '1925 + 1925'],
    ['R11', 'T1 + T1', '1925 + 1925'],
    ['R12', 'T1 + G', '1925 + 1925'],
    ['R13', 'G + G', '1925 + 1925'],
    ['R14', 'G + T2a + B + T2b', '1925 + 982 + 720 + 222'],
    ['R15–R18', 'T3 + P2 + NP', '1725 + 1825 + 413 / 420 / 365 / 365 (câte unul pe riglă)'],
    ['R19', 'NP + PR + NT', '580 × 4 + 720 + 543 (PR îl tai apoi pe grosime la 35 mm)'],
    ['R20', 'NT', '543 + 558 + 558 + 625 + 625']] },
  { titlu: 'Riglă 24 × 48 × 3000 mm, 34 bucăți', randuri: [['17 buc.', 'S1', '2311, rest 689'], ['17 buc.', 'S2', '2017, rest 983'], ['resturi', 'GH', 'ghidajele pentru șapă, pe lângă pereți']] },
  { titlu: 'Riglă 24 × 48 × 4000 mm, 5 bucăți', randuri: [['3 buc.', 'S3 + S3', '1649 + 1649 (iese una în plus)'], ['2 buc.', 'S4 + S4', '1990 + 1990']] },
  { titlu: 'Riglă 48 × 48 × 4000 mm, 3 bucăți', randuri: [
    ['LA', 'L1 + L1 + L2', '1649 + 1649 + 504'],
    ['LB', 'L3 + L3 + L3 + L4', '924 × 3 + 1025'],
    ['LC', 'L4 + L2 + L2 + L5 + L5 + L6 + L6', '1025 + 504 × 2 + 304 × 2 + 424 × 2']] },
  { titlu: 'Plop 28 × 90 × 2700 mm, 12 bucăți', randuri: [
    ['PL1–PL4', 'Ș1 + Ș2', '1649 + 1025'],
    ['PL5–PL6', 'Ș1 + Ș4 + Ș5', '1649 + 600 + 380'],
    ['PL7–PL8', 'Ș3 + Ș6', '1649 + 850'],
    ['PL9–PL11', 'șipci GT', '590 × 4, rest 340'],
    ['PL12', 'rigle GT', '600 × 4, rest 300']] },
  { titlu: 'Placaj filmat 18 mm, 2500 × 1250 mm', randuri: [
    ['Placa 1', 'O1', '1925 × 1250'],
    ['Placa 2', 'O2', '1925 × 675']] },
  { titlu: 'OSB 12 mm, 2500 × 1250 mm, 10 plăci', randuri: [
    ['Placa 3', 'O3', '1999 × 1250'],
    ['Placa 4', 'O4', '1999 × 749'],
    ['Plăcile 5–8', 'OP', 'rândul de jos: 1949 × 1250 (spate, față) și 1925 × 1250 (laterale)'],
    ['Plăcile 9–12', 'OP', 'rândul de sus: 1949 × 1063 (spate, față) și 1925 × 1063 (laterale)']] },
  { titlu: 'Fibrociment 10 mm, 2500 × 1250 mm, 1 placă', randuri: [
    ['Placa 13', 'FP', 'fâșii de 100 mm: 3 × 1649, plus 845 și 85']] },
  { titlu: 'Lambriu interior 2500 mm, 10 pachete', randuri: [['89 scânduri', '1649 + rest', 'din 22 de resturi tai 845 mm, din alte 22 tai 85 mm']] },
  { titlu: 'Lambriu exterior 4000 mm, 7 pachete', randuri: [
    ['41 scânduri', '2000 + 2000', 'pe laterale le scurtezi la 1975'],
    ['8 scânduri', '1020 × 3 + 260 × 3', 'rândurile din dreptul ușii'],
    ['2 scânduri', 'rândul de sus', '2000 + 2000 și 1975 + 1975, tăiate pe lungime la aprox. 40 mm'],
    ['12 scânduri', 'LS + LS', '1995 + 1995 (iese una în plus)'],
    ['4 scânduri', 'BS', '2024 × 2 și 1999 × 2, tăiate pe lungime la 40 mm']] }
];

export const INTRO_TAIERE = 'Fiecare rând arată din ce bucată cumpărată tai ce piese. Codurile sunt aceleași ca în pașii de montaj și pe modelul 3D.';
export const NOTA_TAIERE = 'Fixează un opritor pe masa fierăstrăului și taie toate piesele de același cod deodată, ca să iasă identice. Scrie codul cu creionul pe fiecare piesă. Riglele de 50 × 100 sunt nerindeluite: măsoară-le înainte, pentru că pot avea câțiva milimetri în plus sau în minus.';
