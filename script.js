document.querySelectorAll(".layer").forEach(l => l.style.pointerEvents = "none");

const siteHeader = document.querySelector(".site-header");

const updateNavState = () => {
  siteHeader?.classList.toggle("solid", window.scrollY > 40);
};

updateNavState();
window.addEventListener("scroll", updateNavState, { passive: true });
