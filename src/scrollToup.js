export function initScrollToTop(buttonSelector = ".up", showAfter = 500) {
  const span = document.querySelector(buttonSelector);

  if (!span) {
    console.warn(`Element with selector "${buttonSelector}" not found.`);
    return;
  }

  window.onscroll = function () {
    if (window.scrollY >= showAfter) {
      span.classList.add("show");
    } else {
      span.classList.remove("show");
    }
  };

  span.onclick = function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
}