import { IDigitalWriteJSON } from './interfaces';
import BloqsCommon from './bloqscommon';

export default class DigitalWrite extends BloqsCommon {
  public static typeName: string = 'DigitalWrite';

  constructor(params: IDigitalWriteJSON) {
    super(params);
    this.params = { ...params };
    this.params.type = DigitalWrite.typeName;
  }

  public updateFromJSON(params: IDigitalWriteJSON): void {
    if (this.params.id === params.id) {
      this.params = params;
    } else {
      throw new Error(`id does not match`);
    }
  }

  get code(): string {
    const params = this.params as IDigitalWriteJSON;
    return `digitalWrite(${params.pin}, ${params.value})`;
  }
}
