var dataCacheName = 'unsplash-v1';
self.addEventListener('fetch', function fetcher (event) {
  var request = event.request;
  if (request.url.indexOf('images.unsplash.com') > -1 || request.url.indexOf('api.unsplash.com') > -1) {
    event.respondWith(
      fetch(event.request).then(function (response) {
        return caches.open(dataCacheName).then(function (cache) {
          cache.put(event.request.url, response.clone());
          return response;
        });
      }).catch(function () { })
    );
  }
});