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
