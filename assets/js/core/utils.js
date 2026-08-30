/**
 * UTILS.JS
 * --------
 * Pure utility functions with no side effects.
 * These are reusable across any page or component.
 */

/**
 * Format a number as currency using the app's currency symbol.
 * @param {number} amount
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(amount, currency = "₹") {
  return `${currency}${amount.toLocaleString("en-IN")}`;
}

/**
 * Get a query parameter from the current URL.
 * @param {string} key - Parameter name (e.g. "id")
 * @returns {string|null}
 */
export function getQueryParam(key) {
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Debounce a function — useful for search inputs later.
 * @param {Function} fn
 * @param {number} delay - Milliseconds
 */
export function debounce(fn, delay = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Show a brief toast notification (no library needed).
 * @param {string} message
 * @param {"success"|"error"|"info"} type
 */
export function showToast(message, type = "success") {
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast toast--${type}`;
  toast.textContent = message;
  toast.setAttribute("role", "alert");

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px",
    zIndex: "9999",
    transition: "opacity 0.3s ease",
    background:
      type === "error" ? "#dc2626" : type === "info" ? "#2563eb" : "#16a34a",
  });

  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

/**
 * Create an HTML string safely by escaping user content.
 * Prevents XSS when rendering dynamic data.
 * @param {string} str
 * @returns {string}
 */
export function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
