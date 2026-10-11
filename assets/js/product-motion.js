/* product motion */
(() => {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)"),
    small = matchMedia("(max-width:600px)"),
    fine = matchMedia("(hover:hover) and (pointer:fine)");
  const slots = L.slot,
    reacts = slots.map((e) => e.querySelector(".food-react")),
    n = slots.length;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v)),
    mod = (a, m) => ((a % m) + m) % m;
  let W = 0,
    H = 0,
    T = currentHero,
    th = T + (reduce.matches ? 0 : 3.2),
    v = 0,
    armed = reduce.matches,
    time = 0,
    last = performance.now(),
    visible = true,
    raf = 0,
    drag = null,
    swallow = false;
  let pitch = 0,
    yaw = 0,
    tp = 0,
    ty = 0,
    stx = 0,
    sty = 0,
    tsx = 0,
    tsy = 0,
    anims = [];
  const ph = slots.map(() => Math.random() * 6.28),
    vis = slots.map(() => true),
    lp = slots.map(() => 1e9),
    ly = slots.map(() => 1e9);
  const measure = () => {
    W = heroStage.clientWidth;
    H = heroStage.clientHeight;
  };
  measure();
  new ResizeObserver(measure).observe(heroStage);
  hero.classList.add("flow");
  heroStage._x = 0;
  heroStage._y = 0;
  // riak + uap
  const ripple = document.createElement("div");
  ripple.className = "hero-ripple";
  heroStage.append(ripple);
  const steam = document.createElement("div");
  steam.className = "hero-steam";
  steam.innerHTML = [-60, -20, 18, 58, 0]
    .map((x, i) => `<i style="--x:${x};--d:${i * 0.8}"></i>`)
    .join("");
  heroStage.append(steam);
  function pose(u) {
    const a = Math.abs(u),
      sg = u < 0 ? -1 : 1,
      front = Math.exp(-a * a * 1.6),
      X = W * (small.matches ? 0.43 : 0.39);
    return {
      x: (sg * X * (1 - Math.exp(-a * 1.9))) / (1 - Math.exp(-1.9)),
      y: -H * 0.11 * (1 - Math.exp(-a * 1.5)) - Math.abs(v) * H * 0.035 * front, // melambung saat cincin berputar
      s: 0.4 + 0.6 * Math.exp(-a * a * 2.3),
      r: -7 + 26 * Math.tanh(1.2 * u) - v * 30, // berputar seperti meja putar
      ry: clamp(-u * 30, -55, 55),
      z: -a * 150,
      o: clamp((1.75 - a) * 1.2, 0, 1) * (1 - 0.2 * clamp(a, 0, 1)),
      front,
    };
  }
  function frame(now) {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    time += dt;
    if (drag && drag.on) {
      const nt = drag.th0 - drag.dx / (W * 0.3);
      v += ((nt - th) / Math.max(dt, 0.001) - v) * Math.min(1, dt * 14);
      th = nt;
    } else {
      const goal = armed ? T : T + 3.2,
        sub = Math.max(1, Math.ceil(dt * 120)),
        h = dt / sub;
      for (let i = 0; i < sub; i++) {
        v += (23 * (goal - th) - 7.4 * v) * h;
        th += v * h;
      }
    }
    const m = small.matches ? 0.55 : 1;
    for (let i = 0; i < n; i++) {
      const el = slots[i],
        u = mod(i - th + n / 2, n) - n / 2,
        p = pose(u);
      const iy = Math.sin(time * 1.15 + ph[i]) * 9 * m * p.front,
        ix = Math.sin(time * 0.6 + ph[i]) * 4 * m * p.front,
        ir = Math.sin(time * 0.8 + ph[i] * 1.3) * 1.8 * p.front;
      el.style.transform = `translate3d(${(p.x + ix).toFixed(1)}px,${(p.y + iy).toFixed(1)}px,${p.z.toFixed(0)}px) rotateY(${p.ry.toFixed(1)}deg) rotate(${(p.r + ir).toFixed(2)}deg) scale(${Math.max(0.01, p.s).toFixed(4)})`;
      el.style.opacity = p.o.toFixed(3);
      el.style.zIndex = String(Math.round(100 - Math.abs(u) * 20));
      const vi = p.o > 0.015;
      if (vi !== vis[i]) {
        vis[i] = vi;
        el.style.visibility = vi ? "visible" : "hidden";
      }
      const f = Math.abs(u) < 0.5 ? 1 : -0.45,
        pp = pitch * f,
        yy = yaw * f;
      if (Math.abs(pp - lp[i]) > 0.02 || Math.abs(yy - ly[i]) > 0.02) {
        lp[i] = pp;
        ly[i] = yy;
        reacts[i].style.transform =
          `perspective(950px) rotateX(${pp.toFixed(2)}deg) rotateY(${yy.toFixed(2)}deg)`;
      }
    }
    pitch += (tp - pitch) * Math.min(1, dt * 3.2);
    yaw += (ty - yaw) * Math.min(1, dt * 3.2);
    stx += (tsx - stx) * Math.min(1, dt * 2.6);
    sty += (tsy - sty) * Math.min(1, dt * 2.6);
    if (Math.abs(stx - heroStage._x) > 0.05 || Math.abs(sty - heroStage._y) > 0.05) {
      heroStage._x = stx;
      heroStage._y = sty;
      heroStage.style.transform = `translate3d(${stx.toFixed(2)}px,${sty.toFixed(2)}px,0)`;
    }
    raf = requestAnimationFrame(frame);
  }
  const start = () => {
    if (!raf && visible && !document.hidden) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) start();
  }).observe(hero);
  document.addEventListener("visibilitychange", start);
  // masuk setelah loader selesai: cincin berputar mendarat
  const arm = () => {
    if (armed) return;
    armed = true;
    start();
  };
  if (document.body.classList.contains("ready")) arm();
  else {
    const mo = new MutationObserver(() => {
      if (document.body.classList.contains("ready")) {
        mo.disconnect();
        setTimeout(arm, 150);
      }
    });
    mo.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    setTimeout(arm, 9000);
  }
  if (reduce.matches) {
    th = T;
    frame(performance.now());
  } else start();

  window.animateHeroChange = (change, direction) => {
    const old = currentHero;
    change();
    let d;
    if (window.__dragT != null) {
      d = window.__dragT - T;
      window.__dragT = null;
    } else {
      d = mod(currentHero - old + n / 2, n) - n / 2;
      if (d === -n / 2) d = (direction * n) / 2;
    }
    T += d;
    direction = d < 0 ? -1 : 1;
    if (reduce.matches) {
      th = T;
      return;
    }
    anims.forEach((a) => a.cancel());
    anims = [];
    const play = (el, f, o) => {
        if (el && el.animate) anims.push(el.animate(f, o));
      },
      ease = "cubic-bezier(.16,1,.3,1)";
    play(
      ripple,
      [
        { transform: "scale(.45)", opacity: 0.55 },
        { transform: "scale(1.35)", opacity: 0 },
      ],
      { duration: 1500, delay: 420, easing: "cubic-bezier(.2,.7,.2,1)", fill: "backwards" },
    );
    window.heroGiantOut && window.heroGiantOut(L.giant[old], direction);
    window.heroGiantIn && window.heroGiantIn(L.giant[currentHero], direction, 200);
    window.heroPulse && window.heroPulse(direction);
    [...L.text[currentHero].children].forEach((c, i) =>
      play(
        c,
        [
          { transform: "translateY(22px)", opacity: 0 },
          { transform: "none", opacity: 1 },
        ],
        { duration: 900, delay: 260 + i * 90, easing: ease, fill: "backwards" },
      ),
    );
    play(
      document.querySelector(".hero-price"),
      [
        { transform: "translateY(16px)", opacity: 0 },
        { transform: "none", opacity: 1 },
      ],
      { duration: 950, delay: 360, easing: ease, fill: "backwards" },
    );
    if (!small.matches)
      document.querySelectorAll(".hero-spark").forEach((el, i) =>
        play(
          el,
          [
            { translate: "0 0", rotate: "0deg", scale: 1 },
            {
              translate: `${direction * (i ? 34 : -26)}px -26px`,
              rotate: `${direction * 80}deg`,
              scale: 1.25,
              offset: 0.5,
            },
            { translate: "0 0", rotate: "0deg", scale: 1 },
          ],
          { duration: 1600, easing: "cubic-bezier(.4,0,.2,1)" },
        ),
      );
    start();
  };
  // geser untuk memutar cincin
  hero.addEventListener("pointerdown", (e) => {
    if (reduce.matches || e.button > 0 || e.target.closest("button,a,input")) return;
    drag = { x: e.clientX, th0: th, dx: 0, on: false, id: e.pointerId };
  });
  hero.addEventListener(
    "pointermove",
    (e) => {
      if (drag) {
        drag.dx = e.clientX - drag.x;
        if (!drag.on && Math.abs(drag.dx) > 8) {
          drag.on = true;
          drag.th0 = th;
          drag.x = e.clientX;
          drag.dx = 0;
          hero.classList.add("dragging");
          try {
            hero.setPointerCapture(drag.id);
          } catch (_) {}
        }
      }
      if (fine.matches && !drag) {
        const r = hero.getBoundingClientRect(),
          nx = (e.clientX - r.left) / r.width - 0.5,
          ny = (e.clientY - r.top) / r.height - 0.5;
        ty = nx * 12;
        tp = -ny * 8;
        tsx = nx * -16;
        tsy = ny * -11;
      }
    },
    { passive: true },
  );
  const end = () => {
    if (!drag) return;
    const was = drag.on;
    drag = null;
    hero.classList.remove("dragging");
    if (!was) return;
    swallow = true;
    setTimeout(() => (swallow = false), 60);
    const nt = clamp(Math.round(th + v * 0.18), T - 3, T + 3),
      idx = mod(nt, n);
    if (idx !== currentHero) {
      window.__dragT = nt;
      goTo(idx);
      if (window.__dragT != null) window.__dragT = null;
    }
  };
  hero.addEventListener("pointerup", end);
  hero.addEventListener("pointercancel", end);
  hero.addEventListener(
    "click",
    (e) => {
      if (swallow) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true,
  );
  hero.addEventListener("pointerleave", () => {
    tp = 0;
    ty = 0;
    tsx = 0;
    tsy = 0;
  });
  addEventListener("resize", measure);
})();
