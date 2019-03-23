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

/**
 * @returns date in dd/mm/yyyy -- HH:MM format
 */
const getDate = (): string => {
  const date = new Date();
  const dateString = `${date.getDate()}/${date.getMonth() +
    1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  return dateString;
};

const getBoard = (boards: IBoard[], hardware: IHardware): IBoard => {
  const boardName: string = hardware.board;
  for (const board of boards) {
    if (board.name === boardName) return board;
  }

  throw new Error(`Board ${boardName} not defined`);
};

const boardCodes = (board: IBoard, section: string): string[] => {
  const code: string[] = [];
  if (!board.code[section]) {
    throw new Error(`${section} not defined in ${board.name} code`);
  }
  code.push(...board.code[section]);
  return code;
};

const bloqs2code = (
  boards: IBoard[],
  components: IComponent[],
  bloqTypes: IBloqType[],
  hardware: IHardware,
  program: IBloq[][]
) => {
  debugger;

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

  // get board information
  const board: IBoard = getBoard(boards, hardware);

  // get board code
  try {
    Object.keys(arduinoCode).forEach(section => {
      console.log(`${section}`);
      arduinoCode[section].push(...boardCodes(board, section));
    });
  } catch (e) {
    console.error(`Generating board code ${e}`);
  }

  const nunjucksData = { ...arduinoCode, date: getDate() };
  debugger;
  const code: string = nunjucks.renderString(arduinocodetemplate, nunjucksData);

  return code;
};

export default bloqs2code;
