/* menu */
(() => {
  const IMG = "assets/img/menu/";
  /* urutan HARUS sama dengan MENUS.seblak.toppings di app.js */
  const SEB_INFO = [
    { img: "fish-roll", w: 25, d: "Olahan ikan panjang motif oranye-putih" },
    { img: "chikuwa-mini", w: 21, d: "Olahan ikan tabung pendek dengan lubang" },
    { img: "crab-stick", w: 25, d: "Stik kepiting imitasi merah-putih" },
    { img: "fish-cake-udang", w: 23, d: "Olahan seafood berbentuk udang melengkung" },
    { img: "dumpling-ikan", w: 21, d: "Olahan ikan berbentuk gulungan / lipatan" },
    { img: "bakso-ikan", w: 17, d: "Bakso ikan bulat berwarna putih" },
    { img: "fish-ball-spiral", w: 17, d: "Bulat kerucut motif spiral oranye-putih" },
    { img: "mie-polos", w: 44, d: "Mie kenyal tanpa bumbu, pas dengan kuah seblak", mie: true },
    { img: "telur", w: 24, d: "Telur matang dengan kuning telur bulat" },
  ];
  const OPT = {
    seblak: {
      kind: "plate",
      hint: "Racik topping sendiri",
      topT: "Pilih topping",
      topS: "bisa lebih dari satu",
    },
    burger: {
      kind: "prod",
      hint: "Pilih varian & level pedas",
      emo: [],
      topT: "Tambahan",
      topS: "opsional",
    },
    kentang: {
      kind: "prod",
      free: true,
      min: 2000,
      hint: "Bebas nominal & pilih rasa",
      emo: [],
      topT: "Tambahan",
      topS: "opsional",
      flavors: [
        { n: "Jagung", d: "Gurih manis jagung", c: "#f5c542" },
        { n: "Balado", d: "Pedas gurih balado", c: "#e0301e" },
      ],
    },
    kebab: {
      kind: "prod",
      hint: "Pilih varian & level pedas",
      emo: [],
      topT: "Tambahan",
      topS: "opsional",
    },
  };
  const CATS = [
    ["all", "Semua", null],
    ["seblak", "Seblak", ["seblak"]],
    ["mie", "Mie & Nasi", ["nyemek", "nasgor", "tiaw", "ifumie"]],
    ["roti", "Burger & Kebab", ["burger", "kebab"]],
    ["snack", "Camilan", ["kentang"]],
  ];
  const TAG = { nyemek: "Best Seller", seblak: "Paling Pedas" };
  const LV_ICON = [
    '<img src="' + IMG + 'lv-tidak.webp" alt="">',
    '<img src="' + IMG + 'lv-cabe.webp" alt="">',
    '<img src="' + IMG + 'lv-cabe.webp" alt=""><img src="' + IMG + 'lv-cabe.webp" alt="">',
    '<img src="' + IMG + 'lv-super.webp" alt="">',
  ];
  const $$ = (s, r = document) => [...r.querySelectorAll(s)],
    E = (id) => document.getElementById(id);
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );

  /* ---------- keranjang ---------- */
  function pushCart(it) {
    const key = JSON.stringify([it.name, it.level, it.top, it.say, it.pel, it.note]);
    const ex = cart.find((c) => c.key === key);
    ex ? (ex.q += it.q) : cart.push({ ...it, key });
    drawCart();
    const b = E("mnCartBar");
    b.classList.remove("bump");
    void b.offsetWidth;
    b.classList.add("bump");
  }
  const plainKey = (k) => JSON.stringify([MENUS[k].varian[0][0], "", [], [], [], ""]);
  const plainQty = (k) => {
    const c = cart.find((c) => c.key === plainKey(k));
    return c ? c.q : 0;
  };
  function addPlain(k, silent) {
    const m = MENUS[k];
    pushCart({
      name: m.varian[0][0],
      level: "",
      top: [],
      say: [],
      pel: [],
      note: "",
      unit: m.varian[0][1],
      q: 1,
      img: "assets/img/" + m.foto,
      thumb: "",
    });
    if (!silent) toast(m.name + " ditambahkan");
  }
  function decPlain(k) {
    const i = cart.findIndex((c) => c.key === plainKey(k));
    if (i < 0) return;
    if (--cart[i].q < 1) cart.splice(i, 1);
    drawCart();
  }
  let tt = 0;
  function toast(t) {
    const el = E("mnToast");
    el.textContent = t;
    el.classList.add("on");
    clearTimeout(tt);
    tt = setTimeout(() => el.classList.remove("on"), 1900);
  }

  /* ---------- daftar menu ---------- */
  const grid = E("mnGrid");
  let cat = "all",
    q = "";
  const priceHTML = (m) =>
    m.varian[0][1] === 0
      ? `<div class="mn-price"><small>Per topping</small><b>${rp(2500)}</b></div>`
      : `<div class="mn-price"><small>${m.varian.length > 1 || (OPT[m.key || ""] || {}).free || m.name === "Tela-Tela" ? "Mulai dari" : "Harga"}</small><b>${rp(m.varian[0][1])}</b></div>`;
  grid.innerHTML = KEYS.map((k, i) => {
    const m = MENUS[k],
      o = OPT[k];
    return `<article class="mn-card" data-k="${k}" ${o ? 'data-custom tabindex="0" role="button" aria-label="Atur ' + esc(m.name) + '"' : ""} style="--i:${i}">
      <div class="mn-img">${TAG[k] ? `<span class="mn-tag">${TAG[k]}</span>` : ""}<img src="assets/img/${m.foto}" alt="${esc(m.name)}" loading="lazy" decoding="async"></div>
      <div class="mn-body"><h3>${esc(m.name)}</h3><p>${esc(m.desc)}</p>${o ? `<span class="mn-opt">${o.hint}</span>` : ""}
        <div class="mn-foot2">${priceHTML(m)}<div class="mn-act" data-k="${k}"></div></div></div></article>`;
  }).join("");
  function actHTML(k) {
    if (OPT[k])
      return `<button class="mn-pick" type="button" data-pick="${k}">Pilih<i>+</i></button>`;
    const n = plainQty(k);
    return n
      ? `<div class="mn-step"><button type="button" data-dec="${k}" aria-label="Kurangi">−</button><b>${n}</b><button type="button" data-inc="${k}" aria-label="Tambah">+</button></div>`
      : `<button class="mn-add1" type="button" data-inc="${k}" aria-label="Tambah ${esc(MENUS[k].name)}">+</button>`;
  }
  grid.addEventListener("click", (e) => {
    const inc = e.target.closest("[data-inc]");
    if (inc) {
      addPlain(inc.dataset.inc, true);
      return;
    }
    const dec = e.target.closest("[data-dec]");
    if (dec) {
      decPlain(dec.dataset.dec);
      return;
    }
    const c = e.target.closest("[data-custom]");
    if (c) openMn(c.dataset.k);
  });
  grid.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-custom]")) {
      e.preventDefault();
      openMn(e.target.dataset.k);
    }
  });

  /* kategori + cari */
  const catsEl = E("mnCats");
  catsEl.innerHTML = CATS.map(
    ([id, label, ks]) =>
      `<button class="mn-cat ${id === cat ? "on" : ""}" type="button" role="tab" data-c="${id}" aria-selected="${id === cat}">${label}<small>${ks ? ks.length : KEYS.length}</small></button>`,
  ).join("");
  function applyFilter() {
    const ks = (CATS.find((c) => c[0] === cat) || [])[2];
    let n = 0;
    $$(".mn-card", grid).forEach((c) => {
      const k = c.dataset.k,
        ok =
          (!ks || ks.includes(k)) &&
          (!q || (MENUS[k].name + " " + MENUS[k].desc).toLowerCase().includes(q));
      c.classList.toggle("hide", !ok);
      if (ok) n++;
    });
    E("mnEmpty").hidden = n > 0;
  }
  catsEl.addEventListener("click", (e) => {
    const b = e.target.closest("[data-c]");
    if (!b) return;
    cat = b.dataset.c;
    $$(".mn-cat", catsEl).forEach((x) => {
      const on = x === b;
      x.classList.toggle("on", on);
      x.setAttribute("aria-selected", on);
    });
    b.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
    applyFilter();
  });
  E("mnQ").addEventListener("input", (e) => {
    q = e.target.value.trim().toLowerCase();
    applyFilter();
  });

  /* ---------- sinkron keranjang -> kartu + bar bawah ---------- */
  function mnSync() {
    $$(".mn-act", grid).forEach((a) => {
      const k = a.dataset.k;
      if (OPT[k]) {
        if (!a.firstChild) a.innerHTML = actHTML(k);
        return;
      }
      a.innerHTML = actHTML(k);
    });
    const n = cart.reduce((a, c) => a + c.q, 0),
      t = cart.reduce((a, c) => a + c.unit * c.q, 0),
      bar = E("mnCartBar");
    bar.hidden = !n;
    document.body.classList.toggle("mn-hascart", !!n);
    E("mnCbN").textContent = n;
    E("mnCbL").textContent = n + " item di keranjang";
    E("mnCbP").textContent = rp(t);
  }
  const _dc = drawCart;
  drawCart = function () {
    _dc();
    mnSync();
    window.mnCartUI && mnCartUI();
  };
  E("mnCartBar").addEventListener("click", () => {
    E("mnToast").classList.remove("on");
    drawCart();
    openP(drawer);
  });
  mnSync();
  applyFilter();

  /* ---------- sheet racik ---------- */
  const sh = E("mnSheet");
  let cur = null,
    S = { v: 0, l: 1, f: 0, nom: 0, c: {}, q: 1 },
    inst = [];
  const topList = (k) =>
    MENUS[k].toppings.map(([n, p], i) => {
      const inf = k === "seblak" ? SEB_INFO[i] : null;
      return { i, n, p, inf, emo: (OPT[k].emo || [])[i] };
    });
  const unit = () => {
    if (OPT[cur] && OPT[cur].free) return S.nom >= OPT[cur].min ? S.nom : 0;
    const m = MENUS[cur];
    return (
      m.varian[S.v][1] + Object.entries(S.c).reduce((a, [i, n]) => a + n * m.toppings[i][1], 0)
    );
  };
  const totalTop = () => Object.values(S.c).reduce((a, n) => a + n, 0);

  /* posisi topping di atas piring (persen dari kotak piring) */
  const SL = [];
  for (let i = 0; i < 8; i++) {
    const a = ((-72 + 45 * i) * Math.PI) / 180;
    SL.push([50 + 31 * Math.cos(a), 51 + 28.5 * Math.sin(a)]);
  }
  for (let i = 0; i < 5; i++) {
    const a = ((18 + 72 * i) * Math.PI) / 180;
    SL.push([50 + 16 * Math.cos(a), 51 + 15 * Math.sin(a)]);
  }
  SL.push([50, 51], [38, 40], [62, 62], [40, 63], [61, 40]);
  const MIE_SL = [
    [50, 51],
    [43, 46],
    [58, 56],
  ];

  function buildPreview() {
    const pv = E("mnPv"),
      m = MENUS[cur];
    inst = [];
    if (OPT[cur].kind === "plate")
      pv.innerHTML = `<div class="mn-plate"><img class="base" src="${IMG}kuah-seblak.webp" alt="Piring kuah seblak"><div class="mn-lay" id="mnLay"></div></div><span class="mn-bubble" id="mnBub"></span>`;
    else
      pv.innerHTML = `<div class="mn-prod"><img src="assets/img/${m.foto}" alt="${esc(m.name)}"><div class="mn-lay" id="mnLay"></div></div><span class="mn-bubble" id="mnBub"></span>`;
  }
  function syncLay() {
    const lay = E("mnLay");
    if (!lay) return;
    const plate = OPT[cur].kind === "plate";
    MENUS[cur].toppings.forEach((_, i) => {
      const want = S.c[i] || 0,
        mine = inst.filter((x) => x.i === i);
      for (let n = mine.length; n < want; n++) {
        const el = document.createElement(plate ? "img" : "span"),
          isMie = plate && SEB_INFO[i].mie;
        if (plate) {
          const used = inst.filter((x) => !!x.mie === !!isMie).map((x) => x.s);
          let s = 0;
          while (used.includes(s)) s++;
          if (isMie && s >= MIE_SL.length) {
            inst.push({ i, s, el: null, mie: true });
            continue;
          }
          const base = isMie ? MIE_SL[s] : SL[s % SL.length],
            off = !isMie && s >= SL.length ? 3.5 : 0;
          el.src = IMG + SEB_INFO[i].img + ".webp";
          el.alt = "";
          el.decoding = "async";
          el.style.cssText = `left:${(base[0] + off).toFixed(1)}%;top:${(base[1] + off).toFixed(1)}%;width:${SEB_INFO[i].w * (isMie ? 1 - s * 0.08 : 1)}%;--r:${isMie ? s * 37 - 20 : ((s * 53) % 70) - 35}deg;z-index:${isMie ? 1 : 2 + s}`;
          inst.push({ i, s, el, mie: isMie });
        } else {
          const s = inst.length,
            a = ((s * 137.5 + 20) * Math.PI) / 180,
            r = 26 + (s % 3) * 9;
          el.className = "mn-emo";
          el.textContent = OPT[cur].emo[i] || "🍴";
          el.style.left = 50 + Math.cos(a) * r + "%";
          el.style.top = 50 + Math.sin(a) * r * 1.05 + "%";
          inst.push({ i, s, el });
        }
        if (inst[inst.length - 1].el) lay.appendChild(el);
      }
      for (let n = mine.length; n > want; n--) {
        const k = inst.map((x) => x.i).lastIndexOf(i),
          x = inst.splice(k, 1)[0];
        if (x.el) {
          x.el.classList.add("out");
          setTimeout(() => x.el.remove(), 260);
        }
      }
    });
    const t = totalTop();
    E("mnBub").innerHTML = t
      ? `<span>🍢</span> ${t} topping`
      : `<span>🍲</span> ${plate ? "Kuah seblak, belum ada topping" : esc(OPT[cur].free ? "Tela-Tela " + (S.nom ? rp(S.nom) : "") : MENUS[cur].varian[S.v][0])}`;
  }
  function drawOpts() {
    const m = MENUS[cur],
      o = OPT[cur];
    const VD = {
      "Burger Telur": "Roti lembut, telur, sayur & saus",
      "Burger Ayam": "Pakai daging ayam, isian melimpah",
      "Kebab Telur + Sosis": "Telur & sosis, sayur segar, saus",
      "Kebab Ayam Suwir": "Ditambah ayam suwir, lebih kenyang",
    };
    E("mnVar").innerHTML = m.varian
      .map(
        ([n, p], i) =>
          `<button type="button" class="mn-var ${S.v === i ? "on" : ""}" data-v="${i}" aria-pressed="${S.v === i}"><b>${esc(n)}</b>${VD[n] ? `<small>${VD[n]}</small>` : ""}<span>${rp(p)}</span></button>`,
      )
      .join("");
    const fl = o.flavors || null;
    E("mnNomW").hidden = !o.free;
    {
      const h = E("mnNomH"),
        bad = S.nom > 0 && S.nom < (o.min || 0);
      h.textContent = o.free
        ? bad
          ? `Minimal ${rp(o.min)}`
          : S.nom
            ? `Total ${rp(S.nom * S.q)}`
            : "Ketik jumlah rupiah yang mau kamu beli"
        : "";
      h.classList.toggle("bad", !!bad);
    }
    E("mnFlvW").hidden = !fl;
    E("mnLvlW").hidden = !!fl;
    if (fl)
      E("mnFlv").innerHTML = fl
        .map(
          (f, i) =>
            `<button type="button" class="mn-flv ${S.f === i ? "on" : ""}" data-f="${i}" aria-pressed="${S.f === i}" style="--fc:${f.c}"><i></i><b>${esc(f.n)}</b><small>${esc(f.d)}</small></button>`,
        )
        .join("");
    E("mnVarW").querySelector("h4").lastChild.textContent = fl ? "Pilih nominal" : "Pilih varian";
    E("mnLvl").innerHTML = LEVEL.map(
      (l, i) =>
        `<button type="button" class="mn-lv ${S.l === i ? "on" : ""}" data-l="${i}" aria-pressed="${S.l === i}"><span>${LV_ICON[i]}</span>${l.label}</button>`,
    ).join("");
    E("mnTop").innerHTML = topList(cur)
      .map((t) => {
        const n = S.c[t.i] || 0;
        return `<div class="mn-t ${n ? "on" : ""}"><div class="mn-t-img">${t.inf ? `<img src="${IMG}${t.inf.img}.webp" alt="" loading="lazy">` : t.emo || "🍴"}</div>
        <div class="mn-t-tx"><b>${esc(t.n)}</b>${t.inf ? `<small>${esc(t.inf.d)}</small>` : ""}<em>+${rp(t.p)}</em></div>
        ${n ? `<div class="mn-step"><button type="button" data-td="${t.i}" aria-label="Kurangi ${esc(t.n)}">−</button><b>${n}</b><button type="button" data-ti="${t.i}" aria-label="Tambah ${esc(t.n)}">+</button></div>` : `<button class="mn-add1" type="button" data-ti="${t.i}" aria-label="Tambah ${esc(t.n)}">+</button>`}</div>`;
      })
      .join("");
    E("mnTopT").textContent = o.topT;
    E("mnTopS").textContent = o.topS;
    E("mnVarW").hidden = m.varian.length < 2;
    E("mnTopW").hidden = !m.toppings.length;
    let n = 0;
    ["mnNomW", "mnVarW", "mnFlvW", "mnLvlW", "mnTopW"].forEach((id) => {
      const w = E(id);
      if (!w.hidden) w.querySelector("h4 i").textContent = ++n;
    });
    E("mnQv").textContent = S.q;
    E("mnAddP").textContent = rp(unit() * S.q);
    const empty = unit() === 0,
      ab = E("mnAdd");
    ab.disabled = empty;
    ab.querySelector("span").innerHTML = empty
      ? o.free
        ? "Isi nominal dulu"
        : "Pilih topping dulu"
      : "Tambah<em> ke Keranjang</em>";
  }
  function openMn(k) {
    cur = k;
    S = { v: 0, l: 1, c: {}, q: 1 };
    const m = MENUS[k];
    E("mnName").textContent = m.name;
    E("mnDesc").textContent = m.desc;
    E("mnNote").value = "";
    E("mnNom").value = "";
    buildPreview();
    drawOpts();
    syncLay();
    E("mnScroll").scrollTop = 0;
    _ca();
    sh.classList.add("open");
    sh.setAttribute("aria-hidden", "false");
    E("scrim").classList.add("on");
    document.body.style.overflow = "hidden";
    document.body.classList.add("mn-lock");
    window.lenis && lenis.stop();
  }
  function closeMn() {
    sh.classList.remove("open");
    sh.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mn-lock");
  }
  const _ca = closeAll;
  closeAll = function () {
    _ca();
    closeMn();
  };
  E("scrim").addEventListener("click", () => closeAll());
  E("mnClose").addEventListener("click", () => closeAll());

  sh.addEventListener("click", (e) => {
    const v = e.target.closest("[data-v]");
    if (v) {
      S.v = +v.dataset.v;
      drawOpts();
      syncLay();
      return;
    }
    const fv = e.target.closest("[data-f]");
    if (fv) {
      S.f = +fv.dataset.f;
      drawOpts();
      return;
    }
    const l = e.target.closest("[data-l]");
    if (l) {
      S.l = +l.dataset.l;
      drawOpts();
      return;
    }
    const ti = e.target.closest("[data-ti]");
    if (ti) {
      const i = +ti.dataset.ti;
      if ((S.c[i] || 0) < 9) S.c[i] = (S.c[i] || 0) + 1;
      drawOpts();
      syncLay();
      return;
    }
    const td = e.target.closest("[data-td]");
    if (td) {
      const i = +td.dataset.td;
      if (--S.c[i] < 1) delete S.c[i];
      drawOpts();
      syncLay();
      return;
    }
  });
  E("mnNom").addEventListener("input", (e) => {
    const d = e.target.value.replace(/\D/g, "").slice(0, 6);
    S.nom = +d || 0;
    e.target.value = d ? Number(d).toLocaleString("id-ID") : "";
    drawOpts();
    syncLay();
  });
  E("mnQp").addEventListener("click", () => {
    if (S.q < 20) {
      S.q++;
      drawOpts();
    }
  });
  E("mnQm").addEventListener("click", () => {
    if (S.q > 1) {
      S.q--;
      drawOpts();
    }
  });
  E("mnAdd").addEventListener("click", () => {
    if (unit() === 0) return;
    const m = MENUS[cur],
      top = Object.entries(S.c).map(([i, n]) => m.toppings[i][0] + (n > 1 ? " x" + n : ""));
    const fl = OPT[cur].flavors,
      nmv = fl ? `Tela-Tela ${fl[S.f].n} · ${rp(S.nom)}` : m.varian[S.v][0];
    pushCart({
      name: nmv,
      level: fl ? "" : LEVEL[S.l].label,
      top,
      say: [],
      pel: [],
      note: E("mnNote").value.trim(),
      unit: unit(),
      q: S.q,
      img: "assets/img/" + m.foto,
      thumb: snapThumb(),
    });
    const nm = nmv;
    closeAll();
    toast(nm + " ditambahkan");
  });
  function snapThumb() {
    if (OPT[cur].kind !== "plate") return "";
    const l = E("mnLay");
    if (!l) return "";
    const c = l.cloneNode(true);
    c.querySelectorAll(".out").forEach((x) => x.remove());
    c.removeAttribute("id");
    return c.innerHTML;
  }
  /* geser ke bawah di area gambar untuk menutup (HP) */
  (() => {
    const pv = E("mnPv");
    let y0 = null;
    pv.addEventListener(
      "touchstart",
      (e) => {
        y0 = e.touches[0].clientY;
      },
      { passive: true },
    );
    pv.addEventListener(
      "touchend",
      (e) => {
        if (y0 != null && e.changedTouches[0].clientY - y0 > 90) closeAll();
        y0 = null;
      },
      { passive: true },
    );
  })();

  /* sembunyikan tombol WA melayang di HP saat bagian menu terlihat (supaya tidak menutupi tombol +) */
  if ("IntersectionObserver" in window)
    new IntersectionObserver(
      (es) => es.forEach((e) => document.body.classList.toggle("mn-in", e.isIntersecting)),
      { threshold: 0.05 },
    ).observe(document.getElementById("build-your-own"));

  /* tombol "Pesan sekarang" dari hero / Lihat Menu: menu berpilihan -> buka racik; menu lain -> langsung masuk keranjang */
  openSheet = function (k) {
    if (OPT[k]) openMn(k);
    else addPlain(k);
  };
})();

/* ======================================================================
   KERANJANG v12: gambar pesanan, data pemesan, antar/ambil, pembayaran, pesan WhatsApp lengkap
   ====================================================================== */
(() => {
  const AREAS = ["Pasar 1", "Pasar 2", "Pasar 3", "Klumpang Dalam"];
  /* alamat yang menyebut Pasar selain 1-3 dianggap di luar area antar */
  const outside = (t) =>
    [
      ...String(t)
        .toLowerCase()
        .matchAll(/pasar\s*(?:no\.?\s*)?(\d+)/g),
    ].some((m) => !["1", "2", "3"].includes(m[1]));
  /* Isi nomor DANA di sini kalau mau ditampilkan langsung ke pembeli. Kosong = penjual kirim nomor/QRIS lewat chat WhatsApp. */
  const PAY_INFO = { dana: "" };
  const E = (id) => document.getElementById(id),
    esc = (s) =>
      String(s).replace(
        /[&<>"]/g,
        (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
      );
  const F = { nama: "", tipe: "antar", alamat: "", bayar: "DANA", area: "", catatan: "" };
  try {
    Object.assign(F, JSON.parse(localStorage.getItem("wtdb-order") || "{}"));
    F.catatan = "";
  } catch (_) {}
  const save = () => {
    try {
      localStorage.setItem("wtdb-order", JSON.stringify(F));
    } catch (_) {}
  };
  if (F.bayar !== "Bayar di tempat") F.bayar = "DANA";
  if (!AREAS.includes(F.area)) F.area = "";
  const SEB = MENUS.seblak.toppings.map((t) => t[0]);

  function chipsOf(c) {
    if (!c.top.length) return "";
    return `<div class="dr-chips">${c.top
      .map((t) => {
        const m = /^(.*?)(?: x(\d+))?$/.exec(t),
          nm = m[1],
          q = m[2],
          i = SEB.indexOf(nm),
          img =
            /^Seblak/.test(c.name) && i > -1
              ? `<img src="assets/img/menu/${["fish-roll", "chikuwa-mini", "crab-stick", "fish-cake-udang", "dumpling-ikan", "bakso-ikan", "fish-ball-spiral", "mie-polos", "telur"][i]}.webp" alt="">`
              : "";
        return `<span class="dr-chip">${img}${esc(nm)}${q ? ` <i>×${q}</i>` : ""}</span>`;
      })
      .join("")}</div>`;
  }
  function thumbOf(c) {
    if (c.thumb)
      return `<div class="dr-pl"><img class="base" src="assets/img/menu/kuah-seblak.webp" alt=""><div class="mn-lay">${c.thumb}</div></div>`;
    const m = Object.values(MENUS).find((x) => x.varian.some((v) => v[0] === c.name));
    const src = c.img || (m ? "assets/img/" + m.foto : "");
    return src ? `<img src="${src}" alt="${esc(c.name)}">` : "<span>🍽️</span>";
  }

  window.mnCartUI = function () {
    const n = cart.reduce((a, c) => a + c.q, 0);
    E("drSub").textContent = n
      ? `${n} item · cek pesananmu, lalu isi data pengiriman`
      : "Belum ada pesanan";
    E("drList").innerHTML = cart.length
      ? cart
          .map((c, i) => {
            const sub = [c.level ? "Pedas: " + c.level : "", c.note ? "Catatan: " + c.note : ""]
              .filter(Boolean)
              .join(" · ");
            return `<div class="dr-it"><div class="dr-th">${thumbOf(c)}</div><div class="dr-in"><div class="dr-t"><b>${esc(c.name)}</b><span>${rp(c.unit * c.q)}</span></div>${sub ? `<small>${esc(sub)}</small>` : ""}${chipsOf(c)}
        <div class="dr-ctl"><div class="dr-qty"><button type="button" data-c="-" data-i="${i}" aria-label="Kurangi">−</button><b>${c.q}</b><button type="button" data-c="+" data-i="${i}" aria-label="Tambah">+</button></div><button class="dr-rm" type="button" data-c="x" data-i="${i}">Hapus</button></div></div></div>`;
          })
          .join("")
      : `<div class="dr-empty"><span>🛒</span>Keranjang masih kosong.<br>Pilih menu dulu, yuk!</div>`;
    E("drForm").hidden = !cart.length;
    E("drOrder").disabled = !cart.length;
  };

  /* form */
  const seg = (id, key, after) =>
    E(id).addEventListener("click", (e) => {
      const b = e.target.closest("[data-v]");
      if (!b) return;
      F[key] = b.dataset.v;
      save();
      paintForm();
    });
  seg("fTipe", "tipe");
  seg("fBayar", "bayar");
  seg("fArea", "area");
  [
    ["fNama", "nama"],
    ["fAlamat", "alamat"],
    ["fCatatan", "catatan"],
  ].forEach(([id, k]) =>
    E(id).addEventListener("input", (e) => {
      F[k] = e.target.value;
      save();
      if (k === "alamat") E("fWarn").hidden = !outside(F.alamat);
      e.target.closest(".dr-f").classList.remove("bad");
      E("drErr").hidden = true;
    }),
  );
  function paintForm() {
    E("fNama").value = F.nama;
    E("fAlamat").value = F.alamat;
    E("fCatatan").value = F.catatan;
    document.querySelectorAll("#fTipe [data-v]").forEach((b) => {
      const on = b.dataset.v === F.tipe;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
    document.querySelectorAll("#fBayar [data-v]").forEach((b) => {
      const on = b.dataset.v === F.bayar;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
    document.querySelectorAll("#fArea [data-v]").forEach((b) => {
      const on = b.dataset.v === F.area;
      b.classList.toggle("on", on);
      b.setAttribute("aria-checked", on);
    });
    E("fWarn").hidden = !outside(F.alamat);
    E("fAntar").hidden = F.tipe !== "antar";
    E("fAmbil").hidden = F.tipe !== "ambil";
    const info = F.bayar === "DANA" ? PAY_INFO.dana : "";
    E("fPayInfo").textContent =
      F.bayar === "Bayar di tempat"
        ? F.tipe === "antar"
          ? "Bayar tunai ke kurir saat pesanan sampai."
          : "Bayar tunai di warung saat mengambil pesanan."
        : info
          ? `Transfer ke DANA: ${info}. Bisa juga bayar lewat QRIS.`
          : "Setelah pesanan terkirim, penjual akan membalas di WhatsApp dengan nomor DANA atau QRIS untuk pembayaran.";
  }
  paintForm();

  function fail(id, msg) {
    const el = E(id);
    const f = el.closest(".dr-f");
    f && f.classList.add("bad");
    const er = E("drErr");
    er.textContent = msg;
    er.hidden = false;
    el.focus();
    el.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  E("drOrder").addEventListener("click", () => {
    if (!cart.length) return;
    E("drErr").hidden = true;
    if (!F.nama.trim()) return fail("fNama", "Isi dulu nama pemesan, ya.");
    if (F.tipe === "antar") {
      if (!F.area)
        return fail(
          "fArea",
          "Pilih dulu area pengantaran: Pasar 1, Pasar 2, Pasar 3, atau Klumpang Dalam.",
        );
      if (F.alamat.trim().length < 5)
        return fail("fAlamat", "Isi alamat lengkap supaya pesanan bisa diantar.");
      if (outside(F.alamat))
        return fail(
          "fAlamat",
          "Maaf, alamat di luar Pasar 1, 2, 3 dan Klumpang Dalam belum bisa diantar. Pilih Ambil sendiri di warung, ya.",
        );
    }
    const total = cart.reduce((a, c) => a + c.unit * c.q, 0),
      n = cart.reduce((a, c) => a + c.q, 0);
    const lines = [
      `*PESANAN BARU* - ${CONFIG.nama}`,
      "",
      `Atas nama: ${F.nama.trim()}`,
      F.tipe === "antar"
        ? `Pengambilan: Diantar\nArea: ${F.area}\nAlamat: ${F.alamat.trim()}`
        : `Pengambilan: Ambil sendiri di ${CONFIG.nama}`,
      F.bayar === "DANA"
        ? `Pembayaran: DANA\nMohon kirimkan nomor DANA atau QRIS-nya ya, nanti saya bayar.`
        : `Pembayaran: ${F.bayar}`,
      "",
      `*Daftar pesanan (${n} item)*`,
      ...cart.map(
        (c, i) =>
          `${i + 1}. ${c.name} x${c.q} - ${rp(c.unit * c.q)}${c.level ? "\n    Pedas: " + c.level : ""}${c.top.length ? "\n    Topping: " + c.top.join(", ") : ""}${c.note ? "\n    Catatan: " + c.note : ""}`,
      ),
      "",
      `*Total: ${rp(total)}*`,
    ];
    if (F.catatan.trim()) lines.push("", `Catatan pesanan: ${F.catatan.trim()}`);
    if (window.wtFriday && window.wtFriday())
      lines.push("", "*PROMO JUMAT*: minta minuman es gratis ya!");
    lines.push("", "Mohon dikonfirmasi ya. Terima kasih!");
    const u = waLink(lines.join("\n"));
    u.startsWith("#") ? (location.hash = u) : window.open(u, "_blank", "noopener");
  });
  mnCartUI();
})();
