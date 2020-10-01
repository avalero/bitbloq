import nunjucks from "nunjucks";
import bloqTypes from "../config/bloqs.yml";
import boards from "../config/boards.yml";
import components from "../config/components.yml";
import { IComponentInstance } from "@bitbloq/bloqs";
import { IBloq } from "./types";
import { BloqSection, BloqState } from "./state";

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

export const getCode = (
  boardName: string,
  componentInstances: IComponentInstance[],
  bloqs: BloqState
) => {
  const board = boards.find(b => b.name === boardName);

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
      [section]: getBloqsCode(bloqs[section])
    }),
    {}
  );

  /* Merge all code sections from board, component, bloqs into one */
  const codeSections = [boardSections, bloqSections].reduce(
    (accSections, itemSections) =>
      Object.values(CodeSection).reduce(
        (acc, section) => ({
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

  console.log("Bloqs", bloqs);
  console.log("code sections", codeSections);

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

export const getBloqsCode = (bloqs: IBloq[]): string[] =>
  bloqs.map(bloq => {
    const bloqType = bloqTypesMap[bloq.type];
    return nunjucks.renderString(bloqType.code.main, { ...bloq });
  });
