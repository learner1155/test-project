/**
 * CONFIG.JS
 * ---------
 * Central configuration for the entire application.
 * Keep magic strings, URLs, and settings in ONE place.
 *
 * LONG-TERM TIP: When you add a backend API later, change only
 * API_BASE_URL here — no hunting through dozens of files.
 */

export const APP_CONFIG = {
  /** Application display name */
  name: "PureShop",

  /** Key used in localStorage for cart persistence */
  cartStorageKey: "pureshop_cart",

  /** Currency symbol for price display */
  currency: "₹",

  /**
   * Base path helper — detects if we're on root or inside /pages/
   * This lets the same components work from any page depth.
   */
  getBasePath() {
    const path = window.location.pathname;
    return path.includes("/pages/") ? ".." : ".";
  },

  /**
   * Build a URL relative to project root.
   * @param {string} path - e.g. "pages/products.html" or "index.html"
   */
  url(path) {
    const base = this.getBasePath();
    return `${base}/${path}`.replace(/\/+/g, "/").replace("/./", "/");
  },

  /**
   * Build URL for a JSON data file in assets/data/
   * @param {string} file - e.g. "products.json"
   */
  dataUrl(file) {
    return this.url(`assets/data/${file}`);
  },
};
