# PureShop — Vanilla HTML/CSS/JS E-Commerce Demo

A fully functional e-commerce demo built with **zero third-party libraries, zero frameworks, and zero build tools**. Just open it in a browser.

## Quick Start

Because this project uses ES Modules (`import`/`export`), you need a local web server (browsers block module loading over `file://`).

**Option 1 — VS Code / Cursor Live Server:**
Right-click `index.html` → "Open with Live Server"

**Option 2 — Python (if installed):**
```bash
cd pure-html-ecommerce
python -m http.server 8080
```
Then open http://localhost:8080

**Option 3 — Node-free alternative (PHP):**
```bash
php -S localhost:8080
```

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, featured products, trust badges |
| Products | `pages/products.html` | Full catalog with category filters |
| Product Detail | `pages/product-detail.html` | Single product view (`?id=p1`) |
| Cart | `pages/cart.html` | Shopping cart with quantity controls |
| About | `pages/about.html` | Company info + contact form |

## Folder Structure

```
pure-html-ecommerce/
├── index.html                  # Home page
├── pages/                      # Inner pages
│   ├── products.html
│   ├── product-detail.html
│   ├── cart.html
│   └── about.html
├── assets/
│   ├── data/                   # JSON data files (edit content here!)
│   │   ├── products.json       # Product catalog
│   │   └── site.json           # Hero, features, shipping rules
│   ├── css/
│   │   ├── base/               # Reset, variables, typography
│   │   ├── components/         # Buttons, cards, header, footer, forms
│   │   ├── pages/              # Page-specific styles
│   │   ├── layout.css          # Grid, container, utilities
│   │   └── main.css            # Single CSS entry point (@imports)
│   └── js/
│       ├── core/               # Config, store, utilities
│       ├── data/               # Product catalog
│       ├── components/         # Web Components (header, footer)
│       └── pages/              # Page-specific logic
├── ARCHITECTURE.md             # Detailed architecture guide
├── RESPONSIVE.md               # Mobile responsive guide & tips
└── README.md                   # This file
```

## Design Specs

```css
.site-wrap  { max-width: 1440px; margin: 0 auto; width: 100%; }
.container   { max-width: 1368px; margin: 0 auto; width: 100%; }
```

| Layer | Class | Max width |
|-------|-------|-----------|
| Section backgrounds | `header`, `hero`, `footer` | 100vw (full bleed) |
| Site zone | `.site-wrap` | **1440px** |
| Content | `.container` | **1368px** |

**HTML pattern:**
```html
<section class="hero">
  <div class="site-wrap">
    <div class="container">...</div>
  </div>
</section>
```

## Key Features

- **Web Components** for shared header/footer (no duplication)
- **ES Modules** for clean code organization
- **Pub/Sub Store** for cart state with localStorage persistence
- **CSS Custom Properties** for easy theming
- **Responsive design** with mobile-friendly navigation
- **JSON data files** — products & site content loaded via `fetch()`
- **Fully commented code** for learning

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Markup | HTML5 |
| Styling | CSS3 (Custom Properties, Grid, Flexbox) |
| Logic | Vanilla JavaScript (ES2020+ Modules) |
| Components | Web Components (Custom Elements) |
| State | Custom pub/sub store + localStorage |
| Build | None — open and run |

## License

Free to use for learning and as a project starter template.
