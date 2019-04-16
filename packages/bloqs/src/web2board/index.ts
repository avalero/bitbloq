interface IWeb2BoardReply {
  title: string;
  error: string;
  file: string;
}

interface IWeb2BoardResponse {
  ID: number;
  function: string;
  reply: IWeb2BoardReply;
  success: boolean;
}

export default class Web2Board {
  private ws: WebSocket | null;
  private commandId = 0;
  private url: string;

  constructor(url: string) {
    this.url = url;
    this.ws = new WebSocket(url);
  }

  public isConnected(): boolean {
    if (this.ws) {
      return this.ws.readyState === WebSocket.OPEN;
    }

    return false;
  }

  public startWeb2board() {
    const tempA = document.createElement("a");
    tempA.setAttribute("href", "qssweb2board://");
    document.body.appendChild(tempA);
    tempA.click();
    document.body.removeChild(tempA);
  }

  public connect() {
    return new Promise((resolve, reject) => {
      if (!this.ws) {
        this.ws = new WebSocket(this.url);
      }

      if (this.ws.readyState === WebSocket.OPEN) {
        resolve();
      } else if (this.ws.readyState === WebSocket.CLOSED) {
        this.ws = null;
        const error = new Error();
        error.name = "ConnectionError";
        reject(error);
      } else {
        this.ws.addEventListener("open", () => resolve());
        this.ws.addEventListener("close", e => {
          this.ws = null;
          const error = new Error();
          error.name = "ConnectionError";
          reject(error);
        });
      }
    });
  }

  public async waitUntilOpened() {
    let tries = 0;
    while (tries < 10) {
      console.info(`Connecting to Web2Board: ${tries} out of 10`);
      try {
        await this.connect();
        return;
      } catch (e) {
        if (tries === 0) {
          this.startWeb2board();
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        tries += 1;
      }
    }
    this.ws = null;
    throw new Error();
  }

  public waitForReply(id: number): Promise<IWeb2BoardResponse> {
    return new Promise(resolve => {
      const onMessage = (event: MessageEvent) => {
        const reply = JSON.parse(event.data);
        if (reply.ID === id) {
          if (this.ws) {
            this.ws.removeEventListener("message", onMessage);
          }
          resolve(reply);
        }
      };
      if (this.ws) {
        this.ws.addEventListener("message", onMessage);
      }
    });
  }

  public async sendCommand(
    fn: string,
    args: string[] = []
  ): Promise<IWeb2BoardResponse> {
    await this.waitUntilOpened();
    this.commandId += 1;
    const id = this.commandId;
    const command = {
      args,
      ID: id,
      function: fn
    };
    if (this.ws) {
      this.ws.send(JSON.stringify(command));
    }
    return this.waitForReply(id);
  }

  public getVersion = () => this.sendCommand("get_version", []);

  public setLibVersion = () => this.sendCommand("set_lib_version", ["1.6.0"]);

  public compile(code: string, board: string) {
    return this.callGenerator("compile", [code, board]);
  }

  public upload(code: string, board: string) {
    return this.callGenerator("upload", [code, board]);
  }

  private async *callGenerator(fn: string, args: string[] = []) {
    let response = await this.sendCommand(fn, args);
    while (true) {
      const { reply, success } = response;
      if (reply) {
        if (success) {
          return response;
        }

        if (reply.title === "BOARDNOTDETECTED") {
          const error = new Error();
          error.name = "BoardNotDetected";
          throw error;
        } else if (reply.title === "BOARDNOTKNOWN") {
          const error = new Error();
          error.name = "BoardNotKnown";
          throw error;
        } else if (reply.file) {
          const error = new Error(reply.error);
          error.name = "CompileError";
          throw error;
        }
      }
      yield response;
      response = await this.waitForReply(response.ID);
    }
  }
}
