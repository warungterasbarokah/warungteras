/* Progressive motion: visible by default, interruptible, no perpetual render loop. */
(() => {
  'use strict';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const footer = document.querySelector('footer.ft');
  if (!footer) return;
  const running = new Set();
  function animate(el, frames, options) {
    if (reduced.matches || !el.animate) return;
    const animation = el.animate(frames, options);
    running.add(animation);
    animation.finished.catch(() => {}).finally(() => running.delete(animation));
  }
  reduced.addEventListener('change', () => {
    if (reduced.matches) running.forEach(animation => animation.cancel());
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      document.body.classList.toggle('footer-in-view', entry.isIntersecting);
    }, { threshold: 0 }).observe(footer);
    const reveal = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal.unobserve(entry.target);
        animate(entry.target, [
          { opacity: 0, transform: 'translateY(22px)' },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 700, easing: 'cubic-bezier(.22,1,.36,1)' });
      });
    }, { threshold: .08 });
    footer.querySelectorAll('.ft-welcome, .ft-grid > *, .ft-mark').forEach(el => reveal.observe(el));
  }
  // A short tactile response on release, without interfering with ordering or links.
  document.addEventListener('click', event => {
    const control = event.target.closest('.ft-order, .ft-btn, .ft-soc a, .lm-row, .faq-tabs button');
    if (!control) return;
    animate(control, [{ scale: '.96' }, { scale: '1' }], {
      duration: 330, easing: 'cubic-bezier(.22,1,.36,1)'
    });
  });
  // Keep the current section understandable to screen reader users too.
  const nav = document.getElementById('navLinks');
  if (nav) {
    const sync = () => nav.querySelectorAll('a').forEach(link => {
      if (link.classList.contains('active')) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    new MutationObserver(sync).observe(nav, {
      subtree: true, attributes: true, attributeFilter: ['class']
    });
    sync();
  }
})();
