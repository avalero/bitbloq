import { useEffect } from "react";
import cookie from "cookie";
import { NextApiRequest } from "next";

interface ISession {
  token: string;
  time: number;
}

const getSession = (
  tempSession?: string,
  req?: NextApiRequest
): ISession | null => {
  const cookies = cookie.parse(
    req ? req.headers.cookie || "" : document.cookie
  );

  const sessionString = tempSession
    ? typeof sessionStorage !== "undefined"
      ? sessionStorage.getItem(`session-${tempSession}`)
      : ""
    : cookies.session;

  if (!sessionString) {
    return null;
  }

  return JSON.parse(sessionString);
};

const setSession = (session?: ISession, tempSession?: string) => {
  const sessionString = JSON.stringify(session);
  if (typeof window === "undefined") {
    return;
  }

  if (tempSession) {
    sessionStorage.setItem(`session-${tempSession}`, sessionString);
  } else {
    document.cookie = cookie.serialize("session", sessionString, {
      sameSite: true,
      path: "/"
    });
  }
};

export const getToken = (tempSession?: string, req?: NextApiRequest) => {
  const session = getSession(tempSession, req);
  return session ? session.token : null;
};

export const setToken = (token: string, tempSession?: string) => {
  setSession({ token, time: token ? Date.now() : 0 }, tempSession);
  triggerEvent({ tempSession, event: "new-token", data: token });
};

export const logout = () => {
  setToken("");
  triggerEvent({ event: "logout" });
};

export interface ISessionEvent {
  event: string;
  tempSession?: string;
  error?: any;
  remainingSeconds?: number;
  data?: any;
  allSessions?: boolean;
}

export type SessionCallback = (event: ISessionEvent) => any;

const channel =
  typeof BroadcastChannel !== "undefined"
    ? new BroadcastChannel("bitbloq-session")
    : null;

const triggerEvent = (event: ISessionEvent) => {
  if (channel) {
    channel.postMessage(event);
  }
};

export const onSessionError = (error: any, tempSession?: string) => {
  triggerEvent({ tempSession, error, event: "error" });
};

export const useSessionEvent = (
  eventName: string,
  callback: SessionCallback,
  tempSession?: string
) => {
  useEffect(() => {
    const eventChannel = new BroadcastChannel("bitbloq-session");
    eventChannel.onmessage = e => {
      const event = e.data as ISessionEvent;
      if (
        eventName === event.event &&
        (event.allSessions ||
          event.tempSession === tempSession ||
          (!event.tempSession && !tempSession))
      ) {
        callback(event);
      }
    };

    return () => {
      eventChannel.onmessage = null;
      eventChannel.close();
    };
  }, []);
};
