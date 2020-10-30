import nunjucks from "nunjucks";
import { useRecoilCallback } from "recoil";
import bloqTypes from "../config/bloqs.yml";
import boards from "../config/boards.yml";
import components from "../config/components.yml";
import { selectedCodeStartToken, selectedCodeEndToken } from "./config";
import {
  IBoard,
  IComponent,
  IComponentInstance,
  ILibrary
} from "@bitbloq/bloqs";
import { IBloq } from "./types";
import {
  BloqSection,
  BloqState,
  boardState,
  bloqsState,
  componentsState
} from "./state";

const boardsMap: Record<string, IBoard> = boards.reduce(
  (map, b) => ({ ...map, [b.name]: b }),
  {}
);

const componentsMap: Record<string, IComponent> = components.reduce(
  (map, c) => ({ ...map, [c.name]: c }),
  {}
);

const codeTemplate = `
/***   Included libraries  ***/
{% for include in includes -%}
#include {{include | safe}}
{% endfor %}
/***   Global variables and function definition  ***/
{% for g in globals -%}
{{g | safe}}
{% endfor %}
/***   Setup  ***/
void setup() {
{% for s in setup -%}
{{ s | safe | indent(4, true) }}
{% endfor -%}
}

/***   Loop  ***/
void loop() {
{% for l in loop -%}
{{l | safe | indent(4, true) }}
{% endfor -%}
}
`;

enum CodeSection {
  Includes = "includes",
  Global = "globals",
  Setup = "setup",
  Loop = "loop"
}

const mergeCode = sections =>
  sections.reduce(
    (accSections: Record<CodeSection, string>, itemSections) =>
      Object.values(CodeSection).reduce(
        (acc, section: string) => ({
          ...acc,
          [section]: [...accSections[section], ...(itemSections[section] || [])]
        }),
        {}
      ),
    {
      includes: [],
      globals: [],
      loop: [],
      setup: []
    }
  );

const getExtendChain = (componentName: string) => {
  const component = componentsMap[componentName];
  if (component.extends) {
    return [...getExtendChain(component.extends), component];
  } else {
    return [component];
  }
};

const getComponentCode = (
  instance: IComponentInstance,
  board: IBoard,
  templateFunctions: any
) => {
  const extendChain = getExtendChain(instance.component);
  const component = componentsMap[instance.component];

  const componentSections = extendChain.reduce(
    (acc, component) =>
      mergeCode([
        acc,
        Object.values(CodeSection).reduce(
          (acc, section) => ({
            ...acc,
            [section]: ((component.code && component.code[section]) || []).map(
              code =>
                nunjucks.renderString(code, {
                  ...templateFunctions,
                  component: instance
                })
            )
          }),
          {}
        )
      ]),
    {}
  );
  return componentSections;
};

export const getCode = (
  boardName: string,
  componentInstances: IComponentInstance[],
  bloqs: BloqState,
  selectedBloq?: IBloq | null
): string => {
  const board = boardsMap[boardName];

  const templateFunctions = {
    getComponentType: (instance: IComponentInstance) =>
      instance && componentsMap[instance.component],
    getPinName: (
      instance: IComponentInstance,
      connectorIndex: number,
      pinIndex: number
    ) => {
      if (!instance) return "";
      const componentType = componentsMap[instance.component];
      const connector = componentType.connectors[connectorIndex];
      const pin = connector && connector.pins[pinIndex];
      return pin ? `${instance.name}${pin.name}` : "";
    },
    getPinValue: (
      instance: IComponentInstance,
      connectorName: string,
      pinName: string
    ) => {
      const portName = instance.ports?.[connectorName];
      const port = portName && board.ports.find(p => p.name === portName);
      const portPin = port && port.pins.find(p => p.name === pinName);
      return portPin && portPin.value;
    },
    getBloqCode: (bloq: IBloq) =>
      bloq && getBloqsCode([bloq], templateFunctions, selectedBloq)[0],
    getBloqsCode: (bloqs: IBloq[]) =>
      bloqs && getBloqsCode(bloqs, templateFunctions, selectedBloq).join("\n")
  };

  const componentsSections = componentInstances.map(instance =>
    getComponentCode(instance, board, templateFunctions)
  );

  const boardSections = Object.values(CodeSection).reduce(
    (acc, section) => ({
      ...acc,
      [section]: (board.code[section] || []).map(code =>
        nunjucks.renderString(code, { board })
      )
    }),
    {}
  );

  const bloqSections = Object.values(BloqSection).reduce(
    (acc, section) => ({
      ...acc,
      [section]: getBloqsCode(bloqs[section], templateFunctions, selectedBloq)
    }),
    {}
  );

  /* Merge all code sections from board, component, bloqs into one */
  const codeSections = mergeCode([
    boardSections,
    ...componentsSections,
    bloqSections
  ]);

  const data = {
    ...codeSections
  };

  const codeString = nunjucks.renderString(codeTemplate, data);

  return codeString;
};

const bloqTypesMap = bloqTypes.reduce(
  (acc, bloq) => ({ ...acc, [bloq.name]: bloq }),
  {}
);

export const getBloqsCode = (
  bloqs: IBloq[],
  templateFunctions: Record<string, any>,
  selectedBloq?: IBloq | null
): string[] =>
  bloqs.map(bloq => {
    const bloqType = bloqTypesMap[bloq.type];
    if (!bloqType.code) {
      return "";
    }

    const code = nunjucks.renderString(bloqType.code.main, {
      ...bloq,
      ...templateFunctions
    });

    return bloq === selectedBloq
      ? `${selectedCodeStartToken}${code}${selectedCodeEndToken}`
      : code;
  });

interface ICallbackResult {
  code: string;
  libraries: ILibrary[];
}

const useCodeGeneration = (): (() => Promise<ICallbackResult>) => {
  return useRecoilCallback(({ snapshot }) => async () => {
    const board = await snapshot.getPromise(boardState);
    const instances = await snapshot.getPromise(componentsState);
    const bloqs = await snapshot.getPromise(bloqsState);
    const boardObject = board && boardsMap[board.name];

    if (!board || !boardObject) {
      return { code: "", libraries: [] };
    }

    const components = instances.reduce((acc: IComponent[], instance) => {
      const component = componentsMap[instance.component];
      if (!acc.includes(component)) {
        acc.push(component);
      }
      return acc;
    }, []);
    const libraries = [
      ...(boardObject.libraries || []),
      ...components.flatMap(c => c.libraries || [])
    ];

    const code = getCode(board.name, instances, bloqs);
    return { code, libraries };
  });
};

export default useCodeGeneration;
