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
   en la URL). Ahora da de alta en la lista «Regenera Deià» de Mailchimp (JSONP, sin servidor).
   Si la conexión falla (p. ej. un bloqueador), abre un correo a info@ con el alta. */
(function () {
  var MC = 'https://regeneradeia.us6.list-manage.com/subscribe/post?u=0d27a81b0247a735d283f95a2&id=67850fde18';
  var ca = document.documentElement.lang === 'ca';
  var T = ca ? {
    invalid: 'Escriu una adreça electrònica vàlida.',
    sending: 'Enviant…',
    confirm: 'Gràcies! Revisa el correu per confirmar l\'alta.',
    done: 'Gràcies! Ja reps el butlletí.',
    already: 'Aquest correu ja està subscrit al butlletí.',
    error: 'No s\'ha pogut fer l\'alta. Torna-ho a provar o escriu a info@regeneradeia.com.',
    mailSubject: 'Alta al butlletí de Regenera Deià',
    mailBody: 'Vull rebre el butlletí de Regenera Deià a: '
  } : {
    invalid: 'Please enter a valid email address.',
    sending: 'Sending…',
    confirm: 'Thank you! Check your inbox to confirm your subscription.',
    done: 'Thank you! You are now subscribed.',
    already: 'This email is already subscribed to the newsletter.',
    error: 'We could not subscribe you. Please try again or write to info@regeneradeia.com.',
    mailSubject: 'Newsletter sign-up — Regenera Deià',
    mailBody: 'Please add me to the Regenera Deià newsletter: '
  };
  var n = 0;

  function jsonp(url, ok, fail) {
    var cb = '__rdmc' + (++n), s = document.createElement('script'), t;
    function clean() { clearTimeout(t); delete window[cb]; s.remove(); }
    window[cb] = function (r) { clean(); ok(r); };
    s.onerror = function () { clean(); fail(); };
    t = setTimeout(function () { clean(); fail(); }, 12000);
    s.src = url + '&c=' + cb;
    document.head.appendChild(s);
  }

  document.querySelectorAll('form').forEach(function (form) {
    var email = form.querySelector('input[name="Email"],input[type="email"]');
    if (!email) return;
    // el texto de debajo del campo («Your information is never disclosed…») hace de mensaje de estado
    var wrap = form.closest('[data-framer-name="Form Container"]') || form.parentElement;
    var note = [].slice.call(wrap.querySelectorAll('p')).filter(function (p) { return !form.contains(p) && /third parties|tercers/i.test(p.textContent); })[0];
    var noteText = note && note.textContent;
    function say(msg) { if (note) note.textContent = msg || noteText; }
    var busy = false;
    form.setAttribute('novalidate', '');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (busy) return;
      var v = email.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
        email.focus();
        email.setCustomValidity(T.invalid);
        email.reportValidity();
        return;
      }
      email.setCustomValidity('');
      busy = true;
      say(T.sending);
      // b_…: camp parany de Mailchimp contra bots, ha d'anar buit
      jsonp(MC + '&EMAIL=' + encodeURIComponent(v) + '&b_0d27a81b0247a735d283f95a2_67850fde18=', function (r) {
        busy = false;
        var msg = (r && r.msg) || '';
        if (/already subscribed/i.test(msg)) {            // Mailchimp lo da como éxito o como error
          email.value = '';
          say(T.already);
        } else if (r && r.result === 'success') {
          email.value = '';
          say(/confirm/i.test(msg) ? T.confirm : T.done);
        } else {
          say(T.error);
        }
      }, function () {
        busy = false;
        say(noteText);
        location.href = 'mailto:info@regeneradeia.com?subject=' + encodeURIComponent(T.mailSubject) + '&body=' + encodeURIComponent(T.mailBody + v);
      });
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
