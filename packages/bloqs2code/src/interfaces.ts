export interface IBloqsJSON {
  id: string;
  type: string;
}

export interface IDigitalWriteJSON extends IBloqsJSON {
  value: boolean;
  pin: number;
}
