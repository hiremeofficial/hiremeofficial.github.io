// hire.me · theme toggle, mobile menu, portfolio viewer
(function () {
  var root = document.documentElement;

  // Theme toggle (initial theme is set by the inline script in <head>)
  var toggle = document.querySelector('.theme-toggle');
  function syncLabel() {
    if (!toggle) return;
    var dark = root.getAttribute('data-theme') === 'dark';
    toggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', dark ? '#0F0E0D' : '#F4F2EE');
  }
  if (toggle) {
    syncLabel();
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('hireme-theme', next); } catch (e) {}
      syncLabel();
    });
  }

  // Mobile menu
  var menuBtn = document.querySelector('.menu-btn');
  var nav = document.getElementById('nav');
  if (menuBtn && nav) {
    menuBtn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Portfolio viewers (Home and Work pages)
  var viewers = document.querySelectorAll('.viewer');
  viewers.forEach(function (viewer, vi) {
    var track = viewer.querySelector('.track');
    var slides = track.querySelectorAll('img');
    var prev = viewer.querySelector('.arrow.prev');
    var next = viewer.querySelector('.arrow.next');
    var counter = viewer.querySelector('.counter');
    var thumbs = document.querySelectorAll('.thumbs[data-for="' + viewer.id + '"] button');
    var current = 0;
    function go(i) {
      i = Math.max(0, Math.min(slides.length - 1, i));
      track.scrollTo({ left: i * (track.clientWidth + 16), behavior: 'smooth' });
    }
    function update() {
      current = Math.round(track.scrollLeft / (track.clientWidth + 16));
      if (counter) counter.textContent = (current + 1) + ' / ' + slides.length;
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      thumbs.forEach(function (t, i) { t.setAttribute('aria-current', i === current ? 'true' : 'false'); });
    }
    prev.addEventListener('click', function () { go(current - 1); });
    next.addEventListener('click', function () { go(current + 1); });
    thumbs.forEach(function (t, i) { t.addEventListener('click', function () { go(i); viewer.scrollIntoView({ behavior: 'smooth', block: 'center' }); }); });
    track.addEventListener('scroll', function () { window.requestAnimationFrame(update); }, { passive: true });
    // Keep the current page lined up if the window is resized
    window.addEventListener('resize', function () {
      var keep = current;
      track.style.scrollBehavior = 'auto';
      track.scrollLeft = keep * (track.clientWidth + 16);
      track.style.scrollBehavior = '';
    });
    if (vi === 0) document.addEventListener('keydown', function (e) {
      if (e.target.closest && e.target.closest('input, textarea')) return;
      if (e.key === 'ArrowLeft') go(current - 1);
      if (e.key === 'ArrowRight') go(current + 1);
    });
    update();
  });
})();
