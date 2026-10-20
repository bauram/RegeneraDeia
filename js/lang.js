/* Selector de idioma EN / CA: la versión catalana vive en /ca/ con las mismas rutas. */
(function () {
  var CA = 'eG4_o7Dbq';
  var path = location.pathname;
  var isCa = /\/ca(\/|$)/.test(path);
  function target() {
    if (isCa) return path.replace(/\/ca(\/|$)/, '/');
    var i = path.lastIndexOf('/blog/');
    var base = i >= 0 ? path.slice(0, i + 1) : path.slice(0, path.lastIndexOf('/') + 1);
    return base + 'ca/' + path.slice(base.length);
  }
  document.querySelectorAll('.framer-locale-picker select').forEach(function (sel) {
    sel.value = isCa ? CA : 'default';
    var title = sel.parentNode.querySelector('.title');
    if (title) title.textContent = isCa ? 'Català' : 'English';
    sel.addEventListener('change', function () {
      if ((sel.value === CA) !== isCa) location.href = target() + location.hash;
    });
  });
})();
