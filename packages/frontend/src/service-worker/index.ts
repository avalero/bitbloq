import { execute, GraphQLRequest, makePromise } from "apollo-link";
import { createUploadLink } from "apollo-upload-client";
import fetch from "isomorphic-fetch";
import {
  SET_DOCUMENT_IMAGE_MUTATION,
  UPDATE_SUBMISSION_MUTATION
} from "../apollo/queries";

const uri =
  typeof window !== "undefined"
    ? process.env.API_URL
    : process.env.API_URL_SERVER || process.env.API_URL;
const link = createUploadLink({ fetch, uri });

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

ctx.addEventListener("message", async message => {
  const {
    exerciseID,
    documentId,
    image,
    submissionID,
    token,
    type,
    userID
  } = message.data;

  let operation: GraphQLRequest | undefined;

  if (type === "upload-image") {
    operation = {
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
        id: documentId,
        image,
        isSnapshot: true
      }
    };
  } else if (type === "leave-exercise") {
    operation = {
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
    };
  }

  if (operation) {
    makePromise(execute(link, operation));
  }
});
