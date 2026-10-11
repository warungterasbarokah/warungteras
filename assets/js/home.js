const pk = (k) => {
  const m = MENUS[k] || SNACKS.find((s) => s.key === k);
  return m.foto.replace(/\.(?:webp|png|jpg)$/, "");
};
const IT = KEYS.map((k) => ({ key: k, m: MENUS[k] })).concat(
  SNACKS.map((m) => ({ key: m.key, m, snack: true })),
);
const imgOf = (k) => {
  const it = IT.find((x) => x.key === k);
  return `<img class="ph" src="assets/img/${it.m.foto}" alt="${it.m.name}" onerror="this.remove()">`;
};
/* ---------- LIHAT MENU: video tanpa kontrol, jalan otomatis saat menu bervideo dipilih ---------- */
(() => {
  const list = $("#lmList"),
    plate = $("#lmPlate"),
    fall = $("#lmFall");
  let k = KEYS[0];
  /* Menu yang punya video: key menu -> elemen <video data-k="..."> di index.html. Menu lain tampil sebagai foto bulat. */
  const vids = {};
  plate.querySelectorAll("video.lm-vid").forEach((v) => (vids[v.dataset.k] = v));
  const VIDEOS = Object.keys(vids).reduce((o, x) => ((o[x] = true), o), {});
  const motionPreference = matchMedia("(prefers-reduced-motion: reduce)"),
    HOLD = 2200;
  let want = false,
    seen = true,
    timer = 0,
    retry = false,
    vid = vids[KEYS[0]] || Object.values(vids)[0];
  const failed = {};
  list.innerHTML = IT.map((it, i) => {
    const m = it.m;
    return `<button class="lm-row${i ? "" : " on"} ${it.snack ? "snack" : ""}" data-k="${it.key}"><i>${String(i + 1).padStart(2, "0")}</i><span class="lm-th"><img src="assets/img/${m.foto}" alt="" loading="lazy" decoding="async"></span><span><b>${m.name}</b><small>${m.desc}</small></span><em>${m.varian[0][1] === 0 ? rp(2500) + " / topping" : (m.varian.length > 1 ? "Mulai " : "") + rp(m.varian[0][1])}</em></button>`;
  }).join("");

  /* ---- pemutar video ---- */
  function play(restart) {
    clearTimeout(timer);
    if (motionPreference.matches || !vid || failed[vid.dataset.k] || !want || !seen) return;
    if (restart) {
      try {
        vid.currentTime = 0;
      } catch (_) {}
    }
    const p = vid.play();
    if (p && p.catch)
      p.catch(() => {
        // autoplay diblokir: tampilkan frame akhir, coba lagi saat disentuh
        try {
          vid.currentTime = Math.max(0, (vid.duration || 4) - 0.15);
        } catch (_) {}
        if (!retry) {
          retry = true;
          ["pointerdown", "touchstart", "keydown", "scroll"].forEach((ev) =>
            addEventListener(
              ev,
              () => {
                retry = false;
                play(true);
              },
              { once: true, passive: true },
            ),
          );
        }
      });
  }
  function stopAll() {
    clearTimeout(timer);
    Object.values(vids).forEach((v) => v.pause());
  }
  Object.values(vids).forEach((v) => {
    v.addEventListener("ended", () => {
      if (motionPreference.matches || !want || v !== vid) return;
      timer = setTimeout(() => play(true), HOLD);
    }); // tahan frame akhir sebentar, lalu ulang
    v.addEventListener("playing", () => plate.classList.add("vid-ok"));
    v.addEventListener(
      "error",
      (e) => {
        const t = e.target;
        if (t === v || (t.tagName === "SOURCE" && !t.nextElementSibling)) {
          failed[v.dataset.k] = true;
          if (v === vid) {
            want = false;
            plate.classList.remove("is-video");
          }
        }
      },
      true,
    ); // sumber TERAKHIR gagal -> kembali ke foto
  });
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          seen = e.isIntersecting;
          if (!want) return;
          if (seen) {
            play(vid.ended || vid.currentTime === 0);
          } else vid.pause();
        }),
      { threshold: 0.25 },
    ).observe(plate);
  }
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stopAll();
    else if (want) play(false);
  });

  function show(x, first) {
    k = x;
    const it = IT.find((y) => y.key === x),
      m = it.m,
      ord = $("#lmOrder");
    list.querySelectorAll(".lm-row").forEach((r) => r.classList.toggle("on", r.dataset.k === x));
    $("#lmNum").textContent = String(IT.indexOf(it) + 1).padStart(2, "0");
    $("#lmName").textContent = m.name;
    if (it.snack) {
      delete ord.dataset.open;
      ord.textContent = "Tanya menu ↗";
      ord.dataset.ask = m.name;
    } else {
      ord.dataset.open = x;
      ord.textContent = ["seblak", "burger", "kebab"].includes(x)
        ? "Atur Pesanan"
        : "Tambah ke Keranjang";
      delete ord.dataset.ask;
    }
    const pho = pk(x);
    fall.dataset.photo = pho;
    const olds = [...fall.children],
      lay = document.createElement("div");
    lay.className = "lm-layer";
    lay.innerHTML = imgOf(x);
    if (PHOTO.urls[pho] && lay.firstChild) lay.firstChild.src = PHOTO.urls[pho];
    fall.appendChild(lay);
    requestAnimationFrame(() => requestAnimationFrame(() => lay.classList.add("in")));
    olds.forEach((o) => {
      o.classList.add("out");
      setTimeout(() => o.remove(), 900);
    });
    plate.classList.remove("swap");
    void plate.offsetWidth;
    plate.classList.add("swap");
    stopAll();
    want = !motionPreference.matches && !!VIDEOS[x] && !failed[x];
    plate.classList.toggle("is-video", want);
    Object.entries(vids).forEach(([n, v]) => v.classList.toggle("on", n === x));
    if (want) {
      vid = vids[x];
      if (vid.preload !== "auto") vid.preload = "auto";
      play(true);
    }
  }
  motionPreference.addEventListener("change", () => show(k));
  list.addEventListener("click", (e) => {
    const b = e.target.closest(".lm-row");
    if (!b) return;
    if (b.dataset.k !== k) show(b.dataset.k);
    else if (VIDEOS[k] && vid) play(true);
  }); // klik menu yang sama -> video diputar ulang dari awal

  $("#lmOrder").addEventListener("click", (e) => {
    const n = e.currentTarget.dataset.ask;
    if (n) {
      const u = waLink("Halo, boleh info harga " + n + "?");
      u.startsWith("#") ? (location.hash = u) : window.open(u, "_blank", "noopener");
    }
  });
  show(KEYS[0], true);
})();

paintAll(document);
