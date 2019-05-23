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
  IArduinoCode,
} from '../index';
import { getFullComponentDefinition } from './componentBuilder';
import nunjucks from 'nunjucks';
import { BloqCategory } from '../enums';

interface IAction {
  parameters: { [name: string]: string };
  definition: IComponentAction;
  valuesSym: { [name: string]: string };
}

type ActionsArray = IAction[];

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

  if (bloqDefinition) return bloqDefinition;

  throw new Error(`Bloq Type ${bloqInstance.type} not defined`);
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
      'Unexpected different sizes of actionParameters and actionDefinitions'
    );
  }

  actionsParameters.forEach((parameters, index) => {
    const obj: IAction = {
      parameters: { ...parameters },
      definition: { ...actionsDefinitions[index] },
      valuesSym: { ...componentDefinition.values },
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

  const code: string[] = actions2code(actions);
  return code;
};

/**
 * Generates de code for a wait bloq
 * @param bloqDefinition Defintion of the wait Bloq
 * @param functionNameIndex Number of the corresponding function
 * @param arduinoCode Arduino Code (mutable)
 * @return arduinoCode
 */
const waitTimer2Code = (
  bloqDefinition: Partial<IBloqType>,
  functionName: string,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  if (!bloqDefinition.actions) {
    throw new Error('Wait bloq should have actions');
  }

  if (!bloqDefinition.actions[0].name) {
    throw new Error('Wait bloq should have actions.name');
  }
  if (bloqDefinition.actions[0].name === 'wait') {
    const waitCodeTempalete: string = bloqDefinition.actions[0].parameters.code;
    const waitNunjucksParameters = { functionName };

    const waitCode: string = `
      ${nunjucks.renderString(waitCodeTempalete, waitNunjucksParameters)}\n}
      void ${functionName}(){\n
        `;

    arduinoCode.definitions!.push(waitCode);
    arduinoCode.globals!.push(`void ${functionName}();\n`);
  }
  return arduinoCode;
};

/**
 * Creates the code for the onstar bloq
 * @param functionName function pointer name
 * @param timelineFlagName variable for the timeline
 * @param arduinoCode arduino code to modify (mutable)
 */
const onstart2code = (
  functionName: string,
  timelineFlagName: string,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  const onStartSetupCode = `heap.insert(${functionName});\n ${timelineFlagName} = true;`;
  const onStartGlobalsCode = `bool ${timelineFlagName} = false;\n void ${functionName}();`;
  const onStartDefinitionsCode = `void ${functionName}(){\n`;

  arduinoCode.setup!.push(onStartSetupCode);
  arduinoCode.globals!.push(onStartGlobalsCode);
  arduinoCode.definitions!.push(onStartDefinitionsCode);

  return arduinoCode;
};

const waitEvent2Code = (
  bloqInstance: IBloq,
  hardware: IHardware,
  componentsDefinition: Array<Partial<IComponent>>,
  bloqTypes: Array<Partial<IBloqType>>,
  functionName: string,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  // wait for component event bloq
  const componentDefintion = getComponentForBloq(
    bloqInstance,
    hardware,
    componentsDefinition
  );

  const waitEventCodeArray: string[] = bloq2code(
    bloqInstance,
    hardware,
    bloqTypes,
    componentsDefinition
  );

  if (waitEventCodeArray.length > 1 || waitEventCodeArray.length === 0) {
    throw new Error('Unexepcted number of actions for an event');
  }

  const waitEventCode: string = waitEventCodeArray[0];

  const waitEventGlobalsCode: string = `
  void ${functionName}Wait();
  void ${functionName}();`;

  const waitEventDefinitionCode: string = `
    heap.insert(${functionName}Wait);
  }
  
  void ${functionName}Wait(){
    if(!(${waitEventCode} ${
    bloqInstance.parameters.trueCondition
  } ${(componentDefintion.values &&
    componentDefintion.values[bloqInstance.parameters.value]) ||
    bloqInstance.parameters.value})){
        heap.insert(${functionName}Wait);
    }else{
      heap.insert(${functionName});
    }
  }

  void ${functionName}(){
  `;

  arduinoCode.globals!.push(waitEventGlobalsCode);
  arduinoCode.definitions!.push(waitEventDefinitionCode);

  return arduinoCode;
};

const program2code = (
  componentsDefinition: Array<Partial<IComponent>>,
  bloqTypes: Array<Partial<IBloqType>>,
  hardware: IHardware,
  program: IBloq[][],
  arduinoCode: IArduinoCode
): IArduinoCode => {
  if (!arduinoCode.definitions) arduinoCode.definitions = [];
  if (!arduinoCode.globals) arduinoCode.globals = [];
  if (!arduinoCode.loop) arduinoCode.loop = [];
  if (!arduinoCode.endloop) arduinoCode.endloop = [];
  if (!arduinoCode.setup) arduinoCode.setup = [];

  let functionNameIndex: number = 0;
  let functionName: string = '';
  let timelineFlagName: string;

  program.forEach((timeline, index) => {
    if (timeline.length === 0) return;

    timelineFlagName = `timeline${index + 1}`;

    let i = 0;
    for (i = 0; i < timeline.length; i += 1) {
      let bloqInstance = timeline[i];
      let bloqDefinition: Partial<IBloqType> = getBloqDefinition(
        bloqTypes,
        bloqInstance
      );

      // add code definitions if the bloq has them
      if (bloqDefinition.code) {
        Object.keys(arduinoCode).forEach(key => {
          if (bloqDefinition.code![key]) {
            arduinoCode[key].push(...bloqDefinition.code![key]);
          }
        });
      }

      let componentDefintion: Partial<IComponent> = {};

      switch (bloqDefinition.category) {
        case BloqCategory.Wait:
          if (!bloqDefinition.actions) {
            throw new Error('Wait bloq should have actions');
          }

          functionName = `func_${++functionNameIndex}`;

          // Wait time bloq (it has no components)
          if (!bloqDefinition.components) {
            waitTimer2Code(bloqDefinition, functionName, arduinoCode);
            break;
          } else {
            waitEvent2Code(
              bloqInstance,
              hardware,
              componentsDefinition,
              bloqTypes,
              functionName,
              arduinoCode
            );
            break;
          }

        case BloqCategory.Event:
          functionName = `func_${++functionNameIndex}`;

          // OnStart Bloq requires special treatment
          if (bloqDefinition.name === 'OnStart') {
            onstart2code(functionName, timelineFlagName, arduinoCode);
            break;
          }

          let eventLoopCode: string = '';
          const eventGlobalsCode: string = `bool ${timelineFlagName} = false;`;
          const eventDefinitionCode: string = `void ${functionName}(){\n`;

          // bloqs without component (like onmessage)
          if (
            !bloqDefinition.components ||
            bloqDefinition.components.length === 0
          ) {
            if (!bloqDefinition.actions) {
              throw new Error(`No actions for bloq ${bloqDefinition.name}`);
            }
            const nunjucksData = { ...bloqInstance.parameters };
            const action = bloqDefinition.actions[0];
            const onMsgCodeTemplate: string = `
              if(${action.parameters.variable}){
                if(!${timelineFlagName}){ 
                  heap.insert(${functionName});
                  ${timelineFlagName} = true;
                }
              }
              `;
            eventLoopCode = nunjucks.renderString(
              onMsgCodeTemplate,
              nunjucksData
            );
          } else {
            componentDefintion = getComponentForBloq(
              bloqInstance,
              hardware,
              componentsDefinition
            );

            const codeArray: string[] = bloq2code(
              bloqInstance,
              hardware,
              bloqTypes,
              componentsDefinition
            );

            if (codeArray.length > 1 || codeArray.length === 0) {
              throw new Error('Unexepcted number of actions for an event');
            }

            const code: string = codeArray[0];

            eventLoopCode = `
              if(${code} ${
              bloqInstance.parameters.trueCondition
            } ${(componentDefintion.values &&
              componentDefintion.values[bloqInstance.parameters.value]) ||
              bloqInstance.parameters.value}){
                if(!${timelineFlagName}){ 
                  heap.insert(${functionName});
                  ${timelineFlagName} = true;
                }
              }
              `;
          }
          arduinoCode.loop!.push(eventLoopCode);
          arduinoCode.globals!.push(eventGlobalsCode);
          arduinoCode.definitions!.push(eventDefinitionCode);
          break;

        case BloqCategory.Action:
          // let actionCodeDefinition: string = '';

          // build a function with all action bloqs
          while (bloqDefinition.category === BloqCategory.Action) {
            // Bloqs without components, for example, sendMessage
            if (
              !bloqDefinition.components ||
              bloqDefinition.components.length === 0
            ) {
              if (!bloqDefinition.actions) {
                throw new Error(`No actions for bloq ${bloqDefinition.name}`);
              }
              const nunjucksData = { ...bloqInstance.parameters };
              bloqDefinition.actions.forEach(action => {
                const sendMsgCodeTemplate: string = `
                \t ${action.parameters.code} \n
                `;
                arduinoCode.definitions!.push(
                  nunjucks.renderString(sendMsgCodeTemplate, nunjucksData)
                );
              });
            } else {
              arduinoCode.definitions!.push(
                `\t${bloq2code(
                  bloqInstance,
                  hardware,
                  bloqTypes,
                  componentsDefinition
                ).join('\n\t')}\n`
              );
            }
            i += 1;
            if (i >= timeline.length) break;

            bloqInstance = timeline[i];
            bloqDefinition = getBloqDefinition(bloqTypes, bloqInstance);
          }

          i -= 1; // back to the last one to avoid two increments (while and for)
          break;
      }
    }
    // close timeline definitions with by setting flag variable to false
    arduinoCode.definitions!.push(`
      ${timelineFlagName}=false;
    }`);
  });

  return arduinoCode;
};

export default program2code;
