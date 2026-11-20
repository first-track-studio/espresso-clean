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
  // quote form: send the enquiry without leaving the page
  var form = document.getElementById('quote-form');
  if (form) {
    var status = document.getElementById('form-status');
    var sendBtn = document.getElementById('quote-submit');
    var wrap = document.getElementById('form-wrap');
    var panel = document.getElementById('thanks-panel');
    function showThanks() {
      if (!wrap || !panel) { window.location.href = 'thanks.html'; return; }
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      form.style.height = form.offsetHeight + 'px';
      void form.offsetHeight;
      wrap.classList.add('sending');
      form.style.height = reduce ? '420px' : '440px';
      panel.setAttribute('aria-hidden', 'false');
      setTimeout(function () {
        wrap.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
        wrap.classList.add('sent');
        setTimeout(function () { wrap.classList.add('settled'); }, 1200);
        var t = document.getElementById('thanks-title');
        if (t) t.focus({ preventScroll: true });
      }, reduce ? 0 : 560);
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Sending...'; }
      if (status) { status.textContent = ''; status.removeAttribute('data-state'); }
      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });
      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().then(function (body) { return { ok: r.ok && body.success, body: body }; }); })
        .then(function (res) { if (!res.ok) { throw new Error('send failed'); } showThanks(); })
        .catch(function () {
          if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = 'Send my quote request'; }
          if (status) {
            status.setAttribute('data-state', 'error');
            status.textContent = 'Sorry, that did not send. Please try again, or call ' + form.dataset.phone + ' or email ' + form.dataset.email + '.';
          }
        });
    });
  }
  // testimonials: rotate one at a time (only when there is more than one)
  var quotes = document.getElementById('quotes');
  if (quotes) {
    var slides = quotes.querySelectorAll('.testimonial');
    if (slides.length > 1) {
      quotes.classList.add('is-rotating');
      var current = 0, timer = null, paused = false;
      var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      var controls = document.createElement('div');
      controls.className = 'quote-controls';
      var dots = [];
      var show = function (n) {
        current = (n + slides.length) % slides.length;
        slides.forEach(function (s, i) {
          s.classList.toggle('is-active', i === current);
          s.setAttribute('aria-hidden', i === current ? 'false' : 'true');
        });
        dots.forEach(function (d, i) { d.setAttribute('aria-current', i === current ? 'true' : 'false'); });
      };
      var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
      var start = function () { stop(); if (!paused && !reduce) timer = setInterval(function () { show(current + 1); }, 9000); };
      slides.forEach(function (s, i) {
        var d = document.createElement('button');
        d.type = 'button'; d.className = 'quote-dot';
        d.setAttribute('aria-label', 'Show review ' + (i + 1) + ' of ' + slides.length);
        d.addEventListener('click', function () { show(i); start(); });
        dots.push(d); controls.appendChild(d);
      });
      var pauseBtn = document.createElement('button');
      pauseBtn.type = 'button'; pauseBtn.className = 'quote-pause';
      pauseBtn.textContent = reduce ? 'Play' : 'Pause';
      paused = reduce;
      pauseBtn.addEventListener('click', function () {
        paused = !paused; pauseBtn.textContent = paused ? 'Play' : 'Pause'; start();
      });
      controls.appendChild(pauseBtn);
      quotes.appendChild(controls);
      quotes.addEventListener('mouseenter', stop);
      quotes.addEventListener('mouseleave', start);
      quotes.addEventListener('focusin', stop);
      quotes.addEventListener('focusout', start);
      show(0); start();
    }
  }
})();
