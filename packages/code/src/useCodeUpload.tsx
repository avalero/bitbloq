import React, { useState, useEffect, useRef } from "react";
import Borndate from "@bitbloq/borndate";
import { DialogModal, useTranslate } from "@bitbloq/ui";
import UploadSpinner from "./UploadSpinner";
declare var chrome: any;

export enum UploadErrorType {
  CHROME_APP_MISSING = "chrome-app-missing",
  COMPILE_ERROR = "compile-error",
  BOARD_NOT_FOUND = "board-not-found"
}

const errorMessages = {
  [UploadErrorType.CHROME_APP_MISSING]: "Can't connect with chrome app",
  [UploadErrorType.COMPILE_ERROR]: "Error compiling source code",
  [UploadErrorType.BOARD_NOT_FOUND]: "Can't connect with board"
};

class UploadError extends Error {
  public type: string;
  public data?: any;

  constructor(type: string, data?: any) {
    super(errorMessages[type]);
    this.name = this.constructor.name;
    this.type = type;
    this.data = data;
  }
}

class Uploader {
  private borndate: Borndate;
  private board: string;
  private chromeAppID: string;
  private lastSendPromise: Promise<unknown> = Promise.resolve();

  constructor(board: string, filesRoot: string, chromeAppID: string) {
    this.borndate = new Borndate({ board, filesRoot });
    this.chromeAppID = chromeAppID;
    this.board = board;
  }

  public openChromeAppPort() {
    try {
      const port = chrome.runtime.connect(this.chromeAppID);
      return port;
    } catch (e) {
      return false;
    }
  }

  public upload(code: any[], libraries: any[] = []) {
    return new Promise((resolve, reject) => {
      const port = this.openChromeAppPort();

      if (!port) {
        reject(new UploadError("chrome-app-missing"));
        return;
      }

      this.borndate
        .compile(code, libraries)
        .then(hex => {
          port.onMessage.addListener(msg => {
            if (msg.type === "upload") {
              if (msg.success) {
                resolve();
              } else {
                reject(new UploadError("board-not-found"));
              }
            }
          });
          port.postMessage({
            type: "upload",
            board: this.board,
            file: hex
          });
        })
        .catch(e => reject(new UploadError("compile-error", e.errors)));
    });
  }

  public destroy() {
    console.log("DESTROY BORNDATE");
  }
}

export const useCodeUpload = (
  board: string,
  filesRoot: string,
  chromeAppID: string
): [(code: any[], libraries: any[]) => void, JSX.Element] => {
  const t = useTranslate();
  const [showChromeAppModal, setShowChromeAppModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [noBoard, setNoBoard] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const uploaderRef = useRef<Uploader | null>(null);

  useEffect(() => {
    uploaderRef.current = new Uploader(board, filesRoot, chromeAppID);

    return () => {
      if (uploaderRef.current) {
        uploaderRef.current.destroy();
      }
    };
  }, []);

  const upload = async (code: any[], libraries: any[]) => {
    if (!uploaderRef.current) {
      return;
    }

    if (!uploaderRef.current.openChromeAppPort()) {
      setShowChromeAppModal(true);
      return;
    }

    setUploading(true);
    setNoBoard(false);
    setUploadSuccess(false);
    setUploadText(t("code.uploading-to-board"));

    try {
      const hex = await uploaderRef.current.upload(code, libraries);
      setUploading(false);
      setUploadSuccess(true);
      setUploadText(t("code.uploading-success"));
    } catch (e) {
      setUploading(false);
      setUploadSuccess(false);

      if (e.type === "board-not-found") {
        setNoBoard(true);
        setUploadText(t("code.board-not-found"));
      } else if (e.type === "compile-error") {
        setUploadText(t("code.uploading-error"));
      }

      throw e;
    }
  };

  const content = (
    <>
      <UploadSpinner
        uploading={uploading}
        success={uploadSuccess}
        noBoard={noBoard}
        text={uploadText}
      />
      <DialogModal
        isOpen={showChromeAppModal}
        onCancel={() => setShowChromeAppModal(false)}
        onOk={() => {
          window.open(
            `https://chrome.google.com/webstore/detail/bitbloq/${chromeAppID}`
          );
          setShowChromeAppModal(false);
        }}
        text={t("code.install-chrome-app-text")}
        okText={t("code.open-chrome-webstore")}
        cancelText={t("general-cancel-button")}
        title={t("code.install-chrome-app-title")}
      />
    </>
  );

  return [upload, content];
};

export default useCodeUpload;
