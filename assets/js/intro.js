/* intro */
(function () {
  var I = document.getElementById("intro"),
    L = document.getElementById("loader");
  if (!I) {
    if (L) L.classList.remove("wait");
    window.__introGo = true;
    return;
  }
  var v = document.getElementById("introVideo"),
    cta = document.getElementById("introCta");
  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var shown = false,
    gone = false,
    SHOW_AT = 3;

  document.documentElement.classList.add("intro-lock");

  function show() {
    if (shown) return;
    shown = true;
    I.classList.add("show");
  }

  function go() {
    if (gone) return;
    gone = true;
    window.__introGo = true;
    if (L) L.classList.remove("wait"); // mulai loading
    window.dispatchEvent(new Event("introgo"));
    I.classList.add("out");
    try {
      v.pause();
    } catch (e) {}
    setTimeout(function () {
      I.remove();
    }, 800);
  }
  cta.addEventListener("click", go);

  if (reduce) {
    v.removeAttribute("autoplay");
    v.poster = "assets/intro/last.webp";
    v.removeAttribute("src");
    while (v.firstChild) v.removeChild(v.firstChild);
    show();
    return;
  }

  v.muted = true;
  v.defaultMuted = true;
  v.addEventListener("timeupdate", function () {
    if (v.currentTime >= SHOW_AT) show();
  });
  v.addEventListener("ended", function () {
    show();
  });
  v.addEventListener("error", function () {
    setTimeout(show, SHOW_AT * 1000);
  });
  var p = v.play();
  if (p && p.catch)
    p.catch(function () {
      setTimeout(show, SHOW_AT * 1000);
    }); // autoplay diblokir → tetap munculkan teks & tombol
  setTimeout(show, 9000); // pengaman terakhir
})();
