const siteHeader = document.querySelector(".site-header");

const updateNavState = () => {
  siteHeader?.classList.toggle("solid", window.scrollY > 40);
};

updateNavState();
window.addEventListener("scroll", updateNavState, { passive: true });

if (document.querySelector("[data-cms]")) {
  fetch("content/homepage.json")
    .then((response) => {
      if (!response.ok) throw new Error("Homepage copy could not be loaded.");
      return response.json();
    })
    .then((copy) => {
      document.querySelectorAll("[data-cms]").forEach((element) => {
        const key = element.dataset.cms;
        if (typeof copy[key] === "string") element.textContent = copy[key];
      });
    })
    .catch((error) => console.warn(error.message));
}
