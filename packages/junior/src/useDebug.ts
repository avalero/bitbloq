import { useRef, useCallback, useState } from "react";
import {
  IBoard,
  IBloqLine,
  IBloqType,
  IComponent,
  IHardware,
  getBoardDefinition
} from "@bitbloq/bloqs";
import { knownBoards } from "@bitbloq/code";
import { bloqTypes as partialBloqTypes } from "./bloqTypes";
import { boards as partialBoards } from "./boards";
import { components as partialComponents } from "./components";

const bloqTypes = partialBloqTypes as IBloqType[];
const components = partialComponents as IComponent[];
const boards = partialBoards as IBoard[];

enum Command {
  START_COMMAND = 20,
  SET_PIN_MODE = 21,
  ANALOG_WRITE = 22,
  DIGITAL_READ = 30
}

const useDebug = () => {
  const portRef = useRef<any | null>(null);
  const [isDebugging, setIsDebugging] = useState(false);
  const [activeBloqs, setActiveBloqs] = useState<number[]>([]);

  const startDebugging = useCallback(
    async (program: IBloqLine[], hardware: IHardware) => {
      const board = getBoardDefinition(boards, hardware);
      if (!knownBoards[hardware.board] || !board) return;

      const componentsMap = [...components, ...board.integrated].reduce(
        (map, c) => {
          map[c.name] = c;
          return map;
        },
        {}
      );

      const port = await navigator.serial.requestPort({
        filters: [
          {
            usbVendorId: knownBoards[hardware.board].vendorId
          }
        ]
      });
      portRef.current = port;
      await portRef.current.open({ baudrate: 115200 });

      setIsDebugging(true);

      const reader = port.readable.getReader();
      const writer = port.writable.getWriter();

      const debugBloq = async (
        line: IBloqLine,
        i: number,
        bloqIndex: number
      ) => {
        activeBloqs[i] = bloqIndex;
        const bloq = line.bloqs[bloqIndex];
        //writer.write(new Uint8Array([Command.DIGITAL_READ, 6]));
        setActiveBloqs([...activeBloqs]);
      };

      const startDebugging = () => {
        //writer.write(new Uint8Array([Command.SET_PIN_MODE, 6, 0]));
        //writer.write(new Uint8Array([Command.SET_PIN_MODE, 2, 1]));
        //writer.write(new Uint8Array([Command.SET_PIN_MODE, 7, 1]));
        //writer.write(new Uint8Array([Command.SET_PIN_MODE, 8, 1]));
        writer.write(new Uint8Array([Command.ANALOG_WRITE]));
        writer.write(new Uint8Array([2]));
        writer.write(new Uint8Array([0]));
        program.forEach((line, i) => debugBloq(line, i, 0));
      };

      const read = async () => {
        const result = await reader.read();
        const command = result.value[0];
        console.log("RECEIVED", result.value);

        if (command === Command.START_COMMAND) {
          startDebugging();
        }
        if (!result.done) {
          read();
        } else {
          await reader.releaseLock();
        }
      };
      read();
    },
    []
  );

  const stopDebugging = useCallback(async () => {
    if (portRef.current) {
      await portRef.current.close();
      portRef.current = null;
    }
    setIsDebugging(false);
    setActiveBloqs([]);
  }, []);

  return {
    activeBloqs,
    isDebugging,
    startDebugging,
    stopDebugging
  };
};

export default useDebug;
