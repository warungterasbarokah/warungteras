/* contact */
(() => {
  "use strict";
  const D = document,
    kt = D.getElementById("kt");
  if (!kt) return;
  const $ = (s, r = kt) => r.querySelector(s),
    $$ = (s, r = kt) => [...r.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover:hover) and (pointer:fine)").matches;

  /* alamat (sumber tunggal: #ktAddr) dipecah per kata */
  const addr = $("#ktAddr"),
    addrText = addr.textContent.trim().replace(/\s+/g, " ");
  addr.setAttribute("aria-label", addrText);
  addr.innerHTML = addrText
    .split(" ")
    .map(
      (w, i) =>
        `<span class="kt-w" aria-hidden="true"><i style="--i:${i}">${w.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</i></span>`,
    )
    .join(" ");
  let n = 0;
  $$(".kt-lab,.kt-name,.kt-note").forEach((e) =>
    e.style.setProperty("--d", (0.2 + n++ * 0.1).toFixed(2)),
  );
  $$(".kt-chips li").forEach((e, i) => e.style.setProperty("--d", (0.75 + i * 0.08).toFixed(2)));
  $$(".kt-act>*").forEach((e, i) => e.style.setProperty("--d", (1 + i * 0.1).toFixed(2)));
  $$(".kt-card").forEach((e, i) => e.style.setProperty("--d", (0.5 + i * 0.11).toFixed(2)));
  kt.classList.add("js");

  /* HP */
  const ph = $("#ph"),
    pa = $("#phAddr"),
    clock = $("#phTime");
  ph.classList.add("js");
  pa.textContent = addrText;
  const tick = () => {
    try {
      clock.textContent = new Intl.DateTimeFormat("id-ID", {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
        .format(new Date())
        .replace(":", ".");
    } catch (_) {}
  };
  tick();
  setInterval(tick, 30000);
  let timers = [],
    loopT = 0,
    visible = false,
    hover = false;
  const clear = () => {
    timers.forEach(clearTimeout);
    timers = [];
  };
  const later = (f, ms) => timers.push(setTimeout(f, ms));
  function type() {
    let i = 0;
    ph.classList.add("typing");
    pa.textContent = "";
    (function step() {
      pa.textContent = addrText.slice(0, ++i);
      if (i < addrText.length) later(step, 38);
      else later(() => ph.classList.remove("typing"), 900);
    })();
  }
  function play() {
    clear();
    ph.classList.remove("play", "typing");
    pa.textContent = "";
    void ph.offsetWidth;
    ph.classList.add("play");
    later(type, 2900);
  }
  function schedule() {
    clearTimeout(loopT);
    loopT = setTimeout(() => {
      if (visible && !hover) play();
      schedule();
    }, 13000);
  }
  if (reduce) {
    ph.classList.remove("js");
  }

  /* masuk layar */
  const start = () => {
    kt.classList.add("in");
    setTimeout(() => kt.classList.add("done"), 3200);
    if (!reduce) {
      play();
      schedule();
    }
  };
  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          visible = x.isIntersecting;
          kt.classList.toggle("live", visible);
          ph.classList.toggle("live", visible);
          if (visible && !kt.classList.contains("in")) start();
        }),
      { threshold: 0.2 },
    ).observe(kt);
  } else {
    kt.classList.add("in", "live", "done");
    ph.classList.add("live");
  }
  ph.addEventListener("pointerenter", () => {
    hover = true;
  });
  ph.addEventListener("pointerleave", () => {
    hover = false;
  });

  /* HP miring mengikuti kursor */
  if (fine && !reduce) {
    let raf = 0;
    ph.addEventListener("pointermove", (e) => {
      const r = ph.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width - 0.5,
        y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        ph.style.setProperty("--ry", (x * 12).toFixed(1) + "deg");
        ph.style.setProperty("--rx", (-y * 9).toFixed(1) + "deg");
      });
    });
    ph.addEventListener("pointerleave", () => {
      ph.style.removeProperty("--rx");
      ph.style.removeProperty("--ry");
    });
  }

  /* salin alamat + toast */
  const toast = $("#ktToast", D);
  D.body.appendChild(toast);
  const btn = $("#ktCopy");
  let tt;
  const say = (m) => {
    toast.textContent = m;
    toast.classList.add("on");
    clearTimeout(tt);
    tt = setTimeout(() => toast.classList.remove("on"), 2200);
  };
  const full = "Warung Teras Dian Barokah, " + addrText;
  const fallbackCopy = () => {
    const t = D.createElement("textarea");
    t.value = full;
    t.style.cssText = "position:fixed;opacity:0";
    D.body.appendChild(t);
    t.select();
    let ok = false;
    try {
      ok = D.execCommand("copy");
    } catch (_) {}
    t.remove();
    return ok;
  };
  btn.addEventListener("click", async () => {
    let ok = false;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(full);
        ok = true;
      }
    } catch (_) {}
    if (!ok) ok = fallbackCopy();
    const sp = $("span", btn),
      old = sp.textContent;
    if (ok) {
      btn.classList.add("ok");
      sp.textContent = "Tersalin";
      say("Alamat disalin");
      setTimeout(() => {
        btn.classList.remove("ok");
        sp.textContent = old;
      }, 1800);
    } else say("Gagal menyalin, tekan lama pada alamat");
  });

  /* kartu: cahaya mengikuti kursor + ikon tertarik */
  if (fine && !reduce) {
    $$(".kt-card").forEach((c) => {
      const ic = $(".kt-ic", c);
      c.addEventListener("pointermove", (e) => {
        const r = c.getBoundingClientRect();
        c.style.setProperty("--mx", e.clientX - r.left + "px");
        c.style.setProperty("--my", e.clientY - r.top + "px");
        const ir = ic.getBoundingClientRect(),
          dx = e.clientX - (ir.left + ir.width / 2),
          dy = e.clientY - (ir.top + ir.height / 2),
          d = Math.hypot(dx, dy) || 1,
          pull = Math.min(8, 160 / d);
        ic.style.translate = `${((dx / d) * pull).toFixed(1)}px ${((dy / d) * pull).toFixed(1)}px`;
      });
      c.addEventListener("pointerleave", () => {
        ic.style.translate = "";
      });
    });
  }
})();
