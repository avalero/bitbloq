import DigitalWrite from '../digitalwrite';

const type: string = DigitalWrite.typeName;
const pin: number = 13;
const id: string = '0000';

test('DigitalWrite code', () => {
  const bloq = new DigitalWrite({ type, pin, id, value: true });
  expect(bloq.code).toEqual(`digitalWrite(${pin}, true)`);
});
