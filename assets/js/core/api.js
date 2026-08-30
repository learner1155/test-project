/**
 * API.JS
 * ------
 * Loads JSON data files using fetch().
 *
 * WHY JSON + fetch()?
 * - Edit products in products.json without touching JavaScript
 * - Same pattern used by real APIs — swap JSON path for API URL later
 * - Non-developers can update content easily
 *
 * REQUIRES a local server (fetch does not work with file:// protocol).
 */

/** In-memory cache — each JSON file is fetched only once per page load */
const cache = new Map();

/**
 * Fetch and parse a JSON file. Returns cached result on repeat calls.
 * @param {string} url - Full path to .json file
 * @returns {Promise<object>}
 */
export async function fetchJSON(url) {
  if (cache.has(url)) {
    return cache.get(url);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to load ${url} (${response.status})`);
  }

  const data = await response.json();
  cache.set(url, data);
  return data;
}

/**
 * Clear cache (useful after admin updates data).
 */
export function clearCache() {
  cache.clear();
}
