/* motion */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const fine = matchMedia("(hover:hover) and (pointer:fine)");
  const nav = document.getElementById("navbar");
  addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 90), {
    passive: true,
  });
  if ("IntersectionObserver" in window) {
    const heroVisibility = new IntersectionObserver(([e]) => {
      document.body.classList.toggle("hero-in-view", e.isIntersecting);
      hero.classList.toggle("motion-sleep", !e.isIntersecting);
    });
    heroVisibility.observe(hero);
  }
  const targets = document.querySelectorAll(
    ".nx-head,.nx-card,.nx-bx,.nx-st,.nx-ci,.nx-about,.nx-gal .nx-ph",
  );
  if (!reduced.matches && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    targets.forEach((el) => {
      el.classList.add("reveal-pending");
      io.observe(el);
    });
  }
  if (fine.matches && !reduced.matches) {
    let frame = 0;
    document.querySelectorAll(".nx-card").forEach((card) => {
      card.addEventListener("pointermove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--rx", ((e.clientY - r.top) / r.height - 0.5) * -6 + "deg");
        card.style.setProperty("--ry", ((e.clientX - r.left) / r.width - 0.5) * 7 + "deg");
      });
      card.addEventListener("pointerleave", () => {
        card.style.setProperty("--rx", "0deg");
        card.style.setProperty("--ry", "0deg");
      });
    });
  }
  // Retain the original order dialogs and add keyboard focus management.
  let restoreFocus = null;
  const origOpen = openP,
    origClose = closeAll;
  openP = function (panel) {
    const origin = restoreFocus || document.activeElement;
    origOpen(panel);
    restoreFocus = origin;
    panel.setAttribute("aria-modal", "true");
    panel.querySelector("button")?.focus();
  };
  closeAll = function () {
    origClose();
    [sheet, drawer].forEach((p) => p.removeAttribute("aria-modal"));
    restoreFocus?.focus();
    restoreFocus = null;
  };
  [document.getElementById("sheetX"), document.getElementById("drawerX"), scrim].forEach((el) =>
    el.addEventListener("click", () => {
      restoreFocus?.focus();
      restoreFocus = null;
    }),
  );
  document.addEventListener("keydown", (e) => {
    const panel = document.querySelector(".nx-sheet.open,.nx-drawer.open,.nx-lb.open");
    if (!panel || e.key !== "Tab") return;
    const focusable = [...panel.querySelectorAll("button,a[href],input")].filter(
      (el) => !el.disabled && el.offsetParent !== null && !el.classList.contains("off"),
    );
    const first = focusable[0],
      last = focusable.at(-1);
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last?.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first?.focus();
    }
  });
  document.getElementById("gal").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-photo]")) {
      e.preventDefault();
      e.target.click();
      document.getElementById("lbX").focus();
    }
  });
  const lightbox = document.getElementById("lb");
  let photoFocus = null;
  document.getElementById("gal").addEventListener("click", (e) => {
    if (lightbox.classList.contains("open")) {
      photoFocus = e.target.closest("[data-photo]");
      document.getElementById("lbX").focus();
    }
  });
  lightbox.addEventListener("click", () => photoFocus?.focus());
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && photoFocus) {
      photoFocus.focus();
      photoFocus = null;
    }
  });
  // Unconfigured shop contact must not send visitors to a made-up number.
  let noticeTimer;
  document.addEventListener(
    "click",
    (e) => {
      const a = e.target.closest("a");
      if (!a) return;
      if (a.id === "drOrder" && !cart.length) {
        e.preventDefault();
        return;
      }
      if (a.getAttribute("href") === "#lokasi" && (a.target === "_blank" || a.id === "drOrder")) {
        e.preventDefault();
        document.querySelector(".site-notice")?.remove();
        const n = document.createElement("div");
        n.className = "site-notice";
        n.setAttribute("role", "status");
        n.textContent =
          "Nomor WhatsApp warung belum tersedia. Silakan kembali setelah kontak diperbarui.";
        document.body.append(n);
        clearTimeout(noticeTimer);
        noticeTimer = setTimeout(() => n.remove(), 5500);
      }
    },
    true,
  );
})();
