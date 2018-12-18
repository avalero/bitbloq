import nunjucks from 'nunjucks';
import uniq from 'lodash.uniq';
import {resolveSoftwareType, resolve3DType} from './bloq-types';
import {resolveBoardClass, resolveComponentClass} from './hardware';

const arduinoTemplate = `
#include <ArduinoEventsLib.h>

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

  if (!board) return '';

  const boardClass = resolveBoardClass(board.className);
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

  components.forEach(component => {
    const [
      componentIncludes,
      componentDefinitions,
      componentSetup,
    ] = generateComponentCode(component, boardClass);
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

const oomlTemplate = `
{{mainCode}}
`;

export function generateOOMLCode(bloqs) {
  const main = bloqs.map(bloq => {
    const code = generateBloqCode(bloq, '', resolve3DType);
    return code.statement || '';
  });

  return nunjucks.renderString(oomlTemplate, {mainCode: main.join('\n')});
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

  const data = {...bloq.data};
  bloqType.content.forEach(item => {
    const itemData = data[item.dataField];
    if (item.type === 'bloq' && itemData) {
      data[item.dataField] = {
        ...itemData,
        code: generateBloqCode(itemData, '', resolveType),
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
    getComponentClass: component =>
      component ? resolveComponentClass(component.className) : {},
    getComponentCode: (component, section, params) => {
      if (!component) return '';
      const componentClass = resolveComponentClass(component.className);
      const code = componentClass.getCode(section);
      const codeParams = {
        ...params,
        component,
        componentClass,
      };
      return nunjucks.renderString(code.join(''), codeParams);
    },
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
          if (params.finallyCode) {
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

export function generateComponentCode(component, boardClass) {
  const componentClass = resolveComponentClass(component.className) || {};
  const {code = {}, connectors = []} = componentClass;
  const {ports = []} = boardClass;
  const params = {
    getConnector: name => connectors.find(c => c.name === name),
    getBoardPin: (portName, pinName) => {
      const port = ports.find(p => p.name === portName);
      if (!port) return {};
      const {pins = []} = port;
      return pins.find(p => p.name === pinName);
    },
    component,
  };

  const definitions = componentClass.getCode('definitions');
  const setup = componentClass.getCode('setup');
  const includes = code.includes || [];

  const definitionsCode = nunjucks.renderString(definitions.join(''), params);
  const setupCode = nunjucks.renderString(setup.join(''), params);

  return [includes, definitionsCode, setupCode];
}
