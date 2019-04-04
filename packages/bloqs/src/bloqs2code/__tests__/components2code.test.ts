/*
 * File: board2code.test.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import { getBoard } from '../board2code';
import components2code from '../components2code';
import { IHardware, IArduinoCode } from '../..';
import { boards } from './config/boards';
import { components } from './config/components';

test('components2code - ZUMJuniorButton', () => {
  const hardware: IHardware = {
    board: 'zumjunior',
    components: [{ component: 'ZumjuniorButton', name: 'boton', port: '1' }],
  };

  const includes: string[] = [];
  const globals: string[] = [];
  const setup: string[] = [];
  const loop: string[] = [];
  const definitions: string[] = [];

  const arduinoCode: IArduinoCode = {
    includes,
    globals,
    setup,
    loop,
    definitions,
  };

  try {
    const board = getBoard(boards, hardware);
    components2code(components, hardware.components, board, arduinoCode);
  } catch (e) {
    throw e;
  }

  expect(arduinoCode.globals).toEqual([
    '\n        uint8_t botonPin = BQ::ZUMJunior::ports[1][0] ;\n        ',
  ]);
  expect(arduinoCode.setup).toEqual([
    '\n        pinMode(botonPin,INPUT);\n        ',
  ]);
});

test('components2code - ZUMJuniorLed', () => {
  const hardware: IHardware = {
    board: 'zumjunior',
    components: [{ component: 'ZumjuniorLed', name: 'LED', port: 'A' }],
  };

  const includes: string[] = [];
  const globals: string[] = [];
  const setup: string[] = [];
  const loop: string[] = [];
  const definitions: string[] = [];

  const arduinoCode: IArduinoCode = {
    includes,
    globals,
    setup,
    loop,
    definitions,
  };

  try {
    const board = getBoard(boards, hardware);
    components2code(components, hardware.components, board, arduinoCode);
  } catch (e) {
    throw e;
  }

  expect(arduinoCode.globals).toEqual([
    '\n        uint8_t LEDWhitePin = BQ::ZUMJunior::ports[A][0] ;\n        \n        uint8_t LEDColorPin = BQ::ZUMJunior::ports[A][1] ;\n        ',
  ]);
  expect(arduinoCode.setup).toEqual([
    '\n        pinMode(LEDWhitePin,OUTPUT);\n        \n        pinMode(LEDColorPin,OUTPUT);\n        ',
  ]);
});
