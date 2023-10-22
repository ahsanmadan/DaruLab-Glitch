var nav = document.querySelector("nav");

window.addEventListener("scroll", function () {
  if (this.window.pageYOffset > 100) {
    nav.classList.add("transnav", "shadow");
  } else {
    nav.classList.remove("transnav", "shadow");
  }
});