import nunjucks from 'nunjucks';
import uniq from 'lodash.uniq';
import {resolveSoftwareType, resolve3DType} from './bloq-types';
import {resolveBoardClass, resolveComponentClass} from './hardware';

const arduinoTemplate = `
#include "eventheap.h"

{% for include in includes %}
#include <{{include}}>
{% endfor %}

Heap heap;

{{componentsDefinitionsCode}}

{{declarationsCode}}

void setup() {
  {{setupCode}}
}

void loop() {
  heap.eventloop();

  {{loopCode}}
}

{{definitionsCode}}

`;

export function generateArduinoCode(bloqs, hardware) {
  let includes = [];
  const componentsDefinitions = [];
  const declarations = [];
  const definitions = [];
  const setup = [];
  const loop = [];

  const {board, components} = hardware;

  if (board) {
    const boardClass = resolveBoardClass(board.boardClass);
    const {code = {}} = boardClass;
    if (code.includes) {
      includes = includes.concat(code.includes);
    }
    if (code.definitions) {
      componentsDefinitions.push(code.definitions);
    }
    if (code.setup) {
      setup.push(code.setup);
    }
  }

  components.forEach(component => {
    const [
      componentIncludes,
      componentDefinitions,
      componentSetup,
    ] = generateComponentCode(component);
    includes = includes.concat(componentIncludes);
    componentsDefinitions.push(componentDefinitions);
    setup.push(componentSetup);
  });

  bloqs.forEach(bloq => {
    const code = generateBloqCode(bloq, '', resolveSoftwareType);
    if (code.declarations) {
      declarations.push(code.declarations);
    }
    if (code.definitions) {
      definitions.push(code.definitions);
    }
    if (code.setup) {
      setup.push(code.setup);
    }
    if (code.statement) {
      loop.push(code.statement);
    }
  });

  const finalCode = nunjucks.renderString(arduinoTemplate, {
    componentsDefinitionsCode: componentsDefinitions.join('\n'),
    declarationsCode: declarations.join('\n'),
    definitionsCode: definitions.join('\n'),
    setupCode: setup.join('\n'),
    loopCode: loop.join('\n'),
    includes: uniq(includes),
  });

  return finalCode;
}

const jscadTemplate = `
function main() {
  {{mainCode}}
}
`;

export function generateJscadCode(bloqs) {
  const main = bloqs.map(bloq => {
    const code = generateBloqCode(bloq, '', resolve3DType);
    return code.statement || '';
  });

  return nunjucks.renderString(jscadTemplate, {mainCode: main.join('\n')});
}

export function generateBloqCode(bloq, parentFinally = '', resolveType) {
  const bloqType = resolveType(bloq.type);
  const {children = []} = bloq;
  const codeTemplates = bloqType.code || {};
  const finallyCode = codeTemplates.finally
    ? nunjucks.renderString(codeTemplates.finally, {...bloq})
    : '';

  let childrenCode = '';
  if (children[0]) {
    childrenCode = generateBloqCode(children[0], '', resolveType);
  }

  const nextCode = bloq.next
    ? generateBloqCode(bloq.next, finallyCode + parentFinally, resolveType)
    : {};

  const data = { ...bloq.data };
  bloqType.content.forEach((item) => {
    const itemData = data[item.dataField];
    if (item.type === 'bloq' && itemData) {
      data[item.dataField] = {
        ...itemData,
        code: generateBloqCode(itemData, '', resolveType)
      };
    }
  });

  const params = {
    ...bloq,
    data,
    bloqId: parseInt(Math.random() * 10000),
    nextCode,
    childrenCode,
    finallyCode: !bloq.next ? finallyCode + parentFinally : '',
  };
  return ['declarations', 'definitions', 'setup', 'statement'].reduce(
    (map, codeBlock) => {
      let code;
      let template = codeTemplates[codeBlock] || '';
      if (codeBlock === 'statement') {
        if (!bloqType.async) {
          if (params.nextCode && params.nextCode.statement) {
            template += `\n {{nextCode.statement}}`;
          }
          if (params.finalCode) {
            template += `\n {{finallyCode}}`;
          }
        }
      } else {
        template = `\n {{nextCode.${codeBlock}}}` + template;
      }
      code = nunjucks.renderString(template, params);
      return {...map, [codeBlock]: code};
    },
    {},
  );
}

export function generateComponentCode(component) {
  const componentClass = resolveComponentClass(component.componentClass) || {};
  const {code = {}} = componentClass;
  const params = {component};

  const includes = code.includes || [];
  const definitions = code.definitions
    ? nunjucks.renderString(code.definitions, params)
    : '';
  const setup = code.setup ? nunjucks.renderString(code.setup, params) : '';

  return [includes, definitions, setup];
}
