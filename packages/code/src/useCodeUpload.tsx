import React, { useState, useEffect, useRef } from "react";
import Borndate from "@bitbloq/borndate";
import { DialogModal, useTranslate } from "@bitbloq/ui";
import Avrgirl from "avrgirl-arduino";
import UploadSpinner from "./UploadSpinner";
import { knownBoards } from "./config";
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

const CHROME_APP_TIMEOUT = 1000;

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
  private chromeAppID: string;
  private lastSendPromise: Promise<unknown> = Promise.resolve();

  constructor(filesRoot: string, chromeAppID: string) {
    this.borndate = new Borndate({ filesRoot });
    this.chromeAppID = chromeAppID;
  }

  public openChromeAppPort() {
    return new Promise((resolve, reject) => {
      try {
        const port = chrome.runtime.connect(this.chromeAppID);
        const pingListener = msg => {
          if (msg === "ping") {
            port.onMessage.removeListener(pingListener);
            resolve(port);
          }
        };
        port.onMessage.addListener(pingListener);
        port.postMessage({ type: "ping" });
        setTimeout(() => {
          port.onMessage.removeListener(pingListener);
          reject();
        }, CHROME_APP_TIMEOUT);
      } catch (e) {
        reject();
      }
    });
  }

  public openBrowserPort(board: string) {
    return new Promise((resolve, reject) => {
      const avrgirl = new Avrgirl({
        board
      });
      const connection = avrgirl.connection;
      let serialPortError = null;
      connection._init(() => null);
      connection._init = cb => cb(null);
      const boardConfig = knownBoards[board];
      if (boardConfig) {
        connection.serialPort.requestOptions = {
          filters: [
            {
              usbVendorId: boardConfig.vendorId,
              usbProductId: boardConfig.productId
            }
          ]
        };
      }
      connection.serialPort.open(error => {
        if (error) {
          serialPortError = error;
          reject(error);
        } else {
          resolve(avrgirl);
        }
      });
      connection.serialPort.open = cb => cb(serialPortError);
    });
  }

  public compile(code: any[], libraries: any[] = [], board: string) {
    return new Promise((resolve, reject) => {
      const boardConfig = knownBoards[board];
      this.borndate
        .compile(boardConfig.borndateId, code, libraries)
        .then(resolve)
        .catch(e => reject(new UploadError("compile-error", e.errors)));
    });
  }

  public upload(code: any[], libraries: any[] = [], board: string) {
    return new Promise((resolve, reject) => {
      this.openChromeAppPort()
        .then((port: any) => {
          const boardConfig = knownBoards[board];
          this.borndate
            .compile(boardConfig.borndateId, code, libraries)
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
                board,
                file: hex
              });
            })
            .catch(e => reject(new UploadError("compile-error", e.errors)));
        })
        .catch(() => reject(new UploadError("chrome-app-missing")));
    });
  }

  public browserUpload(code: any[], libraries: any[] = [], board: string) {
    return new Promise((resolve, reject) => {
      const boardConfig = knownBoards[board];
      this.openBrowserPort(board)
        .then(avrgirl =>
          this.borndate
            .compile(boardConfig.borndateId, code, libraries)
            .then(hex => [avrgirl, hex])
            .catch(e => reject(new UploadError("compile-error", e.errors)))
        )
        .catch(e => {
          console.log("BROWSER PORT", e);
          reject(new UploadError("board-not-found"));
        })
        .then(([avrgirl, hex]) => {
          const enc = new TextEncoder();
          avrgirl.protocol.chip.verifyPage = (_a, _b, _c, _d, cb) => cb();
          (avrgirl as Avrgirl).flash(enc.encode(hex as string), error => {
            if (error) {
              reject(error);
              return;
            } else {
              resolve();
            }
          });
        });
    });
  }

  public destroy() {
    return undefined;
  }
}

export interface ICodeUploadOptions {
  filesRoot: string;
  chromeAppID: string;
  onChromeAppMissing?: () => void;
  onBoardNotFound?: () => void;
  onUploadError?: (error: any) => void;
  onUploadSuccess?: () => void;
  useBrowserUpload?: boolean;
}

export const useCodeUpload = (
  options
): [
  (code: any[], libraries: any[], board: string) => void,

  (code: any[], libraries: any[], board: string) => void,
  JSX.Element
] => {
  const {
    filesRoot,
    chromeAppID,
    onChromeAppMissing,
    onBoardNotFound,
    onUploadError,
    onUploadSuccess,
    useBrowserUpload
  } = options;
  const t = useTranslate();
  const [showChromeAppModal, setShowChromeAppModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [noBoard, setNoBoard] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const uploaderRef = useRef<Uploader | null>(null);

  useEffect(() => {
    uploaderRef.current = new Uploader(filesRoot, chromeAppID);

    return () => {
      if (uploaderRef.current) {
        uploaderRef.current.destroy();
      }
    };
  }, []);

  const upload = async (code: any[], libraries: any[], board: string) => {
    if (!uploaderRef.current) {
      return;
    }

    if (!useBrowserUpload) {
      try {
        await uploaderRef.current.openChromeAppPort();
      } catch (e) {
        setShowChromeAppModal(true);
        if (onChromeAppMissing) {
          onChromeAppMissing();
        }
        return;
      }
    }

    setUploading(true);
    setNoBoard(false);
    setUploadSuccess(false);
    setUploadText(t("code.uploading-to-board"));

    try {
      const hex = useBrowserUpload
        ? await uploaderRef.current.browserUpload(code, libraries, board)
        : await uploaderRef.current.upload(code, libraries, board);
      setUploading(false);
      setUploadSuccess(true);
      setUploadText(t("code.uploading-success"));
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (e) {
      setUploading(false);
      setUploadSuccess(false);

      if (e.type === "board-not-found") {
        setNoBoard(true);
        setUploadText(t("code.board-not-found"));
        if (onBoardNotFound) {
          onBoardNotFound();
        }
      } else if (e.type === "compile-error") {
        setUploadText(t("code.uploading-error"));
        if (onUploadError) {
          onUploadError();
        }
      }

      throw e;
    }
  };

  const compile = async (code: any[], libraries: any[], board: string) => {
    setUploading(true);
    setNoBoard(false);
    setUploadSuccess(false);
    setUploadText(t("code.compiling"));

    try {
      const hex = await uploaderRef.current!.compile(code, libraries, board);
      setUploading(false);
      setUploadSuccess(true);
      setUploadText(t("code.compile-success"));
    } catch (e) {
      setUploading(false);
      setUploadSuccess(false);

      if (e.type === "compile-error") {
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
        closeOnNoBoard={useBrowserUpload}
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

  return [upload, compile, content];
};

export default useCodeUpload;
