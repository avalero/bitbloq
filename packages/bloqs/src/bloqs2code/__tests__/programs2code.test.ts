import {
  IBloqType,
  IBloq,
  IHardware,
  IComponent,
  ConnectorPinMode,
} from '../../index';
import { getBloqDefinition, getComponentForBloq } from '../program2code';
import { bloqTypes } from './config/bloqTypes';
import { components } from './config/components';
import { BloqCategory, BloqParameterType } from '../../enums';

test('getBloqDefinition', () => {
  const bloqInstance: IBloq = {
    parameters: { component: 'led', led1: true, led2: true },
    type: 'DoubleLedOnOff',
  };

  const doubleLedOnOff: IBloqType = {
    category: BloqCategory.Action,
    name: 'DoubleLedOnOff',
    components: ['ZumjuniorDoubleLed'],
    parameters: [
      {
        name: 'component',
        label: 'bloq-parameter-component',
        type: BloqParameterType.SelectComponent,
      },
      {
        name: 'led1',
        label: 'bloq-parameter-led-1',
        type: BloqParameterType.Select,
        options: [
          {
            label: 'bloq-parameter-on',
            value: true,
          },
          {
            label: 'bloq-parameter-off',
            value: false,
          },
        ],
      },
      {
        name: 'led2',
        label: 'bloq-parameter-led-2',
        type: BloqParameterType.Select,
        options: [
          {
            label: 'bloq-parameter-on',
            value: true,
          },
          {
            label: 'bloq-parameter-off',
            value: false,
          },
        ],
      },
    ],
    code: {},
  };

  const bloqDefinition: Partial<IBloqType> = getBloqDefinition(
    bloqTypes,
    bloqInstance
  );
  expect(bloqDefinition).toBeDefined();
  expect(bloqDefinition).toEqual(doubleLedOnOff);
});

test('componentForBloq', () => {
  const bloqInstance: IBloq = {
    parameters: { component: 'led', led1: true, led2: true },
    type: 'DoubleLedOnOff',
  };

  const ZumjuniorDoubleLed: IComponent = {
    name: 'ZumjuniorDoubleLed',
    extends: '',
    code: {
      globals: [
        '{% for pin in pinsInfo %}\n        uint8_t {{pin.pinVarName}} = {{pin.pinNumber}} ;\n        {% endfor %}',
      ],
      setup: [
        '{% for pin in pinsInfo %}\n        pinMode({{pin.pinVarName}},OUTPUT);\n        {% endfor %}',
      ],
    },
    onValue: 'LOW',
    offValue: 'HIGH',
    actions: [
      {
        name: 'write',
        parameters: ['pin', 'value'],
        code: 'digitalWrite({{pin}}, {{value}})',
        returns: 'uint8_t',
      },
    ],
    instanceName: 'bloq-led-instance-name',
    connectors: [
      {
        name: 'main',
        type: 'zumjunior-digital',
        position: { x: 0.28, y: 1 },
        pins: [
          {
            name: 'WhitePin',
            mode: ConnectorPinMode.OUTPUT,
            portPin: '0',
          },
          {
            name: 'ColorPin',
            mode: ConnectorPinMode.OUTPUT,
            portPin: '1',
          },
        ],
      },
    ],
    image: {
      url:
        'https://bitbloq.bq.com/images/components/1548099714577.zumjunior_double_led.svg',
      width: 124,
      height: 124,
    },
  };

  const hardware: IHardware = {
    board: 'zumjunior',
    components: [{ component: 'ZumjuniorDoubleLed', name: 'led', port: '1' }],
  };

  const componentDefinition = getComponentForBloq(
    bloqInstance,
    hardware,
    components
  );

  expect(componentDefinition).toEqual(ZumjuniorDoubleLed);
});
