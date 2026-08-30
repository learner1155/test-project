# Architecture Guide — Pure HTML/CSS/JS Projects

This document explains the strategy, patterns, and long-term decisions behind the PureShop demo. Use it as a blueprint for any vanilla web project.

---

## 1. Core Philosophy

| Principle | Why |
|-----------|-----|
| **No build step** | Open `index.html` via a static server and it works. Zero config. |
| **Web standards only** | HTML, CSS, JS are supported for decades. Frameworks come and go. |
| **Separation of concerns** | HTML = structure, CSS = presentation, JS = behavior. Never mix them. |
| **Progressive enhancement** | Pages work without JS (static content); JS adds interactivity. |
| **Grow without rewriting** | Each layer can evolve independently (data → API, CSS → preprocessor). |

---

## 2. Folder Structure Strategy

```
project/
├── index.html              # Entry point (home)
├── pages/                  # All non-home pages
├── assets/
│   ├── css/
│   │   ├── base/           # Foundation (reset, tokens, typography)
│   │   ├── components/     # Reusable UI pieces (buttons, cards)
│   │   ├── pages/          # Page-specific overrides
│   │   ├── layout.css      # Grid, container, spacing utilities
│   │   └── main.css        # Single import entry point
│   ├── js/
│   │   ├── core/           # App-wide logic (config, store, utils)
│   │   ├── data/           # Static data or API wrappers
│   │   ├── components/     # Web Components
│   │   └── pages/          # One JS file per page
│   └── images/             # Optimized images (WebP + fallback)
├── ARCHITECTURE.md
└── README.md
```

### Rules

1. **One CSS entry point** (`main.css`) — each HTML page links only this file.
2. **One JS file per page** — keeps page logic isolated and easy to find.
3. **Shared code lives in `core/` and `components/`** — never duplicate.
4. **Page-specific CSS in `pages/`** — don't bloat the global stylesheet.
5. **Data in `data/`** — swap a JS file for a `fetch()` call later without touching UI code.

---

## 3. Architecture Patterns

### 3.1 Multi-Page Application (MPA)

We use separate HTML files (not a Single Page App) because:

- **SEO-friendly** — each page has its own URL and meta tags.
- **Simple** — no router, no history API hacks.
- **Fast first paint** — browser renders HTML immediately.
- **Easy deployment** — upload files to any static host (GitHub Pages, Netlify, S3).

```
index.html  →  pages/products.html  →  pages/product-detail.html?id=p1
     ↓              ↓                          ↓
  home.js       products.js            product-detail.js
```

### 3.2 Web Components for Shared UI

Problem: Header and footer appear on every page. Copy-pasting HTML is unmaintainable.

Solution: Custom Elements (native, no library):

```html
<!-- In any HTML page -->
<site-header active="products"></site-header>
<script type="module" src="assets/js/components/header.js"></script>
```

```javascript
// header.js defines the component once
class SiteHeader extends HTMLElement {
  connectedCallback() { /* inject HTML */ }
}
customElements.define("site-header", SiteHeader);
```

Benefits:
- Change the header in ONE file, all pages update.
- Components can have their own state and lifecycle.
- Shadow DOM available for true encapsulation (not used here for simplicity).

### 3.3 Pub/Sub Store for State

Problem: Cart data needs to be shared between pages and the header badge.

Solution: A lightweight store with subscribe/notify:

```javascript
// Any file can do:
import { store } from "./core/store.js";

store.addItem("p1");                    // Add to cart
store.subscribe((cart) => render(cart)); // React to changes
```

Data persists in `localStorage`, so the cart survives page navigation and browser refresh.

This is the same pattern Redux uses — simplified to ~60 lines.

### 3.4 ES Modules for Code Organization

```javascript
// core/utils.js
export function formatPrice(amount) { ... }

// pages/cart.js
import { formatPrice } from "../core/utils.js";
```

Rules:
- Always use `type="module"` on `<script>` tags.
- One default export or named exports per file.
- Relative paths (`../core/store.js`) — no path aliases without a bundler.

### 3.5 CSS Architecture (ITCSS-inspired)

Layers, from general to specific:

1. **base/** — Reset, design tokens (variables), typography
2. **layout.css** — Container, grid, flex utilities
3. **components/** — Buttons, cards, header, footer (BEM naming)
4. **pages/** — Styles unique to one page

Naming convention (BEM):
```css
.card              /* Block */
.card__title       /* Element */
.card--featured    /* Modifier */
```

Design tokens in `:root`:
```css
:root {
  --color-primary: #2563eb;
  --space-4: 1rem;
}
```
Change `--color-primary` once → entire site re-themes.

---

## 4. Data Flow

```
┌─────────────┐     ┌──────────┐     ┌──────────────┐
│ products.js │────▶│ page JS  │────▶│  DOM render  │
│  (data)     │     │ (logic)  │     │  (display)   │
└─────────────┘     └────┬─────┘     └──────────────┘
                         │
                    ┌────▼─────┐     ┌──────────────┐
                    │  store   │────▶│ localStorage │
                    │ (state)  │     │ (persist)    │
                    └────┬─────┘     └──────────────┘
                         │
                    ┌────▼─────┐
                    │ header   │
                    │ (badge)  │
                    └──────────┘
```

1. `products.js` is the single source of product truth.
2. Page JS reads products, renders HTML into the DOM.
3. User actions (add to cart) call `store.addItem()`.
4. Store saves to localStorage and notifies subscribers.
5. Header badge and cart page re-render automatically.

---

## 5. Long-Term Growth Path

Your project can evolve without a rewrite:

| Stage | What to do | Effort |
|-------|-----------|--------|
| **Now** | Static JS data file | Done |
| **+Products** | Move data to `products.json`, load with `fetch()` | Low |
| **+Auth** | Add `pages/login.html`, store token in sessionStorage | Medium |
| **+API** | Replace `products.js` with `fetch(API_URL + '/products')` | Medium |
| **+Backend** | Any language (Python, PHP, Go) serves JSON API | Medium |
| **+Payments** | Integrate Razorpay/Stripe via their vanilla JS SDK | Medium |
| **+PWA** | Add `manifest.json` + service worker for offline | Low |
| **+Dark mode** | Add `[data-theme="dark"]` CSS overrides | Low |
| **+i18n** | JSON translation files + `t('key')` helper | Medium |
| **+Build (optional)** | Add Vite/esbuild only when you need TypeScript or bundling | Optional |

The key insight: **each layer is swappable**. The HTML structure, CSS components, and JS patterns stay the same.

---

## 6. Deployment Options (All Free)

| Platform | How | Best for |
|----------|-----|----------|
| **GitHub Pages** | Push to `gh-pages` branch | Personal projects |
| **Netlify** | Drag-and-drop folder | Quick demos |
| **Cloudflare Pages** | Connect git repo | Production sites |
| **Any web host** | Upload via FTP | Traditional hosting |

No server-side code needed. Just static files.

---

## 7. Performance Tips

1. **Images**: Use WebP format, add `loading="lazy"` on below-fold images.
2. **CSS**: For large sites, load only the page CSS needed (not all via `main.css`).
3. **JS**: Keep page scripts small; defer non-critical logic.
4. **Fonts**: Use system font stack (already done) or self-host web fonts.
5. **Caching**: Set long cache headers for `/assets/` on your host.

---

## 8. Accessibility Checklist

- [x] Semantic HTML (`<header>`, `<main>`, `<footer>`, `<nav>`)
- [x] `aria-label` on icon-only buttons
- [x] `.sr-only` class for screen-reader-only text
- [x] Form labels linked with `for`/`id`
- [x] Sufficient color contrast
- [x] Keyboard-navigable buttons and links
- [ ] Add `role="alert"` for toasts (done)
- [ ] Add skip-to-content link for keyboard users

---

## 9. Testing Without Frameworks

| What | How |
|------|-----|
| Manual testing | Click through all pages in Chrome, Firefox, Safari |
| HTML validation | https://validator.w3.org |
| CSS validation | Browser DevTools → no errors |
| JS debugging | `console.log` + browser DevTools |
| Responsive | DevTools device toolbar |
| Lighthouse | Chrome DevTools → Lighthouse audit |

---

## 10. Summary

This architecture gives you:

- **Zero dependencies** — nothing to install, update, or break
- **Clear organization** — any developer can find code in seconds
- **Reusable components** — Web Components scale to large apps
- **Persistent state** — localStorage store works across pages
- **Future-proof** — swap data layer, add API, deploy anywhere
- **Learnable** — every pattern maps to what frameworks do internally

Build the web platform first. Add tools only when you have a specific reason.
