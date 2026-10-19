// Lista de tăiere: din ce bucată cumpărată tai ce piese.
export interface GrupTaiere {
  titlu: string;
  randuri: [bucata: string, tai: string, lungimi: string][];
}

export const TAIERE: GrupTaiere[] = [
  { titlu: 'Riglă 50 × 100 × 4000 mm, 18 bucăți plus 1 de rezervă', randuri: [
    ['R1–R8', 'M + M', '1960 + 1960, rest 74'],
    ['R9', 'M + rezervă', '1960, rest 2037'],
    ['R10', 'P1 + P1', '1925 + 1925'],
    ['R11', 'T1 + T1', '1925 + 1925'],
    ['R12', 'T1 + G', '1925 + 1925'],
    ['R13', 'G + G', '1925 + 1925'],
    ['R14', 'G + T2a + B + T2b', '1925 + 982 + 720 + 222'],
    ['R15–R18', 'T3 + P2', '1725 + 1825']] },
  { titlu: 'Riglă 24 × 48 × 3000 mm, 34 bucăți', randuri: [['17 buc.', 'S1', '2276, rest 720'], ['17 buc.', 'S2', '2022, rest 975']] },
  { titlu: 'Riglă 24 × 48 × 4000 mm, 3 bucăți', randuri: [['3 buc.', 'S3 + S3', '1649 + 1649 (iese una în plus)']] },
  { titlu: 'Riglă 48 × 48 × 4000 mm, 3 bucăți', randuri: [
    ['LA', 'L1 + L1 + L2', '1649 + 1649 + 504'],
    ['LB', 'L3 + L3 + L3 + L4', '924 × 3 + 1025'],
    ['LC', 'L4 + L2 + L2 + L5 + L5 + L6 + L6', '1025 + 504 × 2 + 304 × 2 + 424 × 2']] },
  { titlu: 'Plop 28 × 90 × 2700 mm, 8 bucăți', randuri: [
    ['PL1–PL4', 'Ș1 + Ș2', '1649 + 1025'],
    ['PL5–PL6', 'Ș1 + Ș4 + Ș5', '1649 + 600 + 380'],
    ['PL7–PL8', 'Ș3 + Ș6', '1649 + 850']] },
  { titlu: 'OSB 2500 × 1250 mm', randuri: [
    ['Placa 1, 18 mm', 'O1', '1925 × 1250'],
    ['Placa 2, 18 mm', 'O2', '1925 × 675'],
    ['Placa 3, 12 mm', 'O3', '1975 × 1250'],
    ['Placa 4, 12 mm', 'O4', '1975 × 725']] },
  { titlu: 'Lambriu interior 2500 mm, 10 pachete', randuri: [['89 scânduri', '1649 + rest', 'din 22 de resturi tai 845 mm, din alte 22 tai 85 mm']] },
  { titlu: 'Lambriu exterior 4000 mm, 6 pachete', randuri: [
    ['41 scânduri', '2000 + 2000', 'pe laterale le scurtezi la 1975'],
    ['8 scânduri', '1020 × 3 + 260 × 3', 'rândurile din dreptul ușii']] }
];

export const INTRO_TAIERE = 'Fiecare rând arată din ce bucată cumpărată tai ce piese. Codurile sunt aceleași ca în pașii de montaj și pe modelul 3D.';
export const NOTA_TAIERE = 'Fixează un opritor pe masa fierăstrăului și taie toate piesele de același cod deodată, ca să iasă identice. Scrie codul cu creionul pe fiecare piesă. Riglele de 50 × 100 sunt nerindeluite: măsoară-le înainte, pentru că pot avea câțiva milimetri în plus sau în minus.';
