// Lista de cumpărături, pe magazine. Prețurile sunt cele găsite pe site-uri în octombrie 2026.
// Corectură aprobată: clemele de lambriu sunt 10 pungi (în original 8).
// Modificări aprobate (oct. 2026): podea din placaj filmat + gresie și sifon, lambriu deasupra, relee Shelly.
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
    p('Placaj filmat (cofraj), interior / exterior, 18 × 2500 × 1250 mm', '2 buc.', '314,00 lei/buc.', 'https://www.dedeman.ro/ro/placaj-cofraj-interior/-exterior-maro-18-x-2500-x-1250-mm/p/6071101', 'cod 6071101, podeaua; nu se umflă la apă ca OSB-ul'),
    p('OSB 3, 12 × 2500 × 1250 mm', '2 buc.', '79,35 lei/buc.', 'https://www.dedeman.ro/ro/osb-3-18-x-2500-x-1250-mm/p/4007527', 'alegi grosimea 12 pe aceeași pagină, placa de sus'),
    p('Placă fibrociment A1, 10 × 1250 × 2500 mm', '2 buc.', '225,00 lei/buc.', 'https://www.dedeman.ro/ro/placa-fibrociment-a1-10-x-1250-x-2500-mm/p/6050041', 'cod 6050041, sub gresie'),
    p('Hidroizolație flexibilă Ceresit CR 166, 32 kg', '1 set', '482,00 lei', 'https://www.dedeman.ro/ro/hidroizolatie-flexibila-ceresit-cr-166-32-kg/p/5006178', 'cod 5006178, două straturi pe podea și pe fâșiile de pe perete'),
    p('Gresie portelanată antiderapantă Veranda Bone, 30 × 60 cm', 'aprox. 3 m²', 'preț pe site', 'https://www.dedeman.ro/ro/gresie-exterior/-interior-portelanata-veranda-bone-30-x-60-cm-crem-mata-antiderapanta-imitatie-lemn/p/4020912', 'cod 4020912; poți alege orice gresie portelanată antiderapantă'),
    p('Adeziv flexibil Ceresit CM 17, 25 kg', '1 sac', '104,99 lei', 'https://www.dedeman.ro/ro/adeziv-super-flexibil-pentru-gresie-si-faianta-ceresit-cm-17-interior/-exterior-gri-25-kg/p/4000332', 'cod 4000332, pentru fibrociment și gresie'),
    p('Sifon pardoseală Alca APV26C, grătar inox 105 × 105, ieșire laterală Ø 50', '1 buc.', '104,00 lei', 'https://www.dedeman.ro/ro/sifon-pardoseala-polipropilena-gratar-inox-alca-apv26c-105-x-105-mm-iesire-laterala-d-50-mm-reglabil/p/2034706', 'cod 2034706, reglabil pe înălțime'),
    p('Țeavă PP Ø 50 mm și un cot de 45°', 'cât e nevoie până la rigolă', 'neverificat', '', 'raionul de instalații sanitare'),
    p('Vată bazaltică Baudeman SW38, 100 mm, 3,6 m²/pachet', '6 pachete', '132,99 lei/pachet', 'https://www.dedeman.ro/ro/vata-minerala-bazaltica-baudeman-sw38-1000-x-600-x-100-mm/p/6061835', 'cod 6061835'),
    p('Lambriu interior 2500 × 96 × 12,5 mm, 10 buc./pachet', '10 pachete', '103,00 lei/pachet', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-interior-2500-x-96-x-12-5-mm/p/4026439', 'cod 4026439, interiorul'),
    p('Lambriu ZC 4000 × 96 × 12,5 mm, 10 buc./pachet', '7 pachete', '168,60 lei/pachet', 'https://www.dedeman.ro/ro/lambriu-lemn-rasinoase-zc-interior-4000-x-96-x-12-5-mm/p/4026441', 'cod 4026441, exteriorul și deasupra, cu lazură (sub foișor)'),
    p('Riglă molid 24 × 48 × 4000 mm', '5 buc.', '12,46 lei/buc.', 'https://www.dedeman.ro/ro/rigla-nerindeluita-lemn-molid-a/b-4000-x-48-x-24-mm-zg/p/6068501', 'cod 6068501, șipcile tavanului și cele de deasupra'),
    p('Folie difuzie Baudeman Air 110, rolă de 30 m²', '1 rolă', 'preț pe site', 'https://www.dedeman.ro/ro/folie-anticondens-baudeman-air-110-g/mp-3-straturi-1-5-x-50-m-75-mp/p/6033802', 'cod 6033802, alegi varianta de 30 m²'),
    p('Cleme lambriu 12,5 mm, 100 buc.', '10 pungi', 'preț pe site', 'https://www.dedeman.ro/ro/cleme-lambriu-12-5-mm-100-buc/p/4010586', 'cod 4010586; aprox. 500 la interior și 440 la exterior'),
    p('Șipcă de colț tip L, 40 × 40 mm, 2 m', '8 buc.', 'preț pe site', 'https://www.dedeman.ro/ro/sipci-lemn-accesorii-lambriu/c/3371', 'colțurile exterioare')] },
  { nume: 'Leroy Merlin Suceava', descriere: 'Prețurile sunt de pe site; disponibilitatea pe magazin se vede tot acolo.', produse: [
    p('Riglă nerindeluită 24 × 48 × 3000 mm', '34 buc.', '9,98 lei/buc.', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html', 'șipcile pereților, interior și exterior'),
    p('Riglă nerindeluită 48 × 48 × 4000 mm', '3 buc.', '29,90 lei/buc.', 'https://www.leroymerlin.ro/produse/materiale-constructii/lemn-constructii-si-cherestea/grinzi-lemn/sipca-lemn-p.html', 'cadrul băncilor')] },
  { nume: 'Comenzi online', descriere: 'Nu se găsesc în magazinele de bricolaj din Suceava.', produse: [
    p('Sobă Harvia Vega BC60, 6 kW, cu comandă integrată', '1 buc.', 'aprox. 1.699–1.759 lei', 'https://depozituldesaune.ro/p/incalzitor-sauna-harvia-vega-bc60-inox-6kw-comanda-incorporata/', 'pentru saune de 5–8 m³, înălțime minimă 190 cm'),
    p('Ușă de saună 70 × 190 cm, pin, sticlă bronz', '1 buc.', 'de la 648 lei', 'https://saunabee.ro/usi-sauna', 'alternativă cu sticlă de 8 mm: Andres, aprox. 1.024 lei, depozit-piscine.ro'),
    p('Lemn pentru bănci și grătar, plop tremurător 28 × 90 × 2700 mm', '12 buc.', '59,90 lei/buc.', 'https://depozituldesaune.ro/cp/materiale-saune/lemn-constructie-sauna/', 'fără noduri, nu face rășină'),
    p('Folie de aluminiu Harvia pentru saună, 30 m²', '1 rolă', 'preț la magazin', 'https://nordicsauna.ro/product/folie-de-aluminiu/', 'aluminiu adevărat; foliile de construcții aluminizate rezistă de obicei doar până la 80 °C'),
    p('Grilă de aerisire Harvia', '2 buc.', 'preț la magazin', 'https://www.piscineservice.ro/30-sauna/53-cabine-sauna-uscata/125-materiale-constructie-sauna/1277-grila-aerisire-sauna-harvia', 'cod SAS24300'),
    p('Pietre pentru saună Harvia, 5–10 cm', '20 kg', 'neverificat', '', 'cumpără-le de la același magazin cu soba'),
    p('Lampă pentru saună, rezistentă la căldură', '1 buc.', 'neverificat', '', 'de la același magazin cu soba'),
    p('Releu smart Shelly Pro 1, pe șină DIN', '1 buc.', 'aprox. 250–280 lei', 'https://www.1smart.ro/relee-wireless-inteligente/1020-releu-smart-shelly-pro-1', 'pornește soba din telefon, prin contactorul de 40 A pus de electrician'),
    p('Releu smart Shelly 1 Gen3, 16 A', '1 buc.', 'aprox. 72 lei', 'https://www.emag.ro/releu-inteligent-shelly-1-gen3-1-canal-16a-wifi-contact-uscat-3800235261767/pd/DSWSZLYBM', 'lampa, în doza întrerupătorului din afara saunei')] },
  { nume: 'Feronerie și consumabile', descriere: 'Le găsești la Dedeman sau Leroy Merlin, la raionul de feronerie. Nu am verificat coduri exacte, orice marcă bună e în regulă.', produse: [
    p('Șuruburi lemn 5 × 100 mm', 'aprox. 200', 'neverificat', '', 'structura'),
    p('Șuruburi lemn 6 × 120 mm', 'aprox. 40', 'neverificat', '', 'tălpi și grinzi de tavan'),
    p('Șuruburi lemn 4 × 50, 4 × 60 și 4 × 40 mm', 'aprox. 80 + 200 + 50', 'neverificat', '', 'OSB și șipci'),
    p('Șuruburi inox 4 × 70 și 4 × 50 mm', 'aprox. 60 + 12', 'neverificat', '', 'bănci și parapet'),
    p('Șuruburi pentru fibrociment 4,2 × 35 mm și bandă de etanșare Ceresit CL 152', 'aprox. 120 + 7 m', 'neverificat', 'https://www.hornbach.ro/p/banda-de-etansare-ceresit-cl152-120-mm-50-m/8564497/', 'linkul e pentru bandă (Hornbach); întreabă de role mai scurte'),
    p('Chit de rosturi flexibil, rezistent la apă', '1 sac de 2–5 kg', 'neverificat', '', 'raionul de gresie'),
    p('Contactor modular 40 A, bobină 230 V', '1 buc.', 'neverificat', '', 'îl alege electricianul după cum leagă soba (230 V sau 400 V)'),
    p('Suporți reglabili de terasă 25–40 mm sau plăcuțe de cauciuc', '12 buc.', 'neverificat', '', 'întreabă la raionul de grădină'),
    p('Membrană bitumată, impregnant pentru lemn, lazură exterior, capse, bandă de aluminiu', 'după nevoie', 'neverificat', '', '')] }
];

export const INTRO_CUMPARATURI = 'Cantitățile sunt calculate pentru kitul din pașii de montaj, cu puțină rezervă. Prețurile sunt cele găsite pe site-uri în octombrie 2026 și se pot schimba.';
export const NOTA_CUMPARATURI = 'Produsele cu preț verificat costă împreună aprox. 8.800 lei. Pe lângă ele mai vin cheresteaua de 50 × 100, folia, clamele, gresia, feroneria, pietrele, lampa, contactorul și lucrarea electricianului.';
