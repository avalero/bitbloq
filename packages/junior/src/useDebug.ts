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
import { UploadError } from "@bitbloq/code/src/useCodeUpload";
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
  PLAY_TONE = 50,
  SERVO_SETUP = 60,
  SERVO_WRITE = 61,
  MULTISENSOR_SETUP = 70,
  MULTISENSOR_GET_DISTANCE = 71,
  MULTISENSOR_GET_COLOR = 72,
  MULTISENSOR_GET_AL = 73,
  MULTISENSOR_GET_TEMP = 74
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

const portNumberMap = {
  "1": 1,
  "2": 2,
  "3": 3,
  "4": 4,
  A: 5,
  B: 6
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

const colors = {
  red: 0,
  green: 1,
  blue: 2,
  white: 3,
  black: 4
};

const multiSensorCommands = {
  WaitObstacle: Command.MULTISENSOR_GET_DISTANCE,
  OnObstacle: Command.MULTISENSOR_GET_DISTANCE,
  WaitDetectColor: Command.MULTISENSOR_GET_COLOR,
  OnDetectColor: Command.MULTISENSOR_GET_COLOR,
  WaitDetectLight: Command.MULTISENSOR_GET_AL,
  OnDetectLight: Command.MULTISENSOR_GET_AL,
  WaitDetectTemperature: Command.MULTISENSOR_GET_TEMP,
  OnDetectTemperature: Command.MULTISENSOR_GET_TEMP
};

const READ_PIN_SPEED = 30;

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

interface IUseDebugResult {
  activeBloqs: Record<string, number>;
  isDebugging: boolean;
  startDebugging: (hardware: IHardware) => void;
  stopDebugging: () => void;
  uploadFirmware: (hardware: IHardware) => void;
}

const useDebug = (
  program: IBloqLine[],
  extraData: IExtraData,
  debugSpeed: number
): IUseDebugResult => {
  const portRef = useRef<any | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader | null>(null);
  const writerRef = useRef<WritableStreamDefaultWriter | null>(null);
  const intervalRef = useRef<number>(0);
  const programRef = useRef<IBloqLine[]>([]);
  const extraDataRef = useRef<IExtraData>({});
  const isDebuggingRef = useRef<boolean>(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [activeBloqs, setActiveBloqs] = useState<Record<string, number>>({});

  useEffect(() => {
    programRef.current = program;
  }, [program]);

  useEffect(() => {
    extraDataRef.current = extraData;
  }, [extraData]);

  const uploadFirmware = useCallback(async (hardware: IHardware) => {
    const usbVendorId = knownBoards[hardware.board].vendorId;
    const avrgirl = new Avrgirl({ board: "zumjunior" });
    const enc = new TextEncoder();
    let port;
    try {
      port = await getPort(usbVendorId);
    } catch (e) {
      throw new UploadError("board-not-found");
    }

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
  }, []);

  const startDebugging = useCallback(async (hardware: IHardware) => {
    const activeBloqs = {};

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

    const port = await getPort(usbVendorId);
    portRef.current = port;
    await port.open({ baudrate: 115200, baudRate: 115200 });

    navigator.serial.addEventListener("disconnect", e => {
      if (e.port === port) {
        stopDebugging();
      }
    });

    setIsDebugging(true);
    isDebuggingRef.current = true;

    const reader = port.readable.getReader();
    readerRef.current = reader;
    const writer = port.writable.getWriter();
    writerRef.current = writer;

    const updatingBloq = {};

    const nextBloq = (id: string, delay = debugSpeed) => {
      updatingBloq[id] = true;
      setTimeout(() => {
        debugBloq(id, activeBloqs[id] + 1);
        updatingBloq[id] = false;
      }, delay);
    };

    const sendMessage = (value: string) => {
      programRef.current.forEach(line => {
        if (updatingBloq[line.id]) return;
        const bloq = line.bloqs[activeBloqs[line.id]];
        if (bloq.type === "WaitMessage" || bloq.type === "OnMessage") {
          if (value === bloq.parameters.value) {
            nextBloq(line.id);
          }
        }
      });
    };

    let countPlaying = 0;
    let stopMelody = false;
    const playMelody = (melodyIndex: number, cb: () => void) => {
      const melody = extraDataRef.current.melodies?.[melodyIndex];
      if (!melody) return;
      countPlaying++;
      const playNote = (i: number) => {
        if (stopMelody || i >= melody.length || !isDebuggingRef.current) {
          countPlaying--;
          cb();
          if (countPlaying === 0) {
            stopMelody = false;
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

    const executeCount = {};

    // Ping values
    intervalRef.current = window.setInterval(() => {
      programRef.current.forEach(line => {
        if (activeBloqs[line.id] === undefined) {
          executeCount[line.id] = 0;
          activeBloqs[line.id] = 0;
          debugBloq(line.id, 0);
        }
        if (updatingBloq[line.id]) return;

        const bloq = line.bloqs[activeBloqs[line.id]];
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
                nextBloq(line.id);
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
              break;
            }

            case "WaitObstacle":
            case "OnObstacle":
            case "WaitDetectColor":
            case "OnDetectColor":
            case "WaitDetectLight":
            case "OnDetectLight":
            case "WaitDetectTemperature":
            case "OnDetectTemperature": {
              const { component } = bloq.parameters;
              const instance = hardware.components.find(
                c => c.name === component
              );

              writer.write(
                new Uint8Array([
                  multiSensorCommands[bloq.type],
                  instance?.ports?.main === "A" ? 0 : 1
                ])
              );
              break;
            }

            case "OnStart": {
              const { times, type } = bloq.parameters;
              if (type === "loop" || executeCount[line.id] < times) {
                executeCount[line.id] = executeCount[line.id] + 1;
                nextBloq(line.id);
              }
              break;
            }

            case "WaitSeconds": {
              const { value } = bloq.parameters;
              nextBloq(line.id, (value as number) * 1000);
              break;
            }
          }
        }
      });
    }, READ_PIN_SPEED);

    let tempThreshold = 0;

    const debugBloq = async (id: string, bloqIndex: number) => {
      if (!isDebuggingRef.current) return;
      const line = programRef.current.find(l => l.id === id);
      if (!line) return;
      activeBloqs[id] = bloqIndex % line.bloqs.length;
      const bloq = line.bloqs[activeBloqs[id]];
      if (bloq) {
        const bloqType = bloqTypesMap[bloq.type] as IBloqType;
        switch (bloq.type) {
          case "RGBLed": {
            const { value } = bloq.parameters;
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                2,
                value === "blue" || value === "white" ? 0 : 255
              ])
            );
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                7,
                value === "red" || value === "white" ? 0 : 255
              ])
            );
            writer.write(
              new Uint8Array([
                Command.ANALOG_WRITE,
                8,
                value === "green" || value === "white" ? 0 : 255
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
            if (bloq.parameters.melodyIndex === "stop") {
              stopMelody = true;
              nextBloq(id);
            } else {
              playMelody(bloq.parameters.melodyIndex as number, () =>
                nextBloq(id)
              );
            }
            break;
          }

          case "SetDoubleLedOnOff": {
            const { value, led } = bloq.parameters;
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

          case "ContRotServo": {
            const { component, rotation, speed } = bloq.parameters;
            const instance = hardware.components.find(
              c => c.name === component
            );
            const port = portNumberMap[instance?.ports?.main || ""];
            const value =
              (rotation === "clockwise" ? 1 : -1) *
              (rotation === "stop"
                ? 0
                : speed === "slow"
                ? 10
                : speed === "medium"
                ? 20
                : 30);
            writer.write(
              new Uint8Array([Command.SERVO_WRITE, port, 90 + value])
            );
            break;
          }

          case "ServoPosition": {
            const { component, value } = bloq.parameters;
            const instance = hardware.components.find(
              c => c.name === component
            );
            const port = portNumberMap[instance?.ports?.main || ""];
            writer.write(new Uint8Array([Command.SERVO_WRITE, port, value]));
            break;
          }
        }
        if (
          bloqType.category === BloqCategory.Action &&
          bloq.type !== "Music"
        ) {
          nextBloq(id);
        }
      }
      setActiveBloqs(Object.assign({}, activeBloqs));
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
          } else if (instance.component === "ZumjuniorMultiSensor") {
            writer.write(
              new Uint8Array([
                Command.MULTISENSOR_SETUP,
                instance.ports?.main === "A" ? 0 : 1
              ])
            );
            writer.write(
              new Uint8Array([
                Command.MULTISENSOR_GET_TEMP,
                instance.ports?.main === "A" ? 0 : 1
              ])
            );
          } else if (
            instance.component === "ZumjuniorServo" ||
            instance.component === "ZumjuniorMiniservo"
          ) {
            const port = portNumberMap[instance.ports?.main || ""];
            writer.write(new Uint8Array([Command.SERVO_SETUP, port]));
            if (instance.component === "ZumjuniorServo") {
              writer.write(new Uint8Array([Command.SERVO_WRITE, port, 90]));
            }
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
    };

    const read = async () => {
      const result = await reader.read();
      if (result && result.value) {
        const command = result.value[0];

        if (command === Command.START_COMMAND) {
          startDebugging();
        }
        if (command === Command.MULTISENSOR_GET_TEMP && !tempThreshold) {
          tempThreshold = result.value[2];
        }
        if (
          command === Command.MULTISENSOR_GET_DISTANCE ||
          command === Command.MULTISENSOR_GET_COLOR ||
          command === Command.MULTISENSOR_GET_AL ||
          command === Command.MULTISENSOR_GET_TEMP
        ) {
          const port = result.value[1];
          const value = result.value[2];
          programRef.current.forEach(line => {
            const bloq = line.bloqs[activeBloqs[line.id]];

            if (bloq && multiSensorCommands[bloq.type] === command) {
              const instance = hardware.components.find(
                c => c.name === bloq.parameters.component
              );
              let matches = false;
              if (bloq.type === "OnObstacle" || bloq.type === "WaitObstacle") {
                matches =
                  bloq.parameters.value === "obstacle"
                    ? value < 20
                    : value >= 20;
              } else if (
                bloq.type === "WaitDetectColor" ||
                bloq.type === "OnDetectColor"
              ) {
                const colorValue = colors[bloq.parameters.color];
                matches =
                  bloq.parameters.detect === "=="
                    ? colorValue === value
                    : colorValue !== value;
              } else if (
                bloq.type === "OnDetectTemperature" ||
                bloq.type === "WaitDetectTemperature"
              ) {
                matches =
                  bloq.parameters.value === "cold"
                    ? value < tempThreshold
                    : value > tempThreshold;
              } else if (
                bloq.type === "OnDetectLight" ||
                bloq.type === "WaitDetectLight"
              ) {
                matches =
                  bloq.parameters.value === "light"
                    ? value > 60
                    : bloq.parameters.value === "dark"
                    ? value <= 40
                    : value <= 60 && value > 40;
              }

              if (
                (port === 0
                  ? instance?.ports?.main === "A"
                  : instance?.ports?.main === "B") &&
                matches
              ) {
                nextBloq(line.id);
              }
            }
          });
        }
        if (command === Command.DIGITAL_READ) {
          const pin = result.value[1];
          const value = result.value[2];
          programRef.current.forEach(line => {
            if (updatingBloq[line.id]) return;

            const bloq = line.bloqs[activeBloqs[line.id]];
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
                    nextBloq(line.id);
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
                    nextBloq(line.id);
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
    setActiveBloqs({});
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
    stopDebugging,
    uploadFirmware
  };
};

export default useDebug;
