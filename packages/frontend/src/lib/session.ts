import { useEffect } from "react";
import { flags } from "../config";

interface Session {
  token: string;
  time: number;
}

const {
  RENEW_TOKEN_SECONDS,
  TOKEN_DURATION_MINUTES,
  TOKEN_WARNING_SECONDS
}: any = flags;
const CHECK_TOKEN_MS = 500;

const getSession = (tempSession?: string): Session | null => {
  const sessionString = tempSession
    ? window.sessionStorage.getItem(`session-${tempSession}`)
    : window.localStorage.getItem("session");

  if (!sessionString) {
    return null;
  }

  const session = JSON.parse(sessionString);

  if (Date.now() - session.time > TOKEN_DURATION_MINUTES * 60000) {
    triggerEvent({ event: "expired", tempSession })
    setSession({ token: "", time: 0 });
    return null;
  } else {
    return session;
  }
};

const setSession = (session?: Session, tempSession?: string) => {
  const sessionString = JSON.stringify(session);
  if (tempSession) {
    window.sessionStorage.setItem(`session-${tempSession}`, sessionString);
  } else {
    window.localStorage.setItem("session", sessionString);
  }
};

export const getToken = (tempSession?: string): string | null => {
  const session = getSession(tempSession);
  return session ? session.token : null;
};

export const setToken = (token: string, tempSession?: string) => {
  setSession({ token, time: token ? Date.now() : 0 }, tempSession);
  triggerEvent({ event: "new-token", tempSession });
};

export const shouldRenewToken = (tempSession?: string): boolean => {
  const session = getSession(tempSession);
  return session
    ? Date.now() - session.time > RENEW_TOKEN_SECONDS * 1000
    : false;
};

interface SessionEvent {
  event: string;
  tempSession?: string;
  error?: any;
  remainingSeconds?: number;
}

export type SessionCallback = (event: SessionEvent) => any;

interface SessionListener {
  callback: SessionCallback;
  tempSession?: string;
}

let listeners: SessionListener[] = [];

const triggerEvent = (event: SessionEvent) => {
  listeners.forEach(listener => {
    if (listener.tempSession === event.tempSession) {
      listener.callback(event);
    }
  });
};

export const onSessionError = (error: any, tempSession?: string) => {
  triggerEvent({ event: "error", tempSession, error });
};

export const addSessionListener = (
  callback: SessionCallback,
  tempSession?: string
) => {
  listeners.push({ callback, tempSession });
};

export const removeSessionListener = (callback: SessionCallback) => {
  listeners = listeners.filter(listener => listener.callback !== callback);
};

setInterval(() => {
  listeners.forEach(listener => {
    const session = getSession(listener.tempSession);
    if (session && session.token) {
      const elapsedSeconds = Math.floor((Date.now() - session.time) / 1000);
      const remainingSeconds = TOKEN_DURATION_MINUTES * 60 - elapsedSeconds;
      if (remainingSeconds < TOKEN_WARNING_SECONDS) {
        listener.callback({ event: "expiration-warning", remainingSeconds });
      }
    }
  });
}, CHECK_TOKEN_MS);

export const useSessionEvent = (
  eventName: string,
  callback: SessionCallback,
  tempSession?: string
) => {
  useEffect(() => {
    const handler: SessionCallback = event => {
      if (event.event === eventName) {
        callback(event);
      }
    };

    addSessionListener(handler, tempSession);

    return () => {
      removeSessionListener(handler);
    };
  }, []);
};
