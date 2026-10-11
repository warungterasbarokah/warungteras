/* nav */
(() => {
  const nav = document.getElementById("navLinks");
  if (!nav) return;
  const links = [...nav.querySelectorAll("a")],
    pill = document.createElement("span");
  pill.className = "nx-pill";
  nav.prepend(pill);
  let hov = null;
  const act = () => links.find((a) => a.classList.contains("active")) || links[0];
  function place(a) {
    if (!a || !a.offsetWidth) return;
    pill.style.width = a.offsetWidth + "px";
    pill.style.height = a.offsetHeight + "px";
    pill.style.transform = `translate(${a.offsetLeft}px,${a.offsetTop}px)`;
    links.forEach((l) => l.classList.toggle("hov", l === a));
    nav.classList.toggle("hovering", !!hov);
  }
  const sync = () => place(hov || act());
  links.forEach((a) => {
    a.addEventListener("pointerenter", () => {
      hov = a;
      sync();
    });
    a.addEventListener("focus", () => {
      hov = a;
      sync();
    });
    a.addEventListener("blur", () => {
      hov = null;
      sync();
    });
  });
  nav.addEventListener("pointerleave", () => {
    hov = null;
    sync();
  });
  new MutationObserver(() => {
    if (!hov) sync();
  }).observe(nav, { subtree: true, attributes: true, attributeFilter: ["class"] });
  pill.style.transition = "none";
  sync();
  requestAnimationFrame(() => requestAnimationFrame(() => (pill.style.transition = "")));
  addEventListener("resize", sync);
  addEventListener("load", sync);
  document.fonts && document.fonts.ready.then(sync);
  document.getElementById("navbar").addEventListener("transitionend", sync);
  // foto Lihat Menu berputar pelan mengikuti scroll
  const lm = document.getElementById("lmPlate");
  if (lm && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let raf = 0;
    const upd = () => {
      raf = 0;
      const r = lm.getBoundingClientRect(),
        p = (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight;
      lm.style.setProperty("--sr", (p * 42).toFixed(1) + "deg");
    };
    addEventListener(
      "scroll",
      () => {
        if (!raf) raf = requestAnimationFrame(upd);
      },
      { passive: true },
    );
    upd();
  }
})();
