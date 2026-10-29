// Portfolio starter: light/dark toggle only. No tracking, no network calls.
(function () {
  var button = document.getElementById('theme-toggle');
  if (!button) return;

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    button.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    button.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
  }

  var saved = null;
  try { saved = localStorage.getItem('portfolio-theme'); } catch (e) { saved = null; }
  var start = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  apply(start);

  button.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    try { localStorage.setItem('portfolio-theme', next); } catch (e) {}
    apply(next);
  });
})();
