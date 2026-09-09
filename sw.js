var CACHE_NAME = 'kanae-fleet-cache-v18';
var urlsToCache = [
  './',
  './index.html',
  './manifest.json'
];

// インストール時にアプリの枠組みをキャッシュ
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// 通信発生時の処理
self.addEventListener('fetch', function(event) {
  // Gemini APIへの通信はキャッシュを使わず、必ずネットワークへ通す
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // それ以外のファイル（HTMLやアイコン）はキャッシュがあれば優先して返す
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response; // キャッシュがあれば返す
        }
        return fetch(event.request); // 無ければネットへ取りに行く
      }
    )
  );
});
