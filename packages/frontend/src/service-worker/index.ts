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
