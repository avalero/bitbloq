import { execute, GraphQLRequest, makePromise } from "apollo-link";
import { SET_DOCUMENT_IMAGE_MUTATION } from "../apollo/queries";
import { createUploadLink } from "apollo-upload-client";

interface IContext {
  headers: {
    authorization: string;
  };
  user: {
    userID: string;
  };
}

interface IOperation {
  context: IContext;
  query?: any;
  variables?: {
    [key: string]: any;
  };
}

const uri = process.env.API_URL_SERVER || process.env.API_URL;
const link = createUploadLink({ uri });

const CACHE_NAME = "bitbloq-service-worker";
const urlsToCache = ["/index", "/plans"];

const ctx: ServiceWorkerGlobalScope = self as any;

ctx.addEventListener("install", event => {
  ctx.skipWaiting();
  const preLoaded = caches
    .open(CACHE_NAME)
    .then(cache => cache.addAll(urlsToCache));
  event.waitUntil(preLoaded);
});

self.addEventListener("fetch", event => {
  const response = caches
    .match(event.request)
    .then(match => match || fetch(event.request));
  event.respondWith(response);
});

ctx.addEventListener("message", async message => {
  const { documentId, image, token, type, userID } = message.data;

  let operation: IOperation = {
    context: {
      headers: {
        authorization: `Bearer ${token}`
      },
      user: {
        userID
      }
    }
  };

  if (type === "upload-image") {
    operation = {
      ...operation,
      query: SET_DOCUMENT_IMAGE_MUTATION,
      variables: {
        id: documentId,
        image,
        isSnapshot: true
      }
    };
  }

  makePromise(execute(link, operation as GraphQLRequest));
});
