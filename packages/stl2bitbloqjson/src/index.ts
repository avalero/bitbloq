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

fs.readdirSync(stlFolder).forEach(async file => {
  console.log(`Converting ${file} ...`);

  try {
    const blob: ArrayBuffer = fs.readFileSync(`${stlFolder}/${file}`);

    // const buffer: ArrayBuffer = new Uint8Array(blob).buffer;

    const parameters: ISTLParams = {
      blob: {
        buffer: blob,
        filetype: 'model/x.stl-binary',
      },
    };

    const stlObject: STLObject = new STLObject(parameters);
    await stlObject.computeMeshAsync();
    const json = stlObject.toJSON();
    json.id = '';
    delete json.viewOptions;
    const jsonFileName: string = `${file.substr(0, file.length - 3)}json`;
    fs.writeFileSync(`${jsonFolder}/${jsonFileName}`, JSON.stringify(json));
    console.log('Done!');
  } catch (e) {
    console.error(e);
  }
});
