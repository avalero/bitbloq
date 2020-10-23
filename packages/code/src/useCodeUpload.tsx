import { useEffect, useRef } from "react";
import Borndate from "@bitbloq/borndate";
import Avrgirl from "avrgirl-arduino";
import { knownBoards } from "./config";

export enum UploadErrorType {
  CHROME_APP_MISSING = "chrome-app-missing",
  COMPILE_ERROR = "compile-error",
  BOARD_NOT_FOUND = "board-not-found",
  CANCELED = "canceled"
}

const errorMessages = {
  [UploadErrorType.CHROME_APP_MISSING]: "Can't connect with chrome app",
  [UploadErrorType.COMPILE_ERROR]: "Error compiling source code",
  [UploadErrorType.BOARD_NOT_FOUND]: "Can't connect with board"
};

export class UploadError extends Error {
  public type: string;
  public data?: any;

  constructor(type: string, data?: any) {
    super(errorMessages[type]);
    this.name = this.constructor.name;
    this.type = type;
    this.data = data;
  }
}

interface Navigator {
  serial: any;
}

class Uploader {
  private borndate: Borndate;
  private lastSendPromise: Promise<unknown> = Promise.resolve();

  constructor(filesRoot: string) {
    this.borndate = new Borndate({ filesRoot });
  }

  public async openPort(board: string) {
    const ports = await ((navigator as unknown) as Navigator).serial.getPorts();
    const port = ports.find(
      p =>
        p.getInfo().usbVendorId === knownBoards[board].vendorId &&
        p.getInfo().usbProductId === knownBoards[board].productId
    );
    if (port) {
      return port;
    }

    return ((navigator as unknown) as Navigator).serial.requestPort({
      filters: [
        {
          usbVendorId: knownBoards[board].vendorId,
          usbProductId: knownBoards[board].productId
        }
      ]
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

  public async uploadHex(hex: string, board: string, openPort: any) {
    const port = openPort || (await this.openPort(board));
    const avrgirl = new Avrgirl({ board });
    const enc = new TextEncoder();

    const connection = avrgirl.connection;
    connection._init(() => null);
    connection._init = cb => cb(null);

    connection.serialPort.open = async function(callback) {
      try {
        this.port = port;
        await this.port.open({ baudrate: 115200, baudRate: 115200 });
        this.writer = this.port.writable.getWriter();
        this.reader = this.port.readable.getReader();
        this.emit("open");
        this.isOpen = true;
        callback(null);
        while (this.port.readable.locked) {
          try {
            const { value, done } = await this.reader.read();
            if (done) {
              break;
            }
            this.emit("data", Buffer.from(value));
          } catch (e) {
            console.error(e);
          }
        }
      } catch (e) {
        callback(e);
      }
    };

    avrgirl.protocol.chip.verifyPage = (_a, _b, _c, _d, cb) => cb();
    avrgirl.protocol.chip.verify = (_a, _b, _c, _d, cb) => cb();

    await new Promise((resolve, reject) => {
      (avrgirl as Avrgirl).flash(enc.encode(hex), error =>
        error ? reject(error) : resolve()
      );
    });

    return new Promise(resolve => setTimeout(resolve, 1000));
  }

  public upload(
    code: any[],
    libraries: any[] = [],
    board: string,
    onPortOpen?: () => void
  ) {
    let isCanceled = false;

    const cancel = () => {
      isCanceled = true;
    };

    const doUpload = async () => {
      const boardConfig = knownBoards[board];
      const port = await this.openPort(board)
        .then(port => {
          if (onPortOpen) {
            onPortOpen();
          }
          return port;
        })
        .catch(e => {
          throw new UploadError("board-not-found");
        });
      const hex = await this.borndate
        .compile(boardConfig.borndateId, code, libraries)
        .catch(e => {
          throw new UploadError("compile-error", e.errors);
        });
      if (isCanceled) {
        throw new UploadError("canceled");
      }
      return this.uploadHex(hex, board, port);
    };

    return [doUpload(), cancel];
  }

  public destroy() {
    return undefined;
  }
}

export interface ICodeUploadOptions {
  filesRoot: string;
  onBoardNotFound?: () => void;
  onUploadError?: (error: any) => void;
  onUploadSuccess?: () => void;
}

export interface ICodeUploadResult {
  upload: (
    code: any[],
    libraries: any[],
    board: string,
    onPortOpen?: () => void
  ) => void;
  compile: (code: any[], libraries: any[], board: string) => void;
  cancel: () => void;
}

export const useCodeUpload = (
  options: ICodeUploadOptions
): ICodeUploadResult => {
  const {
    filesRoot,
    onBoardNotFound,
    onUploadError,
    onUploadSuccess
  } = options;
  const cancelRef = useRef<any | null>(null);
  const uploaderRef = useRef<Uploader | null>(null);

  useEffect(() => {
    uploaderRef.current = new Uploader(filesRoot);

    return () => {
      if (uploaderRef.current) {
        uploaderRef.current.destroy();
      }
    };
  }, []);

  const upload = async (
    code: any[],
    libraries: any[],
    board: string,
    onPortOpen?: () => void
  ) => {
    if (!uploaderRef.current) {
      return;
    }

    try {
      const [uploadPromise, uploadCancel] = uploaderRef.current.upload(
        code,
        libraries,
        board,
        onPortOpen
      );
      cancelRef.current = uploadCancel;
      await uploadPromise;
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (e) {
      if (e.type === "board-not-found") {
        if (onBoardNotFound) {
          onBoardNotFound();
        }
      }

      if (e.type !== "board-not-found" && onUploadError) {
        onUploadError(e);
      }

      throw e;
    } finally {
      cancelRef.current = null;
    }
  };

  const cancel = () => {
    if (cancelRef.current) {
      cancelRef.current();
    }
  };

  const compile = async (code: any[], libraries: any[], board: string) => {
    if (!uploaderRef.current) return;
    try {
      const hex = await uploaderRef.current.compile(code, libraries, board);
      return hex;
    } catch (e) {
      console.log("compile error", e);
      throw e;
    }
  };

  return { upload, compile, cancel };
};

export default useCodeUpload;
