import { useRef, useCallback, useEffect, useState } from "react";
import {
  BloqCategory,
  ConnectorPinMode,
  IBoard,
  IBloqLine,
  IBloqType,
  IComponent,
  IComponentInstance,
  IHardware,
  IExtraData,
  getBoardDefinition
} from "@bitbloq/bloqs";
import { knownBoards } from "@bitbloq/code";
import { bloqTypes as partialBloqTypes } from "./bloqTypes";
import { boards as partialBoards } from "./boards";
import { components as partialComponents } from "./components";
import Avrgirl from "avrgirl-arduino";
import debugFirmware from "./debug-firmware";

const bloqTypes = partialBloqTypes as IBloqType[];
const components = partialComponents as IComponent[];
const boards = partialBoards as IBoard[];

enum Command {
  START_COMMAND = 20,
  SET_PIN_MODE = 21,
  ANALOG_WRITE = 22,
  DIGITAL_WRITE = 23,
  DIGITAL_READ = 30,
  SEVEN_SEGMENT_SETUP = 40,
  SEVEN_SEGMENT_DISPLAY = 41,
  PLAY_TONE = 50
}

const portMap = {
  "BQ::ZUMJunior::ports[1][0]": 6,
  "BQ::ZUMJunior::ports[1][1]": 15,
  "BQ::ZUMJunior::ports[2][0]": 5,
  "BQ::ZUMJunior::ports[2][1]": 14,
  "BQ::ZUMJunior::ports[3][0]": 3,
  "BQ::ZUMJunior::ports[3][1]": 17,
  "BQ::ZUMJunior::ports[4][0]": 9,
  "BQ::ZUMJunior::ports[4][1]": 16,
  "BQ::ZUMJunior::ports[A][0]": 18,
  "BQ::ZUMJunior::ports[A][1]": 19,
  "BQ::ZUMJunior::ports[B][0]": 22,
  "BQ::ZUMJunior::ports[B][1]": 23
};

const notes = {
  NOTE_C4: 262,
  NOTE_D4: 294,
  NOTE_E4: 330,
  NOTE_F4: 349,
  NOTE_G4: 392,
  NOTE_A4: 440,
  NOTE_B4: 494,
  NOTE_C5: 523,
  NOTE_D5: 587,
  NOTE_E5: 659,
  NOTE_F5: 698,
  NOTE_G5: 784,
  NOTE_A5: 880,
  NOTE_B5: 988
};

const READ_PIN_SPEED = 10;

const bloqTypesMap = bloqTypes.reduce((map, b) => {
  map[b.name] = b;
  return map;
}, {});

const getPort = async (usbVendorId: string) => {
  const ports = await navigator.serial.getPorts();
  const port = ports.find(p => p.getInfo().usbVendorId === usbVendorId);
  if (port) {
    return port;
  }

  return navigator.serial.requestPort({
    filters: [{ usbVendorId }]
  });
};

const uploadFirmware = async (usbVendorId: string) => {
  const avrgirl = new Avrgirl({ board: "zumjunior" });
  const enc = new TextEncoder();
  const port = await getPort(usbVendorId);

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
    (avrgirl as Avrgirl).flash(enc.encode(debugFirmware), error =>
      error ? reject(error) : resolve()
    );
  });

  return new Promise(resolve => setTimeout(resolve, 1000));
};

const useDebug = (
  program: IBloqLine[],
  extraData: IExtraData,
  debugSpeed: number
) => {
  const portRef = useRef<any | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter | null>(null);
  const intervalRef = useRef<number>(0);
  const programRef = useRef<IBloqLine[]>([]);
  const extraDataRef = useRef<IExtraData>({});
  const isDebuggingRef = useRef<boolean>(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [activeBloqs, setActiveBloqs] = useState<number[]>([]);

  useEffect(() => {
    programRef.current = program;
  }, [program]);

  useEffect(() => {
    extraDataRef.current = extraData;
  }, [extraData]);

  const startDebugging = useCallback(async (hardware: IHardware) => {
    const board = getBoardDefinition(boards, hardware);
    if (!knownBoards[hardware.board] || !board) return;

    const componentsMap = [...components, ...board.integrated].reduce(
      (map, c) => {
        map[c.name] = c;
        return map;
      },
      {}
    );

    const sevenSegmentValues = { A: 0, B: 0 };

    const getComponentPins = (instance: IComponentInstance) => {
      if (!instance.ports || !instance.ports.main) return [];
      const component = componentsMap[instance.component] as IComponent;
      const portPin = instance.ports.main;
      const port = board.ports.find(p => p.name === portPin);
      if (!port || !component) return [];
      return component.connectors[0].pins.map(pin => ({
        ...pin,
        pinValue:
          portMap[port.pins.find(p => p.name === pin.portPin)?.value || ""]
      }));
    };

    const pinsMap = hardware.components
      .filter(c => !c.integrated)
      .reduce((map, c) => {
        map[c.name] = getComponentPins(c);
        return map;
      }, {});

    const usbVendorId = knownBoards[hardware.board].vendorId;

    await uploadFirmware(usbVendorId);

    const port = await getPort(usbVendorId);
    portRef.current = port;
    await port.open({ baudrate: 115200, baudRate: 115200 });

    setIsDebugging(true);
    isDebuggingRef.current = true;

    const reader = port.readable.getReader();
    readerRef.current = reader;
    const writer = port.writable.getWriter();
    writerRef.current = writer;

    const updatingBloq = programRef.current.map(() => false);
    const nextBloq = (i: number, delay = debugSpeed) => {
      updatingBloq[i] = true;
      setTimeout(() => {
        debugBloq(i, activeBloqs[i] + 1);
        updatingBloq[i] = false;
      }, delay);
    };

    const sendMessage = (value: string) => {
      programRef.current.forEach((line, i) => {
        if (updatingBloq[i]) return;
        const bloq = line.bloqs[activeBloqs[i]];
        if (bloq.type === "WaitMessage" || bloq.type === "OnMessage") {
          if (value === bloq.parameters.value) {
            nextBloq(i);
          }
        }
      });
    };

    let countPlaying = 0;
    let stop = false;
    const playMelody = (melodyIndex: number, cb: () => void) => {
      const melody = extraDataRef.current.melodies?.[melodyIndex];
      if (!melody) return;
      countPlaying++;
      const playNote = (i: number) => {
        if (stop || i >= melody.length || !isDebuggingRef.current) {
          countPlaying--;
          cb();
          if (countPlaying === 0) {
            stop = false;
          }
          return;
        }
        const tone = melody[i];
        const toneDuration =
          ((tone.duration > 0 ? tone.duration : 0.5) * 1000 * 0.3) & 0xffff;
        const note = notes[tone.note] & 0xffff;
        const note1 = note >> 8;
        const note2 = note & 0xff;
        const duration1 = toneDuration >> 8;
        const duration2 = toneDuration & 0xff;
        writer.write(
          new Uint8Array([
            Command.PLAY_TONE,
            note1,
            note2,
            duration1,
            duration2
          ])
        );
        setTimeout(() => playNote(i + 1), toneDuration);
      };
      playNote(0);
    };

    // Ping values
    intervalRef.current = window.setInterval(() => {
      programRef.current.forEach((line, i) => {
        if (updatingBloq[i]) return;

        const bloq = line.bloqs[activeBloqs[i]];
        if (bloq) {
          switch (bloq.type) {
            case "WaitButtonPressed":
            case "OnButtonPress": {
              const pins = pinsMap[bloq.parameters.component];
              pins.forEach(pin => {
                writer.write(
                  new Uint8Array([Command.DIGITAL_READ, pin.pinValue])
                );
              });
              break;
            }

            case "WaitForSevenSegmentValue":
            case "OnSevenSegmentValue": {
              const { value, component } = bloq.parameters;
              const instance = hardware.components.find(
                c => c.name === component
              );
              const port = instance?.ports?.main || "A";
              if (value === sevenSegmentValues[port]) {
                nextBloq(i);
              }
              break;
            }

            case "WaitDoubleSwitchOnOff":
            case "OnDoubleSwitchOnOff": {
              const pins = pinsMap[bloq.parameters.component];
              pins.forEach(pin => {
                writer.write(
                  new Uint8Array([Command.DIGITAL_READ, pin.pinValue])
                );
              });
            }
          }
        }
      });
    }, READ_PIN_SPEED);

    const executeCount = programRef.current.map(() => 0);

    const debugBloq = async (i: number, bloqIndex: number) => {
      if (!isDebuggingRef.current) return;
      const line = programRef.current[i];
      activeBloqs[i] = bloqIndex % line.bloqs.length;
      const bloq = line.bloqs[activeBloqs[i]];
      if (bloq) {
        const bloqType = bloqTypesMap[bloq.type] as IBloqType;
        switch (bloq.type) {
          case "OnStart": {
            const { times, type } = bloq.parameters;
            if (type === "loop" || executeCount[i] < times) {
              executeCount[i] = executeCount[i] + 1;
              nextBloq(i);
            }
            break;
          }

          case "WaitSeconds": {
            const { value } = bloq.parameters;
            nextBloq(i, (value as number) * 1000);
            break;
          }

          case "RGBLed": {
            const { value } = bloq.parameters;
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                2,
                value === "blue" ? 0 : 255
              ])
            );
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                7,
                value === "red" ? 0 : 255
              ])
            );
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                8,
                value === "green" ? 0 : 255
              ])
            );
            break;
          }

          case "SetSevenSegmentNumericValue": {
            const { action, component, value = 0 } = bloq.parameters;

            const instance = hardware.components.find(
              c => c.name === component
            );
            const port = instance?.ports?.main || "A";

            sevenSegmentValues[port] =
              action === "writeNumber"
                ? value
                : action === "incrementNumber"
                ? sevenSegmentValues[port] + value
                : action === "decrementNumber"
                ? sevenSegmentValues[port] - (value as number)
                : 0;

            writer.write(
              new Uint8Array([
                Command.SEVEN_SEGMENT_DISPLAY,
                port === "A" ? 0 : 1,
                sevenSegmentValues[port]
              ])
            );
            break;
          }

          case "sendMessage": {
            sendMessage(bloq.parameters.value as string);
            break;
          }

          case "Music": {
            playMelody(bloq.parameters.melodyIndex as number, () =>
              nextBloq(i)
            );
            break;
          }

          case "SetDoubleLedOnOff": {
            const { component, value, led } = bloq.parameters;
            const pins = pinsMap[bloq.parameters.component];
            const pin = led === "White" ? pins[0] : pins[1];
            writer.write(
              new Uint8Array([
                Command.DIGITAL_WRITE,
                pin.pinValue,
                value === "on" ? 0 : 1
              ])
            );
            break;
          }
        }
        if (
          bloqType.category === BloqCategory.Action &&
          bloq.type !== "Music"
        ) {
          nextBloq(i);
        }
      }

      setActiveBloqs([...activeBloqs]);
    };

    const startDebugging = () => {
      writer.write(new Uint8Array([Command.SET_PIN_MODE, 2, 1]));
      writer.write(new Uint8Array([Command.SET_PIN_MODE, 4, 1]));
      writer.write(new Uint8Array([Command.SET_PIN_MODE, 7, 1]));
      writer.write(new Uint8Array([Command.SET_PIN_MODE, 8, 1]));
      writer.write(new Uint8Array([Command.ANALOG_WRITE, 2, 255]));
      writer.write(new Uint8Array([Command.ANALOG_WRITE, 7, 255]));
      writer.write(new Uint8Array([Command.ANALOG_WRITE, 8, 255]));

      hardware.components
        .filter(instance => !instance.integrated)
        .forEach(instance => {
          if (instance.component === "ZumjuniorSevenSegment") {
            writer.write(
              new Uint8Array([
                Command.SEVEN_SEGMENT_SETUP,
                instance.ports?.main === "A" ? 0 : 1
              ])
            );
          } else {
            const pins = pinsMap[instance.name];
            pins.forEach(pin => {
              writer.write(
                new Uint8Array([
                  Command.SET_PIN_MODE,
                  pin.pinValue,
                  pin.mode === ConnectorPinMode.INPUT ? 0 : 1
                ])
              );
              if (instance.component === "ZumjuniorDoubleLed") {
                writer.write(
                  new Uint8Array([Command.DIGITAL_WRITE, pin.pinValue, 1])
                );
              }
            });
          }
        });

      programRef.current.forEach((line, i) => debugBloq(i, 0));
    };

    const read = async () => {
      const result = await reader.read();
      if (result && result.value) {
        const command = result.value[0];

        if (command === Command.START_COMMAND) {
          startDebugging();
        }
        if (command === Command.DIGITAL_READ) {
          const pin = result.value[1];
          const value = result.value[2];
          programRef.current.forEach((line, i) => {
            if (updatingBloq[i]) return;

            const bloq = line.bloqs[activeBloqs[i]];
            if (bloq) {
              switch (bloq.type) {
                case "WaitButtonPressed":
                case "OnButtonPress": {
                  const pins = pinsMap[bloq.parameters.component];
                  const pressed = bloq.parameters.value === "pressed";
                  if (
                    pin === pins[0].pinValue &&
                    ((value === 1 && pressed) || (value === 0 && !pressed))
                  ) {
                    nextBloq(i);
                  }
                  break;
                }

                case "WaitDoubleSwitchOnOff":
                case "OnDoubleSwitchOnOff": {
                  const pins = pinsMap[bloq.parameters.component];
                  const switchPin =
                    bloq.parameters.switch === "0" ? pins[0] : pins[1];
                  const pos = bloq.parameters.value === "pos1" ? 0 : 1;
                  if (pin === switchPin.pinValue && value === pos) {
                    nextBloq(i);
                  }
                  break;
                }
              }
            }
          });
        }
      }
      if (!result.done && isDebuggingRef.current) {
        read();
      } else {
        await reader.releaseLock();
      }
    };
    read();
  }, []);

  const stopDebugging = useCallback(async () => {
    setIsDebugging(false);
    isDebuggingRef.current = false;
    setActiveBloqs([]);
    clearInterval(intervalRef.current);

    try {
      if (readerRef.current) {
        await readerRef.current.cancel();
        await readerRef.current.releaseLock();
      }
    } catch (e) {}

    try {
      if (writerRef.current) {
        await writerRef.current.releaseLock();
      }
    } catch (e) {}

    try {
      if (portRef.current) {
        await portRef.current.close();
        portRef.current = null;
      }
    } catch (e) {
      console.log(e);
    }
  }, []);

  return {
    activeBloqs,
    isDebugging,
    startDebugging,
    stopDebugging
  };
};

export default useDebug;
