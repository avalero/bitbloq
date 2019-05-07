/*
 * File: board2code.ts
 * Project: Bitbloq
 * License: MIT (https://opensource.org/licenses/MIT)
 * Bitbloq Repository: https://github.com/bitbloq
 * Bitbloq Team: https://github.com/orgs/Bitbloq/people
 * Copyright 2018 - 2019 BQ Educacion.
 */

import { IBoard, IHardware, IArduinoCode } from "../index";

/**
 * Returns full definition for the board of a hardware description
 * @param boards List of boards
 * @param hardware List of hardware (including board) for current program
 * @return Board definition
 */
export const getBoardDefinition = (
  boards: IBoard[],
  hardware: IHardware
): IBoard => {
  const boardName: string = hardware.board;
  const board = boards.find(b => b.name === boardName);
  if (board) return board;
  // if not defined no board found
  throw new Error(`Board ${boardName} not found`);
};

const boardCodes = (board: IBoard, section: string): string[] => {
  if (!board.code[section]) {
    return [];
  }
  return board.code[section];
};

/**
 * Adds the code to include in the arduino program related to a specific board
 * @param boards The list of known boards
 * @param hardware The list of hardware used by the program
 * @param arduinoCode The arduinoCode array
 */
const board2code = (
  boards: IBoard[],
  hardware: IHardware,
  arduinoCode: IArduinoCode
): IArduinoCode => {
  // get board information
  const board: IBoard = getBoardDefinition(boards, hardware);

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
