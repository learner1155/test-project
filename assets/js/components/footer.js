/**
 * FOOTER.JS — <site-footer> Web Component
 * ----------------------------------------
 *
 * Same pattern as header.js — define once, use everywhere.
 * Footer links use APP_CONFIG.url() for correct relative paths.
 */

import { APP_CONFIG } from "../core/config.js";

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const base = APP_CONFIG.getBasePath();
    const year = new Date().getFullYear();

    this.innerHTML = `
      <footer class="site-footer">
        <div class="site-wrap">
          <div class="container">
            <div class="site-footer__grid">
              <div>
                <div class="site-footer__brand">Pure<span>Shop</span></div>
                <p class="site-footer__desc">
                  A demo e-commerce site built with pure HTML, CSS, and JavaScript.
                  No frameworks, no build tools, no third-party libraries.
                </p>
              </div>
              <div>
                <h4 class="site-footer__heading">Shop</h4>
                <a href="${base}/pages/products.html" class="site-footer__link">All Products</a>
                <a href="${base}/pages/products.html" class="site-footer__link">Electronics</a>
                <a href="${base}/pages/products.html" class="site-footer__link">Clothing</a>
              </div>
              <div>
                <h4 class="site-footer__heading">Company</h4>
                <a href="${base}/pages/about.html" class="site-footer__link">About Us</a>
                <a href="${base}/pages/about.html" class="site-footer__link">Contact</a>
              </div>
              <div>
                <h4 class="site-footer__heading">Support</h4>
                <a href="#" class="site-footer__link">FAQ</a>
                <a href="#" class="site-footer__link">Shipping</a>
                <a href="#" class="site-footer__link">Returns</a>
              </div>
            </div>
            <div class="site-footer__bottom">
              &copy; ${year} PureShop. Built with vanilla HTML, CSS &amp; JS.
            </div>
          </div>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);
