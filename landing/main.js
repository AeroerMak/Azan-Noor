// Sky mood from the visitor's local time — an approximation of the app's
// prayer-based themes, since the landing page doesn't ask for location.
(function setVibe() {
  const m = new Date().getHours() * 60 + new Date().getMinutes();
  const vibe =
    m >= 4 * 60 && m < 12 * 60 ? 'Fajr' :
    m < 15 * 60 + 30 && m >= 12 * 60 ? 'Dhuhr' :
    m < 18 * 60 + 30 && m >= 15 * 60 + 30 ? 'Asr' :
    m < 20 * 60 && m >= 18 * 60 + 30 ? 'Maghrib' :
    'Isha';
  document.body.dataset.vibe = vibe;
  document.querySelector(`[data-mood="${vibe}"]`)?.classList.add('now');
})();

// Deterministic star field
(function stars() {
  const box = document.querySelector('.sky .stars');
  if (!box) return;
  for (let i = 0; i < 80; i++) {
    const s = document.createElement('span');
    s.style.left = `${(i * 37.7) % 100}%`;
    s.style.top = `${((i * 61.3) % 100) * 0.8}%`;
    s.style.animationDelay = `${(i % 10) * 0.6}s`;
    if (i % 7 === 0) s.style.width = s.style.height = '3px';
    box.appendChild(s);
  }
})();

document.querySelectorAll('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

// Latest APK details (version.json is also what the app will read to offer updates)
fetch('/version.json', { cache: 'no-cache' })
  .then((r) => (r.ok ? r.json() : null))
  .then((v) => {
    if (!v) return;
    const mb = `${Math.round(v.android.size / 1e6)} MB`;
    document.querySelectorAll('[data-apk-link]').forEach((a) => { a.href = v.android.url; });
    document.querySelectorAll('[data-apk-size]').forEach((el) => {
      el.textContent = el.closest('.hero-cta') ? `APK · ${mb}` : mb;
    });
    document.querySelectorAll('[data-apk-meta]').forEach((el) => {
      el.textContent = `Version ${v.android.version} · Android 7.0+`;
    });
  })
  .catch(() => {});

// Reveal sections as they scroll into view
(function reveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  items.forEach((el) => io.observe(el));
})();
