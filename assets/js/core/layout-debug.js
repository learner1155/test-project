/**
 * LAYOUT-DEBUG.JS — site-wrap (1440 max) + container (1368 max)
 */

const SITE_MAX = 1440;
const CONTAINER_MAX = 1368;

function updateDebugBar() {
  const vw = window.innerWidth;
  const siteWrap = document.querySelector(".site-wrap");
  const container = document.querySelector(".container");
  const siteW = siteWrap ? siteWrap.offsetWidth : 0;
  const containerW = container ? container.offsetWidth : 0;
  const innerGutter = siteW > CONTAINER_MAX ? Math.round((siteW - CONTAINER_MAX) / 2) : 0;

  const bar = document.getElementById("layout-debug-bar");
  if (!bar) return;

  bar.innerHTML = `
    <span class="debug-tag debug-tag--viewport">Viewport</span> <strong>${vw}px</strong>
    <span>|</span>
    <span class="debug-tag debug-tag--site">.site-wrap</span> <strong>${siteW}px</strong> / ${SITE_MAX}px max
    <span>|</span>
    <span class="debug-tag debug-tag--container">.container</span> <strong>${containerW}px</strong> / ${CONTAINER_MAX}px max
    <span>|</span>
    Inner gutter: <strong>${innerGutter}px</strong> each side
    <span style="opacity:0.6">Ctrl+Shift+D</span>
  `;
}

function enableDebug() {
  document.body.classList.add("debug-layout");
  if (!document.getElementById("layout-debug-styles")) {
    const link = document.createElement("link");
    link.id = "layout-debug-styles";
    link.rel = "stylesheet";
    link.href = `${window.location.pathname.includes("/pages/") ? "../" : ""}assets/css/debug-layout.css`;
    document.head.appendChild(link);
  }
  if (!document.getElementById("layout-debug-bar")) {
    const bar = document.createElement("div");
    bar.id = "layout-debug-bar";
    bar.className = "layout-debug-bar";
    document.body.appendChild(bar);
  }
  updateDebugBar();
  window.addEventListener("resize", updateDebugBar);
}

function disableDebug() {
  document.body.classList.remove("debug-layout");
  document.getElementById("layout-debug-bar")?.remove();
  document.getElementById("layout-debug-styles")?.remove();
  window.removeEventListener("resize", updateDebugBar);
}

if (new URLSearchParams(window.location.search).has("debug")) enableDebug();

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.shiftKey && e.key === "D") {
    e.preventDefault();
    document.body.classList.contains("debug-layout") ? disableDebug() : enableDebug();
  }
});

export { enableDebug, disableDebug };
