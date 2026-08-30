/**
 * PRODUCT-CARD.JS
 * ---------------
 * Shared product card HTML + add-to-cart handler.
 * Used by home.js and products.js to avoid duplicate code.
 */

import { store } from "../core/store.js";
import { formatPrice, showToast } from "../core/utils.js";
import { APP_CONFIG } from "../core/config.js";

/**
 * Generate HTML for one product card.
 * @param {object} product
 * @returns {string}
 */
export function renderProductCard(product) {
  const detailUrl = APP_CONFIG.url(`pages/product-detail.html?id=${product.id}`);
  return `
    <article class="card" data-product-id="${product.id}">
      <div class="card__image">${product.emoji}</div>
      <div class="card__body">
        <div class="card__category">${product.category}</div>
        <h3 class="card__title">${product.name}</h3>
        <div class="card__price">${formatPrice(product.price)}</div>
        <div class="card__actions">
          <a href="${detailUrl}" class="btn btn--secondary btn--sm">View</a>
          <button class="btn btn--primary btn--sm" data-add-to-cart="${product.id}" data-product-name="${product.name}">
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Attach delegated click handler for add-to-cart buttons.
 * @param {HTMLElement} parent
 */
export function bindAddToCart(parent) {
  parent.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-add-to-cart]");
    if (!btn) return;

    const id = btn.dataset.addToCart;
    const name = btn.dataset.productName || "Product";
    store.addItem(id);
    showToast(`${name} added to cart!`);
  });
}
