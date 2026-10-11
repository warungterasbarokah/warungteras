/* benefits */
(() => {
  const g = document.getElementById("whyGrid");
  if (!g) return;
  if (
    !matchMedia("(hover:hover) and (pointer:fine)").matches ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  )
    return;
  g.addEventListener("pointermove", (e) => {
    const c = e.target.closest(".nx-bx");
    if (!c) return;
    const r = c.getBoundingClientRect();
    c.style.setProperty("--mx", e.clientX - r.left + "px");
    c.style.setProperty("--my", e.clientY - r.top + "px");
  });
  g.addEventListener("pointerout", (e) => {
    const c = e.target.closest(".nx-bx");
    if (c && !c.contains(e.relatedTarget)) {
      c.style.removeProperty("--mx");
      c.style.removeProperty("--my");
    }
  });
})();
