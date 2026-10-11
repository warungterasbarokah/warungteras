/* text motion */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.25, rootMargin: "0px 0px -6% 0px" },
    );
    document
      .querySelectorAll(".nx-head h2,.nx-about h2,.lm-t,.ow-txt h2,.cta-section h2")
      .forEach((h) => {
        if (h.querySelector("*:not(br)")) return;
        let n = 0;
        h.innerHTML = h.innerHTML
          .split(/<br\s*\/?>/i)
          .map((p) =>
            p
              .trim()
              .split(/\s+/)
              .map((w) => `<span class="hw"><span style="--i:${n++}">${w}</span></span>`)
              .join(" "),
          )
          .join("<br>");
        h.classList.add("hsplit");
        io.observe(h);
      });
    const groups = [".nx-menu", ".nx-bento", ".nx-steps", ".ct-list", ".nx-gal", ".nx-stats"];
    groups.forEach((g) =>
      document
        .querySelectorAll(g)
        .forEach((box) =>
          [...box.children].forEach((c, i) => c.style.setProperty("--rd", (i % 4) * 0.09 + "s")),
        ),
    );
    document.querySelectorAll(".ct-map,.ow-photo,.ow-txt,.ct-list").forEach((el) => {
      el.classList.add("reveal-pending");
      io.observe(el);
    });
    const rv = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            rv.unobserve(e.target);
          }
        }),
      { threshold: 0.1 },
    );
    document.querySelectorAll(".ct-map,.ow-photo,.ow-txt,.ct-list").forEach((el) => rv.observe(el));
  }
  if (matchMedia("(hover:hover) and (pointer:fine)").matches && !reduce) {
    let raf = 0,
      ev = null,
      cur = null;
    const reset = () => {
      if (cur) {
        cur.style.translate = "";
        cur = null;
      }
    };
    document.addEventListener(
      "pointermove",
      (e) => {
        ev = e;
        if (raf) return;
        raf = requestAnimationFrame(() => {
          raf = 0;
          const b = ev.target.closest && ev.target.closest(".magnetic,.kbtn");
          if (!b) {
            reset();
            return;
          }
          if (cur && cur !== b) reset();
          cur = b;
          const r = b.getBoundingClientRect();
          b.style.translate = `${(ev.clientX - r.left - r.width / 2) * 0.16}px ${(ev.clientY - r.top - r.height / 2) * 0.24}px`;
        });
      },
      { passive: true },
    );
    document.addEventListener("pointerleave", reset);
  }
})();
