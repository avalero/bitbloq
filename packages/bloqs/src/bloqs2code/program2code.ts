/*
 * File: program2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import {
  IBloqType,
  IBloq,
  IComponent,
  IHardware,
  IComponentInstance,
  IComponentAction,
  IArduinoCode
} from "../index";

import initializeArduinoCode from "./initializearduinocode";
import { getFullComponentDefinition } from "./componentBuilder";
import nunjucks from "nunjucks";
import { BloqCategory } from "../enums";
import { isString } from "util";

/**
 *
 * @param bloqTypes The array of existing bloqs
 * @param bloqInstance the bloq we are processing
 * @returns the code corresponding to the value of the bloqInstance
 */
const genCode = (
  bloqInstance: IBloq,
  bloqDefinition: Partial<IBloqType>,
  hardware: IHardware,
  functionName: string,
  timelineFlagName: string,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  // add code definitions if the bloq has them

  if (bloqDefinition.code) {
    Object.keys(arduinoCode).forEach(key => {
      if (bloqDefinition.code![key]) {
        (arduinoCode[key] as string[]).push(
          ...(bloqDefinition.code![key] as string[])
        );
      }
    });
  }

  Object.keys(arduinoCode).forEach(key => {
    try {
      if (bloqDefinition.genCode![key]) {
        bloqDefinition.genCode![key].forEach((keycode: string) => {
          let code: string = keycode;
          const component = hardware.components.find(
            obj => obj.name === bloqInstance.parameters.component
          );

          let nunjucksData = {
            ...bloqInstance.parameters,
            conditionCode: bloqDefinition.conditionCode || "",
            functionName,
            timelineFlagName
          };
          nunjucksData =
            component && component.pins
              ? { ...nunjucksData, ...component.pins }
              : nunjucksData;

          while (code.includes("{{") && code.includes("}}")) {
            code = nunjucks.renderString(code, nunjucksData);
          }

          arduinoCode[key].push(code);
        });
      }
    } catch (e) {
      console.error(e);
    }
  });

  return arduinoCode;
};

/**
 * Returns the bloq definition to which a bloq refers
 * @param bloqTypes The array of existing bloqs
 * @param bloqInstance the bloq we are processing
 * @returns the bloq definition to which a bloq refers
 */
export const getBloqDefinition = (
  bloqTypes: Array<Partial<IBloqType>>,
  bloqInstance: IBloq
): Partial<IBloqType> => {
  const bloqDefinition: Partial<IBloqType> | undefined = bloqTypes.find(
    bloq => bloq.name === bloqInstance.type
  );

  if (!bloqDefinition) {
    throw new Error(`Bloq Type ${bloqInstance.type} not defined`);
  }

  if (bloqDefinition.extends) {
    const parent: Partial<IBloqType> | undefined = bloqTypes.find(
      bloq => bloq.name === bloqDefinition.extends
    );

    if (parent) {
      bloqDefinition.genCode = {
        ...parent.genCode,
        ...bloqDefinition.genCode
      };
    }
  }

  return bloqDefinition;
};

/**
 * Returns the full component definition for a given bloq
 * @param bloqInstance the bloq we are processing
 * @param hardware the collection of components and board of this program
 * @param componentsDefinition the definition of all existing components.
 * @return full component definition to which the bloq applies.
 */
export const getComponentForBloq = (
  bloqInstance: IBloq,
  hardware: IHardware,
  componentsDefinition: Array<Partial<IComponent>>
): Partial<IComponent> => {
  const componentInstance:
    | IComponentInstance
    | undefined = hardware.components.find(
    c => c.name === bloqInstance.parameters.component
  );
  if (!componentInstance) {
    throw new Error(`Component ${bloqInstance.parameters.name} not found`);
  }

  const component = getFullComponentDefinition(
    componentsDefinition,
    componentInstance
  );
  if (!component) {
    throw new Error(`Component ${componentInstance.component} not defined`);
  }

  return component;
};

const program2code = (
  componentsDefinition: Array<Partial<IComponent>>,
  bloqTypes: Array<Partial<IBloqType>>,
  hardware: IHardware,
  program: IBloq[][]
): IArduinoCode => {
  const arduinoCode: IArduinoCode = initializeArduinoCode();

  let functionNameIndex: number = 0;
  let functionName: string = "";
  let timelineFunctionName: string = ""; // first function name of a timeline
  let timelineFlagName: string; // flag to avoid a timeline to run simultaneously
  let onStartEvent: boolean = false;

  for (let index = 0; index < program.length; index++) {
    const timeline = program[index];
    if (timeline.length === 0) {
      continue;
    } // this should not happen on fixed programs

    timelineFlagName = `timeline${index + 1}`;
    let i = 0;

    for (i = 0; i < timeline.length; i += 1) {
      let bloqInstance = timeline[i];
      let bloqDefinition: Partial<IBloqType> = getBloqDefinition(
        bloqTypes,
        bloqInstance
      );

      switch (bloqDefinition.category) {
        case BloqCategory.Wait:
        case BloqCategory.Event:
          functionName = `func_${++functionNameIndex}`;
          if (bloqDefinition.category === BloqCategory.Event) {
            timelineFunctionName = functionName;
          }
          if (bloqDefinition.name === "OnStart") {
            onStartEvent = true;
          }
          // functionName = `func_${++functionNameIndex}`;
          genCode(
            bloqInstance,
            bloqDefinition,
            hardware,
            functionName,
            timelineFlagName,
            arduinoCode
          );
          break;

        case BloqCategory.Action:
          // build a function with all action bloqs
          while (bloqDefinition.category === BloqCategory.Action) {
            genCode(
              bloqInstance,
              bloqDefinition,
              hardware,
              functionName,
              timelineFlagName,
              arduinoCode
            );
            i += 1;
            if (i >= timeline.length) {
              break;
            }

            bloqInstance = timeline[i];
            bloqDefinition = getBloqDefinition(bloqTypes, bloqInstance);
          }

          i -= 1; // back to the last one to avoid two increments (while and for)
          break;
      }
    }
    // close timeline definitions by setting flag variable to false
    // or repeating timeline if event has an associated loop
    if (onStartEvent) {
      onStartEvent = false;
      arduinoCode.definitions!.push(
        `
          if(onStartForEver${timelineFlagName}){
            heap.insert(${timelineFunctionName},0);
          }else if(onStartLoopTimes${timelineFlagName} > 1){
            onStartLoopTimes${timelineFlagName}--;
            heap.insert(${timelineFunctionName},0);
          }else{
            ${timelineFlagName}=false;
          }
        }`
      );
    } else {
      arduinoCode.definitions!.push(
        `
          ${timelineFlagName}=false;
        }`
      );
    }
  }

  return arduinoCode;
};

export default program2code;
