/**
 * ABOUT.JS — About page
 * Loads header copy from site.json
 */

import { getAbout } from "../data/site.js";

const heroEl = document.querySelector("[data-about-hero]");

async function initAbout() {
  if (!heroEl) return;

  try {
    const about = await getAbout();
    heroEl.innerHTML = `
      <h2>${about.title}</h2>
      <p class="text-muted">${about.subtitle}</p>
    `;
  } catch (err) {
    console.error(err);
  }
}

const form = document.querySelector("[data-contact-form]");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("[name='name']").value.trim();
    const email = form.querySelector("[name='email']").value.trim();
    const message = form.querySelector("[name='message']").value.trim();

    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }

    if (!email.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }

    console.log("Contact form submitted:", { name, email, message });
    alert("Thank you! Your message has been received. (Demo — no email sent)");
    form.reset();
  });
}

initAbout();
