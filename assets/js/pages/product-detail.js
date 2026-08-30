/**
 * PRODUCT-DETAIL.JS — Single product page
 * Loads product by ?id= from products.json
 */

import { getProductById } from "../data/products.js";
import { store } from "../core/store.js";
import { formatPrice, getQueryParam, showToast } from "../core/utils.js";
import { APP_CONFIG } from "../core/config.js";

const container = document.querySelector("[data-product-detail]");
const productId = getQueryParam("id");

async function initProductDetail() {
  if (!productId || !container) {
    if (container) showNotFound();
    return;
  }

  container.innerHTML = `<p class="text-muted">Loading product...</p>`;

  try {
    const product = await getProductById(productId);

    if (!product) {
      showNotFound();
      return;
    }

    let quantity = 1;
    renderProduct(product);

    container.addEventListener("click", (e) => {
      if (e.target.matches("[data-qty-minus]")) {
        quantity = Math.max(1, quantity - 1);
        updateQtyDisplay();
      }
      if (e.target.matches("[data-qty-plus]")) {
        quantity += 1;
        updateQtyDisplay();
      }
      if (e.target.matches("[data-add-to-cart]")) {
        store.addItem(product.id, quantity);
        showToast(`${quantity}× ${product.name} added to cart!`);
      }
    });

    function updateQtyDisplay() {
      const el = container.querySelector("[data-qty-value]");
      if (el) el.textContent = quantity;
    }
  } catch (err) {
    container.innerHTML = `<p class="text-muted">Could not load product.</p>`;
    console.error(err);
  }
}

function showNotFound() {
  container.innerHTML = `<p>Product not found. <a href="${APP_CONFIG.url("pages/products.html")}">Browse products</a></p>`;
}

function renderProduct(product) {
  container.innerHTML = `
    <div class="product-detail__image">${product.emoji}</div>
    <div>
      <div class="product-detail__category">${product.category}</div>
      <h1 class="product-detail__title">${product.name}</h1>
      <div class="product-detail__price">${formatPrice(product.price)}</div>
      <p class="product-detail__description">${product.description}</p>
      <div class="product-detail__actions">
        <div class="product-detail__qty">
          <button class="qty-btn" data-qty-minus aria-label="Decrease quantity">−</button>
          <span class="qty-value" data-qty-value>1</span>
          <button class="qty-btn" data-qty-plus aria-label="Increase quantity">+</button>
        </div>
        <button class="btn btn--primary btn--lg" data-add-to-cart>
          Add to Cart
        </button>
      </div>
    </div>
  `;
}

initProductDetail();
