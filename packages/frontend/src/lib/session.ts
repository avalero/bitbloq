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
    if (session.token) {
      triggerEvent({ event: "expired", tempSession });
      setSession({ token: "", time: 0 });
    }
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
    ? Date.now() - session.time > RENEW_TOKEN_SECONDS * 1000 &&
        Date.now() - session.time < TOKEN_DURATION_MINUTES * 60000
    : false;
};

interface SessionEvent {
  event: string;
  tempSession?: string;
  error?: any;
  remainingSeconds?: number;
}

export type SessionCallback = (event: SessionEvent) => any;

const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("bitbloq-session")
    : null;
const triggerEvent = (event: SessionEvent) => {
  channel && channel.postMessage(event);
};

export const onSessionError = (error: any, tempSession?: string) => {
  triggerEvent({ event: "error", tempSession, error });
};

export const watchSession = (tempSession?: string) => {
  setInterval(() => {
    const session = getSession(tempSession);
    if (session && session.token) {
      const elapsedSeconds = Math.floor((Date.now() - session.time) / 1000);
      const remainingSeconds = TOKEN_DURATION_MINUTES * 60 - elapsedSeconds;
      if (remainingSeconds < TOKEN_WARNING_SECONDS) {
        triggerEvent({ event: "expiration-warning", remainingSeconds });
      }
    }
  }, CHECK_TOKEN_MS);
};

export const useSessionEvent = (
  eventName: string,
  callback: SessionCallback,
  tempSession?: string
) => {
  useEffect(() => {
    const channel = new BroadcastChannel("bitbloq-session");
    channel.onmessage = e => {
      const event = e.data as SessionEvent;
      if (eventName === event.event) {
        callback(event);
      }
    };

    return () => {
      channel.close();
    };
  }, []);
};
