const siteHeader = document.querySelector(".site-header");

const updateNavState = () => {
  siteHeader?.classList.toggle("solid", window.scrollY > 40);
};

updateNavState();
window.addEventListener("scroll", updateNavState, { passive: true });
