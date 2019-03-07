import { IBloqsJSON } from './interfaces';

import { v1 } from 'uuid';
const uuid = v1;

export default class BloqsCommon {
  protected params: IBloqsJSON;

  constructor(params: IBloqsJSON) {
    if (!params.id) this.params.id = uuid();
  }

  get code(): string {
    throw new Error('Implemented on childre');
  }
}
