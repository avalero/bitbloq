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

interface IAction {
  parameters: { [name: string]: string };
  definition: IComponentAction;
  valuesSym: { [name: string]: string };
}

type ActionsArray = IAction[];

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
  debugger;
  if (bloqDefinition.code) {
    Object.keys(arduinoCode).forEach(key => {
      if (bloqDefinition.code![key]) {
        (arduinoCode[key] as string[]).push(
          ...(bloqDefinition.code![key] as string[])
        );
      }
    });
  }

  debugger;

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

          debugger;
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

export const getActions = (
  bloqInstance: IBloq,
  bloqDefinition: Partial<IBloqType>,
  componentDefinition: Partial<IComponent>
): ActionsArray => {
  if (!bloqDefinition.actions) {
    throw new Error(`${bloqDefinition.name} has no actions`);
  }

  if (!componentDefinition.actions) {
    throw new Error(`${componentDefinition.name} has no actions`);
  }

  const actionsNames: string[] = bloqDefinition.actions.map(
    action => action.name
  );

  const actionsDefinitions: IComponentAction[] = actionsNames.map(
    actionName => {
      const actionDef = componentDefinition.actions!.find(
        action => action.name === actionName
      );

      if (!actionDef) {
        throw new Error(
          `Action ${actionName} not defined in ${componentDefinition.name}`
        );
      }
      return actionDef;
    }
  );

  const actionsParameters: Array<{ [name: string]: string }> = [];

  actionsDefinitions.forEach((action, index) => {
    const obj: { [name: string]: string } = {};
    action.parameters.forEach(parameter => {
      const codeTemplate = bloqDefinition.actions![index].parameters[parameter];
      const nunjucksData = bloqInstance.parameters;
      const value: string = nunjucks.renderString(codeTemplate, nunjucksData);
      obj[parameter] = value;
    });
    actionsParameters.push(obj);
  });

  const actions: ActionsArray = [];

  if (actionsParameters.length !== actionsDefinitions.length) {
    throw new Error(
      "Unexpected different sizes of actionParameters and actionDefinitions"
    );
  }

  actionsParameters.forEach((parameters, index) => {
    const obj: IAction = {
      parameters: { ...parameters },
      definition: { ...actionsDefinitions[index] },
      valuesSym: { ...componentDefinition.values }
    };
    actions.push(obj);
  });

  return actions;
};

export const actions2code = (actions: ActionsArray): string[] => {
  const code: string[] = [];
  actions.forEach(action => {
    const nunjucksData = action.parameters;

    // in case the alias is a value
    if (action.valuesSym[action.parameters.value]) {
      nunjucksData.value = action.valuesSym[action.parameters.value];
    }

    const codeTemplate = action.definition.code;
    const c: string = nunjucks.renderString(codeTemplate, nunjucksData);
    code.push(c);
  });

  return code;
};

export const bloq2code = (
  bloqInstance: IBloq,
  hardware: IHardware,
  bloqTypes: Array<Partial<IBloqType>>,
  componentsDefinition: Array<Partial<IComponent>>
): string[] => {
  const bloqDefinition: Partial<IBloqType> = getBloqDefinition(
    bloqTypes,
    bloqInstance
  );
  const componentDefintion: Partial<IComponent> = getComponentForBloq(
    bloqInstance,
    hardware,
    componentsDefinition
  );
  const actions: ActionsArray = getActions(
    bloqInstance,
    bloqDefinition,
    componentDefintion
  );

  const runActions = actions.filter(action => {
    // if the bloq has an "action" parameter defining which action to run
    if (bloqInstance.parameters.action) {
      return bloqInstance.parameters.action === action.definition.name;
    }
    return true;
  });

  const code: string[] = actions2code(runActions);
  return code;
};

const program2code = (
  componentsDefinition: Array<Partial<IComponent>>,
  bloqTypes: Array<Partial<IBloqType>>,
  hardware: IHardware,
  program: IBloq[][]
): IArduinoCode => {
  debugger;
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

      debugger;

      switch (bloqDefinition.category) {
        case BloqCategory.Wait:
        case BloqCategory.Event:
          functionName = `func_${++functionNameIndex}`;
          timelineFunctionName = functionName;
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

        // case BloqCategory.Event:
        // functionName = `func_${++functionNameIndex}`;
        // timelineFunctionName = functionName;

        // OnStart Bloq requires special treatment
        // if (bloqDefinition.name === "OnStart") {
        //   onStartEvent = true;
        // }
        // genCode(
        //   bloqInstance,
        //   bloqDefinition,
        //   hardware,
        //   functionName,
        //   timelineFlagName,
        //   arduinoCode
        // );

        // break;

        case BloqCategory.Action:
          // build a function with all action bloqs
          while (bloqDefinition.category === BloqCategory.Action) {
            // Bloqs without components, for example, sendMessage
            // if (
            //   !bloqDefinition.components ||
            //   bloqDefinition.components.length === 0
            // ) {
            //   const nunjucksData = { ...bloqInstance.parameters };
            //   bloqDefinition.actions!.forEach(action => {
            //     const sendMsgCodeTemplate: string = `
            //     \t ${action.parameters.code} \n
            //     `;
            //     arduinoCode.definitions!.push(
            //       nunjucks.renderString(sendMsgCodeTemplate, nunjucksData)
            //     );
            //   });
            // } else {
            genCode(
              bloqInstance,
              bloqDefinition,
              hardware,
              functionName,
              timelineFlagName,
              arduinoCode
            );
            // }
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
            ${timelineFunctionName}();
          }else if(onStartLoopTimes${timelineFlagName} > 1){
            onStartLoopTimes${timelineFlagName}--;
            ${timelineFunctionName}();
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
