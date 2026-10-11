/* ordering */
(() => {
  "use strict";
  const D = document,
    cp = D.getElementById("cp");
  if (!cp) return;
  const sts = [...cp.querySelectorAll(".cp-st")];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  sts.forEach((s, i) => s.style.setProperty("--d", (0.15 + i * 0.14).toFixed(2)));
  cp.classList.add("js");

  let i = -1,
    timer = 0,
    visible = false,
    paused = false;
  const set = (k) => {
    i = (k + sts.length) % sts.length;
    sts.forEach((s, j) => s.classList.toggle("hot", j === i));
  };
  const loop = () => {
    clearInterval(timer);
    if (reduce) return;
    timer = setInterval(() => {
      if (visible && !paused) set(i + 1);
    }, 2400);
  };

  sts.forEach((s, k) => {
    s.addEventListener("pointerenter", () => {
      paused = true;
      sts.forEach((x) => x.classList.remove("hot"));
    });
    s.addEventListener("pointerleave", () => {
      paused = false;
      set(k);
    });
    s.addEventListener("focus", () => {
      paused = true;
      sts.forEach((x) => x.classList.remove("hot"));
    });
    s.addEventListener("blur", () => {
      paused = false;
    });
    s.addEventListener("click", () => {
      set(k);
    });
  });

  if ("IntersectionObserver" in window && !reduce) {
    new IntersectionObserver(
      (es) =>
        es.forEach((x) => {
          visible = x.isIntersecting;
          if (visible && !cp.classList.contains("in")) {
            cp.classList.add("in");
            setTimeout(() => {
              cp.classList.add("done");
              set(0);
            }, 1700);
            loop();
          }
        }),
      { threshold: 0.25 },
    ).observe(cp);
  } else {
    cp.classList.add("in", "done");
  }
})();
