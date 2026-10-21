# Saună 2 × 2 m – kit de montaj 3D

Aplicație web (PWA) cu montajul unei saune de 2 × 2 m sub foișor: 39 de pași animați în 3D, listă de tăiere și listă de cumpărături. Merge offline după prima deschidere și se poate instala pe ecranul principal (pe iPhone: Safari → Partajare → Adaugă pe ecranul principal).

**Link public:** https://paulsmocot.github.io/sauna-kit/

## Ce poți edita

Toate datele stau în `src/data/`, separat de cod:

| Fișier | Conține |
| --- | --- |
| `dimensiuni.ts` | cotele modelului 3D (în metri) |
| `piese.ts` | codurile pieselor, denumire, dimensiune, din ce bucată se taie |
| `pasi.ts` | cei 39 de pași: texte, piese, prinderi, avertismente |
| `taiere.ts` | lista de tăiere |
| `magazine.ts` | lista de cumpărături, cu prețuri și linkuri |

Geometria fiecărui pas e în `src/scene/model.ts`, animațiile și uneltele în `src/scene/viewer.ts` și `src/scene/tools.ts`.

## Rulare locală

```bash
npm install
npm run dev      # server de dezvoltare
npm run build    # versiunea finală în dist/
```

La fiecare `git push` pe `main`, GitHub Actions compilează aplicația și o publică pe GitHub Pages.

## Corecturi față de fișierul original `sauna-3d.html`

- Pasul 10: golul ușii = tocul plus 2 cm pe lățime și plus 1 cm pe înălțime (720 × 1910 pentru toc 700 × 1900).
- Pasul 20: ultima șipcă S3 la 1600 mm (nu 1605).
- Pasul 27: banca de jos începe la aprox. 625 mm de lambriul din stânga (800 mm de la marginea exterioară).
- Cumpărături: 10 pungi de cleme (aprox. 940 necesare).
- Model: lambriul interior de pe spate și față are 1649 mm; 4 șuruburi 6 × 120 pe talpa din față.

## Modificări (octombrie 2026)

- Podeaua: placaj filmat 18 mm în loc de OSB 18 (aceleași dimensiuni). În interior se pun peste el fibrociment 10 mm, hidroizolație Ceresit CR 166 și gresie antiderapantă, cu sifon și țeavă de scurgere. Gresia ridică podeaua cu aprox. 28 mm, așa că șipcile S2 au acum 1994 mm.
- Pași noi: țeava de scurgere, lambriul de deasupra plăcii de sus (S4, LS, BS), pardoseala cu gresie și sifon, grătarul de lemn detașabil (GT).
- Relee smart: Shelly Pro 1 cu contactor de 40 A pentru sobă și Shelly 1 Gen3 pentru lampă.
- Fișa fiecărei piese are linkul către magazinul de unde o cumperi.

## Modificări (21 octombrie 2026), după pozele de referință

- OSB 12 mm pe exteriorul pereților (pas nou). Exteriorul crește la 2024 × 2024 mm; lambriul exterior păstrează lungimile, iar colțurile le acoperă șipcile tip L.
- Distanțieri (noggins) în pereți, la îmbinarea plăcilor OSB, și între grinzile tavanului.
- Pereți cu 35 mm mai înalți (montanți de 1995 mm), ca interiorul să rămână de aprox. 2,02 m de la gresie. Prag de 35 mm la ușă.
- Podeaua: șapă de pantă (Baumit Nivello 50) pe folie, trasă pe ghidaje spre sifon, în loc de plăcile de fibrociment. Fibrocimentul rămâne doar ca fâșii pe pereți, sub hidroizolație.
