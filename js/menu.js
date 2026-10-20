/* Menú y pie en móvil: el clon de Framer solo trae las variantes de escritorio; por debajo
   de 1024px los enlaces se esconden tras un botón y se despliegan en vertical, y el pie se apila. */
(function () {
  // "Desktop" (fondo oscuro) o "Desktop Light" (fondo claro)
  var nav = document.querySelector('nav[data-framer-name^="Desktop"]');
  if (!nav) return;
  nav.classList.add('rd-nav');
  var light = /Light/.test(nav.getAttribute('data-framer-name'));
  if (light) nav.classList.add('rd-light');
  var box = nav.querySelector('[data-framer-name="Container"]');
  var links = nav.querySelector('[data-framer-name="Links"]');
  if (!box || !links) return;

  var css = document.createElement('style');
  css.textContent =
    '.rd-burger{display:none}' +
    // diseño compacto (móvil, tableta, o cuando el menú no cabe): clase html.rd-compact
    'html.rd-compact nav.rd-nav{width:100%!important;max-width:100vw;height:auto!important}' +
    'html.rd-compact nav.rd-nav>[data-framer-name="Container"]{flex-wrap:wrap;height:auto!important;width:100%!important;' +
      'box-sizing:border-box;padding:0 16px!important;justify-content:flex-start;align-items:center;column-gap:12px}' +
    'html.rd-compact nav.rd-nav [data-framer-name="Top"]{margin-right:auto}' +
    'html.rd-compact nav.rd-nav [data-framer-name^="Border"]{display:none!important}' +
    'html.rd-compact nav.rd-nav [data-framer-name="Links"]{display:none!important;order:5;flex:0 0 100%;width:100%!important;' +
      'height:auto!important;flex-direction:column;align-items:stretch;gap:0;padding:4px 0 20px}' +
    'html.rd-compact nav.rd-open [data-framer-name="Links"]{display:flex!important}' +
    'html.rd-compact nav.rd-nav [data-framer-name="Links"]>*{width:100%!important;height:auto!important;' +
      'border:0!important;border-top:1px solid rgba(255,255,255,.12)!important;padding:0!important}' +
    'html.rd-compact nav.rd-nav [data-framer-name="Links"] a{display:block;padding:14px 0;font-size:18px}' +
    'html.rd-compact nav.rd-nav [data-framer-name="Links"] .framer-locale-picker{padding:8px 0}' +
    'html.rd-compact nav.rd-open{background:rgb(31,43,34)!important}' +
    'html.rd-compact nav.rd-light.rd-open{background:rgb(249,245,235)!important}' +
    'html.rd-compact nav.rd-light [data-framer-name="Links"]>*{border-top-color:rgba(0,0,0,.1)!important}' +
    'html.rd-compact .rd-burger{display:flex;order:3;flex-direction:column;justify-content:center;gap:5px;width:40px;height:40px;' +
      'padding:10px 8px;margin:0;background:none;border:0;color:rgb(249,245,235);cursor:pointer;-webkit-tap-highlight-color:transparent}' +
    'html.rd-compact .rd-burger span{display:block;height:2px;width:100%;background:currentColor;border-radius:1px;transition:transform .2s,opacity .2s}' +
    'html.rd-compact nav.rd-open .rd-burger span:nth-child(1){transform:translateY(7px) rotate(45deg)}' +
    'html.rd-compact nav.rd-open .rd-burger span:nth-child(2){opacity:0}' +
    'html.rd-compact nav.rd-open .rd-burger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}' +
    'html.rd-compact nav.rd-light .rd-burger{color:rgb(24,24,24)}' +
    'html.rd-compact.rd-lock,html.rd-compact.rd-lock body{overflow:hidden}' +
    // tarjetas de cuotas (Donate y Fundraising): una columna
    'html.rd-compact [data-framer-name="Pricing Grid"]{grid-template-columns:minmax(0,1fr)!important;gap:16px!important}' +
    'html.rd-compact [data-framer-name="Pricing Card"]{width:100%!important;height:auto!important}' +
    // artículo destacado del blog: imagen arriba, texto debajo
    'html.rd-compact a[data-framer-name="Type 1"]{flex-direction:column!important;align-items:stretch!important;gap:20px!important;height:auto!important}' +
    'html.rd-compact a[data-framer-name="Type 1"]>*{width:100%!important;flex:none!important}' +
    'html.rd-compact a[data-framer-name="Type 1"] h2{font-size:40px!important;line-height:1.1!important}' +
    // pie: el clon solo trae la variante "Large Desktop"; en móvil se apila
    'html.rd-compact footer [data-framer-name="Top Footer"]{flex-direction:column!important;align-items:stretch!important;gap:48px!important}' +
    'html.rd-compact footer [data-framer-name="Left Content"],html.rd-compact footer [data-framer-name="Form Container"]{width:100%!important}' +
    'html.rd-compact footer [data-framer-name="Right Content"]{width:100%!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:40px 16px!important}' +
    'html.rd-compact footer [data-framer-name="Footer Column"],html.rd-compact footer [data-framer-name="Footer Links"]{width:auto!important;min-width:0}' +
    'html.rd-compact footer [data-framer-name="Footer Links"] *{white-space:normal!important;max-width:100%}' +
    'html.rd-compact footer [data-framer-name="Bottom Footer Wrapper"]{flex-direction:column!important;align-items:flex-start!important;gap:8px!important;height:auto!important}' +
    'html.rd-compact footer [data-framer-name="Copyrights Wrapper"],html.rd-compact footer [data-framer-name="Author"]{width:auto!important;height:auto!important}' +
    'html.rd-compact footer [data-framer-name="Author"]>*{position:relative!important;inset:auto!important;transform:none!important}' +
    '@media (max-width:1199.98px){' +
    // tarjeta del objetivo de la Fase Dos (Fundraising): fuera de la posición absoluta y cifra a medida
    '[data-framer-name="Placeholder"]{height:auto!important;padding:28px 20px!important}' +
    '[data-framer-name="Placeholder"]>div{position:relative!important;inset:auto!important;transform:none!important;width:100%!important;height:auto!important}' +
    '[data-framer-name="Placeholder"] p{white-space:normal!important}' +
    '[data-framer-name="Placeholder"]>div>div:nth-child(2) p{font-size:clamp(40px,13vw,80px)!important;line-height:1.1!important}' +
    '[data-framer-name="Placeholder"]>div>div:nth-child(1) p{font-size:24px!important;line-height:1.25!important}' +
    '}';
  document.head.appendChild(css);

  var ca = document.documentElement.lang === 'ca';
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'rd-burger';
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', ca ? 'Obre el menú' : 'Open menu');
  btn.innerHTML = '<span></span><span></span><span></span>';
  box.appendChild(btn);

  function set(open) {
    nav.classList.toggle('rd-open', open);
    document.documentElement.classList.toggle('rd-lock', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? (ca ? 'Tanca el menú' : 'Close menu') : (ca ? 'Obre el menú' : 'Open menu'));
  }
  btn.addEventListener('click', function () { set(!nav.classList.contains('rd-open')); });
  links.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') set(false); });

  // compacto por debajo de 1024px, o si con la barra de escritorio algo no cabe
  // (p. ej. las etiquetas en catalán, más largas)
  var root = document.documentElement;
  function overflows() {
    if (box.scrollWidth > box.clientWidth + 2) return true;
    var cols = document.querySelectorAll('footer [data-framer-name="Footer Column"]');
    for (var i = 0; i < cols.length; i++) {
      var r = cols[i].getBoundingClientRect(), n = cols[i + 1] && cols[i + 1].getBoundingClientRect();
      var inner = cols[i].querySelector('[data-framer-name="Footer Links"]');
      var right = inner ? inner.getBoundingClientRect().left + inner.scrollWidth : r.right;
      if (n && right > n.left + 2) return true;
    }
    return false;
  }
  function layout() {
    var compact = innerWidth < 1024;
    if (!compact) {
      root.classList.remove('rd-compact');
      compact = overflows();
    }
    root.classList.toggle('rd-compact', compact);
    if (!compact) set(false);
  }
  var pending;
  window.addEventListener('resize', function () {
    cancelAnimationFrame(pending);
    pending = requestAnimationFrame(layout);
  });
  layout();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);
})();
