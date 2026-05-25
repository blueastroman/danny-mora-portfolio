document.querySelectorAll(".layer").forEach(l => l.style.pointerEvents = "none");

const siteHeader = document.querySelector(".site-header");

const updateNavState = () => {
  siteHeader?.classList.toggle("solid", window.scrollY > 40);
};

updateNavState();
window.addEventListener("scroll", updateNavState, { passive: true });

// Content loader — reads content.json and populates [data-content] elements
(function () {
  fetch("/content.json")
    .then(r => r.json())
    .then(data => {
      document.querySelectorAll("[data-content]").forEach(el => {
        const val = el.getAttribute("data-content")
          .split(".")
          .reduce((o, k) => o?.[k], data);
        if (val != null && val !== "") el.textContent = val;
      });
    })
    .catch(() => {}); // silently fail — hardcoded content stays visible
})();
