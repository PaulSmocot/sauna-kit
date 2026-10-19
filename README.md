# Saună 2 × 2 m – kit de montaj 3D

Aplicație web (PWA) cu montajul unei saune de 2 × 2 m sub foișor: 33 de pași animați în 3D, listă de tăiere și listă de cumpărături. Merge offline după prima deschidere și se poate instala pe ecranul principal (pe iPhone: Safari → Partajare → Adaugă pe ecranul principal).

**Link public:** https://paulsmocot.github.io/sauna-kit/

## Ce poți edita

Toate datele stau în `src/data/`, separat de cod:

| Fișier | Conține |
| --- | --- |
| `dimensiuni.ts` | cotele modelului 3D (în metri) |
| `piese.ts` | codurile pieselor, denumire, dimensiune, din ce bucată se taie |
| `pasi.ts` | cei 33 de pași: texte, piese, prinderi, avertismente |
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
