const url = 'wss://web2board.es:9867/bitbloq';

export class ConnectionError extends Error {};
export class CompileError extends Error {};
export class BoardNotDetectedError extends Error {};

let ws;
let commandID = 0;

function waitUntilOpened() {
  return new Promise((resolve, reject) => {
    if (!ws) {
      ws = new WebSocket(url);
    }
    if (ws.readyState === WebSocket.OPEN) {
      resolve();
    } else {
      ws.addEventListener('open', () => resolve());
      ws.addEventListener('close', e => {
        ws = null;
        reject(new ConnectionError());
      });
    }
  });
}

function waitForReply(ID) {
  return new Promise(resolve => {
    const onMessage = event => {
      const reply = JSON.parse(event.data);
      if (reply.ID === ID) {
        ws.removeEventListener('message', onMessage);
        resolve(reply);
      }
    };
    ws.addEventListener('message', onMessage);
  });
}

async function sendCommand(fn, args = []) {
  await waitUntilOpened();
  const ID = commandID++;
  const command = {
    function: fn,
    args,
    ID,
  };
  ws.send(JSON.stringify(command));
  return await waitForReply(ID);
}

const getVersion = () => sendCommand('get_version', []);

const setLibVersion = () => sendCommand('set_lib_version', ['1.6.0']);

async function* upload(code) {
  let response = await sendCommand('upload', [code, 'zumjunior']);
  while (true) {
    const {reply, success} = response;
    if (reply) {
      if (success) {
        return response;
      } else {
        if (reply.title === 'BOARDNOTDETECTED') {
          throw new BoardNotDetectedError();
        } else if (reply.file) {
          throw new CompileError(reply.error);
        }
      }
    }
    yield response;
    response = await waitForReply(response.ID);
  }
}

export default {
  getVersion,
  setLibVersion,
  upload,
};
