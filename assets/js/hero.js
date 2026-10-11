/* hero */
(() => {
  const hero = document.getElementById("hero"),
    stage = document.getElementById("heroStage"),
    wrap = document.getElementById("heroGiant");
  if (!hero || !stage || !wrap || typeof THEME === "undefined" || typeof L === "undefined") return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches,
    small = matchMedia("(max-width:600px)");
  const E_OUT = "cubic-bezier(.16,1,.3,1)";

  /* ---------- latar ---------- */
  const bg = document.createElement("div");
  bg.className = "hero-bg";
  bg.setAttribute("aria-hidden", "true");
  const layers = {};
  ["red", "cream", "dark", "maroon"].forEach((t) => {
    const d = document.createElement("div");
    d.className = "hb hb-" + t;
    layers[t] = d;
    bg.append(d);
  });
  const grain = document.createElement("div");
  grain.className = "hero-grain";
  const dust = document.createElement("div");
  dust.className = "hero-dust";
  dust.innerHTML = Array.from({ length: small.matches ? 9 : 15 }, (_, i) => {
    const r = (a, b) => (a + Math.random() * (b - a)).toFixed(2);
    return `<i style="--x:${r(2, 98)}%;--s:${r(3, 7)}px;--t:${r(14, 26)}s;--d:${-r(0, 22)}s;--dx:${r(-40, 40)}px"></i>`;
  }).join("");
  hero.prepend(bg);

  let tone = null,
    z = 1,
    revealAnim = null;
  const center = () => {
    const h = hero.getBoundingClientRect(),
      r = stage.getBoundingClientRect();
    return [r.left - h.left + r.width / 2, r.top - h.top + r.height / 2, h.width, h.height];
  };
  function setBg(idx, animate) {
    const t = THEME[idx].tone || "red";
    hero.dataset.tone = t;
    const mq = document.querySelector(".marquee.mq2");
    if (mq) {
      clearTimeout(mq._t);
      const mt = t === "maroon" ? "red" : t;
      if (!animate || reduce) mq.dataset.tone = mt;
      else mq._t = setTimeout(() => (mq.dataset.tone = mt), 520);
    }
    if (t === tone) return;
    const el = layers[t],
      prev = tone && layers[tone];
    tone = t;
    if (revealAnim) {
      revealAnim.cancel();
      revealAnim = null;
      Object.values(layers).forEach((l) => l.classList.remove("under"));
    }
    if (prev) {
      prev.classList.remove("on");
      prev.classList.add("under");
    }
    el.style.zIndex = String(++z);
    el.classList.add("on");
    if (!animate || reduce || !prev) {
      if (prev) prev.classList.remove("under");
      return;
    }
    const [cx, cy, w, h] = center(),
      R = Math.hypot(Math.max(cx, w - cx), Math.max(cy, h - cy)) + 30;
    revealAnim = el.animate(
      [
        { clipPath: `circle(0px at ${cx}px ${cy}px)` },
        { clipPath: `circle(${R}px at ${cx}px ${cy}px)` },
      ],
      { duration: 1150, easing: "cubic-bezier(.7,0,.2,1)" },
    );
    const a = revealAnim;
    a.onfinish = () => {
      if (revealAnim === a) {
        revealAnim = null;
        prev.classList.remove("under");
      }
    };
  }

  /* ---------- halo + cincin ---------- */
  const halo = document.createElement("div");
  halo.className = "hero-halo";
  const mk = (cls, dots) => {
    const s = document.createElement("div");
    s.className = "hero-spin " + cls;
    s.innerHTML = `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="r1" cx="50" cy="50" r="49"/><circle class="r2" cx="50" cy="50" r="46.5"/>${dots}</svg>`;
    return s;
  };
  const spin = mk("", "");
  const spin2 = mk("rev", "");
  stage.prepend(spin2);
  stage.prepend(spin);
  stage.prepend(halo);

  /* ---------- teks raksasa ---------- */
  const giants = L.giant;
  giants.forEach((g, i) => {
    g.style.color = THEME[i].ink;
    g.querySelectorAll(".word").forEach((w) => {
      const t = w.textContent;
      w.setAttribute("aria-hidden", "true");
      w.innerHTML = [...t].map((c) => `<span class="gc">${c}</span>`).join("");
    });
  });
  function fit() {
    const aw = wrap.clientWidth * (small.matches ? 0.94 : 0.9),
      cap = Math.min(small.matches ? 118 : 250, wrap.clientHeight * 1.12);
    giants.forEach((g) => {
      g.style.setProperty("--gfs", "100px");
      const w = g.getBoundingClientRect().width || 1;
      g.style.setProperty("--gfs", Math.max(40, Math.min(cap, (100 * aw) / w)).toFixed(1) + "px");
    });
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
  let rt;
  addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(fit, 120);
  });
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = setTimeout(fit, 60);
  }).observe(wrap);

  window.heroGiantIn = (g, dir = 1, delay = 180) => {
    if (reduce || !g) return;
    g.querySelectorAll(".gc").forEach((c, i) =>
      c.animate(
        [
          { transform: `translateY(118%) rotate(${dir * 8}deg)`, opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 1100, delay: delay + i * 45, easing: E_OUT, fill: "backwards" },
      ),
    );
  };
  window.heroGiantOut = (g, dir = 1) => {
    if (reduce || !g) return;
    g.querySelectorAll(".gc").forEach((c, i) =>
      c.animate(
        [{ transform: "none" }, { transform: `translateY(-118%) rotate(${-dir * 6}deg)` }],
        { duration: 520, delay: i * 20, easing: "cubic-bezier(.55,0,.85,.35)", fill: "forwards" },
      ),
    );
  };
  window.heroPulse = (dir = 1) => {
    if (reduce) return;
    halo.animate(
      [
        { scale: 0.78, opacity: 0.2 },
        { scale: 1.1, opacity: 1, offset: 0.45 },
        { scale: 1, opacity: 1 },
      ],
      { duration: 1500, delay: 260, easing: E_OUT, fill: "backwards" },
    );
    spin.animate(
      [
        { scale: 0.88, opacity: 0.3 },
        { scale: 1.05, offset: 0.5, opacity: 1 },
        { scale: 1, opacity: 1 },
      ],
      { duration: 1500, delay: 300, easing: E_OUT, fill: "backwards" },
    );
    spin2.animate([{ scale: 0.94 }, { scale: 1.03, offset: 0.5 }, { scale: 1 }], {
      duration: 1700,
      delay: 340,
      easing: E_OUT,
    });
  };

  /* ---------- sambungkan ke renderHero ---------- */
  const _render = window.renderHero;
  if (typeof _render === "function")
    window.renderHero = function () {
      _render.apply(this, arguments);
      setBg(currentHero, true);
    };
  setBg(currentHero, false);

  /* masuk pertama setelah loading selesai */
  const enter = () => {
    window.heroGiantIn(giants[currentHero], 1, 350);
    halo.animate(
      [
        { scale: 0.7, opacity: 0 },
        { scale: 1, opacity: 1 },
      ],
      { duration: 1600, delay: 200, easing: E_OUT, fill: "backwards" },
    );
  };
  if (document.body.classList.contains("ready")) enter();
  else {
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains("ready")) {
        mo.disconnect();
        enter();
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
})();
