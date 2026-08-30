/**
 * CART.JS — Shopping cart page
 * Resolves cart item IDs against products.json
 */

import { getProducts } from "../data/products.js";
import { getShipping } from "../data/site.js";
import { store } from "../core/store.js";
import { formatPrice, showToast } from "../core/utils.js";

const cartContainer = document.querySelector("[data-cart-items]");
const summaryContainer = document.querySelector("[data-cart-summary]");
const emptyState = document.querySelector("[data-cart-empty]");

/** Product lookup map: id → product (built once from JSON) */
let productMap = null;

async function loadProductMap() {
  if (productMap) return productMap;
  const products = await getProducts();
  productMap = Object.fromEntries(products.map((p) => [p.id, p]));
  return productMap;
}

async function render() {
  const cart = store.getCart();

  if (cart.length === 0) {
    if (cartContainer) cartContainer.innerHTML = "";
    if (summaryContainer) summaryContainer.style.display = "none";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";
  if (summaryContainer) summaryContainer.style.display = "block";

  try {
    const map = await loadProductMap();
    const shipping = await getShipping();

    const items = cart
      .map((item) => {
        const product = map[item.id];
        return product ? { ...product, quantity: item.quantity } : null;
      })
      .filter(Boolean);

    if (cartContainer) {
      cartContainer.innerHTML = items.map(renderCartItem).join("");
    }

    if (summaryContainer) {
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingCost = subtotal > shipping.freeThreshold ? 0 : shipping.flatRate;
      const total = subtotal + shippingCost;

      summaryContainer.innerHTML = `
        <h3 style="margin-bottom: var(--space-6);">Order Summary</h3>
        <div class="cart-summary__row">
          <span>Subtotal</span>
          <span>${formatPrice(subtotal)}</span>
        </div>
        <div class="cart-summary__row">
          <span>Shipping</span>
          <span>${shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
        </div>
        <div class="cart-summary__total">
          <span>Total</span>
          <span>${formatPrice(total)}</span>
        </div>
        <button class="btn btn--primary btn--lg" style="width:100%; margin-top: var(--space-6);" data-checkout>
          Proceed to Checkout
        </button>
        <button class="btn btn--secondary" style="width:100%; margin-top: var(--space-3);" data-clear-cart>
          Clear Cart
        </button>
      `;
    }
  } catch (err) {
    if (cartContainer) {
      cartContainer.innerHTML = `<p class="text-muted">Could not load cart data.</p>`;
    }
    console.error(err);
  }
}

function renderCartItem(item) {
  return `
    <div class="cart-item" data-cart-item="${item.id}">
      <div class="cart-item__image">${item.emoji}</div>
      <div class="cart-item__info">
        <div class="cart-item__title">${item.name}</div>
        <div class="cart-item__price">${formatPrice(item.price)} each</div>
        <div class="cart-item__actions">
          <div class="product-detail__qty">
            <button class="qty-btn" data-qty-minus="${item.id}" aria-label="Decrease">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn" data-qty-plus="${item.id}" aria-label="Increase">+</button>
          </div>
          <strong>${formatPrice(item.price * item.quantity)}</strong>
          <button class="btn btn--danger btn--sm" data-remove="${item.id}">Remove</button>
        </div>
      </div>
    </div>
  `;
}

document.addEventListener("click", (e) => {
  const minusId = e.target.dataset?.qtyMinus;
  const plusId = e.target.dataset?.qtyPlus;
  const removeId = e.target.dataset?.remove;

  if (minusId) {
    const item = store.getCart().find((i) => i.id === minusId);
    if (item) store.updateQuantity(minusId, item.quantity - 1);
  }
  if (plusId) {
    const item = store.getCart().find((i) => i.id === plusId);
    if (item) store.updateQuantity(plusId, item.quantity + 1);
  }
  if (removeId) {
    store.removeItem(removeId);
    showToast("Item removed from cart", "info");
  }
  if (e.target.matches("[data-clear-cart]")) {
    store.clearCart();
    showToast("Cart cleared", "info");
  }
  if (e.target.matches("[data-checkout]")) {
    showToast("Checkout is a demo — no payment processed!", "info");
  }
});

store.subscribe(render);
render();
