import { IComponent, IComponentInstance } from '../index';
import deepmerge from 'deepmerge';

/**
 * It gets the component definition of a given component name
 * @param componentsDef Definition of components
 * @param name Component name
 * @returns the component definition of a given component name
 */
export const getComponentDefinition = (
  componentsDef: Array<Partial<IComponent>>,
  name: string
): Partial<IComponent> => {
  // look for component with same name
  const component: Partial<IComponent> | undefined = componentsDef.find(
    c => c.name === name
  );
  if (component) return component;

  // if undefined throw Error exception
  throw new Error(`Unknown component name ${name}`);
};

/**
 * Merges a parent and child components
 * @param parent Parent component
 * @param child Child component
 * @returns merged components
 */
export const composeComponents = (
  parent: Partial<IComponent>,
  child: Partial<IComponent>
): Partial<IComponent> => {
  const merge = deepmerge(parent, child);
  merge.name = child.name || '';
  merge.extends = parent.extends || '';

  return merge;
};

/**
 * Constructs full component object composing with all components ancestors
 * @param componentesDef All components hierarchy
 * @param comp component to compose
 * @return fully composed component
 */
export const getFullComponentDefinition = (
  componentsDef: Array<Partial<IComponent>>,
  comp: Partial<IComponentInstance>
): Partial<IComponent> => {
  if (!comp.component) {
    throw new Error('No Component name');
  }

  try {
    const compDef = getComponentDefinition(componentsDef, comp.component);
    let construct: Partial<IComponent> = compDef;

    while (construct.extends) {
      const parent = getComponentDefinition(componentsDef, construct.extends);
      construct = composeComponents(parent, construct);
    }

    return construct;
  } catch (e) {
    throw new Error(`Cannot construct Component ${e}`);
  }
};
