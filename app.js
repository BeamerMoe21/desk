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
  var hash = window.location.hash || '';
  var m = hash.match(/d=([A-Za-z0-9_-]+)/);
  if (m) { try { localStorage.setItem('desk_data_path', m[1]); } catch (e) {} }
  var t = hash.match(/t=([A-Za-z0-9_-]+)/);
  if (t) { try { localStorage.setItem('desk_app_token', t[1]); } catch (e) {} }

  // Poll the Plan B state files under d/<DATA_PATH>/ every 15s
  // (Step 10: the app polls instead of SSE). The poll only runs once
  // a data path is known (hash or localStorage); without one the app
  // stays in its empty state and never shows an error.
  // state.json field names are the live process's contract (Step 10,
  // writer not built yet): balance, todayPct and multiplier are read
  // only when present as numbers. On any failure the error row shows
  // with a retry countdown and the last good numbers stay on screen
  // — never a blank screen.
  var POLL_MS = 15000;
  var dataPath = null;
  try { dataPath = localStorage.getItem('desk_data_path'); } catch (e) {}
  var lastGood = null;
  var retryTimer = null;

  function setText(id, value) {
    var el = document.getElementById(id);
    if (el) el.textContent = value;
  }

  function showError(secondsLeft) {
    var row = document.getElementById('desk-error');
    if (!row) return;
    row.hidden = false;
    setText('retry-s', String(secondsLeft));
    setText('last-update', lastGood || '—');
  }

  function hideError() {
    var row = document.getElementById('desk-error');
    if (row) row.hidden = true;
  }

  function countdown(secondsLeft) {
    if (retryTimer) clearInterval(retryTimer);
    showError(secondsLeft);
    retryTimer = setInterval(function () {
      secondsLeft -= 1;
      if (secondsLeft <= 0) { clearInterval(retryTimer); return; }
      setText('retry-s', String(secondsLeft));
    }, 1000);
  }

  function refreshFrame() {
    var img = document.getElementById('screen-frame');
    var text = document.getElementById('frame-text');
    if (!img || !dataPath) return;
    img.onload = function () {
      img.hidden = false;
      if (text) text.style.display = 'none';
    };
    img.onerror = function () { /* keep the waiting text */ };
    img.src = 'd/' + dataPath + '/screen.jpg?ts=' + Date.now();
  }

  function poll() {
    fetch('d/' + dataPath + '/state.json', {cache: 'no-store'})
      .then(function (resp) {
        if (!resp.ok) throw new Error('state ' + resp.status);
        return resp.json();
      })
      .then(function (state) {
        lastGood = new Date().toLocaleTimeString();
        hideError();
        if (state && typeof state.balance === 'number') {
          setText('balance', state.balance.toFixed(2));
        }
        if (state && typeof state.todayPct === 'number') {
          setText('today-pct', (state.todayPct >= 0 ? '+' : '') +
            state.todayPct.toFixed(2) + '%');
        }
        if (state && typeof state.multiplier === 'number') {
          setText('mult', state.multiplier.toFixed(2) + 'x');
        }
        refreshFrame();
      })
      .catch(function () { countdown(POLL_MS / 1000); });
  }

  if (dataPath) {
    poll();
    setInterval(poll, POLL_MS);
  }
})();
