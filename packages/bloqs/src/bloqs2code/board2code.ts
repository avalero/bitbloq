/*
 * File: board2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import { IBoard, IHardware, IArduinoCode } from "../index";

const getBoard = (boards: IBoard[], hardware: IHardware): IBoard => {
  const boardName: string = hardware.board;
  const board = boards.find(b => b.name === boardName);
  if (board) return board;
  // if not defined no board found
  throw new Error(`Board ${boardName} not defined`);
};

const boardCodes = (board: IBoard, section: string): string[] => {
  if (!board.code[section]) {
    console.warn(`Warning ${section} not defined in ${board.name} code`);
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
