/*
 * File: bloqs2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import {
  IBoard,
  IComponent,
  IBloqType,
  IHardware,
  IBloq,
  IArduinoCode,
} from '../index';
import nunjucks from 'nunjucks';

import arduinocodetemplate from './arduinocodetemplate';
import board2code from './board2code';
import { getFullComponentDefinition } from './componentBuilder';
import components2code from './components2code';

/**
 * @returns date in dd/mm/yyyy -- HH:MM format
 */
const getDate = (): string => {
  const date = new Date();
  const dateString = `${date.getDate()}/${date.getMonth() +
    1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  return dateString;
};

const bloqs2code = (
  boards: IBoard[],
  components: IComponent[],
  bloqTypes: IBloqType[],
  hardware: IHardware,
  program: IBloq[][]
) => {
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
    board2code(boards, hardware, arduinoCode);
    components2code(components, hardware.components, arduinoCode);
  } catch (e) {
    throw e;
  }

  const nunjucksData = { ...arduinoCode, date: getDate() };
  const code: string = nunjucks.renderString(arduinocodetemplate, nunjucksData);

  return code;
};

export default bloqs2code;
