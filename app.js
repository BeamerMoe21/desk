// Step 10 app shell — static only. No live data yet.
// The app opens once at (URL)#d={DATA_PATH} (and #t={APP_TOKEN}),
// keeps them in localStorage, and polls instead of SSE.
// DATA_PATH / APP_TOKEN are never committed here.
(function () {
  var tabs = document.querySelectorAll('.tabbar button');
  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () {
      tabs.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      document.querySelectorAll('.screen').forEach(function (s) {
        s.classList.remove('active');
      });
      var el = document.getElementById(btn.getAttribute('data-tab'));
      if (el) el.classList.add('active');
    });
  });

  // Read #d= and #t= from the URL hash once, then store locally.
  // Nothing is fetched in this skeleton.
  var hash = window.location.hash || '';
  var m = hash.match(/d=([A-Za-z0-9_-]+)/);
  if (m) { try { localStorage.setItem('desk_data_path', m[1]); } catch (e) {} }
  var t = hash.match(/t=([A-Za-z0-9_-]+)/);
  if (t) { try { localStorage.setItem('desk_app_token', t[1]); } catch (e) {} }
})();
