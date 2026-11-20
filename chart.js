// Step 10 — charts by hand on <canvas>, devicePixelRatio aware.
// Stub: draws the empty state. Live points come from /api/chart.
(function () {
  var c = document.getElementById('chart');
  if (!c) return;
  var dpr = window.devicePixelRatio || 1;
  var w = c.clientWidth || 320, h = 180;
  c.width = w * dpr; c.height = h * dpr;
  var ctx = c.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.strokeStyle = '#00d35a'; ctx.lineWidth = 2;
  ctx.setLineDash([4, 4]);
  ctx.beginPath(); ctx.moveTo(0, h - 20); ctx.lineTo(w, h - 20); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = 'rgba(235,235,245,0.6)';
  ctx.font = '13px -apple-system, sans-serif';
  ctx.fillText('Waiting for the first trade', 8, 24);
})();
