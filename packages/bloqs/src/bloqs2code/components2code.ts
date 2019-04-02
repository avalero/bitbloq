/*
 * File: components2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import { IComponent, IComponentInstance, IArduinoCode } from '../index';
import { getFullComponentDefinition } from './componentBuilder';

const components2code = (
  componentsDefinition: IComponent[],
  components: IComponentInstance[],
  arduinoCode: IArduinoCode
): IArduinoCode => {
  components.forEach(c => {
    const component = getFullComponentDefinition(componentsDefinition, c);
    // TODO
  });

  return arduinoCode;
};

export default components2code;
