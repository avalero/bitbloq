import nunjucks from 'nunjucks';
import {resolveType} from './bloq-types';

const codeTemplate = `

{{definitionsCode}}

setup() {
  {{setupCode}}
}

loop() {
  {{loopCode}}
}

`;

export function generateCode(bloqs) {
  const includes = [];
  const definitions = [];
  const setup = [];
  const loop = [];

  bloqs.forEach((bloq) => {
    const code = generateBloqCode(bloq);
    if (code.definitions) {
      definitions.push(code.definitions);
    }
    if (code.setup) {
      setup.push(code.setup);
    }
  });

  const finalCode = nunjucks.renderString(
    codeTemplate,
    {
      definitionsCode: definitions.join('\n'),
      setupCode: setup.join('\n')
    }
  );

  return finalCode;
}

export function generateBloqCode(bloq) {
  const bloqType = resolveType(bloq.type);
  const codeTemplates = bloqType.code || {};
  const params = {
    nextCode: bloq.next ? generateBloqCode(bloq.next) : {}
  };
  return ['definitions', 'setup', 'statement'].reduce((map, codeBlock) => {
    let code;
    let template = codeTemplates[codeBlock];
    if (template) {
      if (codeBlock === 'statement') {
        template += '\n {{nextCode.statement}}';
      }
      code = nunjucks.renderString(template, params);
    } else {
      code = '';
    }
    return { ...map, [codeBlock]: code };
  }, {});
}

