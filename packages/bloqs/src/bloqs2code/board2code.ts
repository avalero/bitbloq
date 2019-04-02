/*
 * File: board2code.ts
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
  const board = boards.find(b => b.name === boardName);
  if (board) return board;
  // if not defined no board found
  throw new Error(`Board ${boardName} not defined`);
};

const boardCodes = (board: IBoard, section: string): string[] => {
  if (!board.code[section]) {
    throw new Error(`${section} not defined in ${board.name} code`);
  }
  return board.code[section];
};

const board2code = (
  boards: IBoard[],
  hardware: IHardware,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  // get board information
  const board: IBoard = getBoard(boards, hardware);

  // get board code
  try {
    Object.keys(arduinoCode).forEach(section => {
      arduinoCode[section].push(...boardCodes(board, section));
    });
  } catch (e) {
    console.info(`Error generating board code ${e}`);
  }
  return arduinoCode;
};

export default board2code;
