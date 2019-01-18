import 'jsdom-worker';

import { STLObject } from '@bitbloq/lib3d';
import * as fs from 'fs';

interface ISTLParams {
  blob: {
    buffer: ArrayBuffer;
    filetype: string;
  };
}

const stlFolder = './stl/';
const jsonFolder = './json/';

fs.readdirSync(stlFolder).forEach(file => {
  console.log(`Parsing ${file} ...`);

  const blob: ArrayBuffer = fs.readFileSync(`${stlFolder}/${file}`);

  const buffer: ArrayBuffer = new Uint8Array(blob).buffer;

  const parameters: ISTLParams = {
    blob: {
      buffer,
      filetype: 'model/x.stl-binary',
    },
  };

  const stlObject: STLObject = new STLObject(parameters);
  const json = stlObject.toJSON();
  parameters.blob.buffer = blob;
  json.parameters = parameters;
  json.id = '';
  delete json.viewOptions;
  const jsonFileName: string = `${file.substr(0, file.length - 3)}json`;
  console.log(`Converting ${file} to ${jsonFileName} ...`);
  console.log(json);
  fs.writeFileSync(`${jsonFolder}/${jsonFileName}`, JSON.stringify(json));
});
