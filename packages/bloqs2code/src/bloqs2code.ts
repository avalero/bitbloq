import { IBloqsJSON } from './interfaces';
import BloqsCommon from './bloqscommon';

export default class Bloqs2Code {
  private bloqs: BloqsCommon[];

  constructor(bloqs: IBloqsJSON[] = []) {
    // TODO
  }

  public updateFromJSON(bloqs: IBloqsJSON[]) {
    // TODO
  }

  get code(): string {
    let code: string = '';
    this.bloqs.forEach(bloq => {
      code = `${code} ${bloq.code} \n`;
    });

    return code;
  }
}
