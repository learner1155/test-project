/**
 * HEADER.JS — <site-header> Web Component
 * ----------------------------------------
 *
 * WHY WEB COMPONENTS?
 * - Native browser feature (no library)
 * - Reusable across all pages with ONE tag: <site-header>
 * - Encapsulates markup + behavior in a single file
 * - Cart badge auto-updates via store.subscribe()
 *
 * USAGE in any HTML page:
 *   <site-header active="products"></site-header>
 *   <script type="module" src="assets/js/components/header.js"></script>
 */

import { APP_CONFIG } from "../core/config.js";
import { store } from "../core/store.js";

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const activePage = this.getAttribute("active") || "";
    const base = APP_CONFIG.getBasePath();

    this.innerHTML = `
      <header class="site-header">
        <div class="site-wrap">
          <div class="site-header__inner container">
          <a href="${base}/index.html" class="site-header__logo">
            Pure<span>Shop</span>
          </a>

          <button class="site-header__menu-btn" aria-label="Toggle menu" aria-expanded="false" data-menu-toggle>
            ☰
          </button>

          <nav class="site-header__nav" data-nav>
            <a href="${base}/index.html"
               class="site-header__link ${activePage === "home" ? "site-header__link--active" : ""}">
              Home
            </a>
            <a href="${base}/pages/products.html"
               class="site-header__link ${activePage === "products" ? "site-header__link--active" : ""}">
              Products
            </a>
            <a href="${base}/pages/about.html"
               class="site-header__link ${activePage === "about" ? "site-header__link--active" : ""}">
              About
            </a>
            <a href="${base}/pages/cart.html" class="site-header__cart">
              🛒 Cart
              <span class="site-header__cart-count" data-cart-count>0</span>
            </a>
          </nav>
          </div>
        </div>
      </header>
    `;

    this.setupMobileMenu();
    this.updateCartCount();
    this.unsubscribe = store.subscribe(() => this.updateCartCount());
  }

  disconnectedCallback() {
    if (this.unsubscribe) this.unsubscribe();
  }

  /** Toggle mobile navigation menu */
  setupMobileMenu() {
    const toggle = this.querySelector("[data-menu-toggle]");
    const nav = this.querySelector("[data-nav]");

    toggle?.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("site-header__nav--open");
      toggle.setAttribute("aria-expanded", isOpen);
    });

    /* Close menu when a nav link is tapped (mobile UX) */
    nav?.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("site-header__nav--open");
        toggle?.setAttribute("aria-expanded", "false");
      });
    });

    /* Close menu when clicking outside */
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        nav?.classList.remove("site-header__nav--open");
        toggle?.setAttribute("aria-expanded", "false");
      }
    });
  }

  /** Update the cart badge number in the header */
  updateCartCount() {
    const badge = this.querySelector("[data-cart-count]");
    if (badge) {
      badge.textContent = store.getItemCount();
    }
  }
}

customElements.define("site-header", SiteHeader);
