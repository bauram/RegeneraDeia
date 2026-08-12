/* Reproducción ligera y local de las animaciones "appear" de Framer.
   Los elementos [data-appear] arrancan ocultos (opacity:0 + translateY) y se
   revelan al entrar en el viewport, imitando el fade/slide del sitio original.
   Robustez: IntersectionObserver + red de seguridad por scroll, y failsafe
   externo (en el <head>) que muestra todo si este script no llega a ejecutarse. */
(function () {
  window.__animOK = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function all() { return Array.prototype.slice.call(document.querySelectorAll('[data-appear]')); }
  function revealAll() { all().forEach(function (el) { el.classList.add('anim-in'); }); }

  if (reduce) { revealAll(); return; }

  function run() {
    var els = all();
    // escalonado sutil entre hermanos que aparecen juntos
    var groups = new Map();
    els.forEach(function (el) {
      var p = el.parentElement || document.body;
      var arr = groups.get(p) || []; arr.push(el); groups.set(p, arr);
    });
    groups.forEach(function (arr) {
      arr.forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 350) + 'ms'; });
    });

    function reveal(el) { el.classList.add('anim-in'); }

    var io = null;
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } });
      }, { root: null, rootMargin: '0px 0px -6% 0px', threshold: 0 });
      els.forEach(function (el) { io.observe(el); });
    }

    // Red de seguridad: cualquier elemento ya dentro (o por encima) del viewport se revela.
    var ticking = false;
    function sweep() {
      ticking = false;
      var vh = window.innerHeight || document.documentElement.clientHeight;
      all().forEach(function (el) {
        if (el.classList.contains('anim-in')) return;
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.98 && r.bottom > 0) { reveal(el); if (io) io.unobserve(el); }
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', sweep);
    sweep();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();
})();
