// espresso clean. : small enhancements (the site works without JS)
(function () {
  // footer year
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // mobile menu
  var btn = document.getElementById('menu-btn');
  var nav = document.getElementById('mobile-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      btn.setAttribute('aria-label', open ? 'Open menu' : 'Close menu');
      nav.hidden = open;
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !nav.hidden) btn.click();
    });
  }

  // preselect service on the quote form (?service=deep)
  var sel = document.getElementById('service');
  if (sel) {
    var s = new URLSearchParams(location.search).get('service');
    if (s && sel.querySelector('option[value="' + s + '"]')) sel.value = s;
  }
})();
