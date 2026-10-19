// Lista de cumpărături, pe magazine. Prețurile sunt cele găsite pe site-uri în octombrie 2026.
// Corectură aprobată: clemele de lambriu sunt 10 pungi (în original 8).
export interface Produs {
  nume: string;
  cantitate: string;
  pret: string;          // 'neverificat' se afișează cu altă culoare
  link: string;
  nota: string;
}
export interface Magazin {
  nume: string;
  descriere: string;
  produse: Produs[];
}

const p = (nume: string, cantitate: string, pret: string, link: string, nota: string): Produs => ({ nume, cantitate, pret, link, nota });

export const MAGAZINE: Magazin[] = [
  { nume: 'Dedeman Suceava', descriere: 'Calea Unirii nr. 28. Am verificat că produsele există pe site; stocul din magazin îl vezi alegând Suceava pe pagina produsului.', produse: [
    p('Cherestea nerindeluită molid 50 × 100 × 4000 mm', '19 buc.', 'preț pe site', 'https://www.dedeman.ro/ro/cherestea-nerindeluita-detroit-city-lemn-molid-a/b-4000-x-100-x-50-mm/p/6060472', 'cod 6060472, cadrul întreg'),
    p('OSB 3, 18 × 2500 × 1250 mm', '2 buc.', '119,19 lei/buc.', 'https://www.dedeman.ro/ro/osb-3-18-x-2500-x-1250-mm/p/4007527', 'cod 4007527, podeaua'),
    p('OSB 3, 12 × 2500 × 1250 mm', '2 buc.', '79,35 lei/buc.', 'https://www.dedeman.ro/ro/osb-3-18-x-2500-x-1250-mm/p/4007527', 'alegi grosimea 12 pe aceeași pagină, placa de sus'),
    p('Vată bazaltică Baudeman SW38, 100 mm, 3,6 m²/pachet', '6 pachete', '132,99 lei/pachet', 'https://www.dedeman.ro/ro/vata-minerala-bazaltica-baudeman-sw38-1000-x-600-x-100-mm/p/6061835', 'cod 6061835'),
    p('Lambriu interior 2500 × 96 × 12,5 mm, 10 buc./pachet', '10 pachete', '103,00 lei/pachet', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-interior-2500-x-96-x-12-5-mm/p/4026439', 'cod 4026439, interiorul'),
    p('Lambriu ZC 4000 × 96 × 12,5 mm, 10 buc./pachet', '6 pachete', '168,60 lei/pachet', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-zc-interior-4000-x-96-x-12-5-mm/p/4026441', 'cod 4026441, exteriorul, cu lazură (sub foișor)'),
    p('Riglă molid 24 × 48 × 4000 mm', '3 buc.', '12,46 lei/buc.', 'https://www.dedeman.ro/ro/rigla-nerindeluita-lemn-molid-a/b-4000-x-48-x-24-mm-zg/p/6068501', 'cod 6068501, șipcile tavanului'),
    p('Folie difuzie Baudeman Air 110, rolă de 30 m²', '1 rolă', 'preț pe site', 'https://www.dedeman.ro/ro/folie-anticondens-baudeman-air-110-g/mp-3-straturi-1-5-x-50-m-75-mp/p/6033802', 'cod 6033802, alegi varianta de 30 m²'),
    p('Cleme lambriu 12,5 mm, 100 buc.', '10 pungi', 'preț pe site', 'https://www.dedeman.ro/ro/cleme-lambriu-12-5-mm-100-buc/p/4010586', 'cod 4010586; aprox. 500 la interior și 440 la exterior'),
    p('Șipcă de colț tip L, 40 × 40 mm, 2 m', '8 buc.', 'preț pe site', 'https://www.dedeman.ro/ro/sipci-lemn-accesorii-lambriu/c/3371', 'colțurile exterioare')] },
  { nume: 'Leroy Merlin Suceava', descriere: 'Prețurile sunt de pe site; disponibilitatea pe magazin se vede tot acolo.', produse: [
    p('Riglă nerindeluită 24 × 48 × 3000 mm', '34 buc.', '9,98 lei/buc.', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html', 'șipcile pereților, interior și exterior'),
    p('Riglă nerindeluită 48 × 48 × 4000 mm', '3 buc.', '29,90 lei/buc.', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html', 'cadrul băncilor')] },
  { nume: 'Comenzi online', descriere: 'Nu se găsesc în magazinele de bricolaj din Suceava.', produse: [
    p('Sobă Harvia Vega BC60, 6 kW, cu comandă integrată', '1 buc.', 'aprox. 1.699–1.759 lei', 'https://depozituldesaune.ro/p/incalzitor-sauna-harvia-vega-bc60-inox-6kw-comanda-incorporata/', 'pentru saune de 5–8 m³, înălțime minimă 190 cm'),
    p('Ușă de saună 70 × 190 cm, pin, sticlă bronz', '1 buc.', 'de la 648 lei', 'https://saunabee.ro/usi-sauna', 'alternativă cu sticlă de 8 mm: Andres, aprox. 1.024 lei, depozit-piscine.ro'),
    p('Lemn pentru bănci, plop tremurător 28 × 90 × 2700 mm', '8 buc.', '59,90 lei/buc.', 'https://depozituldesaune.ro/cp/materiale-saune/lemn-constructie-sauna/', 'fără noduri, nu face rășină'),
    p('Folie de aluminiu Harvia pentru saună, 30 m²', '1 rolă', 'preț la magazin', 'https://nordicsauna.ro/product/folie-de-aluminiu/', 'aluminiu adevărat; foliile de construcții aluminizate rezistă de obicei doar până la 80 °C'),
    p('Grilă de aerisire Harvia', '2 buc.', 'preț la magazin', 'https://www.piscineservice.ro/30-sauna/53-cabine-sauna-uscata/125-materiale-constructie-sauna/1277-grila-aerisire-sauna-harvia', 'cod SAS24300'),
    p('Pietre pentru saună Harvia, 5–10 cm', '20 kg', 'neverificat', '', 'cumpără-le de la același magazin cu soba'),
    p('Lampă pentru saună, rezistentă la căldură', '1 buc.', 'neverificat', '', 'de la același magazin cu soba')] },
  { nume: 'Feronerie și consumabile', descriere: 'Le găsești la Dedeman sau Leroy Merlin, la raionul de feronerie. Nu am verificat coduri exacte, orice marcă bună e în regulă.', produse: [
    p('Șuruburi lemn 5 × 100 mm', 'aprox. 200', 'neverificat', '', 'structura'),
    p('Șuruburi lemn 6 × 120 mm', 'aprox. 40', 'neverificat', '', 'tălpi și grinzi de tavan'),
    p('Șuruburi lemn 4 × 50, 4 × 60 și 4 × 40 mm', 'aprox. 80 + 200 + 50', 'neverificat', '', 'OSB și șipci'),
    p('Șuruburi inox 4 × 70 și 4 × 50 mm', 'aprox. 60 + 12', 'neverificat', '', 'bănci și parapet'),
    p('Suporți reglabili de terasă 25–40 mm sau plăcuțe de cauciuc', '12 buc.', 'neverificat', '', 'întreabă la raionul de grădină'),
    p('Membrană bitumată, impregnant pentru lemn, lazură exterior, capse, bandă de aluminiu', 'după nevoie', 'neverificat', '', '')] }
];

export const INTRO_CUMPARATURI = 'Cantitățile sunt calculate pentru kitul din pașii de montaj, cu puțină rezervă. Prețurile sunt cele găsite pe site-uri în octombrie 2026 și se pot schimba.';
export const NOTA_CUMPARATURI = 'Produsele cu preț verificat costă împreună aprox. 6.500 lei. Pe lângă ele mai vin cheresteaua de 50 × 100, folia, clamele, feroneria, pietrele, lampa și lucrarea electricianului.';
