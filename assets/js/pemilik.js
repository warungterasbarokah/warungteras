/* pemilik */
(() => {
  "use strict";
  const s = document.getElementById("pemilik");
  if (!s) return;
  if (
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    s.classList.add("in");
    return;
  }
  s.classList.add("pm-armed");
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        s.classList.add("in");
        io.disconnect();
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
  );
  io.observe(s);
})();
