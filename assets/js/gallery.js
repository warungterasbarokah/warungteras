/* gallery */
(function () {
  "use strict";
  var G = "assets/gallery/";
  var ITEMS = [
    {
      id: "a",
      t: "p",
      f: "warung-depan",
      tag: "Warung",
      cat: ["foto", "warung"],
      title: "Warung Teras Dian Barokah",
      desc: "Tampak depan warung: jajanan, mie, kebab dan burger dalam satu teras.",
      alt: "Tampak depan Warung Teras Dian Barokah",
    },
    {
      id: "b",
      t: "v",
      f: "anak-jajan",
      dur: "0:08",
      tag: "Video",
      cat: ["video", "warung"],
      title: "Jam jajan anak sekolah",
      desc: "Anak-anak antre dan duduk menikmati jajanan di teras warung.",
      alt: "Video anak-anak jajan di warung",
    },
    {
      id: "c",
      t: "p",
      f: "jajan-sekolah",
      tag: "Suasana",
      cat: ["foto", "warung"],
      title: "Seru jajan bareng teman",
      desc: "Langganan cilik yang selalu ramai sepulang sekolah.",
      alt: "Anak sekolah jajan di depan warung",
    },
    {
      id: "d",
      t: "p",
      f: "kebab-burger",
      tag: "Menu",
      cat: ["foto", "jajanan"],
      title: "Kebab & Burger Rp5.000",
      desc: "Gerobak kayu kebab, burger, mie level, dan dimsum.",
      alt: "Gerobak Kebab dan Burger Rp5.000",
    },
    {
      id: "e",
      t: "p",
      f: "gerobak-mie",
      tag: "Menu",
      cat: ["foto", "warung"],
      title: "Mie Goreng & Nasi Goreng",
      desc: "Etalase tempat mie dan nasi goreng dimasak fresh.",
      alt: "Etalase mie goreng dan nasi goreng",
    },
    {
      id: "f",
      t: "p",
      f: "jajanan-bocil",
      tag: "Jajanan",
      cat: ["foto", "jajanan"],
      title: "Jajanan Bocil & Seblak",
      desc: "Meja jajanan aneka rasa, pas untuk uang saku anak.",
      alt: "Meja jajanan bocil dan seblak",
    },
    {
      id: "g",
      t: "p",
      f: "topping-seblak",
      tag: "Seblak",
      cat: ["foto", "jajanan"],
      title: "Topping seblak lengkap",
      desc: "Bakso ikan, crab stick, fish roll, dan sayur segar.",
      alt: "Aneka topping seblak dalam wadah",
    },
    {
      id: "h",
      t: "v",
      f: "tur-website",
      dur: "0:17",
      tag: "Video",
      cat: ["video"],
      title: "Dari wajan ke mangkukmu",
      desc: "Tur singkat website Warung Teras Dian Barokah.",
      alt: "Video tur website",
    },
  ];
  var FILTERS = [
    ["semua", "Semua"],
    ["foto", "Foto"],
    ["video", "Video"],
    ["warung", "Warung"],
    ["jajanan", "Jajanan"],
  ];
  var reduce = matchMedia("(prefers-reduced-motion:reduce)").matches;
  var root = document.getElementById("gx");
  if (!root) return;
  var PLAY = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  /* bar filter */
  var bar = document.createElement("div");
  bar.className = "gx-bar";
  bar.innerHTML =
    '<div class="gx-chips" role="group" aria-label="Filter galeri">' +
    FILTERS.map(function (f, i) {
      var n =
        f[0] === "semua"
          ? ITEMS.length
          : ITEMS.filter(function (x) {
              return x.cat.indexOf(f[0]) > -1;
            }).length;
      return (
        '<button type="button" class="gx-chip" data-f="' +
        f[0] +
        '" aria-pressed="' +
        (i === 0) +
        '">' +
        f[1] +
        "<small>" +
        n +
        "</small></button>"
      );
    }).join("") +
    '</div><div class="gx-count" id="gxCount" aria-live="polite"></div>';
  root.appendChild(bar);
  var grid = document.createElement("div");
  grid.className = "gx-grid";
  root.appendChild(grid);

  grid.innerHTML = ITEMS.map(function (x, i) {
    var v = x.t === "v",
      src = v ? G + x.f + "-poster.webp" : G + x.f + "-t.webp";
    return (
      '<button type="button" class="gx-it gx-' +
      x.id +
      (v ? " gx-vid" : "") +
      '" data-i="' +
      i +
      '" aria-label="' +
      esc((v ? "Putar video: " : "Perbesar foto: ") + x.title) +
      '">' +
      (v
        ? '<video muted loop playsinline preload="none" poster="' +
          src +
          '" data-src="' +
          G +
          x.f +
          '"></video>'
        : '<img src="' + src + '" alt="' + esc(x.alt) + '" loading="lazy" decoding="async">') +
      '<span class="gx-tag">' +
      esc(x.tag) +
      "</span>" +
      (v
        ? '<span class="gx-dur">' + x.dur + '</span><span class="gx-play">' + PLAY + "</span>"
        : "") +
      '<span class="gx-cap"><b>' +
      esc(x.title) +
      "</b><span>" +
      esc(x.desc) +
      "</span></span></button>"
    );
  }).join("");
  var els = [].slice.call(grid.children);

  /* muncul bertahap */
  var io =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          function (en) {
            en.forEach(function (e) {
              if (e.isIntersecting) {
                var el = e.target;
                setTimeout(function () {
                  el.classList.add("in");
                }, +el.dataset.d || 0);
                io.unobserve(el);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
        )
      : null;
  els.forEach(function (el, i) {
    el.dataset.d = (i % 4) * 90;
    io ? io.observe(el) : el.classList.add("in");
  });

  /* video di grid: putar saat terlihat (senyap) */
  var vids = [].slice.call(grid.querySelectorAll("video"));
  function srcs(m, base) {
    m.innerHTML =
      '<source src="' +
      base +
      '.mp4" type="video/mp4"><source src="' +
      base +
      '.webm" type="video/webm">';
  }
  function loadV(v) {
    if (!v.dataset.ld && v.dataset.src) {
      v.dataset.ld = 1;
      srcs(v, v.dataset.src);
      v.load();
    }
  }
  if (!reduce && "IntersectionObserver" in window) {
    var vo = new IntersectionObserver(
      function (en) {
        en.forEach(function (e) {
          var v = e.target;
          if (e.isIntersecting && !lb.classList.contains("open") && !v.closest(".gone")) {
            loadV(v);
            var p = v.play();
            p && p.catch && p.catch(function () {});
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.45 },
    );
    vids.forEach(function (v) {
      vo.observe(v);
    });
  }
  document.addEventListener("visibilitychange", function () {
    if (document.hidden)
      vids.forEach(function (v) {
        v.pause();
      });
  });

  /* filter */
  var cur = "semua";
  function visible() {
    return els.filter(function (el) {
      return !el.classList.contains("gone");
    });
  }
  function count() {
    var n = visible().length;
    document.getElementById("gxCount").textContent = n + " item";
  }
  function apply(f) {
    cur = f;
    [].forEach.call(bar.querySelectorAll(".gx-chip"), function (c) {
      c.setAttribute("aria-pressed", c.dataset.f === f);
    });
    els.forEach(function (el) {
      el.classList.add("fade");
    });
    setTimeout(
      function () {
        els.forEach(function (el, i) {
          var ok = f === "semua" || ITEMS[i].cat.indexOf(f) > -1;
          el.classList.toggle("gone", !ok);
          if (!ok) {
            var v = el.querySelector("video");
            v && v.pause();
          }
        });
        grid.classList.toggle("is-f", f !== "semua");
        grid.classList.toggle("is-few", f !== "semua" && visible().length <= 2);
        count();
        requestAnimationFrame(function () {
          els.forEach(function (el) {
            el.classList.add("in");
            el.classList.remove("fade");
          });
        });
      },
      reduce ? 0 : 260,
    );
  }
  bar.addEventListener("click", function (e) {
    var c = e.target.closest(".gx-chip");
    if (c && c.dataset.f !== cur) apply(c.dataset.f);
  });
  count();

  /* lightbox */
  var lb = document.createElement("div");
  lb.className = "gxlb";
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.setAttribute("aria-label", "Pratinjau galeri");
  lb.innerHTML =
    '<div class="gxlb-top"><span class="gxlb-n" id="gxN"></span><button type="button" class="gxlb-x" id="gxX" aria-label="Tutup">✕</button></div>' +
    '<div class="gxlb-stage" id="gxS"><button type="button" class="gxlb-nav gxlb-prev" id="gxP" aria-label="Sebelumnya">‹</button><button type="button" class="gxlb-nav gxlb-next" id="gxNx" aria-label="Berikutnya">›</button></div>' +
    '<div class="gxlb-cap"><b id="gxT"></b><span id="gxD"></span></div>';
  document.body.appendChild(lb);
  var stage = lb.querySelector("#gxS"),
    idx = 0,
    list = [],
    opener = null;
  function show(k) {
    idx = (k + list.length) % list.length;
    var x = ITEMS[list[idx]];
    var old = stage.querySelector("img,video");
    if (old) {
      if (old.pause) old.pause();
      old.remove();
    }
    var m;
    if (x.t === "v") {
      m = document.createElement("video");
      m.controls = true;
      m.autoplay = true;
      m.playsInline = true;
      m.setAttribute("playsinline", "");
      m.poster = G + x.f + "-poster.webp";
      srcs(m, G + x.f);
      var p = m.play();
      p && p.catch && p.catch(function () {});
    } else {
      m = document.createElement("img");
      m.src = G + x.f + ".webp";
      m.alt = x.alt;
    }
    stage.insertBefore(m, stage.firstChild);
    lb.querySelector("#gxN").textContent = idx + 1 + " / " + list.length;
    lb.querySelector("#gxT").textContent = x.title;
    lb.querySelector("#gxD").textContent = x.desc;
    var one = list.length < 2;
    lb.querySelector("#gxP").hidden = one;
    lb.querySelector("#gxNx").hidden = one;
  }
  function open(i, btn) {
    list = visible().map(function (el) {
      return +el.dataset.i;
    });
    idx = Math.max(0, list.indexOf(i));
    opener = btn;
    vids.forEach(function (v) {
      v.pause();
    });
    show(idx);
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    window.lenis && lenis.stop && lenis.stop();
    lb.querySelector("#gxX").focus();
  }
  function close() {
    var m = stage.querySelector("video");
    m && m.pause();
    lb.classList.remove("open");
    document.body.style.overflow = "";
    window.lenis && lenis.start && lenis.start();
    setTimeout(function () {
      var o = stage.querySelector("img,video");
      o && o.remove();
    }, 350);
    opener && opener.focus();
    vids.forEach(function (v) {
      var r = v.getBoundingClientRect();
      if (!reduce && r.top < innerHeight && r.bottom > 0 && !v.closest(".gone")) {
        var p = v.play();
        p && p.catch && p.catch(function () {});
      }
    });
  }
  grid.addEventListener("click", function (e) {
    var b = e.target.closest(".gx-it");
    if (b) open(+b.dataset.i, b);
  });
  lb.querySelector("#gxX").addEventListener("click", close);
  lb.querySelector("#gxP").addEventListener("click", function () {
    show(idx - 1);
  });
  lb.querySelector("#gxNx").addEventListener("click", function () {
    show(idx + 1);
  });
  lb.addEventListener("click", function (e) {
    if (e.target === lb || e.target === stage) close();
  });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
    else if (e.key === "Tab") {
      var f = [].slice.call(lb.querySelectorAll("button:not([hidden]),video"));
      var a = document.activeElement,
        i = f.indexOf(a);
      if (e.shiftKey && i <= 0) {
        e.preventDefault();
        f[f.length - 1].focus();
      } else if (!e.shiftKey && i === f.length - 1) {
        e.preventDefault();
        f[0].focus();
      }
    }
  });
  var sx = null;
  stage.addEventListener(
    "touchstart",
    function (e) {
      sx = e.touches[0].clientX;
    },
    { passive: true },
  );
  stage.addEventListener("touchend", function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    sx = null;
    if (Math.abs(dx) > 60) show(idx + (dx < 0 ? 1 : -1));
  });
})();
