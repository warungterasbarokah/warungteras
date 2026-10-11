/* app */
const CONFIG = { whatsapp: "628211807383", nama: "Warung Teras Dian Barokah" }; // ganti nomor WA asli (format 62xxxxxxxxxx)
function waLink(m) {
  if (!/^62\d{8,13}$/.test(CONFIG.whatsapp)) return "#lokasi";
  return "https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(m);
}
document.querySelectorAll('[href="__WA_LINK_GENERAL__"]').forEach((a) => {
  a.href = waLink("Halo " + CONFIG.nama + ", saya mau pesan.");
});
function formatRupiah(n) {
  return "Rp" + n.toLocaleString("id-ID");
}

/* HARGA & TOPPING = CONTOH, silakan sesuaikan */
const LEVEL = [
  { id: "tidak", label: "Tidak Pedas" },
  { id: "sedang", label: "Sedang" },
  { id: "pedas", label: "Pedas" },
  { id: "super", label: "Super Pedas" },
];
const T25 = 2500;
const MENUS = {
  nyemek: {
    name: "Mie Nyemek",
    emoji: "🍜",
    color: "#d90429",
    foto: "mie-nyemek.webp",
    base: 12000,
    desc: "Mie berkuah kental gurih-pedas yang nyemek, hangat di setiap suapan.",
    varian: [["Mie Nyemek", 12000]],
    toppings: [
      ["Telur", 3000],
      ["Tambah Mie", 2000],
      ["Ayam Suwir", T25],
      ["Bakso", T25],
      ["Sosis", T25],
      ["Sawi Tambahan", T25],
      ["Kerupuk", T25],
    ],
    sayur: ["Sawi", "Tauge", "Kol"],
  },
  nasgor: {
    name: "Nasi Goreng",
    emoji: "🍛",
    color: "#b30000",
    foto: "nasi-goreng.webp",
    base: 12000,
    desc: "Nasi goreng harum wajan dengan bumbu pas, cocok dari pagi sampai malam.",
    varian: [["Nasi Goreng", 12000]],
    toppings: [
      ["Telur Ceplok", 3000],
      ["Telur Dadar", 3000],
      ["Ayam Suwir", T25],
      ["Sosis", T25],
      ["Bakso", T25],
      ["Ati Ampela", T25],
      ["Kerupuk", T25],
    ],
    sayur: ["Sawi", "Tomat", "Timun"],
  },
  seblak: {
    name: "Seblak",
    emoji: "🌶️",
    color: "#9d0208",
    foto: "seblak.webp",
    base: 2500,
    desc: "Seblak kuah kencur pedas gurih, isi sesuai topping pilihanmu. Tiap topping Rp2.500, telur Rp3.000.",
    varian: [["Seblak Dasar", 0]],
    toppings: [
      ["Fish Roll", T25],
      ["Chikuwa Mini", T25],
      ["Crab Stick", T25],
      ["Fish Cake Udang", T25],
      ["Dumpling Ikan", T25],
      ["Bakso Ikan", T25],
      ["Fish Ball Spiral", T25],
      ["Mie Polos", 2000],
      ["Telur", 3000],
    ],
    sayur: [],
  },
  tiaw: {
    name: "Mie Tiaw",
    emoji: "🍝",
    color: "#222",
    foto: "mie-tiaw.webp",
    base: 12000,
    desc: "Mie tiaw kenyal digoreng atau berkuah, bumbu sedap khas warung.",
    varian: [["Mie Tiaw", 12000]],
    toppings: [
      ["Telur", 3000],
      ["Tambah Mie", 2000],
      ["Ayam Suwir", T25],
      ["Bakso", T25],
      ["Sosis", T25],
      ["Kerupuk", T25],
    ],
    sayur: ["Sawi", "Tauge", "Wortel"],
  },
  ifumie: {
    name: "Mie Ifumie",
    emoji: "🍲",
    color: "#ef233c",
    foto: "mie-ifumie.webp",
    base: 12000,
    desc: "Mie ifumie lembut dengan kuah atau tumisan gurih, topping bebas pilih.",
    varian: [["Mie Ifumie", 12000]],
    toppings: [
      ["Telur", 3000],
      ["Tambah Mie", 2000],
      ["Ayam Suwir", T25],
      ["Bakso", T25],
      ["Sosis", T25],
      ["Jamur", T25],
    ],
    sayur: ["Sawi", "Tauge", "Kol"],
  },
  burger: {
    name: "Burger",
    emoji: "🍔",
    color: "#e88733",
    foto: "burger.webp",
    base: 7000,
    desc: "Burger telur Rp7.000, pakai daging ayam jadi Rp10.000. Roti lembut, isian melimpah.",
    varian: [
      ["Burger Telur", 7000],
      ["Burger Ayam", 10000],
    ],
    toppings: [],
    sayur: [],
    pel: [],
  },
  kebab: {
    name: "Kebab",
    emoji: "🌯",
    color: "#a94824",
    foto: "kebab.webp",
    base: 8000,
    desc: "Kebab telur + sosis Rp8.000, tambah ayam suwir jadi Rp10.000. Sayuran segar dan saus favorit.",
    varian: [
      ["Kebab Telur + Sosis", 8000],
      ["Kebab Ayam Suwir", 10000],
    ],
    toppings: [],
    sayur: [],
    pel: [],
  },
  kentang: {
    name: "Tela-Tela",
    emoji: "🍟",
    color: "#df861a",
    foto: "kentang.webp",
    base: 2000,
    desc: "Tela-tela renyah di luar, lembut di dalam. Beli berapa rupiah saja bebas, mulai Rp2.000. Pilih rasa Jagung atau Balado.",
    varian: [["Tela-Tela", 2000]],
    toppings: [],
    sayur: [],
    pel: [],
  },
};
const KEYS = Object.keys(MENUS);
const PELENGKAP = ["Kerupuk", "Acar", "Sambal Tambahan", "Jeruk Nipis"];
function plate(m, cls = "") {
  const k = m.foto.replace(/\.(?:webp|png|jpg)$/, "");
  return `<div class="plate ${cls}" data-photo="${k}" style="--pc:${m.color}"><span class="plate-emoji">${m.emoji}</span><img class="ph" src="assets/img/${m.foto}" alt="${m.name}" onerror="this.remove()"></div>`;
}

const SNACKS = [];
const CATEGORIES = KEYS.map((k, i) => ({
  key: k,
  name: MENUS[k].name,
  title: MENUS[k].name,
  desc: MENUS[k].desc,
  priceFrom: MENUS[k].base,
  m: MENUS[k],
})).concat(
  SNACKS.map((m) => ({
    key: m.key,
    name: m.name,
    title: m.name,
    desc: m.desc,
    priceFrom: null,
    m,
  })),
);
const THEME = [
  { word: "MIE NYEMEK", tone: "red", bg: "#b30f0f", ink: "#fff1de", fg: "#ffffff" },
  { word: "NASI GORENG", tone: "cream", bg: "#f6ecdc", ink: "#d4080f", fg: "#140a0a" },
  { word: "SEBLAK", tone: "dark", bg: "#0b0909", ink: "#ffffff", fg: "#ffffff" },
  { word: "MIE TIAW", tone: "red", bg: "#b30f0f", ink: "#fff1de", fg: "#ffffff" },
  { word: "MIE IFUMIE", tone: "cream", bg: "#f6ecdc", ink: "#d4080f", fg: "#140a0a" },
  { word: "BURGER", tone: "dark", bg: "#0b0909", ink: "#ffffff", fg: "#ffffff" },
  { word: "KEBAB", tone: "maroon", bg: "#5a0909", ink: "#f0e2cc", fg: "#ffffff" },
  { word: "TELA-TELA", tone: "cream", bg: "#f6ecdc", ink: "#d4080f", fg: "#140a0a" },
];
const WHY = [
  {
    ico: "🔥",
    title: "Dimasak Saat Dipesan",
    desc: "Setiap porsi dibuat fresh ketika pesanan masuk.",
  },
  { ico: "🌶️", title: "Level Pedas Sesuai Selera", desc: "Dari tidak pedas sampai super pedas." },
  {
    ico: "🍳",
    title: "Topping Bebas Pilih",
    desc: "Telur, ayam suwir, bakso, ceker, dan banyak lagi.",
  },
  { ico: "💰", title: "Harga Bersahabat", desc: "Mulai Rp2.000." },
];
const STEPS = [
  { title: "Pilih Menu", desc: "Mie nyemek, nasi goreng, seblak, mie tiaw, atau mie ifumie." },
  {
    title: "Pilih Pedas & Topping",
    desc: "Atur level pedas dan topping lewat fitur Pilih Topping.",
  },
  { title: "Pesan via WhatsApp", desc: "Pesanan dikirim ke WhatsApp untuk dikonfirmasi." },
  { title: "Ambil / Diantar", desc: "Pesanan siap diambil atau diproses untuk pengantaran." },
];
const REVIEWS = [
  {
    stars: 5,
    quote: "Mie nyemeknya gurih, kuahnya pas, toppingnya banyak.",
    name: "Andi",
    item: "🍜 Mie Nyemek",
  },
  {
    stars: 5,
    quote: "Nasi gorengnya wangi, porsinya mantap.",
    name: "Rina",
    item: "🍛 Nasi Goreng",
  },
  { stars: 5, quote: "Seblaknya pedasnya nendang, ceker empuk.", name: "Dewi", item: "🌶️ Seblak" },
  { stars: 4, quote: "Mie tiawnya kenyal, bumbunya sedap.", name: "Fajar", item: "🍝 Mie Tiaw" },
];

/* Hero: shared orbit positions keep adjacent products physically connected. */
const hero = document.getElementById("hero"),
  heroStage = document.getElementById("heroStage");
const heroGiant = document.getElementById("heroGiant"),
  heroTexts = document.getElementById("heroTexts"),
  heroDots = document.getElementById("heroDots");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const N = CATEGORIES.length,
  L = { slot: [], giant: [], text: [], dot: [] };
let currentHero = 0,
  heroBusy = false,
  paused = reduceMotion,
  autoplayTimer;
CATEGORIES.forEach((cat, i) => {
  const g = document.createElement("div");
  g.className = "giant";
  g.innerHTML = THEME[i].word
    .split(" ")
    .map((w) => `<span class="word">${w}</span>`)
    .join("");
  heroGiant.append(g);
  L.giant.push(g);
  const slot = document.createElement("div");
  slot.className = "food-slot";
  slot.innerHTML = `<div class="food-float"><div class="food-react">${plate(cat.m, "hero-plate")}</div></div>`;
  slot.setAttribute("aria-hidden", "true");
  heroStage.append(slot);
  L.slot.push(slot);
  const t = document.createElement("div");
  t.className = "hero-text";
  t.innerHTML = `<span class="hero-label">HANGAT. NIKMAT. BIKIN DEKAT.</span><h2 class="ht">${cat.title}</h2><p class="desc">${cat.desc}</p><div class="hero-cta">${cat.priceFrom ? `<button class="kbtn kbtn-primary magnetic" data-open="${cat.key}">Pesan sekarang <span>↗</span></button>` : `<a class="kbtn kbtn-primary" href="${waLink("Halo, boleh info " + cat.name + "?")}">Tanya menu ↗</a>`}<a href="#menu-lengkap" class="hero-menu-link">Semua menu →</a></div>`;
  heroTexts.append(t);
  L.text.push(t);
  const dot = document.createElement("button");
  dot.className = "hero-dot";
  dot.setAttribute("aria-label", "Tampilkan " + cat.name);
  dot.addEventListener("click", () => goTo(i));
  heroDots.append(dot);
  L.dot.push(dot);
});
function renderHero() {
  const th = THEME[currentHero];
  hero.style.setProperty("--hb", th.bg);
  hero.style.setProperty("--ink", th.ink);
  clearTimeout(window.__fgT);
  if (hero.style.getPropertyValue("--fg"))
    window.__fgT = setTimeout(() => hero.style.setProperty("--fg", th.fg), 430);
  else hero.style.setProperty("--fg", th.fg);
  L.slot.forEach((el, i) => {
    let d = (i - currentHero + N) % N;
    if (d > N / 2) d -= N;
    el.dataset.position =
      d === 0 ? "center" : d === -1 ? "left" : d === 1 ? "right" : d < 0 ? "out-left" : "out-right";
    el.classList.toggle("active", d === 0);
    L.giant[i].classList.toggle("active", d === 0);
    L.text[i].classList.toggle("active", d === 0);
    L.text[i].inert = d !== 0;
    L.text[i].setAttribute("aria-hidden", String(d !== 0));
    L.dot[i].classList.toggle("active", d === 0);
    L.dot[i].setAttribute("aria-pressed", String(d === 0));
  });
  document.getElementById("heroCurrent").textContent = String(currentHero + 1).padStart(2, "0");
  document.getElementById("heroPrice").textContent = CATEGORIES[currentHero].priceFrom
    ? formatRupiah(CATEGORIES[currentHero].priceFrom)
    : "Tanya kami";
  document.querySelector(".hero-price .from").textContent = CATEGORIES[currentHero].priceFrom
    ? "Mulai dari"
    : "Harga & ketersediaan";
}
function goTo(i) {
  const index = (i + N) % N;
  if (heroBusy || index === currentHero) return;
  heroBusy = true;
  let distance = (index - currentHero + N) % N;
  const direction = distance > N / 2 ? -1 : 1;
  const change = () => {
    currentHero = index;
    renderHero();
  };
  if (window.animateHeroChange && !reduceMotion) window.animateHeroChange(change, direction);
  else change();
  resetAutoplay();
  setTimeout(() => (heroBusy = false), reduceMotion ? 0 : 650);
}
function resetAutoplay() {
  clearTimeout(autoplayTimer);
  if (!paused && !document.hidden)
    autoplayTimer = setTimeout(() => {
      if (
        hero.getBoundingClientRect().bottom > innerHeight * 0.45 &&
        !document.querySelector(".nx-scrim.on") &&
        !hero.matches(":focus-within")
      )
        goTo(currentHero + 1);
      else resetAutoplay();
    }, 5800);
}
document.getElementById("heroNext").addEventListener("click", () => goTo(currentHero + 1));
document.getElementById("heroPrev").addEventListener("click", () => goTo(currentHero - 1));
const pauseBtn = document.getElementById("heroPause");
pauseBtn.textContent = paused ? "▶" : "Ⅱ";
pauseBtn.setAttribute("aria-pressed", String(paused));
pauseBtn.setAttribute("aria-label", paused ? "Putar pergantian produk" : "Jeda pergantian produk");
pauseBtn.addEventListener("click", () => {
  paused = !paused;
  pauseBtn.textContent = paused ? "▶" : "Ⅱ";
  pauseBtn.setAttribute("aria-pressed", String(paused));
  pauseBtn.setAttribute(
    "aria-label",
    paused ? "Putar pergantian produk" : "Jeda pergantian produk",
  );
  resetAutoplay();
});
hero.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
    e.preventDefault();
    goTo(currentHero + (e.key === "ArrowRight" ? 1 : -1));
  }
});
document.addEventListener("visibilitychange", resetAutoplay);
renderHero();
resetAutoplay();

/* foto: file di assets/img/ dipakai apa adanya (fitur upload/mode edit foto sudah dihapus) */
const PHOTO = { urls: {}, init: async () => {} };
const paintAll = () => {};

/* ======================================================================
   KONTEN BARU
   ====================================================================== */
const $ = (s) => document.querySelector(s),
  rp = formatRupiah;
const phBox = (m, extra = "") =>
  `<div class="nx-ph" ${extra} data-photo="${m.foto.replace(/\.(?:webp|png|jpg)$/, "")}" data-edit style="--pc:${m.color}"><span class="nx-ph-e">${m.emoji}</span><img class="ph" src="assets/img/${m.foto}" alt="${m.name}" loading="lazy" onerror="this.remove()"></div>`;
const TAGS = { nyemek: "Best Seller", seblak: "Paling Pedas" };
/* kenapa, cara pesan */
$("#whyGrid").innerHTML = [
  [
    "🔥",
    "Dimasak saat dipesan",
    "Setiap porsi dibuat fresh ketika pesanan masuk, jadi selalu panas dan harum.",
  ],
  ["🌶️", "Level pedas sesuai selera", "Dari tidak pedas sampai super pedas."],
  ["🍳", "Topping bebas pilih", "Telur, ayam suwir, bakso, ceker, dan banyak lagi."],
  [
    "💰",
    "Harga bersahabat",
    "Mie dan nasi goreng Rp12.000, tela-tela mulai Rp2.000, seblak mulai Rp2.500.",
  ],
]
  .map(([e, t, d]) => `<div class="nx-bx"><span>${e}</span><h3>${t}</h3><p>${d}</p></div>`)
  .join("");
if ($("#stepsRow"))
  $("#stepsRow").innerHTML = [
    ["Pilih menu", "Mie, nasi goreng, seblak, kebab, burger, atau tela-tela."],
    ["Atur topping", "Pilih varian, level pedas, dan topping favoritmu."],
    ["Kirim ke WhatsApp", "Cek keranjang lalu kirim pesanan untuk dikonfirmasi."],
    ["Ambil / diantar", "Pesanan siap diambil atau diproses untuk diantar."],
  ]
    .map(([t, d], i) => `<div class="nx-st"><b>${i + 1}</b><h3>${t}</h3><p>${d}</p></div>`)
    .join("");

/* galeri: slot galeri-1..N, bisa ditambah di mode edit */
let galN = 8;
function drawGal() {
  let h = "";
  for (let i = 0; i < galN; i++) {
    const m = CATEGORIES[i % CATEGORIES.length].m,
      k = i < CATEGORIES.length ? m.foto.replace(/\.webp$/, "") : `galeri-${i + 1}`;
    h += `<div class="nx-ph" data-photo="${k}" data-default="assets/img/${m.foto}" data-edit tabindex="0" role="button" aria-label="Perbesar foto ${m.name}"><img class="ph" src="assets/img/${m.foto}" alt="${m.name}" loading="lazy"><span class="gallery-caption">${m.name} ↗</span></div>`;
  }
  h += '<button type="button" class="nx-ph nx-add" id="galAdd">＋ Tambah slot foto</button>';
  $("#gal").innerHTML = h;
  paintAll($("#gal"));
}
drawGal();
$("#gal").addEventListener("click", (e) => {
  if (e.target.closest("#galAdd")) {
    galN++;
    return drawGal();
  }
  if (document.body.classList.contains("editing") || e.target.closest(".ph-ctl")) return;
  const ph = e.target.closest(".nx-ph");
  const img = ph && ph.querySelector("img.ph");
  if (img) {
    $("#lbImg").src = img.src;
    $("#lb").classList.add("open");
  }
});
$("#lb").addEventListener("click", () => $("#lb").classList.remove("open"));
$("#lbX").addEventListener("click", () => $("#lb").classList.remove("open"));

/* ---------- sheet pesanan + keranjang ---------- */
const scrim = $("#scrim"),
  sheet = $("#sheet"),
  drawer = $("#drawer");
function closeAll() {
  [sheet, drawer].forEach((p) => {
    p.classList.remove("open");
    p.setAttribute("aria-hidden", "true");
    p.removeAttribute("aria-modal");
  });
  scrim.classList.remove("on");
  window.lenis && lenis.start();
  document.body.style.overflow = "";
}
function openP(p) {
  closeAll();
  p.classList.add("open");
  p.setAttribute("aria-hidden", "false");
  scrim.classList.add("on");
  window.lenis && lenis.stop();
  document.body.style.overflow = "hidden";
}
scrim.addEventListener("click", closeAll);
$("#sheetX").addEventListener("click", closeAll);
$("#drawerX").addEventListener("click", closeAll);
addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeAll();
    $("#lb").classList.remove("open");
  }
});
let cur = null,
  sel = { v: 0, l: 1, t: new Set(), s: new Set(), p: new Set(), q: 1 };
const chip = (label, on, extra, attr) =>
  `<button type="button" class="nx-ch ${on ? "on" : ""}" aria-pressed="${on}" ${attr}>${label}${extra ? `<small>${extra}</small>` : ""}</button>`;
const unit = () => {
  const m = MENUS[cur];
  return m.varian[sel.v][1] + [...sel.t].reduce((a, i) => a + m.toppings[i][1], 0);
};
function drawSheet() {
  const m = MENUS[cur];
  $("#shVar").innerHTML = m.varian
    .map(([n, p], i) =>
      chip(n.replace(m.name + " ", ""), sel.v === i, rp(p), `data-g="v" data-i="${i}"`),
    )
    .join("");
  $("#shLvl").innerHTML = LEVEL.map((l, i) =>
    chip(l.label, sel.l === i, "", `data-g="l" data-i="${i}"`),
  ).join("");
  $("#shTop").innerHTML = m.toppings
    .map(([n, p], i) => chip(n, sel.t.has(i), "+" + rp(p), `data-g="t" data-i="${i}"`))
    .join("");
  $("#shSay").innerHTML = m.sayur
    .map((n, i) => chip(n, sel.s.has(i), "", `data-g="s" data-i="${i}"`))
    .join("");
  $("#shPel").innerHTML = (m.pel || PELENGKAP)
    .map((n, i) => chip(n, sel.p.has(i), "", `data-g="p" data-i="${i}"`))
    .join("");
  ["shTop", "shSay", "shPel"].forEach((id) => {
    const e = $("#" + id);
    e.previousElementSibling.hidden = e.hidden = !e.innerHTML.trim();
  });
  $("#qVal").textContent = sel.q;
  $("#addBtn").textContent = `Tambah ke Keranjang · ${rp(unit() * sel.q)}`;
}
function openSheet(k, topIdx) {
  cur = k;
  const m = MENUS[k];
  sel = {
    v: 0,
    l: 1,
    t: new Set(topIdx == null ? [] : [topIdx]),
    s: new Set(),
    p: new Set(),
    q: 1,
  };
  const ph = $("#shPh");
  ph.dataset.photo = m.foto.replace(/\.(?:webp|png|jpg)$/, "");
  ph.style.setProperty("--pc", m.color);
  ph.querySelector(".nx-ph-e").textContent = m.emoji;
  ph.querySelectorAll("img.ph").forEach((i) => i.remove());
  paint(ph, true);
  if (PHOTO.urls[ph.dataset.photo]) paint(ph);
  $("#shName").textContent = m.name;
  $("#shDesc").textContent = m.desc;
  $("#shBase").textContent = "Mulai " + rp(m.varian[0][1]);
  drawSheet();
  openP(sheet);
}
document.addEventListener("click", (e) => {
  const o = e.target.closest("[data-open]");
  if (o) return openSheet(o.dataset.open);
  const t = e.target.closest("[data-tk]");
  if (t) return openSheet(t.dataset.tk, +t.dataset.ti);
  const q = e.target.closest("[data-quick]");
  if (q) {
    const m = MENUS[q.dataset.quick];
    addItem(q.dataset.quick, { v: 0, l: 1, t: new Set(), s: new Set(), p: new Set(), q: 1 });
    return openP(drawer);
  }
});
sheet.addEventListener("click", (e) => {
  const b = e.target.closest("[data-g]");
  if (!b) return;
  const g = b.dataset.g,
    i = +b.dataset.i;
  if (g === "v") sel.v = i;
  else if (g === "l") sel.l = i;
  else {
    const s = sel[g];
    s.has(i) ? s.delete(i) : s.add(i);
  }
  drawSheet();
});
$("#qPlus").addEventListener("click", () => {
  sel.q++;
  drawSheet();
});
$("#qMin").addEventListener("click", () => {
  if (sel.q > 1) {
    sel.q--;
    drawSheet();
  }
});
const cart = [];
function addItem(k, s) {
  const m = MENUS[k];
  const top = [...s.t].map((i) => m.toppings[i]);
  const it = {
    name: m.varian[s.v][0],
    level: s.l == null ? "" : LEVEL[s.l].label,
    note: s.note || "",
    top: top.map((t) => t[0]),
    say: [...s.s].map((i) => m.sayur[i]),
    pel: [...s.p].map((i) => (m.pel || PELENGKAP)[i]),
    unit: m.varian[s.v][1] + top.reduce((a, t) => a + t[1], 0),
    q: s.q,
  };
  const key = JSON.stringify([it.name, it.level, it.top, it.say, it.pel, it.note]);
  const ex = cart.find((c) => c.key === key);
  ex ? (ex.q += it.q) : cart.push({ ...it, key });
  drawCart();
  const cb = $("#cartBtn");
  cb.classList.remove("bump");
  void cb.offsetWidth;
  cb.classList.add("bump");
}
$("#addBtn").addEventListener("click", () => {
  addItem(cur, sel);
  openP(drawer);
});
$("#cartBtn").addEventListener("click", () => {
  drawCart();
  openP(drawer);
});
function drawCart() {
  const n = cart.reduce((a, c) => a + c.q, 0),
    total = cart.reduce((a, c) => a + c.unit * c.q, 0);
  $("#cartCount").textContent = n;
  $("#drTotal").textContent = rp(total);
  $("#drList").innerHTML = cart.length
    ? cart
        .map(
          (
            c,
            i,
          ) => `<div class="nx-it"><div><b>${c.name}</b><small>${[c.level ? "Pedas: " + c.level : "", c.top.length ? "Topping: " + c.top.join(", ") : ""].filter(Boolean).join(" · ")}${c.note ? ` · Catatan: ${c.note}` : ""}${c.say.length ? ` · Sayur: ${c.say.join(", ")}` : ""}${c.pel.length ? ` · ${c.pel.join(", ")}` : ""}</small></div><div class="p">${rp(c.unit * c.q)}</div>
  <div class="ctl"><button data-c="-" data-i="${i}" aria-label="Kurangi">−</button><b>${c.q}</b><button data-c="+" data-i="${i}" aria-label="Tambah">+</button><button class="rm" data-c="x" data-i="${i}">Hapus</button></div></div>`,
        )
        .join("")
    : `<div class="nx-empty"><span>🛒</span>Keranjang masih kosong.<br>Pilih menu dulu, yuk!</div>`;
  const o = $("#drOrder");
  o.classList.toggle("off", !cart.length);
  o.href = cart.length
    ? waLink(
        [
          `Halo ${CONFIG.nama}, saya mau pesan:`,
          ...cart.map(
            (c, i) =>
              `${i + 1}. ${c.name} x${c.q} (${rp(c.unit * c.q)})${c.level ? "\n   Pedas: " + c.level : ""}${c.note ? "\n   Catatan: " + c.note : ""}${c.top.length ? "\n   Topping: " + c.top.join(", ") : ""}${c.say.length ? "\n   Sayur: " + c.say.join(", ") : ""}${c.pel.length ? "\n   Pelengkap: " + c.pel.join(", ") : ""}`,
          ),
          `Total: ${rp(total)}`,
        ].join("\n"),
      )
    : "#";
}
$("#drList").addEventListener("click", (e) => {
  const b = e.target.closest("[data-c]");
  if (!b) return;
  const i = +b.dataset.i,
    a = b.dataset.c;
  if (a === "x") cart.splice(i, 1);
  else if (a === "+") cart[i].q++;
  else if (--cart[i].q < 1) cart.splice(i, 1);
  drawCart();
});
drawCart();
PHOTO.init().then(() => paintAll(document));

/* ======================================================================
   MOTION: Lenis + loader + GSAP (loader & hero dipertahankan)
   ====================================================================== */
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasGSAP = !!(window.gsap && window.ScrollTrigger);
var lenis = null;
if (window.Lenis && !reduce) {
  lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.stop();
  if (hasGSAP) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  } else {
    const raf = (t) => {
      lenis.raf(t);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
  }
}
document.querySelectorAll('a[href^="#"]').forEach((a) =>
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    lenis
      ? lenis.scrollTo(el, { offset: -70, force: true })
      : el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
  }),
);

/* ---------- LOADER (intro dulu → klik PESAN SEKARANG → progress loading → masuk website) ---------- */
(function () {
  const Lo = document.getElementById("loader"),
    bar = document.getElementById("loaderBar"),
    pct = document.getElementById("ldPct");
  const MIN = reduce ? 0 : 2800;
  let loaded = document.readyState === "complete",
    done = false;
  window.addEventListener("load", () => {
    loaded = true;
  });
  function finish() {
    if (done) return;
    done = true;
    Lo.classList.add("exit");
    pct && (pct.textContent = "100%");
    bar.style.transform = "scaleX(1)";
    // hero mulai masuk saat layar loading baru mulai terbuka dari tengah → terasa menyambung
    setTimeout(
      () => {
        document.documentElement.classList.remove("intro-lock");
        document.body.classList.add("ready");
        lenis && lenis.start();
        hasGSAP && ScrollTrigger.refresh();
      },
      reduce ? 150 : 380,
    );
    setTimeout(() => Lo.remove(), reduce ? 600 : 1800);
  }
  function run() {
    const t0 = performance.now();
    (function tick(now) {
      if (done) return;
      const p = Math.min((now - t0) / MIN, 1);
      const v = loaded ? p : Math.min(p, 0.9);
      bar.style.transform = `scaleX(${v})`;
      pct && (pct.textContent = Math.round(v * 100) + "%");
      p >= 1 && loaded ? finish() : requestAnimationFrame(tick);
    })(t0);
    setTimeout(finish, 7000);
  }
  // loading baru dimulai setelah tombol PESAN SEKARANG di intro ditekan
  window.__introGo || !document.getElementById("intro")
    ? run()
    : window.addEventListener("introgo", run, { once: true });
})();

/* ---------- SCROLL-TRIGGER ---------- */
if (hasGSAP && !reduce) {
  gsap.registerPlugin(ScrollTrigger);
  const split = (el) => {
    el.innerHTML = el.textContent
      .trim()
      .split(/\s+/)
      .map((w) => `<span class="sw"><span class="swi">${w}</span></span>`)
      .join(" ");
    return el.querySelectorAll(".swi");
  };
  document.querySelectorAll(".nx-head h2,.nx-about h2,.cta-section h2").forEach((h) =>
    gsap.from(split(h), {
      yPercent: 120,
      rotate: 5,
      duration: 1,
      ease: "power4.out",
      stagger: 0.08,
      scrollTrigger: { trigger: h, start: "top 88%" },
    }),
  );
  const batch = (sel, from = {}) => {
    const els = gsap.utils.toArray(sel);
    if (!els.length) return;
    gsap.set(els, Object.assign({ opacity: 0, y: 60 }, from));
    ScrollTrigger.batch(els, {
      start: "top 92%",
      once: true,
      onEnter: (b) =>
        gsap.to(b, {
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotate: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          overwrite: true,
          clearProps: "transform,opacity",
        }),
    });
  };
  batch(".nx-card", { scale: 0.94 });
  batch(".nx-bx", { scale: 0.94 });
  batch(".nx-st");
  batch(".nx-ci");
  batch(".nx-gal .nx-ph", { scale: 0.92 });
  batch(".nx-seg,.nx-heat,.nx-stats>div");
  gsap.from(".nx-about .nx-ph", {
    clipPath: "inset(100% 0% 0% 0%)",
    scale: 1.25,
    duration: 1.3,
    ease: "power4.out",
    scrollTrigger: { trigger: ".nx-about", start: "top 80%" },
  });
  const hs = { trigger: "#hero", start: "top top", end: "bottom top", scrub: true };
  gsap.to("#heroGiant", { yPercent: -22, ease: "none", scrollTrigger: hs });
  gsap.to("#heroStage", { yPercent: 10, scale: 0.92, ease: "none", scrollTrigger: hs });
  gsap.to(".hero-info", {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: { trigger: "#hero", start: "15% top", end: "70% top", scrub: true },
  });
  window.addEventListener("load", () => ScrollTrigger.refresh());
}

/* ---------- NAVBAR DOCK, progress, glow, magnetic, counter ---------- */
(function () {
  const nav = document.getElementById("navbar"),
    links = [...document.querySelectorAll("#navLinks a")];
  const secs = links.map((l) => document.getElementById(l.dataset.sec)).filter(Boolean),
    bar = document.getElementById("scrollProgress");
  let lastY = 0;
  function setActive(id) {
    links.forEach((l) => l.classList.toggle("active", l.dataset.sec === id));
  }
  function onScroll() {
    const y = scrollY,
      max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
    nav.classList.toggle("hide", y > lastY && y > 500 && !matchMedia("(max-width:900px)").matches);
    lastY = y;
    let cur = "hero";
    secs.forEach((s) => {
      if (s.getBoundingClientRect().top < innerHeight * 0.45) cur = s.id;
    });
    setActive(cur);
  }
  let _sr = 0;
  addEventListener(
    "scroll",
    () => {
      if (!_sr)
        _sr = requestAnimationFrame(() => {
          _sr = 0;
          onScroll();
        });
    },
    { passive: true },
  );
  onScroll();
  const glow = document.getElementById("cursorGlow");
  if (glow && matchMedia("(hover:hover)").matches)
    addEventListener("mousemove", (e) => {
      glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`;
    });
  if (matchMedia("(hover:hover)").matches && !reduce) {
    document.addEventListener("mousemove", (e) => {
      if (1) return;
      document.querySelectorAll(".magnetic,.kbtn").forEach((b) => {
        const r = b.getBoundingClientRect(),
          dx = e.clientX - (r.left + r.width / 2),
          dy = e.clientY - (r.top + r.height / 2);
        b.style.translate = Math.hypot(dx, dy) < 90 ? `${dx * 0.18}px ${dy * 0.28}px` : "";
      });
    });
  }
  document.querySelectorAll(".nx-stats strong").forEach((el) => {
    const n = parseInt(el.textContent),
      suf = el.textContent.replace(/[0-9]/g, "");
    if (!n) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      (function f(t) {
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(n * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(f);
      })(t0);
    });
    io.observe(el);
  });
})();
