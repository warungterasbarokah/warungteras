/* page effects */
(() => {
  "use strict";
  const D = document,
    H = D.documentElement,
    B = D.body;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  const $ = (s, r = D) => r.querySelector(s),
    $$ = (s, r = D) => [...r.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2); // easeInOutCubic

  /* ---------- 1. PROMO JUMAT (jam Jakarta) ---------- */
  const jkt = () => {
    const p = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Jakarta",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: false,
    }).formatToParts(new Date());
    const g = (t) => p.find((x) => x.type === t).value;
    return {
      wd: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(g("weekday")),
      h: +g("hour") % 24,
      m: +g("minute"),
    };
  };
  window.wtFriday = () => jkt().wd === 5;
  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  function promoUI() {
    const t = jkt(),
      on = t.wd === 5;
    const st = $("#pjStatus"),
      tx = $("#pjStT"),
      mp = $("#mnPromoSt"),
      dr = $("#drPromo");
    let txt, short;
    if (on) {
      txt = "Promo aktif hari ini — minuman es gratis!";
      short = "Aktif hari ini";
    } else {
      const left = (5 - t.wd + 7) % 7 || 7;
      txt = left === 1 ? "Promo mulai besok (Jumat)" : `Promo Jumat ${left} hari lagi`;
      short = left === 1 ? "Besok Jumat" : `${left} hari lagi`;
    }
    tx && (tx.textContent = txt);
    mp && (mp.textContent = short);
    st && st.classList.toggle("on", on);
    mp && mp.classList.toggle("on", on);
    dr && (dr.hidden = !on);
  }
  promoUI();
  setInterval(promoUI, 60000);

  /* ---------- 2. TEPI SECTION: lapisan bayangan bergelombang ---------- */
  const edges = $$(".edge[data-edge]");
  const ghosts = [];
  edges.forEach((e) => {
    const prev = e.previousElementSibling;
    if (!prev) return;
    if (getComputedStyle(prev).position === "static") prev.style.position = "relative";
    ["g1", "g2"].forEach((c) => {
      const g = D.createElement("i");
      g.className = "eg " + c;
      g.setAttribute("aria-hidden", "true");
      g.setAttribute("data-edge", e.dataset.edge);
      if (e.dataset.gc) g.style.setProperty("--gc", e.dataset.gc);
      prev.appendChild(g);
      ghosts.push(g);
    });
  });
  if ("IntersectionObserver" in window) {
    const gio = new IntersectionObserver(
      (es) => es.forEach((x) => x.target.classList.toggle("off", !x.isIntersecting)),
      { rootMargin: "200px" },
    );
    ghosts.forEach((g) => gio.observe(g));
  }

  /* ---------- 3. REVEAL SCROLL ---------- */
  $$(".reveal-pending").forEach((el) => el.classList.remove("reveal-pending")); // gantikan animasi lama
  const groups = [
    [".nx-head", [".nx-eyebrow", "h2", "p"]],
    [".mn-head", ["*"]],
    [".nx-menu", ">"],
    [".nx-bento", ">"],
    [".nx-steps", ">"],
    [".ct-list", ">"],
    [".nx-gal", ">"],
    [".nx-stats", ">"],
    [".lm-list", ">"],
    [".pj-txt", ">"],
    [".mn-grid", ">"],
  ];
  const setRv = (el, kind, delay) => {
    if (!el || el.hasAttribute("data-rv")) return;
    el.setAttribute("data-rv", kind || "");
    el.style.setProperty("--d", delay + "s");
  };
  // kelompok: anak-anaknya muncul berurutan per baris
  groups.forEach(([sel, mode]) =>
    $$(sel).forEach((box) => {
      const kids = mode === ">" ? [...box.children] : mode.flatMap((s) => $$(":scope > " + s, box));
      const cols = sel === ".nx-gal" || sel === ".nx-bento" || sel === ".nx-menu" ? 3 : 4;
      kids.forEach((k, i) =>
        setRv(
          k,
          sel === ".nx-gal" ? "zoom" : sel === ".nx-bento" ? "pop" : "",
          (i % cols) * 0.1 + Math.floor(i / cols) * 0.04,
        ),
      );
    }),
  );
  [
    [".ow-phone", "left"],
    [".ow-main", "right"],
    [".ct-map", "right"],
    [".nx-about > *:first-child", "left"],
    [".nx-about > *:last-child", "right"],
    [".pj-vis", "zoom"],
    [".mn-promo", ""],
  ].forEach(([s, k]) => $$(s).forEach((el) => setRv(el, k, 0)));

  // judul: kata naik dari balik topeng (menjaga <em> dan <br>)
  function splitHead(h) {
    if (h.dataset.split) return;
    h.dataset.split = "1";
    let n = 0;
    const walk = (node, out) => {
      node.childNodes.forEach((c) => {
        if (c.nodeType === 3) {
          c.textContent.split(/(\s+)/).forEach((w) => {
            if (!w) return;
            if (/^\s+$/.test(w)) {
              out.appendChild(D.createTextNode(" "));
              return;
            }
            const a = D.createElement("span");
            a.className = "hw";
            const b = D.createElement("span");
            b.style.setProperty("--i", n++);
            b.textContent = w;
            a.appendChild(b);
            out.appendChild(a);
          });
        } else if (c.nodeName === "BR") out.appendChild(D.createElement("br"));
        else if (c.nodeType === 1) {
          const w = c.cloneNode(false);
          walk(c, w);
          out.appendChild(w);
        }
      });
    };
    const f = D.createDocumentFragment();
    walk(h, f);
    h.textContent = "";
    h.appendChild(f);
    h.classList.add("hd-split");
  }
  let heads = [];
  if (!reduce) {
    $$(".nx-head h2,.nx-about h2,.lm-t,.ow-txt h2,.cta-section h2,.pj-t,.mn-head h2").forEach(
      (h) => {
        h.classList.remove("hsplit", "in"); // lepas split v9 supaya tidak ganda
        const plain = h.textContent;
        if (!h.querySelector(".hw")) splitHead(h);
        else {
          // v9 sudah memecah: pakai yang ada
          h.classList.add("hd-split");
        }
        heads.push(h);
      },
    );
  }
  const done = (el) => {
    // bersihkan agar hover/animasi lain tidak ikut transisi reveal
    setTimeout(() => {
      el.style.transition = "none";
      el.removeAttribute("data-rv");
      el.style.removeProperty("--d");
      void el.offsetWidth;
      el.style.transition = "";
    }, 1700);
  };
  if (!reduce && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (!x.isIntersecting) return;
          const el = x.target;
          io.unobserve(el);
          if (el.hasAttribute("data-rv")) {
            el.classList.add("in");
            done(el);
          }
          if (el.classList.contains("hd-split")) el.classList.add("hd-in");
        }),
      { threshold: 0.14, rootMargin: "0px 0px -7% 0px" },
    );
    $$("[data-rv]").forEach((el) => io.observe(el));
    heads.forEach((h) => io.observe(h));
  } else {
    $$("[data-rv]").forEach((el) => el.removeAttribute("data-rv"));
  }

  /* ---------- 4. PROGRES SCROLL per section (--p 0..1) + parallax ---------- */
  const secs = $$(".lm,.nx-crimson,.cta-section,.mn,.pj,.nx-light,.nx-dark");
  let tick = 0;
  function progress() {
    tick = 0;
    const vh = innerHeight;
    secs.forEach((s) => {
      const r = s.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      s.style.setProperty("--p", clamp((vh - r.top) / (vh + r.height), 0, 1).toFixed(4));
    });
  }
  const req = () => {
    if (!tick) tick = requestAnimationFrame(progress);
  };
  if (fine && !reduce) {
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    progress();
  } else secs.forEach((s) => s.style.setProperty("--p", ".5")); // HP: tanpa hitung parallax per scroll

  /* ---------- 5. SCROLL HALUS (wheel lerp + anchor eased) ---------- */
  let cur = scrollY,
    tgt = scrollY,
    run = false,
    anim = null,
    mine = false;
  const locked = () =>
    H.classList.contains("intro-lock") ||
    B.style.overflow === "hidden" ||
    B.classList.contains("mn-lock");
  const maxY = () => H.scrollHeight - innerHeight;
  let last = 0;
  const jump = (y) => {
    y = Math.round(y);
    if (y !== Math.round(scrollY)) {
      mine = true;
      scrollTo({ top: y, behavior: "instant" });
    }
  };
  function loop(now) {
    now = now || performance.now();
    const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
    last = now;
    if (anim) {
      const t = clamp((now - anim.t0) / anim.d, 0, 1);
      cur = anim.a + (anim.b - anim.a) * ease(t);
      tgt = cur;
      jump(cur);
      if (t >= 1) {
        anim = null;
        run = false;
        return;
      }
    } else {
      const diff = tgt - cur;
      if (Math.abs(diff) < 0.5) {
        cur = tgt;
        jump(cur);
        run = false;
        return;
      }
      cur += diff * (1 - Math.exp(-dt * 9));
      jump(cur); // halus & sama di 60Hz / 120Hz
    }
    requestAnimationFrame(loop);
  }
  const kick = () => {
    if (!run) {
      run = true;
      last = performance.now();
      requestAnimationFrame(loop);
    }
  };
  addEventListener(
    "scroll",
    () => {
      if (mine) {
        mine = false;
        return;
      }
      cur = tgt = scrollY;
    },
    { passive: true },
  ); // scroll native (keyboard, scrollbar)
  if (!reduce && fine) {
    addEventListener(
      "wheel",
      (e) => {
        if (e.ctrlKey || e.defaultPrevented || locked()) return;
        if (
          e.target.closest &&
          e.target.closest(
            "[data-lenis-prevent],.nx-sheet,.nx-drawer,.nx-lb,.mn-sheet,.mn-scroll,.dr-scroll,textarea,select",
          )
        )
          return;
        e.preventDefault();
        anim = null;
        if (!run) {
          cur = scrollY;
          tgt = scrollY;
        }
        const dy =
          e.deltaMode === 1 ? e.deltaY * 34 : e.deltaMode === 2 ? e.deltaY * innerHeight : e.deltaY;
        tgt = clamp(tgt + clamp(dy, -240, 240) * 1.05, 0, maxY());
        kick();
      },
      { passive: false },
    );
  }
  function goTo(y, d) {
    y = clamp(y, 0, maxY());
    if (reduce) {
      scrollTo(0, y);
      return;
    }
    cur = scrollY;
    const dist = Math.abs(y - cur);
    anim = { a: cur, b: y, t0: performance.now(), d: d || clamp(650 + dist * 0.28, 800, 1700) };
    last = performance.now();
    run = true;
    requestAnimationFrame(loop);
  }
  D.addEventListener(
    "click",
    (e) => {
      if (e.defaultPrevented) return;
      const a = e.target.closest && e.target.closest('a[href^="#"]');
      if (!a || a.target === "_blank") return;
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const el = D.querySelector(id);
      if (!el) return;
      e.preventDefault();
      const nav = $("#navbar");
      const off = (nav ? nav.offsetHeight : 70) - 2;
      // section dengan tepi: target di awal isi, bukan di margin negatif
      const eh =
        el.classList && el.classList.contains("edge")
          ? parseFloat(getComputedStyle(el).getPropertyValue("--eh")) || 0
          : 0;
      const top =
        el.getBoundingClientRect().top +
        scrollY +
        (eh ? Math.min(eh, el.offsetHeight) * 0.55 : 0) -
        off;
      goTo(top);
      try {
        history.replaceState(null, "", id);
      } catch (_) {}
    },
    true,
  );

  /* ---------- 6. SENTUHAN HALUS ---------- */
  // cincin tipis di piring "Lihat Menu"
  const plate = $("#lmPlate");
  if (plate && !$(".lm-rg", plate)) {
    ["", "b"].forEach((c) => {
      const r = D.createElement("i");
      r.className = "lm-rg " + c;
      r.setAttribute("aria-hidden", "true");
      plate.prepend(r);
    });
  }
  if (fine && !reduce) {
    // sorotan pointer pada kartu menu
    D.addEventListener(
      "pointermove",
      (e) => {
        const c = e.target.closest && e.target.closest(".mn-card");
        if (!c) return;
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
      },
      { passive: true },
    );
    // gambar promo miring mengikuti pointer
    const vis = $("#pjVis"),
      img = $(".pj-img");
    if (vis && img) {
      vis.addEventListener("pointermove", (e) => {
        const r = vis.getBoundingClientRect();
        img.style.setProperty("--rx", ((e.clientX - r.left) / r.width - 0.5) * 7 + "deg");
        img.style.setProperty("--ry", ((e.clientY - r.top) / r.height - 0.5) * -6 + "deg");
      });
      vis.addEventListener("pointerleave", () => {
        img.style.setProperty("--rx", "0deg");
        img.style.setProperty("--ry", "0deg");
      });
    }
  }
  // hitung naik untuk angka statistik
  const counters = $$(".nx-stats [data-count],.nx-stats b");
  if (!reduce && "IntersectionObserver" in window && counters.length) {
    const cio = new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          if (!x.isIntersecting) return;
          cio.unobserve(x.target);
          const el = x.target,
            txt = el.textContent.trim();
          const m = txt.match(/^(\D*)(\d+(?:[.,]\d+)?)(.*)$/);
          if (!m) return;
          const end = parseFloat(m[2].replace(",", ".")),
            dec = (m[2].split(/[.,]/)[1] || "").length,
            t0 = performance.now(),
            d = 1500;
          (function f(now) {
            const t = clamp((now - t0) / d, 0, 1),
              v = end * (1 - Math.pow(1 - t, 4));
            el.textContent = m[1] + (dec ? v.toFixed(dec).replace(".", ",") : Math.round(v)) + m[3];
            if (t < 1) requestAnimationFrame(f);
            else el.textContent = txt;
          })(t0);
        }),
      { threshold: 0.6 },
    );
    counters.forEach((c) => cio.observe(c));
  }
})();
