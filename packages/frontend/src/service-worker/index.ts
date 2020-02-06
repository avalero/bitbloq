import { execute, GraphQLRequest, makePromise } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import { getDocumentSnapshot } from "./snapshot";
import fetch from "isomorphic-fetch";
import {
  SET_DOCUMENT_IMAGE_MUTATION,
  UPDATE_SUBMISSION_MUTATION
} from "../apollo/queries";

const uri = process.env.API_URL;
const link = createUploadLink({ fetch, uri });

const CACHE_NAME = "bitbloq-service-worker";
// const urlsToCache = ["/index", "/plans"];
const urlsToCache = [];

const ctx: ServiceWorkerGlobalScope = self as any;

ctx.addEventListener("install", event => {
  ctx.skipWaiting();
  const preLoaded = caches
    .open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
});

/*const compileWasm = "http://localhost:8000/_next/static/borndate/compile.wasm";

ctx.addEventListener("message", async message => {
  const { type } = message.data;
  if (type === "preload-borndate") {
    caches.open(CACHE_NAME).then(cache =>
      cache.match(compileWasm).then(cacheHit => {
        if (!cacheHit) {
          console.log("NOT FOUND COMPILE.WASM");
          fetch(compileWasm).then(response => {
            console.log("SAVING COMPILE.WASM");
            cache.put(compileWasm, response.clone());
          });
        } else {
          WebAssembly.instantiateStreaming(cacheHit);
          console.log("FOUND COMPILE.WASM");
        }
      })
    );
  }
});*/

/*self.addEventListener('fetch', (event: FetchEvent) => {
  console.log("FETCHING", event.request.url);
  event.respondWith(
    caches.open('borndate').then((cache) => {
      return cache.match(event.request).then((response) => {
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});*/

ctx.addEventListener("message", async message => {
  const {
    exerciseID,
    document,
    submissionID,
    token,
    type,
    userID
  } = message.data;

  if (type === "upload-image") {
    try {
      const image = await getDocumentSnapshot(document);
      makePromise(
        execute(link, {
          context: {
            headers: {
              authorization: `Bearer ${token}`
            },
            user: {
              userID
            }
          },
          query: SET_DOCUMENT_IMAGE_MUTATION,
          variables: {
            id: document.id,
            image,
            isSnapshot: true
          }
        })
      );
    } catch (e) {
      console.log("Error generating document snapshot", e);
    }
  } else if (type === "leave-exercise") {
    makePromise(
      execute(link, {
        context: {
          headers: {
            authorization: `Bearer ${token}`
          },
          user: {
            exerciseID,
            submissionID
          }
        },
        query: UPDATE_SUBMISSION_MUTATION,
        variables: {
          active: false
        }
      })
    );
  }
});
