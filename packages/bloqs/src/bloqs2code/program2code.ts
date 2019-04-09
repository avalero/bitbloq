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
  IBoard,
  IBloqAction,
  IComponentAction,
  IArduinoCode,
} from '../index';
import { getFullComponentDefinition } from './componentBuilder';
import { pinsForComponent } from './components2code';
import nunjucks from 'nunjucks';
import { BloqCategory } from '../enums';

type ActionsArray = Array<{
  parameters: { [name: string]: string };
  definition: IComponentAction;
}>;

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
  const bloqType = bloqInstance.type;
  const bloqDefinition: Partial<IBloqType> | undefined = bloqTypes.find(
    bloq => bloq.name === bloqType
  );

  if (bloqDefinition) return bloqDefinition;

  throw new Error(`Bloq Type ${bloqType} not defined`);
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
    throw new Error(`${bloqDefinition.name} has no defined action`);
  }

  if (!bloqDefinition.actions) {
    throw new Error(`${bloqDefinition.name} has no actions`);
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

  const actions: Array<{
    parameters: { [name: string]: string };
    definition: IComponentAction;
  }> = [];

  if (actionsParameters.length !== actionsDefinitions.length) {
    throw new Error(
      'Unexpected different sizes of actionParameters and actionDefinitions'
    );
  }

  actionsParameters.forEach((parameters, index) => {
    const obj: {
      parameters: { [name: string]: string };
      definition: IComponentAction;
    } = {
      parameters: { ...parameters },
      definition: { ...actionsDefinitions[index] },
    };
    actions.push(obj);
  });

  return actions;
};

export const actions2code = (actions: ActionsArray): string[] => {
  const code: string[] = [];
  actions.forEach(action => {
    const nunjucksData = action.parameters;
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

const program2code = (
  components: Array<Partial<IComponent>>,
  bloqTypes: Array<Partial<IBloqType>>,
  hardware: IHardware,
  program: IBloq[][],
  arduinoCode: IArduinoCode
): IArduinoCode => {
  if (!arduinoCode.loop) arduinoCode.loop = [];

  program.forEach(timeline => {
    timeline.forEach(bloqInstance => {
      const bloqDefinition: Partial<IBloqType> = getBloqDefinition(
        bloqTypes,
        bloqInstance
      );
      // MANAGE ACTIONS BLOQS
      if (bloqDefinition.category === BloqCategory.Action) {
        const code: string[] = bloq2code(
          bloqInstance,
          hardware,
          bloqTypes,
          components
        );
        arduinoCode.loop!.push(...code);
      }
    });
  });

  return arduinoCode;
};

export default program2code;
