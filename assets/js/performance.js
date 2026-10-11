/* performance */
(() => {
  "use strict";
  const H = document.documentElement;
  document.addEventListener("visibilitychange", () =>
    H.classList.toggle("tab-off", document.hidden),
  );
  if (!("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.target.classList.toggle("is-off", !e.isIntersecting)),
    { rootMargin: "160px 0px" },
  );
  document.querySelectorAll("body > section, body > footer").forEach((el) => io.observe(el));
})();
