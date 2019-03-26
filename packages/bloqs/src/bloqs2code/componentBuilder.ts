import { IComponentNew } from "../index";
import deepmerge from "deepmerge";

/**
 * It gets the component definition of a given component name
 * @param componentsDef Definition of components
 * @param name Component name
 * @returns the component definition of a given component name
 */
export const getComponentDefinition = (
  componentsDef: Array<Partial<IComponentNew>>,
  name: string
): Partial<IComponentNew> => {
  for (const component of componentsDef) {
    if (component.name === name) {
      return component;
    }
  }

  throw new Error(`Unknown component name ${name}`);
};

/**
 * Merges a parent and child components
 * @param parent Parent component
 * @param child Child component
 * @returns merged components
 */
export const composeComponents = (
  parent: Partial<IComponentNew>,
  child: Partial<IComponentNew>
): Partial<IComponentNew> => {
  const merge = deepmerge(parent, child);
  merge.name = child.name || "";
  merge.extends = parent.extends;

  return merge;
};

/**
 * Constructs full component object composing with all components ancestors
 * @param componentesDef All components hierarchy
 * @param comp component to compose
 * @return fully composed component
 */
export const getFullComponentDefinition = (
  componentsDef: Array<Partial<IComponentNew>>,
  comp: Partial<IComponentNew>
): Partial<IComponentNew> => {
  if (!comp.name) {
    throw new Error("No Component name");
  }

  try {
    const compDef = getComponentDefinition(componentsDef, comp.name);
    let construct: Partial<IComponentNew> = compDef;

    while (construct.extends) {
      const parent = getComponentDefinition(componentsDef, construct.extends);
      construct = composeComponents(parent, construct);
    }

    return construct;
  } catch (e) {
    throw new Error(`Cannot construct Component ${e}`);
  }
};
