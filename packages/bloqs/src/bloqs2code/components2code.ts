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
  ConnectorPinMode,
} from '../index';
import { getFullComponentDefinition } from './componentBuilder';
import nunjucks from 'nunjucks';

const componentCodes = (
  component: Partial<IComponent>,
  section: string
): string[] => {
  if (!component.code) throw new Error('Component has no code key');

  if (!component.code[section]) {
    console.warn(`Warning ${section} not defined in ${component.name} code`);
    return [];
  }
  return component.code[section];
};

const getPinNumber = (
  board: IBoard,
  portName: string,
  portPinName: string
): string => {
  const port = board.ports.find(p => p.name === portName);
  if (!port) throw new Error('Port not found');

  const portPin = port.pins.find(p => p.name === portPinName);
  if (!portPin) throw new Error('Pin not found');

  return portPin.value;
};

export const pinsForComponent = (
  componentInstance: IComponentInstance,
  componentDefinition: Partial<IComponent>,
  boardDefintion: IBoard
): Array<{ pinNumber: string; pinVarName: string }> => {
  const pinsInfo: Array<{ pinNumber: string; pinVarName: string }> = [];
  if (!componentDefinition.connectors) throw new Error('No connector defined');

  componentDefinition.connectors.forEach(connector => {
    connector.pins.forEach(pin => {
      pinsInfo.push({
        pinNumber: getPinNumber(
          boardDefintion,
          componentInstance.port,
          pin.portPin
        ),
        pinVarName: `${componentInstance.name}${pin.name}`,
      });
    });
  });
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
          ...componentCodes(componentDefinition, section),
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
      console.info(`Error generating board code ${e}`);
    }
  });

  return arduinoCode;
};

export default components2code;
