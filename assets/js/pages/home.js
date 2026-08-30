/**
 * HOME.JS — Home page logic (index.html)
 * Loads hero, features, and products from JSON files.
 */

import { getFeaturedProducts } from "../data/products.js";
import { getHero, getFeatures } from "../data/site.js";
import { renderProductCard, bindAddToCart } from "../components/product-card.js";
import { APP_CONFIG } from "../core/config.js";

/** Run all home page data loading */
async function initHome() {
  await Promise.all([renderHero(), renderFeatures(), renderFeaturedProducts()]);
}

/** Hero section from site.json */
async function renderHero() {
  const el = document.querySelector("[data-hero]");
  if (!el) return;

  try {
    const hero = await getHero();
    el.innerHTML = `
      <h1>${hero.title}</h1>
      <p>${hero.subtitle}</p>
      <a href="${APP_CONFIG.url(hero.ctaLink)}" class="btn btn--primary btn--lg">${hero.ctaText}</a>
    `;
  } catch (err) {
    el.innerHTML = `<p class="text-muted">Could not load hero content.</p>`;
    console.error(err);
  }
}

/** Trust badges / features from site.json */
async function renderFeatures() {
  const el = document.querySelector("[data-features]");
  if (!el) return;

  try {
    const features = await getFeatures();
    el.innerHTML = features
      .map(
        (f) => `
      <div class="feature">
        <div class="feature__icon">${f.icon}</div>
        <h3>${f.title}</h3>
        <p>${f.description}</p>
      </div>
    `
      )
      .join("");
  } catch (err) {
    el.innerHTML = `<p class="text-muted">Could not load features.</p>`;
    console.error(err);
  }
}

/** Featured products from products.json */
async function renderFeaturedProducts() {
  const container = document.querySelector("[data-featured-products]");
  if (!container) return;

  try {
    const products = await getFeaturedProducts(4);
    container.innerHTML = products.map(renderProductCard).join("");
    bindAddToCart(container);
  } catch (err) {
    container.innerHTML = `<p class="text-muted">Could not load products. Run via a local server.</p>`;
    console.error(err);
  }
}

initHome();
