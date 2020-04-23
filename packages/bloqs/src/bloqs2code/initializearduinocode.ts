import { IArduinoCode } from "..";

const initilizeArduinoCode: () => IArduinoCode = () => {
  const defines: string[] = [];
  const includes: string[] = [];
  const globals: string[] = [];
  const setup: string[] = [];
  const loop: string[] = [];
  const endloop: string[] = [];
  const definitions: string[] = [];

  const arduinoCode: IArduinoCode = {
    defines,
    includes,
    globals,
    setup,
    loop,
    endloop,
    definitions
  };

  return arduinoCode;
};

export { initilizeArduinoCode as default };
