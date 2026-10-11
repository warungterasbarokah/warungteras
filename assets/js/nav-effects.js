/* nav effects */
(() => {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  const prog = document.createElement("span");
  prog.className = "nx-prog";
  prog.setAttribute("aria-hidden", "true");
  nav.appendChild(prog);
  let raf = 0;
  const upd = () => {
    raf = 0;
    const h = document.documentElement.scrollHeight - innerHeight;
    nav.style.setProperty("--np", h > 0 ? Math.min(1, Math.max(0, scrollY / h)).toFixed(4) : 0);
  };
  addEventListener(
    "scroll",
    () => {
      if (!raf) raf = requestAnimationFrame(upd);
    },
    { passive: true },
  );
  addEventListener("resize", upd);
  upd();
  if (matchMedia("(hover:hover) and (pointer:fine)").matches) {
    let r2 = 0,
      ev = null;
    nav.addEventListener(
      "pointermove",
      (e) => {
        ev = e;
        if (r2) return;
        r2 = requestAnimationFrame(() => {
          r2 = 0;
          const b = nav.getBoundingClientRect();
          nav.style.setProperty("--mx", ev.clientX - b.left + "px");
          nav.style.setProperty("--my", ev.clientY - b.top + "px");
        });
      },
      { passive: true },
    );
    nav.addEventListener("pointerleave", () => {
      nav.style.setProperty("--mx", "50%");
      nav.style.setProperty("--my", "0%");
    });
  }
})();
