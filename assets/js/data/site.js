/**
 * SITE.JS
 * -------
 * Site-wide content from assets/data/site.json
 * Hero text, features, shipping rules, about page copy, etc.
 */

import { fetchJSON } from "../core/api.js";
import { APP_CONFIG } from "../core/config.js";

let siteData = null;

/**
 * Load site.json (cached after first call).
 * @returns {Promise<object>}
 */
export async function getSiteData() {
  if (siteData) return siteData;

  siteData = await fetchJSON(APP_CONFIG.dataUrl("site.json"));
  return siteData;
}

/** @returns {Promise<object>} Hero section content */
export async function getHero() {
  const data = await getSiteData();
  return data.hero;
}

/** @returns {Promise<Array>} Feature/trust badge items */
export async function getFeatures() {
  const data = await getSiteData();
  return data.features;
}

/** @returns {Promise<object>} Shipping rules for cart */
export async function getShipping() {
  const data = await getSiteData();
  return data.shipping;
}

/** @returns {Promise<object>} About page header content */
export async function getAbout() {
  const data = await getSiteData();
  return data.about;
}
