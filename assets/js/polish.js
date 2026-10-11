/* polish.js: ulasan, FAQ, menu, tombol ke atas, dan efek interaksi.
   Satu berkas, tiap fitur terpisah dan aman dijalankan sendiri-sendiri. */
(function () {
  "use strict";

  /* ===== util ===== */
  var D = document;
  var $ = function (s, r) {
    return (r || D).querySelector(s);
  };
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || D).querySelectorAll(s));
  };
  var mq = function (q) {
    return !!(window.matchMedia && matchMedia(q).matches);
  };
  var reduce = mq("(prefers-reduced-motion: reduce)");
  var finePointer = mq("(hover: hover) and (pointer: fine)");
  var clamp = function (v, a, b) {
    return Math.min(b, Math.max(a, v));
  };
  function raf(fn) {
    var q = false,
      args;
    return function () {
      args = arguments;
      if (q) return;
      q = true;
      requestAnimationFrame(function () {
        q = false;
        fn.apply(null, args);
      });
    };
  }
  var store = {
    get: function (k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set: function (k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {}
    },
  };
  function waNumber() {
    return (typeof CONFIG !== "undefined" && CONFIG.whatsapp) || "628211807383";
  }
  function waLink(text) {
    return "https://wa.me/" + waNumber() + "?text=" + encodeURIComponent(text);
  }
  var toastEl;
  function toast(msg) {
    if (!toastEl) {
      toastEl = D.createElement("div");
      toastEl.className = "pl-toast";
      toastEl.setAttribute("role", "status");
      toastEl.setAttribute("aria-live", "polite");
      D.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toast.t);
    toast.t = setTimeout(function () {
      toastEl.classList.remove("show");
    }, 2600);
  }
  function feature(name, fn) {
    try {
      fn();
    } catch (e) {
      if (window.console) console.warn("[polish:" + name + "]", e);
    }
  }

  /* ===== 1. reveal saat scroll ===== */
  feature("reveal", function () {
    var els = $$(".tm-head > *, .tm-form, .faq-l > *, .faq-search, .faq-tabs, .faq-it");
    els.forEach(function (el, i) {
      el.classList.add("pl-rv");
      el.style.setProperty("--d", (i % 7) * 0.06 + "s");
    });
    if (!("IntersectionObserver" in window)) {
      els.forEach(function (el) {
        el.classList.add("in");
      });
      return;
    }
    var io = new IntersectionObserver(
      function (es) {
        es.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  });

  /* ===== 2. cahaya yang mengikuti kursor di kartu ===== */
  feature("spotlight", function () {
    if (!finePointer || reduce) return;
    var SEL = ".tm-card, .faq-it, .mn-card, .kt-card, .nx-bx, .mn-fill";
    var last = null,
      px = 0,
      py = 0;
    var paint = raf(function () {
      if (!last) return;
      var r = last.getBoundingClientRect();
      last.style.setProperty("--mx", px - r.left + "px");
      last.style.setProperty("--my", py - r.top + "px");
    });
    D.addEventListener(
      "pointermove",
      function (e) {
        var t = e.target.closest ? e.target.closest(SEL) : null;
        if (!t) return;
        last = t;
        px = e.clientX;
        py = e.clientY;
        paint();
      },
      { passive: true },
    );
  });

  /* ===== 3. ulasan: marquee dengan drag + inersia ===== */
  feature("marquee", function () {
    var sec = $("#testimoni");
    var rows = $$(".tm-row", sec || D);
    if (!sec || !rows.length) return;
    if (reduce) {
      sec.classList.add("tm-static");
      return;
    }
    sec.classList.add("js-mq");

    rows.forEach(function (row, idx) {
      var track = $(".tm-track", row);
      var base = $$(".tm-card", track);
      var dir = row.getAttribute("data-dir") === "r" ? 1 : -1;
      var speed = 34 + idx * 6; // px per detik
      var half = 0,
        x = 0,
        vel = 0,
        target = speed * dir,
        dragging = false,
        hover = false,
        running = false,
        lastT = 0,
        lastX = 0,
        lastMove = 0,
        moved = 0,
        visible = false;

      function fill() {
        // pastikan satu putaran (separuh track) lebih lebar dari layar
        $$(".tm-card[data-clone]", track).forEach(function (c) {
          c.remove();
        });
        var w1 = track.scrollWidth;
        var copies = Math.max(1, Math.ceil((innerWidth + 300) / Math.max(1, w1)));
        for (var n = 0; n < copies; n++) {
          base.forEach(function (k) {
            var c = k.cloneNode(true);
            c.setAttribute("aria-hidden", "true");
            c.setAttribute("data-clone", "1");
            track.appendChild(c);
          });
        }
        // satu set = base + copies pertama; ukur lebar satu putaran
        var all = $$(".tm-card", track);
        var per = base.length;
        var first = all[0].getBoundingClientRect().left;
        var next = all[per].getBoundingClientRect().left;
        half = Math.abs(next - first) || w1;
        // perlu dua putaran penuh agar loop mulus
        var need = Math.ceil((innerWidth + half) / half) + 1;
        var have = Math.floor(all.length / per);
        for (var m = have; m < need; m++) {
          base.forEach(function (k) {
            var c = k.cloneNode(true);
            c.setAttribute("aria-hidden", "true");
            c.setAttribute("data-clone", "1");
            track.appendChild(c);
          });
        }
      }
      function wrap() {
        if (!half) return;
        x = ((x % half) + half) % half;
        x -= half; // rentang [-half, 0)
      }
      function frame(t) {
        if (!running) return;
        var dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
        lastT = t;
        if (!dragging) {
          var want = hover ? 0 : target;
          vel += (want - vel) * Math.min(1, dt * (hover ? 6 : 2.2));
          x += vel * dt;
        }
        wrap();
        track.style.transform = "translate3d(" + x.toFixed(2) + "px,0,0)";
        requestAnimationFrame(frame);
      }
      function start() {
        if (running || !visible || D.hidden) return;
        running = true;
        lastT = performance.now();
        requestAnimationFrame(frame);
      }
      function stop() {
        running = false;
      }

      fill();
      x = -half * 0.2 * (idx + 1);
      wrap();

      row.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "mouse") hover = true;
      });
      row.addEventListener("pointerleave", function (e) {
        if (e.pointerType === "mouse") hover = false;
      });
      row.addEventListener("pointerdown", function (e) {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        dragging = true;
        moved = 0;
        lastX = e.clientX;
        lastMove = performance.now();
        vel = 0;
        row.classList.add("drag");
        try {
          row.setPointerCapture(e.pointerId);
        } catch (er) {}
      });
      row.addEventListener("pointermove", function (e) {
        if (!dragging) return;
        var dx = e.clientX - lastX;
        var now = performance.now();
        var dt = Math.max(1, now - lastMove) / 1000;
        x += dx;
        moved += Math.abs(dx);
        vel = clamp(dx / dt, -2400, 2400);
        lastX = e.clientX;
        lastMove = now;
      });
      function release() {
        if (!dragging) return;
        dragging = false;
        row.classList.remove("drag");
        if (performance.now() - lastMove > 90) vel = 0;
      }
      row.addEventListener("pointerup", release);
      row.addEventListener("pointercancel", release);
      row.addEventListener("lostpointercapture", release);
      row.addEventListener("dragstart", function (e) {
        e.preventDefault();
      });

      // jalan hanya saat terlihat
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(
          function (es) {
            visible = es[0].isIntersecting;
            visible ? start() : stop();
          },
          { rootMargin: "120px" },
        ).observe(row);
      } else {
        visible = true;
        start();
      }
      D.addEventListener("visibilitychange", function () {
        D.hidden ? stop() : start();
      });
      var rz = raf(function () {
        var was = running;
        stop();
        fill();
        wrap();
        if (was) start();
      });
      addEventListener("resize", rz);
    });
  });

  /* ===== 4. form ulasan ===== */
  feature("review-form", function () {
    var rate = $("#tmRate"),
      form = $("#tmForm");
    if (!rate || !form) return;
    var val = 5;
    var labels = ["", "Kurang", "Biasa saja", "Lumayan", "Enak", "Enak banget"];
    var btns = $$("button", rate);
    function paint(n) {
      btns.forEach(function (b) {
        b.classList.toggle("on", +b.dataset.v <= n);
      });
    }
    function pick(n) {
      val = n;
      btns.forEach(function (b) {
        b.setAttribute("aria-checked", +b.dataset.v === n ? "true" : "false");
        b.tabIndex = +b.dataset.v === n ? 0 : -1;
      });
      paint(n);
      var l = $("#tmRateL");
      if (l) l.textContent = labels[n];
    }
    var lab = D.createElement("span");
    lab.id = "tmRateL";
    lab.className = "tm-rate-l";
    rate.appendChild(lab);
    btns.forEach(function (b) {
      b.addEventListener("click", function () {
        pick(+b.dataset.v);
      });
      b.addEventListener("mouseenter", function () {
        paint(+b.dataset.v);
      });
      b.addEventListener("keydown", function (e) {
        var d = e.key === "ArrowRight" || e.key === "ArrowUp" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowDown" ? -1 : 0;
        if (!d) return;
        e.preventDefault();
        pick(clamp(val + d, 1, 5));
        btns[val - 1].focus();
      });
    });
    rate.addEventListener("mouseleave", function () {
      paint(val);
    });
    pick(5);

    var name = $("#tmName"),
      menu = $("#tmMenu"),
      text = $("#tmText"),
      count = $("#tmCount"),
      err = $("#tmErr");
    var saved = store.get("wtdb-review-name");
    if (saved && !name.value) name.value = saved;
    function updCount() {
      count.textContent = text.value.length + "/300";
      count.classList.toggle("warn", text.value.length > 270);
    }
    text.addEventListener("input", function () {
      updCount();
      showErr("");
    });
    updCount();
    function showErr(m) {
      err.hidden = !m;
      err.textContent = m || "";
      text.classList.toggle("bad", !!m);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var t = text.value.trim();
      if (t.length < 8) {
        showErr(t ? "Ceritanya agak singkat, tambah sedikit lagi ya." : "Tulis dulu ulasanmu ya.");
        text.focus();
        return;
      }
      var n = name.value.trim(),
        m = menu.value.trim();
      if (n) store.set("wtdb-review-name", n);
      var msg =
        "Halo Warung Teras Dian Barokah, aku mau kasih ulasan.\n\n" +
        "Bintang: " +
        new Array(val + 1).join("⭐") +
        " (" +
        labels[val] +
        ")\n" +
        (n ? "Nama: " + n + "\n" : "") +
        (m ? "Menu: " + m + "\n" : "") +
        "Ulasan: " +
        t;
      toast("Membuka WhatsApp…");
      window.open(waLink(msg), "_blank", "noopener");
      text.value = "";
      menu.value = "";
      updCount();
    });
  });

  /* ===== 5. FAQ: akordeon, filter, pencarian, keyboard, deep link ===== */
  feature("faq", function () {
    var list = $("#faqList");
    if (!list) return;
    var items = $$(".faq-it", list);
    var tabs = $("#faqTabs"),
      search = $("#faqSearch"),
      none = $("#faqNone");
    var cat = "all",
      q = "";
    function setOpen(it, open) {
      it.classList.toggle("open", open);
      $(".faq-q", it).setAttribute("aria-expanded", open ? "true" : "false");
    }
    function openOnly(it) {
      items.forEach(function (o) {
        setOpen(o, o === it);
      });
    }
    function norm(s) {
      return (s || "").toLowerCase();
    }
    function apply() {
      var first = null,
        n = 0;
      items.forEach(function (it) {
        var ok = (cat === "all" || it.dataset.c === cat) && (!q || norm(it.textContent).indexOf(q) > -1);
        it.hidden = !ok;
        if (ok) {
          n++;
          if (!first) first = it;
        }
      });
      // penomoran ulang sesuai yang tampil
      var i = 0;
      items.forEach(function (it) {
        if (!it.hidden) $("em", it).textContent = ("0" + ++i).slice(-2);
      });
      none.hidden = n > 0;
      var open = items.filter(function (it) {
        return !it.hidden && it.classList.contains("open");
      })[0];
      if (!open && first) openOnly(first);
    }
    items.forEach(function (it, i) {
      setOpen(it, i === 0);
      var btn = $(".faq-q", it);
      btn.addEventListener("click", function () {
        var willOpen = !it.classList.contains("open");
        items.forEach(function (o) {
          setOpen(o, false);
        });
        setOpen(it, willOpen);
      });
      btn.addEventListener("keydown", function (e) {
        var vis = items.filter(function (x) {
          return !x.hidden;
        });
        var at = vis.indexOf(it),
          to = -1;
        if (e.key === "ArrowDown") to = (at + 1) % vis.length;
        else if (e.key === "ArrowUp") to = (at - 1 + vis.length) % vis.length;
        else if (e.key === "Home") to = 0;
        else if (e.key === "End") to = vis.length - 1;
        if (to < 0) return;
        e.preventDefault();
        $(".faq-q", vis[to]).focus();
      });
    });
    if (tabs) {
      $$("button", tabs).forEach(function (b) {
        b.addEventListener("click", function () {
          $$("button", tabs).forEach(function (x) {
            var on = x === b;
            x.classList.toggle("on", on);
            x.setAttribute("aria-selected", on ? "true" : "false");
          });
          cat = b.dataset.f;
          items.forEach(function (it) {
            setOpen(it, false);
          });
          apply();
        });
      });
    }
    if (search) {
      var t;
      search.addEventListener("input", function () {
        clearTimeout(t);
        t = setTimeout(function () {
          q = norm(search.value.trim());
          if (q) items.forEach(function (it) {
            setOpen(it, false);
          });
          apply();
        }, 120);
      });
    }
    // deep link: #faq-3 membuka pertanyaan ke-3
    function fromHash() {
      var m = /^#faq-(\d+)$/.exec(location.hash);
      if (!m) return;
      var it = items[+m[1] - 1];
      if (!it) return;
      openOnly(it);
      setTimeout(function () {
        it.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }, 300);
    }
    addEventListener("hashchange", fromHash);
    fromHash();
  });

  /* ===== 6. menu: kartu pengisi di baris terakhir ===== */
  feature("menu-fill", function () {
    var grid = $("#mnGrid");
    if (!grid) return;
    var fill = D.createElement("a");
    fill.className = "mn-fill";
    fill.target = "_blank";
    fill.rel = "noopener";
    fill.href = waLink("Halo, aku mau tanya soal menu dong.");
    fill.innerHTML =
      '<img src="assets/img/logo-warung.webp" alt="" width="120" height="110" loading="lazy" />' +
      '<span class="mn-fill-t"><small>Bingung pilih?</small><b>Tanya kami, <em>kami bantu pilihkan</em></b>' +
      "<span>Setiap Jumat beli apa saja dapat es gratis.</span></span>" +
      '<span class="mn-fill-b">Chat WhatsApp <i aria-hidden="true">→</i></span>';
    grid.appendChild(fill);
    var busy = false;
    function layout() {
      busy = true;
      var cols = getComputedStyle(grid).gridTemplateColumns.split(" ").length;
      var n = grid.querySelectorAll(".mn-card:not(.hide)").length;
      var empty = cols > 1 && n > 0 ? (cols - (n % cols)) % cols : 0;
      if (empty > 0) {
        fill.style.display = "";
        fill.style.gridColumn = "span " + empty;
        fill.classList.toggle("wide", empty > 1);
      } else {
        fill.style.display = "none";
      }
      busy = false;
    }
    new MutationObserver(function () {
      if (!busy) layout();
    }).observe(grid, { attributes: true, attributeFilter: ["class"], subtree: true, childList: true });
    addEventListener("resize", raf(layout));
    layout();
  });

  /* ===== 7. tombol ke atas + status navbar ===== */
  feature("scroll-ui", function () {
    var top = $("#toTop"),
      arc = $("#toTopArc"),
      dock = $("#navbar");
    var C = 2 * Math.PI * 23;
    var upd = raf(function () {
      var h = D.documentElement.scrollHeight - innerHeight;
      var p = h > 0 ? clamp(scrollY / h, 0, 1) : 0;
      if (arc) arc.style.strokeDashoffset = C * (1 - p);
      if (top) top.classList.toggle("show", scrollY > innerHeight * 0.8);
      if (dock) dock.classList.toggle("is-scrolled", scrollY > 24);
    });
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    upd();
    if (top) {
      top.addEventListener("click", function () {
        if (window.lenis && typeof lenis.scrollTo === "function") lenis.scrollTo(0, { duration: 1.4 });
        else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
      });
    }
  });

  /* ===== 8. heading: pecah per kata untuk text-wrap lebih rapi ===== */
  feature("a11y", function () {
    // tandai region yang bisa digulir keyboard
    $$(".tm-rows").forEach(function (r) {
      r.addEventListener("keydown", function (e) {
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          // tidak ada scroll native: beri sinyal agar pengguna keyboard tahu bisa Tab ke form
          e.preventDefault();
        }
      });
    });
  });
})();

/* ===== footer: tahun otomatis + status Promo Jumat ===== */
(function () {
  try {
    var y = document.getElementById("ftYear");
    if (y) y.textContent = new Date().getFullYear();
    var p = document.getElementById("ftPromo");
    if (!p) return;
    function upd() {
      var d = new Date().getDay(); // 5 = Jumat
      var b = p.querySelector("b");
      if (d === 5) {
        p.classList.add("live");
        b.textContent = "Hari ini Jumat: es gratis!";
      } else {
        p.classList.remove("live");
        var n = (5 - d + 7) % 7;
        b.textContent = "Promo Jumat " + n + " hari lagi: es gratis";
      }
    }
    upd();
    setInterval(upd, 60000);
  } catch (e) {}
})();
