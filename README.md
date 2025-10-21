# 🎨 Evaluarea Darurilor Spirituale

O aplicație web **mobile-first** pentru descoperirea darurilor spirituale prin intermediul unui chestionar interactiv cu 133 de întrebări.

## 📁 Structura Proiectului

```
tds/
├── index.html              # Pagina principală
├── manifest.json           # PWA manifest
├── README.md              # Documentație
├── assets/                # Resurse statice
│   ├── css/
│   │   └── style.css      # Stiluri CSS
│   ├── js/
│   │   └── app.js         # Logica aplicației
│   └── images/
│       ├── icon.svg       # Favicon SVG
│       └── og-image.png   # Open Graph image
├── data/                  # Date JSON
│   ├── intrebari.json     # 133 întrebări
│   └── daruri.json        # 19 daruri spirituale
└── docs/                  # Documentație
    └── spec.md            # Specificații originale
```

## ✨ Caracteristici

### 🎯 Funcționalități Principale

- **133 Întrebări** organizate în 10 pagini (14 întrebări/pagină)
- **19 Daruri Spirituale** cu descrieri complete
- **Salvare Automată** - progresul este salvat în localStorage
- **Progress Bar Animat** - vizualizare clară a progresului
- **Rezultate Detaliate** - scoruri și topul darurilor dominante
- **Export PDF** - tipărire rezultate direct din browser

### 📱 Design Mobile-First

- **Optimizat pentru telefon** - interfață tactilă prietenoasă
- **Swipe Gestures** - navigare naturală între pagini
- **Responsive** - funcționează perfect pe toate dispozitivele
- **Animații Smooth** - feedback vizual plăcut
- **UI Modern** - gradient backgrounds, shadows, micro-interactions

### 🎨 Experiență Utilizator

- **Interfață Curată** - design minimalist și elegant
- **Scala Vizuală** - opțiuni de răspuns clare (0-3)
- **Indicatori Vizuali** - întrebări răspunse marcate cu verde
- **Page Dots** - navigare rapidă între pagini
- **Top Gifts Highlight** - darurile dominante evidențiate

## 🚀 Utilizare

### Pornire Rapidă

1. Deschide `index.html` în browser
2. Click pe "Începe Chestionarul"
3. Răspunde sincer la fiecare afirmație
4. Vezi rezultatele și descoperă-ți darurile!

### Navigare

- **Acasă** - informații despre test și pornire
- **Chestionar** - completează cele 133 întrebări
- **Rezultate** - vezi scorurile și darurile dominante
- **Despre Daruri** - citește descrieri detaliate

### Scala de Răspuns

- **3 - Întotdeauna** - Afirmația se aplică constant
- **2 - De cele mai multe ori** - Afirmația se aplică frecvent
- **1 - Uneori** - Afirmația se aplică ocazional
- **0 - Niciodată** - Afirmația nu se aplică

## 🛠️ Tehnologii

- **HTML5** - markup semantic
- **CSS3** - design modern cu variables, flexbox, grid
- **JavaScript** (Vanilla) - fără dependențe externe
- **LocalStorage** - persistență date
- **Hash Routing** - navigare SPA

## 📊 Structură Date

### intrebari.json

```json
[
  {
    "intrebare": "Text întrebare...",
    "cod_dar": "a",
    "nr": 1
  }
]
```

### daruri.json

```json
[
  {
    "cod_dar": "a",
    "nume": "Numele darului",
    "descriere": "Descriere completă..."
  }
]
```

## 🎯 Algoritm Scorare

- **133 întrebări** mapate pe **19 daruri** (A-S)
- Fiecare dar are **7 întrebări** asociate
- Scor maxim per dar: **21 puncte** (7 × 3)
- Distribuție rotativă: întrebările 1, 20, 39... → Dar A

## 💾 Persistență Date

### Chei LocalStorage

- `sgq.v1.answers` - array[133] cu răspunsuri (0-3 sau null)
- `sgq.v1.meta` - metadata (timestamp, versiune)

### Auto-save

- Salvare automată la fiecare răspuns (debounced 500ms)
- Rezistență la închidere browser
- Backup continuu al progresului

## 🖨️ Export Rezultate

### Tipărire PDF

1. Navighează la pagina Rezultate
2. Click "Tipărește Rezultatele"
3. Selectează "Salvare ca PDF" în dialog
4. Datele sunt formatate print-friendly

### Print Styles

- Header/nav ascunse
- Culori optimizate pentru print
- Layout 1-2 coloane
- Page breaks inteligente

## 📱 Mobile Optimizations

### Touch Gestures

- **Swipe Left** - pagina următoare
- **Swipe Right** - pagina anterioară
- Threshold: 50px pentru activare

### Viewport

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
/>
```

### Performance

- Animații hardware-accelerated
- Debounced save operations
- Lazy rendering per pagină
- Minimal reflows

## 🎨 Design System

### Culori

- **Primary**: #6366f1 (Indigo)
- **Secondary**: #8b5cf6 (Violet)
- **Success**: #10b981 (Green)
- **Warning**: #f59e0b (Amber)
- **Danger**: #ef4444 (Red)

### Spacing

- XS: 0.25rem (4px)
- SM: 0.5rem (8px)
- MD: 1rem (16px)
- LG: 1.5rem (24px)
- XL: 2rem (32px)

### Border Radius

- SM: 0.375rem
- MD: 0.5rem
- LG: 0.75rem
- XL: 1rem

## 🔄 Updates & Versioning

### Versiune Curentă: 1.0.0

- ✅ Toate cele 133 întrebări
- ✅ Toate cele 19 daruri
- ✅ Mobile-first design
- ✅ Auto-save funcțional
- ✅ Export PDF
- ✅ Responsive pe toate device-urile

## 📝 Licență

Acest proiect este creat pentru evaluarea darurilor spirituale conform documentului "Testul de Daruri Spirituale".

---

**Descoperă-ți darurile spirituale și află cum te-a înzestrat Dumnezeu pentru slujire!** ✨
