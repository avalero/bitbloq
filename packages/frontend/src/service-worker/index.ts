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

const BORNDATE_CACHE_NAME = `borndate-${process.env.BORNDATE_VERSION}`;

ctx.addEventListener("install", event => {
  ctx.skipWaiting();
  const preLoaded = caches
    .open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));

  // Clean old versions of borndate
  const cleanCaches = caches.keys().then(keys =>
    Promise.all(
      keys.map(key => {
        if (key.indexOf("borndate-") === 0 && key !== BORNDATE_CACHE_NAME) {
          return caches.delete(key);
        } else {
          return Promise.resolve(false);
        }
      })
    )
  );

  event.waitUntil(Promise.all([preLoaded, cleanCaches]));
});

/* Cache Borndate files */
self.addEventListener("fetch", (event: FetchEvent) => {
  if (/static\/borndate\/*/.test(event.request.url)) {
    event.respondWith(
      caches.open(BORNDATE_CACHE_NAME).then(cache => {
        return cache.match(event.request).then(cacheResponse => {
          return (
            cacheResponse ||
            fetch(event.request).then(response => {
              cache.put(event.request, response.clone());
              return response;
            })
          );
        });
      })
    );
  }
});

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
