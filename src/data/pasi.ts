// Pașii de montaj. Textele vin din fișierul original sauna-3d.html.
// Corecturi aprobate: golul ușii, ultima șipcă S3, poziția băncii de jos.
// Modificări aprobate (oct. 2026): podea din placaj filmat cu fibrociment, hidroizolație, gresie și sifon;
// lambriu deasupra plăcii de sus; grătar de lemn; relee smart Shelly pentru sobă și lampă.
// Modificări aprobate (21 oct. 2026), după pozele trimise: OSB 12 pe exteriorul pereților, distanțieri în pereți și tavan,
// pereți cu 35 mm mai înalți (montanți 1995), prag la ușă, șapă de pantă în loc de fibrociment pe jos.
export interface Pas {
  faza: string;
  titlu: string;
  text: string[];
  piese?: [string, number][];
  prinderi?: string[];
  nota?: string;
  avertisment?: boolean;
}

export const PASI: Pas[] = [
  { faza: 'Baza', titlu: 'Așezi suporții', text: [
    'Pe pavele marchezi cu sfoară un pătrat de 1925 × 1925 mm și verifici că diagonalele sunt egale, de 2722 mm.',
    'Pui 12 suporți pe patru coloane, câte una sub fiecare grindă de podea, la 25, 640, 1250 și 1900 mm de latura din stânga. Rândurile sunt la 160, 960 și 1760 mm de latura din spate. Îi reglezi pe toți la același nivel, cu nivela laser sau cu o riglă lungă și o nivelă.'],
    piese: [['SR', 12]] },
  { faza: 'Baza', titlu: 'Membrana sub lemn', text: ['Pe fiecare suport pui un pătrat de membrană bitumată de 110 × 110 mm. Astfel lemnul nu atinge direct suportul și nu stă în apă.'], piese: [['MB', 12]] },
  { faza: 'Podea', titlu: 'Cadrul exterior al podelei', text: [
    'Dai cu impregnant pe toate piesele podelei și le lași o zi la uscat.',
    'Așezi pe cant (cu latura de 100 mm în sus) cele două grinzi P1, în față și în spate, iar între ele, la capete, câte o grindă P2. Prinzi fiecare colț cu două șuruburi 5 × 100 mm trecute prin P1 în capătul lui P2. Dai întâi o gaură de ghidaj de 3 mm, la 2 cm de capăt, ca lemnul să nu crape.'],
    piese: [['P1', 2], ['P2', 2]], prinderi: ['8 șuruburi 5 × 100 mm'] },
  { faza: 'Podea', titlu: 'Grinzile din mijloc', text: [
    'Pe fiecare P1 măsori din stânga 612 mm și 1225 mm: acolo vine fața din stânga a celor două grinzi P2 rămase. Le prinzi la fel, cu câte două șuruburi la fiecare capăt.',
    'Măsori din nou diagonalele: amândouă trebuie să aibă 2722 mm. Dacă diferă, împingi de colțuri până se egalează.'],
    piese: [['P2', 2]], prinderi: ['8 șuruburi 5 × 100 mm'] },
  { faza: 'Podea', titlu: 'Țeava de scurgere', text: [
    'Sifonul vine în fața băncii de jos, la 980 mm de marginea din stânga și 1550 mm de marginea din spate, între grinzile a doua și a treia.',
    'De acolo duci țeava TS de Ø 50 mm printre grinzi, spre față, cu pantă de cel puțin 2 % (2 cm pe metru). Dai o gaură de 55 mm prin mijlocul grinzii P1 din față și scoți țeava afară, apoi o duci până la o rigolă sau într-un puț cu pietriș, departe de suporți.'],
    piese: [['TS', 1]], prinderi: ['un cot de 45° Ø 50 mm', 'coliere pentru țeavă'],
    nota: 'Capătul dinspre sifon îl astupi cu bandă până montezi sifonul, ca să nu intre nimic în țeavă.' },
  { faza: 'Podea', titlu: 'Vata din podea', text: [
    'Pe fețele interioare ale grinzilor bați resturi de șipcă la 5 mm de muchia de jos, ca să țină vata.',
    'Tai vata cu 1 cm mai lată decât golul (aprox. 570 și 610 mm) și o așezi în cele trei goluri, strânsă, fără spații.'],
    piese: [['V', 1]], prinderi: ['resturi de șipcă și cuie de 40 mm'] },
  { faza: 'Podea', titlu: 'Placa podelei', text: [
    'Așezi placa O1 în stânga și O2 în dreapta, cu latura lungă pe direcția față-spate. Îmbinarea lor cade pe mijlocul grinzii a treia.',
    'Înșurubezi la 15 cm pe fiecare grindă, cu șuruburi 4 × 50 mm, la 1 cm de marginea plăcii.',
    'În dreptul sifonului tai în placă o gaură cât corpul sifonului, cu ferăstrăul pendular.'],
    piese: [['O1', 1], ['O2', 1]], prinderi: ['aprox. 80 șuruburi 4 × 50 mm'],
    nota: 'Placajul filmat e mai rigid decât OSB-ul și nu se umflă dacă se udă. Peste el, în interior, vine pardoseala cu gresie, după ce pui folia.' },
  { faza: 'Pereți', titlu: 'Peretele din spate', text: [
    'Pe podea asamblezi culcat: talpa de jos T1, talpa de sus T1 și 4 montanți M. Pe ambele tălpi trasezi fața din stânga a montanților la 0, 630, 1260 și 1875 mm.',
    'Fiecare capăt de montant se prinde cu două șuruburi 5 × 100 mm trecute prin talpă. Ridici peretele pe muchia din spate a podelei și prinzi talpa de jos în podea cu șuruburi 6 × 120 mm, la 40 cm unul de altul.',
    'Între montanți pui distanțierii NP, culcați, cu fața de jos la 1107 mm de placaj. Fiecare capăt se prinde prin montant cu un șurub 5 × 100 mm. Pe ei cade mai târziu îmbinarea plăcilor de OSB.'],
    piese: [['T1', 2], ['M', 4], ['NP', 3]], prinderi: ['16 șuruburi 5 × 100 mm', '5 șuruburi 6 × 120 mm', '6 șuruburi 5 × 100 mm pentru distanțieri'],
    nota: 'Cere ajutorul cuiva la ridicat și sprijină peretele provizoriu cu o riglă înclinată până montezi peretele lateral.' },
  { faza: 'Pereți', titlu: 'Peretele din stânga', text: [
    'Tălpile T3 și 4 montanți, cu fețele trasate la 0, 630, 1260 și 1675 mm de capătul dinspre spate.',
    'Îl ridici lipit de peretele din spate, prinzi talpa de jos în podea și montantul de capăt de montantul de colț al peretelui din spate, cu 3 șuruburi 5 × 100 mm.',
    'Pui și aici cei 3 distanțieri NP, la aceeași înălțime ca pe peretele din spate.'],
    piese: [['T3', 2], ['M', 4], ['NP', 3]], prinderi: ['16 șuruburi 5 × 100 mm', '4 șuruburi 6 × 120 mm', '3 șuruburi 5 × 100 mm la colț', '6 șuruburi 5 × 100 mm pentru distanțieri'] },
  { faza: 'Pereți', titlu: 'Peretele din dreapta', text: ['La fel ca peretele din stânga, în oglindă: tălpile T3 și 4 montanți la 0, 630, 1260 și 1675 mm de la spate, cu cei 3 distanțieri NP.'],
    piese: [['T3', 2], ['M', 4], ['NP', 3]], prinderi: ['16 șuruburi 5 × 100 mm', '4 șuruburi 6 × 120 mm', '3 șuruburi 5 × 100 mm la colț', '6 șuruburi 5 × 100 mm pentru distanțieri'] },
  { faza: 'Pereți', titlu: 'Peretele din față și golul ușii', text: [
    'Talpa de sus T1, talpa de jos din două bucăți (T2a și T2b) și 5 montanți, cu fețele trasate la 0, 462, 932, 1702 și 1875 mm. Între montanții 3 și 4 rămâne golul ușii, de 720 mm.',
    'Sus, între montanții 3 și 4, pui buiandrugul B pe cant, lipit de talpa de sus, și îl prinzi prin montanți cu câte două șuruburi. Jos, în gol, pui pragul PR de 35 mm, prins în placaj. Golul trebuie să iasă 720 × 1910 mm, măsurat de la prag. La final verifici diagonalele fiecărui perete și verticalitatea colțurilor.',
    'Distanțierii NP vin și aici, la aceeași înălțime, doar în afara golului ușii.'],
    piese: [['T1', 1], ['T2a', 1], ['T2b', 1], ['M', 5], ['B', 1], ['PR', 1], ['NP', 3]], prinderi: ['24 șuruburi 5 × 100 mm', '4 șuruburi 6 × 120 mm', '6 șuruburi 5 × 100 mm la colțuri', '6 șuruburi 5 × 100 mm pentru distanțieri', '3 șuruburi 5 × 80 mm pentru prag'],
    nota: 'Golul e calculat pentru o ușă cu tocul de 700 × 1900 mm. Cumpără ușa înainte de acest pas și măsoară tocul: golul = tocul plus 2 cm pe lățime și plus 1 cm pe înălțime.', avertisment: true },
  { faza: 'Tavan', titlu: 'Grinzile tavanului', text: [
    'Cele 4 grinzi G se pun pe cant peste tălpile de sus, pe direcția stânga-dreapta. Fața din spate a fiecărei grinzi vine la 0, 592, 1200 și 1875 mm de marginea din spate.',
    'Fiecare capăt se prinde cu două șuruburi 6 × 120 mm înclinate în talpă sau cu un colțar metalic.',
    'Între grinzi pui distanțierii NT pe două rânduri, la 650 și 1350 mm de marginea din stânga. Îi prinzi prin grinzi cu câte un șurub 5 × 100 mm la fiecare capăt, ca grinzile să nu se răsucească.'],
    piese: [['G', 4], ['NT', 6]], prinderi: ['16 șuruburi 6 × 120 mm sau 8 colțare', '12 șuruburi 5 × 100 mm pentru distanțieri'] },
  { faza: 'Pereți', titlu: 'Placarea pereților cu OSB', text: [
    'Pe exteriorul pereților înșurubezi plăcile de OSB 12 mm OP, culcate, cu latura lungă pe orizontală. Rândul de jos pornește de la marginea de jos a podelei și are 1250 mm, iar îmbinarea cu rândul de sus cade pe mijlocul distanțierilor NP. Rândul de sus are aprox. 1063 mm și urcă până pe grinzile tavanului.',
    'Pe spate și pe față plăcile au 1949 mm și acoperă și capetele pereților laterali; pe laterale au 1925 mm. Le prinzi în montanți, tălpi și distanțieri cu șuruburi 4 × 40 mm, la 15 cm pe margini și la 30 cm în rest. Golul ușii îl tai după ce ai prins placa.'],
    piese: [['OP', 8]], prinderi: ['aprox. 300 șuruburi 4 × 40 mm'],
    nota: 'Plăcile de OSB țin pereții în echer și fac toată structura rigidă. Lasă 2–3 mm între plăci, ca să aibă loc să lucreze lemnul.' },
  { faza: 'Exterior', titlu: 'Membrana de difuzie', text: [
    'Capsezi membrana pe exteriorul pereților, de jos în sus, cu fâșiile suprapuse 10 cm. Ea coboară până la marginea de jos a podelei și urcă până sus, peste grinzile tavanului.',
    'În dreptul ușii o tai în X și îi întorci colțurile pe montanți.'],
    piese: [['MD', 1]], prinderi: ['capse de 10 mm'] },
  { faza: 'Exterior', titlu: 'Șipcile exterioare', text: ['Bați 17 șipci S1 verticale, câte una peste fiecare montant, de la marginea de jos a podelei până sus. Le prinzi cu șuruburi 4 × 60 mm la 50 cm. Spațiul de 24 mm din spatele lor aerisește peretele.'],
    piese: [['S1', 17]], prinderi: ['aprox. 90 șuruburi 4 × 60 mm'] },
  { faza: 'Exterior', titlu: 'Lambriul exterior', text: [
    'Pornești de jos, cu lamba în sus, ca apa să nu intre în îmbinare, și urci rând cu rând. Pe spate și pe față bucățile au 2000 mm, pe laterale 1975 mm, iar în dreptul ușii 1020 mm în stânga și 260 mm în dreapta.',
    'Prinzi fiecare scândură cu clame pe fiecare șipcă. Pe colțuri bați șipcile de colț tip L: ele acoperă și cei 12 mm rămași liberi la capătul scândurilor. La final dai două straturi de lazură.'],
    piese: [['LE', 1], ['CL', 8]], prinderi: ['clame pentru lambriu 12,5 mm și cuie mici', 'cuie inox pentru șipcile de colț'] },
  { faza: 'Exterior', titlu: 'Placa de deasupra', text: ['Peste grinzile tavanului înșurubezi O3 în spate și O4 în față. Îmbinarea lor cade pe grinda a treia. Folosești șuruburi 4 × 40 mm, la 20 cm unul de altul.'],
    piese: [['O3', 1], ['O4', 1]], prinderi: ['aprox. 50 șuruburi 4 × 40 mm'] },
  { faza: 'Exterior', titlu: 'Lambriul de deasupra', text: [
    'Peste placa de sus bați 4 șipci S4 pe direcția stânga-dreapta, exact deasupra grinzilor tavanului. Le prinzi cu șuruburi 4 × 60 mm prin OSB în grinzi, la 40 cm.',
    'Pe șipci pui 23 de scânduri LS de 1995 mm pe direcția față-spate, prinse cu câte o clamă pe fiecare șipcă. Ultima scândură o tai pe lățime.',
    'Pe margini bați bordura BS: 4 fâșii de lambriu de 40 mm, tăiate pe lungime (2024 mm pe față și spate, 1999 mm pe laterale), care acoperă capetele șipcilor și ale scândurilor. La final dai două straturi de lazură, ca la pereți.'],
    piese: [['S4', 4], ['LS', 23], ['BS', 4]], prinderi: ['aprox. 40 șuruburi 4 × 60 mm', 'aprox. 92 clame', 'cuie inox mici pentru bordură'] },
  { faza: 'Instalații', titlu: 'Cabluri și găuri de aerisire', text: [
    'Electricianul trage cablul sobei prin peretele din stânga, până în spatele locului sobei, și cablul lămpii până pe peretele din dreapta. Montanții se găuresc pe mijloc.',
    'Tai cele două goluri de aerisire: intrarea aerului jos pe peretele din stânga, lângă sobă, și evacuarea pe peretele din dreapta, sub banca de sus. Pozițiile exacte le verifici în manualul sobei.'],
    piese: [['CB', 1], ['GA', 2]],
    nota: 'Manualul Harvia Vega interzice cablul cu izolație din PVC. Cablurile aflate în pereții saunei la mai mult de 1 m de podea trebuie să reziste la cel puțin 170 °C. Conectarea o face un electrician autorizat.', avertisment: true },
  { faza: 'Izolație', titlu: 'Vata din pereți', text: ['Tai vata cu 1 cm mai lată decât golul dintre montanți și o împingi strâns, de jos în sus, fără spații la colțuri și în jurul cablurilor.'],
    piese: [['V', 4]], prinderi: ['mănuși, mască, ochelari'] },
  { faza: 'Izolație', titlu: 'Vata din tavan', text: ['De jos, împingi vata între grinzile tavanului, sprijinită pe placa de deasupra. O ții pe loc cu sfoară capsată în zigzag pe grinzi până pui folia.'],
    piese: [['V', 1]], prinderi: ['sfoară și capse'] },
  { faza: 'Izolație', titlu: 'Folia de aluminiu', text: [
    'Pui întâi folia pe tavan și o lași să coboare 10 cm pe pereți, apoi pe pereți, de sus în jos. Partea lucioasă stă spre interior, iar fâșiile se suprapun 10 cm.',
    'Toate îmbinările și găurile pentru cabluri le lipești cu bandă de aluminiu. Folia trebuie să fie continuă, fără nicio gaură.'],
    piese: [['FA', 1]], prinderi: ['capse de 8 mm', 'bandă de aluminiu'],
    nota: 'Folia trebuie să fie de aluminiu adevărat, pentru saună. Foliile de construcții aluminizate rezistă de obicei doar până la 80 °C.', avertisment: true },
  { faza: 'Podea', titlu: 'Șapa de pantă', text: [
    'Montezi sifonul SF în gaura din placaj, îl legi la țeava de scurgere și îi reglezi înălțimea: rama lui trebuie să iasă cu 15 mm peste placaj.',
    'Pe placaj întinzi folia FL, întoarsă 10 cm pe pereți și lipită cu bandă în jurul sifonului. De-a lungul pereților bați ghidajele GH: rigle de 24 mm, puse culcat, din resturi de șipcă.',
    'Prepari șapa SP și o tragi cu un dreptar de pe ghidaje spre rama sifonului, ca să iasă 25 mm la pereți și 15 mm la sifon. Apa curge așa singură spre sifon. După ce se întărește puțin, scoți ghidajele și umpli locul lor cu șapă.'],
    piese: [['SF', 1], ['FL', 1], ['GH', 4], ['SP', 5]], prinderi: ['găleată, mixer de șapă, dreptar de 1 m, nivelă', 'bandă adezivă pentru folie'],
    nota: 'Lași șapa să se usuce cât scrie pe sac înainte de hidroizolație. Cu hidroizolația, adezivul și gresia, podeaua finită iese cu aprox. 40 mm peste placaj; de aici înainte, cotele „de la podea” se măsoară de la gresie.' },
  { faza: 'Podea', titlu: 'Hidroizolația și gresia', text: [
    'Pe pereți, peste folie, înșurubezi în montanți fâșiile de fibrociment FP, lipite de șapă, ca hidroizolația să urce 10 cm pe perete. Peste capetele șuruburilor și peste îmbinări lipești bandă.',
    'Dai hidroizolația HI în două straturi, în cruce, pe toată șapa și pe fâșii. În colțuri, la îmbinarea cu peretele și în jurul sifonului lipești banda de etanșare în primul strat.',
    'După 24 de ore lipești gresia GS cu adeziv flexibil, pe panta șapei, și umpli rosturile cu chit flexibil.'],
    piese: [['FP', 5], ['HI', 1], ['GS', 1]],
    prinderi: ['șuruburi pentru fibrociment 4,2 × 35 mm', 'bandă de etanșare Ceresit CL 152', 'adeziv flexibil C2TE S1 (Ceresit CM 17)', 'chit de rosturi flexibil'],
    nota: 'Înainte de gresie faci o probă: torni o găleată de apă pe hidroizolație și verifici că se scurge toată în sifon, fără bălți. Acoperă apoi gresia cu carton cât lucrezi mai departe.' },
  { faza: 'Interior', titlu: 'Șipcile tavanului', text: ['5 șipci S3 pe direcția față-spate, la 5, 375, 745, 1115 și 1600 mm de fața interioară a peretelui din stânga. Le înșurubezi prin folie în grinzile tavanului, cu șuruburi 4 × 60 mm.'],
    piese: [['S3', 5]], prinderi: ['20 șuruburi 4 × 60 mm'] },
  { faza: 'Interior', titlu: 'Lambriul tavanului', text: ['19 scânduri de 1649 mm pe direcția stânga-dreapta. Începi de la peretele din spate și prinzi fiecare scândură cu câte o clamă pe fiecare șipcă.'],
    piese: [['LI', 19]], prinderi: ['aprox. 95 clame'] },
  { faza: 'Interior', titlu: 'Șipcile pereților', text: ['17 șipci S2 verticale peste montanți, prin folie, de la podea până la lambriul tavanului. Le prinzi cu șuruburi 4 × 60 mm la 50 cm. Ele lasă un strat de aer între folie și lambriu.'],
    piese: [['S2', 17]], prinderi: ['aprox. 85 șuruburi 4 × 60 mm'] },
  { faza: 'Interior', titlu: 'Lambriul pereților', text: ['Pe peretele din spate și pe cele laterale pui câte 23 de rânduri de 1649 mm, de jos în sus, cu lamba în sus. Primul rând îl lași la 5 mm de gresie, iar ultimul îl tai pe lățime.'],
    piese: [['LI', 69]], prinderi: ['aprox. 280 clame'] },
  { faza: 'Interior', titlu: 'Lambriul peretelui din față', text: ['În dreptul ușii fiecare rând are o bucată de 845 mm în stânga și una de 85 mm în dreapta, tăiate din resturile scândurilor de 2,5 m. Peste ușă pui un rând întreg de 1649 mm.'],
    piese: [['LI', 45]], prinderi: ['aprox. 120 clame'] },
  { faza: 'Bănci', titlu: 'Cadrul băncii de sus', text: [
    'Rigla L1 din spate se prinde pe perete cu fața de sus la 972 mm de podea, cu șuruburi 5 × 100 mm în fiecare montant. A doua L1 vine în față, la 600 mm de perete.',
    'Între ele pui cele 3 traverse L2: una la fiecare capăt și una la mijloc. Sub L1 din față pui 3 picioare L3 și le prinzi cu șuruburi 5 × 80 mm.'],
    piese: [['L1', 2], ['L2', 3], ['L3', 3]], prinderi: ['4 șuruburi 5 × 100 mm', 'aprox. 20 șuruburi 5 × 80 mm'] },
  { faza: 'Bănci', titlu: 'Șipcile băncii de sus', text: ['Cele 6 șipci Ș1 stau la 10 mm una de alta, cu prima la 10 mm de perete; ca distanțier folosești un rest de 10 mm. Le prinzi de dedesubt, prin traverse, cu șuruburi inox 4 × 70 mm, ca șuruburile să nu se vadă și să nu atingă pielea.'],
    piese: [['Ș1', 6]], prinderi: ['36 șuruburi inox 4 × 70 mm'] },
  { faza: 'Bănci', titlu: 'Banca de jos', text: [
    'Riglele L4 se prind în spate de picioarele băncii de sus și în față pe 2 picioare L6, cu fața de sus la 472 mm de podea. Între ele pui traversele L5.',
    'Deasupra vin cele 4 șipci Ș2, prinse la fel, de dedesubt. Banca de jos începe la aprox. 625 mm de lambriul peretelui din stânga (800 mm de la marginea exterioară), ca să rămână loc liber în fața sobei.'],
    piese: [['L4', 2], ['L5', 2], ['L6', 2], ['Ș2', 4]], prinderi: ['aprox. 16 șuruburi 5 × 80 mm', '16 șuruburi inox 4 × 70 mm'] },
  { faza: 'Bănci', titlu: 'Spătarul', text: ['Cele două șipci Ș3 se prind pe peretele din spate, la 250 mm și la 420 mm deasupra băncii de sus, cu șuruburi inox în montanți. Capetele șuruburilor le îngropi 3 mm în lemn.'],
    piese: [['Ș3', 2]], prinderi: ['8 șuruburi inox 4 × 70 mm'] },
  { faza: 'Final', titlu: 'Ușa', text: [
    'Așezi tocul ușii în gol, pe prag, îl reglezi cu pene până e perfect vertical și îl prinzi prin toc în montanți, cum scrie în instrucțiunile ușii. Ușa se deschide spre exterior.',
    'Golul dintre toc și perete îl acoperi pe ambele fețe cu șipci de lemn.'],
    piese: [['U', 1]], prinderi: ['șuruburile din pachetul ușii', 'pene de lemn'] },
  { faza: 'Final', titlu: 'Soba', text: [
    'Prinzi suportul sobei pe peretele din stânga, în dreptul montanților, la înălțimea și la distanțele din manual. Agăți soba pe suport.',
    'Speli pietrele și le așezi rar în sobă, ca aerul să circule printre ele. Soba ia cel mult 20 kg de pietre.'],
    piese: [['SB', 1], ['PT', 1]], prinderi: ['șuruburile din pachetul sobei'] },
  { faza: 'Final', titlu: 'Parapetul sobei', text: ['Cei doi stâlpi Ș6 se prind în podea și în bara de jos, la 75 mm în fața sobei. Între ei pui două bare Ș4, iar de la stâlpi la perete două bare laterale Ș5. Distanța minimă față de sobă o verifici în manual.'],
    piese: [['Ș6', 2], ['Ș4', 2], ['Ș5', 2]], prinderi: ['12 șuruburi inox 4 × 50 mm', '2 colțare mici pentru podea'] },
  { faza: 'Final', titlu: 'Grătarul de lemn', text: [
    'Din plop faci două panouri GT de 590 × 600 mm: pe 2 rigle de 600 mm prinzi 6 șipci de 590 mm, la 12 mm una de alta, cu șuruburi inox 4 × 50 mm trecute de dedesubt.',
    'Le așezi pe gresie, între parapet și peretele din dreapta, peste sifon. Nu le prinzi: le scoți când speli sauna și le lași să se usuce afară.'],
    piese: [['GT', 2]], prinderi: ['24 șuruburi inox 4 × 50 mm'] },
  { faza: 'Final', titlu: 'Grilele, lampa și conectarea', text: ['Montezi grilele de lemn peste cele două goluri de aerisire și lampa pe peretele din dreapta, deasupra băncii. Electricianul conectează soba și lampa la circuitul separat.',
    'Pentru pornit și oprit din telefon, electricianul pune în tablou releul Shelly Pro 1 (SH), care comandă un contactor de 40 A pe circuitul sobei. Pentru lampă pune un Shelly 1 Gen3 (SL) în doza întrerupătorului, afară. Butonul de timp al sobei îl lași pornit, iar cum se leagă exact verifică electricianul în manualul Harvia.'],
    piese: [['GR', 2], ['LP', 1], ['SH', 1], ['SL', 1]],
    nota: 'Conectarea sobei și a lămpii o face un electrician autorizat, pe un circuit separat. Releele și contactorul nu se montează în saună, pentru că nu rezistă la căldură.', avertisment: true },
  { faza: 'Final', titlu: 'Prima încălzire', text: ['Încălzești sauna o oră goală, cu ușa întredeschisă, ca să dispară mirosul de nou al sobei și al lemnului. Apoi o aerisești și e gata de folosit.'] }
];

export const TITLU = 'Saună 2 × 2 m sub foișor';
export const SUBTITLU = 'Interior 1,65 × 1,65 m, înălțime aprox. 2,02 m de la gresie. Exterior 2,02 × 2,02 m, înălțime aprox. 2,39 m. Sobă Harvia Vega BC60.';
