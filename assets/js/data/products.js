/**
 * PRODUCTS.JS
 * -----------
 * Product data layer — loads from assets/data/products.json
 *
 * All pages import functions from here, NOT the JSON directly.
 * To add a product: edit products.json only.
 */

import { fetchJSON } from "../core/api.js";
import { APP_CONFIG } from "../core/config.js";

/** Cached product array after first fetch */
let productsList = null;

/**
 * Load all products from JSON (cached after first call).
 * @returns {Promise<Array>}
 */
export async function getProducts() {
  if (productsList) return productsList;

  const data = await fetchJSON(APP_CONFIG.dataUrl("products.json"));
  productsList = data.products;
  return productsList;
}

/**
 * Get category list for filter buttons.
 * @returns {Promise<Array<string>>}
 */
export async function getCategories() {
  const products = await getProducts();
  return ["all", ...new Set(products.map((p) => p.category))];
}

/**
 * Find one product by ID.
 * @param {string} id
 * @returns {Promise<object|undefined>}
 */
export async function getProductById(id) {
  const products = await getProducts();
  return products.find((p) => p.id === id);
}

/**
 * Filter products by category.
 * @param {string} category
 * @returns {Promise<Array>}
 */
export async function getProductsByCategory(category) {
  const products = await getProducts();
  if (category === "all") return products;
  return products.filter((p) => p.category === category);
}

/**
 * Get featured products for home page.
 * @param {number} limit
 * @returns {Promise<Array>}
 */
export async function getFeaturedProducts(limit = 4) {
  const products = await getProducts();
  const featured = products.filter((p) => p.featured);
  return featured.length > 0 ? featured.slice(0, limit) : products.slice(0, limit);
}
