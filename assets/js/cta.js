/* cta */
(() => {
  const sec = document.getElementById("cta-final"),
    fx = document.getElementById("cta2Fx");
  if (!sec || !fx) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches,
    fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const small = () => innerWidth < 700;
  const D = [
    // x,y = % dari section (pusat piring), w = lebar px, r = putaran, d = kedalaman paralaks
    ["mie-nyemek", 11, 27, 175, -14, 1.0, [13, 11, 66]],
    ["seblak", 89, 26, 165, 13, 1.0, [87, 11, 62]],
    ["burger", 20, 77, 120, 10, 0.6, [85, 90, 66]],
    ["kebab", 80, 76, 135, -9, 0.7, [14, 90, 70]],
    ["mie-tiaw", 3.5, 58, 96, -6, 0.4, null],
    ["nasi-goreng", 96.5, 60, 96, 8, 0.45, null],
  ];
  const pl = D.map(([k, x, y, w, r, d, m], i) => {
    const el = document.createElement("div");
    el.className = "cta2-plate";
    el.innerHTML = `<img src="assets/img/${k}.webp" alt="" loading="lazy" decoding="async" draggable="false">`;
    fx.append(el);
    return {
      el,
      x,
      y,
      w,
      r,
      d,
      m,
      ph: Math.random() * 6.28,
      sp: 0.5 + Math.random() * 0.5,
      k: reduce ? 1 : 0,
    };
  });
  let W = 0,
    H = 0;
  const measure = () => {
    const b = sec.getBoundingClientRect();
    W = b.width;
    H = b.height;
    pl.forEach((p) => {
      const s = small(),
        m = p.m;
      if (s && !m) {
        p.el.style.display = "none";
        return;
      }
      p.el.style.display = "";
      p.cx = s ? m[0] : p.x;
      p.cy = s ? m[1] : p.y;
      const w = s ? m[2] : p.w;
      p.el.style.setProperty("--w", w + "px");
      p.hw = w / 2;
    });
  };
  measure();
  new ResizeObserver(measure).observe(sec);
  let mx = 0,
    my = 0,
    tx = 0,
    ty = 0,
    sx = 50,
    sy = 46,
    tsx = 50,
    tsy = 46,
    vis = false,
    raf = 0,
    t0 = 0,
    started = false,
    p = 0;
  const ease = (t) => {
    t = Math.min(1, Math.max(0, t));
    const c = 1.9;
    return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2);
  }; // easeOutBack
  function frame(now) {
    raf = 0;
    if (!vis) return;
    const time = now / 1000;
    const r = sec.getBoundingClientRect();
    p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height)));
    mx += (tx - mx) * 0.07;
    my += (ty - my) * 0.07;
    sx += (tsx - sx) * 0.12;
    sy += (tsy - sy) * 0.12;
    sec.style.setProperty("--mx", sx.toFixed(1) + "%");
    sec.style.setProperty("--my", sy.toFixed(1) + "%");
    pl.forEach((q, i) => {
      if (q.el.style.display === "none") return;
      if (!reduce && started) q.k = ease((now - t0 - i * 110) / 1250);
      const k = Math.max(0, q.k),
        dr = reduce ? 0 : 1;
      const bx = (q.cx / 100) * W,
        by = (q.cy / 100) * H,
        ox = Math.sin(time * 0.55 * q.sp + q.ph) * 10 * dr + mx * 34 * q.d,
        oy = Math.cos(time * 0.7 * q.sp + q.ph) * 14 * dr + my * 26 * q.d + (p - 0.5) * -90 * q.d,
        rot =
          q.r + Math.sin(time * 0.5 * q.sp + q.ph) * 4 * dr + (p - 0.5) * 50 * q.d + (1 - k) * 140;
      const fx0 = W / 2 - bx,
        fy0 = H * 0.46 - by; // masuk dari tengah (belakang teks)
      const x = bx - q.hw + ox + fx0 * (1 - k),
        y = by - q.hw + oy + fy0 * (1 - k);
      q.el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0) rotate(${rot.toFixed(2)}deg) scale(${(0.15 + 0.85 * k).toFixed(3)})`;
      q.el.style.opacity = Math.min(1, k * 1.6).toFixed(2);
    });
    raf = requestAnimationFrame(frame);
  }
  const go = () => {
    if (!raf && vis) raf = requestAnimationFrame(frame);
  };
  new IntersectionObserver(
    ([e]) => {
      vis = e.isIntersecting;
      if (vis) {
        if (!started) {
          started = true;
          t0 = performance.now() + 120;
        }
        go();
      }
    },
    { threshold: 0.12 },
  ).observe(sec);
  if (reduce) {
    vis = true;
    started = true;
    frame(performance.now());
    vis = false;
  }

  if (fine && !reduce) {
    sec.addEventListener(
      "pointermove",
      (e) => {
        const b = sec.getBoundingClientRect(),
          nx = (e.clientX - b.left) / b.width,
          ny = (e.clientY - b.top) / b.height;
        tx = nx - 0.5;
        ty = ny - 0.5;
        tsx = nx * 100;
        tsy = ny * 100;
      },
      { passive: true },
    );
    sec.addEventListener("pointerleave", () => {
      tx = ty = 0;
      tsx = 50;
      tsy = 46;
    });
    // tombol magnetik + percikan bintang
    sec.querySelectorAll(".cta2-btn").forEach((b) => {
      b.addEventListener("pointermove", (e) => {
        const r = b.getBoundingClientRect();
        b.style.setProperty("--tx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
        b.style.setProperty("--ty", ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + "px");
      });
      b.addEventListener("pointerleave", () => {
        b.style.setProperty("--tx", "0px");
        b.style.setProperty("--ty", "0px");
      });
    });
    const row = sec.querySelector(".cta2-row"),
      prim = sec.querySelector(".kbtn-primary.cta2-btn");
    if (row && prim)
      prim.addEventListener("pointerenter", () => {
        const rr = row.getBoundingClientRect(),
          br = prim.getBoundingClientRect(),
          cx = br.left - rr.left + br.width / 2,
          cy = br.top - rr.top + br.height / 2;
        for (let i = 0; i < 9; i++) {
          const s = document.createElement("span");
          s.className = "cta2-sp";
          s.textContent = i % 2 ? "✦" : "✳";
          s.style.fontSize = 9 + Math.random() * 11 + "px";
          row.append(s);
          const a = -Math.PI / 2 + (i - 4) * 0.42 + (Math.random() - 0.5) * 0.3,
            d = 60 + Math.random() * 60;
          const an = s.animate(
            [
              { transform: `translate(${cx}px,${cy}px) scale(.3) rotate(0)`, opacity: 1 },
              {
                transform: `translate(${cx + Math.cos(a) * d}px,${cy + Math.sin(a) * d - 18}px) scale(1) rotate(${(Math.random() - 0.5) * 200}deg)`,
                opacity: 0,
              },
            ],
            { duration: 750 + Math.random() * 350, easing: "cubic-bezier(.2,.7,.3,1)" },
          );
          an.onfinish = () => s.remove();
        }
      });
  }
})();
