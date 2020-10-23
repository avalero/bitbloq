import nunjucks from "nunjucks";
import {
  useCodeUpload,
  ICodeUploadOptions
} from "@bitbloq/code/src/useCodeUpload";
import { useSetRecoilState, useRecoilCallback, Snapshot } from "recoil";
import bloqTypes from "../config/bloqs.yml";
import boards from "../config/boards.yml";
import components from "../config/components.yml";
import { IBoard, IComponent, IComponentInstance } from "@bitbloq/bloqs";
import { IBloq, InstructionType } from "./types";
import {
  BloqSection,
  BloqState,
  boardState,
  bloqsState,
  componentsState,
  compilingState
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

{% for include in includes 
%}#include {{include | safe}}
{% endfor %}



/***   Global variables and function definition  ***/
{% for g in globals
%}{{g | safe}}
{% endfor %}




/***   Setup  ***/
void setup() {
    {% for s in setup %}
    {{s | safe}}
    {% endfor %}
}


/***   Loop  ***/
void loop() {
    {% for l in loop %}
    {{l | safe}}
    {% endfor %}
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
  bloqs: BloqState
): string => {
  const board = boardsMap[boardName];

  const templateFunctions = {
    getComponentType: (instance: IComponentInstance) =>
      componentsMap[instance.component],
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
      bloq && getBloqsCode([bloq], templateFunctions)[0],
    getBloqsCode: (bloqs: IBloq[]) =>
      bloqs && getBloqsCode(bloqs, templateFunctions).join("\n")
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
      [section]: getBloqsCode(bloqs[section], templateFunctions)
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
  templateFunctions: Record<string, any>
): string[] =>
  bloqs.map(bloq => {
    const bloqType = bloqTypesMap[bloq.type];
    if (!bloqType.code) {
      return "";
    }

    return nunjucks.renderString(bloqType.code.main, {
      ...bloq,
      ...templateFunctions
    });
  });

interface IUseCodeGeneration {
  compile: () => void;
  upload: () => void;
}

const useCodeGeneration = (
  uploadOptions: ICodeUploadOptions
): IUseCodeGeneration => {
  const { compile, upload, cancel } = useCodeUpload(uploadOptions);
  const setCompiling = useSetRecoilState(compilingState);

  const generateCode = async (snapshot: Snapshot) => {
    const board = await snapshot.getPromise(boardState);
    const components = await snapshot.getPromise(componentsState);
    const bloqs = await snapshot.getPromise(bloqsState);

    if (!board) {
      return "";
    }

    return getCode(board.name, components, bloqs);
  };

  const onCompile = useRecoilCallback(({ snapshot }) => async () => {
    setCompiling({ compiling: true, visible: true });
    const board = await snapshot.getPromise(boardState);
    if (!board) {
      return;
    }
    const code = await generateCode(snapshot);
    try {
      const boardObject = boardsMap[board.name];
      const libraries = [...(boardObject.libraries || [])];
      console.log(code);
      /*await compile(
        [{ name: "main.ino", content: code }],
        libraries,
        boardObject.borndateBoard || ""
      );*/
      setCompiling({ compileSuccess: true, visible: true });
    } catch (e) {
      console.log(e.data);
      setCompiling({ compileError: true, visible: true });
      /*switch (e.type) {
        case UploadErrorType.COMPILE_ERROR:
          setErrors(parseErrors(e.data));
          break;

        default:
          console.log(e);
      }*/
    }
  });

  const onUpload = useRecoilCallback(({ snapshot }) => async () => {
    setCompiling({ uploading: true, visible: true });
    const board = await snapshot.getPromise(boardState);
    const instances = await snapshot.getPromise(componentsState);
    if (!board) {
      return;
    }
    const code = await generateCode(snapshot);

    try {
      const boardObject = boardsMap[board.name];
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
      console.log(libraries);

      await upload(
        [{ name: "main.ino", content: code }],
        libraries,
        boardObject.borndateBoard || ""
      );
      setCompiling({ uploadSuccess: true, visible: true });
    } catch (e) {
      setCompiling({ uploadError: true, visible: true });
    }
  });

  return {
    compile: onCompile,
    upload: onUpload
  };
};

export default useCodeGeneration;
