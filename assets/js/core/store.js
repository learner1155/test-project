/**
 * STORE.JS
 * --------
 * Simple state management for the shopping cart.
 *
 * ARCHITECTURE PATTERN: Pub/Sub (Publish/Subscribe)
 * - Components subscribe to cart changes via store.subscribe()
 * - Any add/remove/update calls store.notify() to update all listeners
 * - Data persists in localStorage so cart survives page refreshes
 *
 * This is the same pattern Redux uses, simplified for vanilla JS.
 * No framework needed — just 60 lines of clean code.
 */

import { APP_CONFIG } from "./config.js";

/** @type {Array<{id: string, quantity: number}>} */
let cart = loadCart();

/** @type {Set<Function>} */
const listeners = new Set();

/**
 * Load cart from localStorage, or return empty array.
 */
function loadCart() {
  try {
    const stored = localStorage.getItem(APP_CONFIG.cartStorageKey);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Save cart to localStorage and notify all subscribers.
 */
function persist() {
  localStorage.setItem(APP_CONFIG.cartStorageKey, JSON.stringify(cart));
  notify();
}

/**
 * Notify all subscribed listeners of a state change.
 */
function notify() {
  listeners.forEach((fn) => fn(getCart()));
}

/**
 * Public store API — import this in any file that needs cart access.
 */
export const store = {
  /**
   * Get a copy of the current cart (immutable pattern).
   */
  getCart() {
    return [...cart];
  },

  /**
   * Get total number of items in cart (sum of quantities).
   */
  getItemCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  },

  /**
   * Add a product to cart or increase quantity if already present.
   * @param {string} productId
   * @param {number} quantity
   */
  addItem(productId, quantity = 1) {
    const existing = cart.find((item) => item.id === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ id: productId, quantity });
    }
    persist();
  },

  /**
   * Remove a product entirely from the cart.
   * @param {string} productId
   */
  removeItem(productId) {
    cart = cart.filter((item) => item.id !== productId);
    persist();
  },

  /**
   * Set exact quantity for a product (removes if quantity is 0).
   * @param {string} productId
   * @param {number} quantity
   */
  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = cart.find((i) => i.id === productId);
    if (item) {
      item.quantity = quantity;
      persist();
    }
  },

  /**
   * Clear the entire cart.
   */
  clearCart() {
    cart = [];
    persist();
  },

  /**
   * Subscribe to cart changes. Returns an unsubscribe function.
   * @param {Function} callback - Called with updated cart array
   * @returns {Function} unsubscribe
   */
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};
