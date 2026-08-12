/* Animaciones "appear" locales (reproducción del efecto de Framer).
   Oculta [data-appear] con CSS :not(.anim-in) y revela al entrar en viewport.
   Robusto: scroll en captura (soporta contenedores de scroll anidados) + poll
   de respaldo + failsafe externo en el <head>. Respeta prefers-reduced-motion. */
(function () {
  window.__animOK = true;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function pending() { return Array.prototype.slice.call(document.querySelectorAll('[data-appear]:not(.anim-in)')); }
  function revealAll() { document.querySelectorAll('[data-appear]').forEach(function (e) { e.classList.add('anim-in'); }); }
  if (reduce) { revealAll(); return; }

  function start() {
    // escalonado sutil entre hermanos
    var groups = new Map();
    document.querySelectorAll('[data-appear]').forEach(function (el) {
      var p = el.parentElement || document.body; var a = groups.get(p) || []; a.push(el); groups.set(p, a);
    });
    groups.forEach(function (a) { a.forEach(function (el, i) { el.style.transitionDelay = Math.min(i * 70, 350) + 'ms'; }); });

    function tick() {
      var vh = window.innerHeight || document.documentElement.clientHeight;
      pending().forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('anim-in');
      });
    }
    var raf = false;
    function onScroll() { if (!raf) { raf = true; requestAnimationFrame(function () { raf = false; tick(); }); } }
    // capture:true => también recibe scroll de contenedores internos (no burbujea)
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', tick);
    tick();
    // poll de respaldo para scroll no estándar; se detiene al revelar todo
    var poll = setInterval(function () { tick(); if (pending().length === 0) clearInterval(poll); }, 200);
    setTimeout(function () { clearInterval(poll); }, 20000);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
