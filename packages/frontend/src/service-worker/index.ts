import { debounce } from "lodash";

/*import { createClient } from "../apollo/client";
import {
  getToken,
  onSessionError,
  onSessionActivity
} from "../lib/session";*/

const CACHE_NAME = "bitbloq-service-worker";
const urlsToCache = ["/"];

// const client = createClient({}, { getToken, onSessionError, onSessionActivity });

const ctx: ServiceWorkerGlobalScope = self as any;

ctx.addEventListener("install", event => {
  ctx.skipWaiting();
  console.log("instalado");
  console.log("test importing something works", debounce);
  const preLoaded = caches
    .open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
  console.log(ctx);
});

// self.addEventListener("fetch", event => {
//   const response = caches
//     .match(event.request)
//     .then(match => match || fetch(event.request));
//   event.respondWith(response);
// });

ctx.addEventListener("message", message => {
  console.log("Mensaje recibido");
  // importScripts("/uploadImage.js")
  // func();
  console.log("No hay error");
  console.log(1, message.data);
});
