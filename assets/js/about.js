/* about */
(function () {
  const sec = document.getElementById("tentang"),
    ab = document.getElementById("ab");
  if (!sec || !ab) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches,
    fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const vis = document.getElementById("abVis"),
    nums = [...ab.querySelectorAll(".ab-st i[data-to]")];
  ab.querySelectorAll(".ab-pl").forEach((e, i) => e.style.setProperty("--i", i));
  ab.querySelectorAll(".ab-pills span").forEach((e, i) => e.style.setProperty("--i", i));
  ab.classList.add("js");
  function count() {
    nums.forEach((el, k) => {
      const to = +el.dataset.to;
      if (reduce) {
        el.textContent = to;
        return;
      }
      const t0 = performance.now() + 1000 + k * 160,
        dur = 1500;
      el.textContent = "0";
      (function tick(now) {
        const p = Math.min(1, Math.max(0, (now - t0) / dur)),
          e = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = Math.round(to * e);
        if (p < 1) requestAnimationFrame(tick);
      })(performance.now());
    });
  }
  nums.forEach((el) => (el.textContent = "0"));
  let shown = false;
  const io = new IntersectionObserver(
    (es) =>
      es.forEach((x) => {
        ab.classList.toggle("live", x.isIntersecting);
        if (x.isIntersecting && !shown) {
          shown = true;
          ab.classList.add("in");
          count();
          setTimeout(() => ab.classList.add("done"), 3200);
        }
      }),
    { threshold: 0.15 },
  );
  io.observe(ab);
  if (reduce || !fine || !vis) return;
  let raf = 0;
  vis.addEventListener("pointermove", (e) => {
    const r = vis.getBoundingClientRect(),
      x = (e.clientX - r.left) / r.width - 0.5,
      y = (e.clientY - r.top) / r.height - 0.5;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      vis.style.setProperty("--ry", (x * 8).toFixed(1) + "deg");
      vis.style.setProperty("--rx", (-y * 6).toFixed(1) + "deg");
    });
  });
  vis.addEventListener("pointerleave", () => {
    vis.style.removeProperty("--rx");
    vis.style.removeProperty("--ry");
  });
})();
