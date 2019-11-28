const CACHE_NAME = "bitbloq-service-worker";
const urlsToCache = ["/"];

self.importScripts("/uploadImage.js");

self.addEventListener("install", event => {
  self.skipWaiting();
  console.log("instalado");
  const preLoaded = caches
    .open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
  console.log(self);
});

// self.addEventListener("fetch", event => {
//   const response = caches
//     .match(event.request)
//     .then(match => match || fetch(event.request));
//   event.respondWith(response);
// });

self.addEventListener("message", message => {
  console.log("Mensaje recibido");
  // importScripts("/uploadImage.js")
  func();
  console.log("No hay error");
  console.log(1, message.data);
});
