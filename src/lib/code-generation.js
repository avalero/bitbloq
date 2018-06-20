import nunjucks from 'nunjucks';
import uniq from 'lodash.uniq';
import {resolveType} from './bloq-types';
import {resolveBoardClass, resolveComponentClass} from './hardware';

const codeTemplate = `
#include "eventheap.h"

{% for include in includes %}
#include <{{include}}>
{% endfor %}

Heap heap;

{{definitionsCode}}

void setup() {
  {{setupCode}}
}

void loop() {
  heap.eventloop();

  {{loopCode}}
}

`;

export function generateCode(bloqs, hardware) {
  let includes = [];
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
      definitions.push(code.definitions);
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
    definitions.push(componentDefinitions);
    setup.push(componentSetup);
  });

  bloqs.forEach(bloq => {
    const code = generateBloqCode(bloq);
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

  const finalCode = nunjucks.renderString(codeTemplate, {
    definitionsCode: definitions.join('\n'),
    setupCode: setup.join('\n'),
    loopCode: loop.join('\n'),
    includes: uniq(includes),
  });

  return finalCode;
}

export function generateBloqCode(bloq, parentFinally = '') {
  const bloqType = resolveType(bloq.type);
  const codeTemplates = bloqType.code || {};
  const finallyCode = codeTemplates.finally
    ? nunjucks.renderString(codeTemplates.finally, {...bloq})
    : '';

  const nextCode = bloq.next
    ? generateBloqCode(bloq.next, finallyCode + parentFinally)
    : {};
  const params = {
    ...bloq,
    bloqId: parseInt(Math.random() * 10000),
    nextCode,
    finallyCode: !bloq.next ? finallyCode + parentFinally : '',
  };
  return ['definitions', 'setup', 'statement'].reduce((map, codeBlock) => {
    let code;
    let template = codeTemplates[codeBlock] || '';
    if (codeBlock === 'statement') {
      if (!bloqType.async) {
        template += `\n {{nextCode.statement}}\n {{finallyCode}}`;
      }
    } else {
      template = `\n {{nextCode.${codeBlock}}}` + template;
    }
    code = nunjucks.renderString(template, params);
    return {...map, [codeBlock]: code};
  }, {});
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
