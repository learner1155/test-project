# Responsive Design Guide

A practical reference for building reliable mobile-responsive websites with pure HTML, CSS, and JavaScript. This guide matches the PureShop project setup.

---

## Your Design System

```
VIEWPORT (100% width — always edge to edge, no empty side gaps)
└── .site-canvas  →  width: 100%
    └── .container →  max-width: 1368px (centered content)
```

| What | Value | Meaning |
|------|-------|---------|
| **Design reference** | 1440px | Size you design in Figma — not a site width cap |
| **Site** | 100% width | Covers full screen on all devices |
| **Container** | 1368px max | Where your content lives |
| **Gutter at 1440px** | 36px each side | When viewport = 1440px: `(1440 − 1368) / 2` |

On ultrawide (1920px): site still covers **full 1920px**, container stays **1368px** centered — no boxed/rounded layout with empty sides.

### HTML structure

```html
<body>
  <div class="site-canvas">        <!-- width: 100% -->
    <main>
      <div class="container">    <!-- max-width: 1368px -->
        <!-- content -->
      </div>
    </main>
  </div>
</body>
```

---

## Breakpoints Used in This Project

| Name | Value | Typical devices | Grid columns |
|------|-------|-----------------|--------------|
| Base | 0–479px | Phones (portrait) | 1 |
| `sm` | 480px+ | Large phones, small tablets | 2 |
| `md` | 768px+ | Tablets | 3 |
| `lg` | 1024px+ | Laptops | 4 |
| `xl` | 1280px+ | Desktops | 4 |
| `2xl` | 1440px | Design canvas | 4 |

**Rule:** We use **mobile-first** — base styles target the smallest screen, then `@media (min-width: ...)` adds complexity as the screen grows.

---

## 10 Reliable Rules for Mobile Responsive

### 1. Always include the viewport meta tag

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
```

Without this, mobile browsers render at ~980px and shrink the page. Every HTML page must have it.

### 2. Use mobile-first CSS

```css
/* ✅ Good — mobile first */
.grid { grid-template-columns: 1fr; }
@media (min-width: 768px) { .grid { grid-template-columns: repeat(3, 1fr); } }

/* ❌ Avoid — desktop first */
.grid { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 767px) { .grid { grid-template-columns: 1fr; } }
```

Mobile-first means less CSS overrides, fewer bugs, and better performance on phones.

### 3. Never use fixed widths for layout

```css
/* ❌ Bad */
.sidebar { width: 300px; }

/* ✅ Good */
.sidebar { width: 100%; max-width: 300px; }
.container { width: 100%; max-width: 1368px; }
```

Use `max-width`, percentages, `fr` units, and `clamp()` instead of fixed pixel widths.

### 4. Use `clamp()` for fluid typography and spacing

```css
h1 { font-size: clamp(1.75rem, 4vw, 2.25rem); }
padding: clamp(1rem, 2.5vw, 2.25rem);
```

`clamp(min, preferred, max)` scales smoothly between breakpoints without extra media queries.

### 5. Touch targets must be at least 44×44px

Apple and WCAG recommend **44px minimum** for buttons and links on mobile. We use:

```css
--touch-target-min: 44px;
.btn { min-height: var(--touch-target-min); }
```

Small tap targets cause mis-taps and frustrate users.

### 6. Prevent horizontal overflow

```css
body { overflow-x: hidden; }
img, video { max-width: 100%; height: auto; }
```

Horizontal scrolling on mobile is almost always a bug. Test by setting viewport to 320px width.

### 7. Use `flex-wrap` and `grid` — never force one row

```css
/* ✅ Good */
.toolbar { display: flex; flex-wrap: wrap; gap: 1rem; }

/* ❌ Bad — items overflow on small screens */
.toolbar { display: flex; }
```

### 8. Stack layouts on mobile, side-by-side on desktop

```css
.product-detail {
  display: grid;
  grid-template-columns: 1fr;          /* mobile: stacked */
}
@media (min-width: 768px) {
  .product-detail {
    grid-template-columns: 1fr 1fr;  /* desktop: side by side */
  }
}
```

### 9. Input font-size ≥ 16px on mobile

iOS Safari zooms in when an input has `font-size` below 16px. We enforce this in `layout.css`:

```css
@media (max-width: 767px) {
  input, select, textarea { font-size: 16px; }
}
```

### 10. Test on real breakpoints, not just browser resize

Test at these exact widths: **320, 375, 414, 768, 1024, 1280, 1440**.

Chrome DevTools → Toggle device toolbar → Responsive mode → type exact widths.

---

## Tips & Tricks

### `aspect-ratio` for consistent image boxes

```css
.card__image {
  aspect-ratio: 4 / 3;  /* Always 4:3, any width */
}
```

No more broken layouts from images of different heights.

### `@media (hover: hover)` for touch vs mouse

```css
/* Only apply hover effects on devices with a mouse */
@media (hover: hover) {
  .card:hover { transform: translateY(-2px); }
}
```

On touch screens, `:hover` can get "stuck" after a tap. This prevents that.

### `min()` and `max()` for responsive sizing

```css
.hero { padding: max(2rem, 5vh); }
.sidebar { width: min(300px, 100%); }
```

### CSS Grid `auto-fit` for auto-responsive columns

```css
.grid-auto {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```

No media queries needed — columns auto-adjust to available space. Great for product grids.

### `position: sticky` for cart summary

```css
.cart-summary {
  position: sticky;
  top: calc(var(--header-height) + 1rem);
}
```

Keeps the order summary visible while scrolling on desktop. On mobile it stacks naturally below items.

### Safe area insets for notched phones (iPhone X+)

```css
body {
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
```

Add `viewport-fit=cover` to meta tag for full-screen PWAs:

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
```

### `picture` element for responsive images

```html
<picture>
  <source media="(min-width: 768px)" srcset="hero-large.webp">
  <source media="(min-width: 480px)" srcset="hero-medium.webp">
  <img src="hero-small.webp" alt="Hero" loading="lazy">
</picture>
```

Serve smaller images to mobile = faster load times.

### `loading="lazy"` on below-fold images

```html
<img src="product.jpg" alt="Product" loading="lazy">
```

Browser defers loading until the image is near the viewport.

### Container queries (modern browsers)

```css
.card-container { container-type: inline-size; }

@container (min-width: 400px) {
  .card { display: flex; }
}
```

Responds to the **parent's width**, not the viewport. Useful for reusable components in unpredictable layouts.

### Debug responsive issues quickly

Add this temporarily to find overflowing elements:

```css
* { outline: 1px solid red; }
```

Or in DevTools Console:

```javascript
document.querySelectorAll('*').forEach(el => {
  if (el.scrollWidth > document.documentElement.clientWidth) {
    console.log('Overflow:', el);
  }
});
```

---

## Common Mistakes to Avoid

| Mistake | Fix |
|---------|-----|
| Designing only at 1440px | Always check 375px (iPhone) and 320px (small Android) |
| Using `px` for all font sizes | Use `rem` + `clamp()` for fluid text |
| Hiding content on mobile with `display: none` | Restructure layout instead — hidden content hurts SEO |
| Fixed `height` on containers | Use `min-height` or let content define height |
| `100vh` on mobile | Use `100dvh` (dynamic viewport height) to avoid address bar issues |
| Too many breakpoints | 4–5 breakpoints is enough; more creates maintenance pain |
| Testing only in Chrome | Check Safari (iOS) — it has unique quirks |

---

## Testing Checklist

Before shipping any page, verify:

- [ ] No horizontal scroll at 320px, 375px, 414px
- [ ] All buttons/links are tappable (44px min)
- [ ] Text is readable without zooming
- [ ] Images don't overflow their containers
- [ ] Navigation works on mobile (hamburger menu opens/closes)
- [ ] Forms don't trigger iOS zoom on focus
- [ ] Layout looks correct at 1440px with 1368px content
- [ ] Sticky elements don't overlap content
- [ ] Page works in portrait and landscape

---

## Quick Reference: CSS Units for Responsive

| Unit | Best for | Example |
|------|----------|---------|
| `%` | Widths relative to parent | `width: 50%` |
| `vw` / `vh` | Full-viewport sections | `height: 100vh` |
| `rem` | Typography, spacing | `font-size: 1.25rem` |
| `em` | Component-relative sizing | `padding: 1em` |
| `fr` | Grid columns | `grid-template-columns: 1fr 2fr` |
| `clamp()` | Fluid anything | `clamp(1rem, 3vw, 2rem)` |
| `min()` / `max()` | Constrained sizing | `width: min(100%, 400px)` |

---

## Summary

1. **Design at 1440px**, content at **1368px**, fluid padding everywhere else
2. **Mobile-first** CSS with `min-width` media queries
3. **Fluid typography** with `clamp()`
4. **44px touch targets** minimum
5. **Flexbox + Grid** with wrapping — never fixed layouts
6. **Test at real device widths** — 320, 375, 768, 1024, 1440
7. **No horizontal overflow** — ever

These patterns are framework-free, work in every modern browser, and scale from a demo site to a production e-commerce store.
