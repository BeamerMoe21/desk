// Service worker — Step 10. Skeleton only: no caching of live data,
// no push handling until webpush.py is built and the app is on the
// user's home screen with notifications allowed.
self.addEventListener('install', function () { self.skipWaiting(); });
self.addEventListener('push', function (event) {
  // TODO: show the push with the coin's FOMO button from links.py.
});
