/*
 * File: components2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import {
  IComponent,
  IComponentInstance,
  IArduinoCode,
  IBoard,
  IIntegratedComponent
} from "../index";
import { getFullComponentDefinition } from "./componentBuilder";
import nunjucks from "nunjucks";

/**
 * Retrieves the code that a component requires for a precise section
 * @param component The definition of a particular component
 * @param section The code for a precise section: globals, setup, etc.
 */
const componentCodes = (
  component: Partial<IComponent>,
  section: string
): string[] => {
  if (!component.code) throw new Error("Component has no code key");

  if (!component.code[section]) {
    return [];
  }
  return component.code[section];
};

/**
 * Returns the pin (or template for computing the pin) for a precise portName and pinName
 * @param board The definition of the board
 * @param portName The name of the port
 * @param portPinName The name of the pin
 */
const getPinNumber = (
  board: IBoard,
  portName: string,
  portPinName: string
): string => {
  const port = board.ports.find(p => p.name === portName);
  if (!port) throw new Error("Port not found");

  const portPin = port.pins.find(p => p.name === portPinName);
  if (!portPin) throw new Error("Pin not found");

  return portPin.value;
};

export const pinsForComponent = (
  componentInstance: IComponentInstance,
  componentDefinition: Partial<IComponent>,
  boardDefintion: IBoard
): Array<{ pinNumber: string; pinVarName: string }> => {
  const pinsInfo: Array<{ pinNumber: string; pinVarName: string }> = [];

  if (!componentDefinition.connectors) throw new Error("No connector defined");

  // Pin of an Integrated component (the instance has the integrated flat set to true)
  if (componentInstance.integrated) {
    const integratedInstance:
      | IIntegratedComponent
      | undefined = boardDefintion.integrated.find(
      component => component.name === componentInstance.name
    );
    if (!integratedInstance) {
      throw new Error(
        `${componentInstance.name} not found on ${boardDefintion.name}`
      );
    }

    componentDefinition.connectors.forEach(connector => {
      connector.pins.forEach(pin => {
        pinsInfo.push({
          pinVarName: `${componentInstance.name}${pin.name}`,
          pinNumber: `${integratedInstance.pins[pin.name]}`
        });
      });
    });

    // Connected Component
  } else {
    if (!componentInstance.port) {
      throw new Error(
        `Port expected but not found on component ${componentDefinition.name}`
      );
    }

    componentDefinition.connectors.forEach(connector => {
      connector.pins.forEach(pin => {
        pinsInfo.push({
          pinNumber: getPinNumber(
            boardDefintion,
            componentInstance.port!,
            pin.portPin
          ),
          pinVarName: `${componentInstance.name}${pin.name}`
        });
      });
    });
  }

  return pinsInfo;
};

const components2code = (
  componentsDefinition: Array<Partial<IComponent>>,
  components: IComponentInstance[],
  board: IBoard,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  // loop over every component connected to the board
  components.forEach(componentInstance => {
    const componentDefinition = getFullComponentDefinition(
      componentsDefinition,
      componentInstance
    );

    // get pins of component instance
    const pinsInfo: Array<{
      pinNumber: string;
      pinVarName: string;
    }> = pinsForComponent(componentInstance, componentDefinition, board);

    // compute the code for all the sections (setup, loop, etc)
    try {
      Object.keys(arduinoCode).forEach(section => {
        const codeTemplates: string[] = [
          ...componentCodes(componentDefinition, section)
        ];
        const nunjucksData = { pinsInfo };
        codeTemplates.forEach(codeTemplate => {
          const code: string = nunjucks.renderString(
            codeTemplate,
            nunjucksData
          );
          arduinoCode[section].push(code);
        });
      });
    } catch (e) {
      throw new Error(`Error generating component code ${e}`);
    }

    return arduinoCode;
  });

  return arduinoCode;
};

export default components2code;
