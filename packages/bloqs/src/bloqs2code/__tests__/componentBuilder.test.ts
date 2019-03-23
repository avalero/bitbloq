import {
  getComponentDefinition,
  getFullComponentDefinition,
  composeComponents,
} from '../componentBuilder';
import { IComponentNew } from '../../index';

const components = [
  {
    name: 'Digital',
    def_code: {
      globals: ['uint8_t {{pin}};'],
    },
  },
  {
    name: 'DigitalOutput',
    extends: 'Digital',
    def_code: {
      setup: ['pinMode({{pin}},INPUT);'],
    },
    write: {
      code: 'digitalWrite({{pin}}, {{value}});',
    },
  },
  {
    name: 'DigitalInput',
    extends: 'Digital',
    def_code: {
      setup: ['pinMode({{pin}},OUTPUT)'],
    },
    read: {
      code: 'digitalRead({{pin}});',
      returns: 'uint8_t',
    },
  },
  {
    name: 'LED',
    extends: 'DigitalOutput',
    write: {
      values: {
        turnOn: 1,
        turnOff: 0,
      },
    },
  },
  {
    name: 'Button',
    extends: 'DigitalInput',
    read: {
      values: {
        isPressed: 1,
        isNotPressed: 0,
      },
    },
  },
];

const LED = {
  name: 'LED',
  extends: 'DigitalOutput',
  write: {
    values: {
      turnOn: 1,
      turnOff: 0,
    },
  },
};

const fullLED = {
  name: 'LED',
  def_code: {
    globals: ['uint8_t {{pin}};'],
    setup: ['pinMode({{pin}},INPUT);'],
  },
  extends: undefined,
  write: {
    code: 'digitalWrite({{pin}}, {{value}});',
    values: { turnOn: 1, turnOff: 0 },
  },
};

const DigitalOutput = {
  name: 'DigitalOutput',
  extends: 'Digital',
  def_code: {
    setup: ['pinMode({{pin}},INPUT);'],
  },
  write: {
    code: 'digitalWrite({{pin}}, {{value}});',
  },
};

const LEDDigitalOutputComp = {
  name: 'LED',
  extends: 'Digital',
  def_code: { setup: ['pinMode({{pin}},INPUT);'] },
  write: {
    code: 'digitalWrite({{pin}}, {{value}});',
    values: { turnOn: 1, turnOff: 0 },
  },
};

test('getComponentDefinition', () => {
  const comp: Partial<IComponentNew> = getComponentDefinition(
    components,
    'LED'
  );
  // console.info(comp);
  expect(comp).toEqual(LED);
});

test('composeComponents', () => {
  const composition: Partial<IComponentNew> = composeComponents(
    DigitalOutput,
    LED
  );
  expect(composition).toEqual(LEDDigitalOutputComp);
});

test('constructComponent', () => {
  const comp: Partial<IComponentNew> = getFullComponentDefinition(
    components,
    LED
  );
  expect(comp).toEqual(fullLED);
});
