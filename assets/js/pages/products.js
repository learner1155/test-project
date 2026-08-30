/**
 * PRODUCTS.JS — Product listing page
 * Loads catalog and categories from products.json
 */

import { getProducts, getCategories } from "../data/products.js";
import { renderProductCard, bindAddToCart } from "../components/product-card.js";

const grid = document.querySelector("[data-products-grid]");
const filterContainer = document.querySelector("[data-filters]");
const countEl = document.querySelector("[data-products-count]");

let allProducts = [];
let activeCategory = "all";

async function initProductsPage() {
  if (grid) grid.innerHTML = `<p class="text-muted text-center">Loading products...</p>`;

  try {
    allProducts = await getProducts();
    const categories = await getCategories();

    if (filterContainer) renderFilters(categories);
    if (grid) {
      renderProducts(allProducts);
      bindAddToCart(grid);
    }
  } catch (err) {
    if (grid) {
      grid.innerHTML = `<p class="text-muted text-center">Could not load products. Run via a local server.</p>`;
    }
    console.error(err);
  }
}

function renderFilters(categories) {
  filterContainer.innerHTML = categories
    .map(
      (cat) => `
    <button class="filter-btn ${cat === activeCategory ? "filter-btn--active" : ""}"
            data-filter="${cat}">
      ${cat.charAt(0).toUpperCase() + cat.slice(1)}
    </button>
  `
    )
    .join("");

  filterContainer.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-filter]");
    if (!btn) return;

    activeCategory = btn.dataset.filter;

    filterContainer.querySelectorAll(".filter-btn").forEach((b) => {
      b.classList.toggle("filter-btn--active", b.dataset.filter === activeCategory);
    });

    const filtered =
      activeCategory === "all"
        ? allProducts
        : allProducts.filter((p) => p.category === activeCategory);

    renderProducts(filtered);
  });
}

function renderProducts(items) {
  if (countEl) {
    countEl.textContent = `${items.length} product${items.length !== 1 ? "s" : ""}`;
  }

  if (items.length === 0) {
    grid.innerHTML = `<div class="products-empty"><p>No products found in this category.</p></div>`;
    return;
  }

  grid.innerHTML = items.map(renderProductCard).join("");
}

initProductsPage();
