# SPEC.md — Evaluarea Darurilor Spirituale (HTML + CSS + JS)

## 1) Scop

Site static (fără backend) care oferă un chestionar cu **133** afirmații, salvează progresul local (localStorage), calculează scorurile pe **19 daruri** și afișează rezultatele, cu opțiune de **tipărire PDF** din browser (Ctrl/Cmd+P). Include o pagină / secțiune de **explicare a darurilor**.

## 2) Tehnologii (fără build system)

- **HTML5**, **CSS3**, **JavaScript** (fără framework).
- Fișier unic JS care gestionează rutele pe hash (`#/`, `#/quiz`, `#/results`, `#/gifts`), întrebările și scorurile.
- **Persistență**: `localStorage`.
- **PDF**: folosim funcția nativă de tipărire a browserului (layout print CSS).

## 3) Structură proiect (recomandat)

```
/
├─ index.html        # markup + template-uri (home/quiz/results/gifts)
├─ style.css         # stil minimalist, responsiv, print-friendly
├─ app.js            # router, randare chestionar, salvare, scoruri, rezultate
├─ intrebari.json    # 133 de obiecte: { intrebare, cod_dar }
└─ daruri.json       # 19 obiecte: { cod_dar, descriere }
```

## 4) Flux & Rute

- `#/` — Intro, butoane „Începe/Reia” și „Resetează datele”.
- `#/quiz` — Afișează întrebările (paginare ~20/ pagină), fiecare cu opțiuni 3/2/1/0.
- `#/results` — Tabel scoruri (0–21/ dar), top daruri evidențiat, buton „Tipărește”.
- `#/gifts` — Lista tuturor darurilor (din `daruri.json`) cu descrieri.

## 5) Date și Scorare

- **intrebari.json**: listă cu 133 elemente `{ intrebare, cod_dar }`.
- **daruri.json**: listă cu 19 elemente `{ cod_dar, descriere }`.
- Fiecare dar (A..S) are **7** întrebări ⇒ scor maxim **21** (7 × 3).
- **Mapare** întrebări → dar: secvențial, rotativ, în ordinea codurilor **a..s** (19 coduri). (Compatibil cu structura testului).

## 6) Persistență (localStorage)

Chei propuse:

- `sgq.v1.answers` — array(133) cu valori `0|1|2|3|null`.
- `sgq.v1.meta` — `{ startedAt, updatedAt, version: "1" }` (opțional).

## 7) Interfață & Accesibilitate

- UI curat, spații ample, contrast bun, focus vizibil.
- Grupul de răspunsuri este un **radio group** 0/1/2/3 cu label clar.
- Indicator progres (completate / total).
- Confirmare la resetarea datelor.

## 8) Rezultate

- Tabel cu scor pe fiecare **cod_dar (a..s)** și denumirea asociată (din `daruri.json`).
- Evidențiere top scoruri (două sau mai multe dacă egalitate).
- Buton „Tipărește” (PDF via print).

## 9) CSS Print

- Ascunde header/nav/controale la print.
- Păstrează un layout clar 1–2 coloane.
- Nume fișier sugerat: `daruri-spirituale-rezultate-YYYY-MM-DD.pdf` (lăsat la latitudinea utilizatorului).

## 10) Validări & Edge cases

- Permite vizualizarea rezultatelor chiar și cu întrebări lipsă, dar alertează utilizatorul.
- Dacă `localStorage` indisponibil, folosește fallback în memorie și arată banner de atenționare.

## 11) Notă conținut

- Întrebările și descrierile darurilor sunt preluate/derivate din documentul furnizat de autor („Testul de Daruri Spirituale”). Scala de răspuns: **3 = Întotdeauna**, **2 = De cele mai multe ori**, **1 = Uneori**, **0 = Niciodată**.
