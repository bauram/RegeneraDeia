/* Piezas interactivas que dependían del runtime de Framer y el clon estático había perdido. */

/* Barra de progreso de la captación (Fundraising): el relleno se quedaba a 0 px. */
(function () {
  document.querySelectorAll('span').forEach(function (s) {
    var m = /^(\d{1,3})\s*%$/.exec(s.textContent.trim());
    if (!m) return;
    var box = s.parentElement && s.parentElement.parentElement;
    var track = box && box.lastElementChild;
    var fill = track && track.firstElementChild;
    if (!fill || track === s.parentElement || track.children.length !== 1) return;
    fill.style.setProperty('width', Math.min(100, +m[1]) + '%', 'important');
  });
})();

/* Boletín: el formulario de Framer ya no envía a ningún sitio (recargaba la página con el email
   en la URL). Mientras no haya una lista conectada, abre un correo a info@ con el alta. */
(function () {
  var ca = document.documentElement.lang === 'ca';
  document.querySelectorAll('form').forEach(function (form) {
    var email = form.querySelector('input[name="Email"],input[type="email"]');
    if (!email) return;
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        email.focus();
        email.setCustomValidity(ca ? 'Escriu una adreça electrònica vàlida.' : 'Please enter a valid email address.');
        email.reportValidity();
        return;
      }
      email.setCustomValidity('');
      var subject = ca ? 'Alta al butlletí de Regenera Deià' : 'Newsletter sign-up — Regenera Deià';
      var body = (ca ? 'Vull rebre el butlletí de Regenera Deià a: ' : 'Please add me to the Regenera Deià newsletter: ') + v;
      location.href = 'mailto:info@regeneradeia.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
      email.value = '';
      email.placeholder = ca ? 'Gràcies! Envia el correu per confirmar-ho.' : 'Thank you! Send the email to confirm.';
    });
    email.addEventListener('input', function () { email.setCustomValidity(''); });
  });
})();

/* Indicador "cargando más" del blog: era la paginación de Framer y se quedaba girando para siempre. */
(function () {
  document.querySelectorAll('[data-framer-name="Loading"]').forEach(function (l) {
    (l.parentElement || l).style.setProperty('display', 'none', 'important');
  });
})();

/* Selector Mensual / Anual de las cuotas: solo existe la versión mensual, así que se oculta
   en lugar de dejar un botón que no hace nada. */
(function () {
  document.querySelectorAll('[data-framer-name="Pricing Switch"]').forEach(function (sw) {
    sw.style.setProperty('display', 'none', 'important');
  });
})();

/* Acordeón de preguntas frecuentes (FAQ y Donate): sin el runtime de Framer las preguntas
   no se abrían. Cada pregunta es una variante "Closed" u "Open" con su respuesta dentro. */
(function () {
  var items = document.querySelectorAll('[data-framer-name="Closed"],[data-framer-name="Open"]');
  if (!items.length) return;

  function imp(el, prop, val) { if (el) el.style.setProperty(prop, val, 'important'); }

  items.forEach(function (item) {
    var top = item.querySelector('[data-framer-name="Top"]');
    var ans = item.querySelector('[data-framer-name="Answer"]');
    if (!top || !ans) return;
    var inner = ans.firstElementChild;
    // icono +/−: dos barras; la vertical es la más alta
    var bars = top.lastElementChild ? [].slice.call(top.lastElementChild.children) : [];
    var vbar = bars.filter(function (b) { return b.offsetHeight > b.offsetWidth; })[0];
    if (!vbar && bars[0]) {                       // la variante "Open" solo dibuja la barra horizontal
      vbar = bars[0].cloneNode(true);
      vbar.style.transform = 'rotate(90deg)';
      bars[0].parentNode.appendChild(vbar);
    }

    function set(open) {
      item.classList.toggle('rd-faq-open', open);
      imp(item, 'height', 'auto');
      imp(ans, 'opacity', open ? '1' : '0');
      imp(ans, 'height', open ? 'auto' : '0px');
      imp(ans, 'overflow', 'hidden');
      if (inner) imp(inner, 'height', open ? 'auto' : '0px');
      imp(ans, 'padding-top', '0px');
      imp(ans, 'padding-bottom', open ? '24px' : '0px');
      if (vbar) { imp(vbar, 'opacity', open ? '0' : '1'); imp(vbar, 'transition', 'opacity .2s'); }
      top.setAttribute('aria-expanded', open ? 'true' : 'false');
    }

    top.setAttribute('role', 'button');
    top.setAttribute('tabindex', '0');
    top.style.cursor = 'pointer';
    var open = item.getAttribute('data-framer-name') === 'Open';
    set(open);
    // la transición solo tras la carga, para no animar el estado inicial
    setTimeout(function () { imp(ans, 'transition', 'opacity .25s'); }, 0);
    function toggle() { open = !open; set(open); }
    top.addEventListener('click', toggle);
    top.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });
  });
})();
