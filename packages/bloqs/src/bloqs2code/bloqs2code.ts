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
  IArduinoCode
} from "../index";
import nunjucks from "nunjucks";
import cloneDeep from "clone-deep";

import juniorcodetemplate from "./juniorcodetemplate";
import board2code, { getBoardDefinition } from "./board2code";
import components2code from "./components2code";
import program2code, { getBloqDefinition } from "./program2code";

/**
 * @returns date in dd/mm/yyyy -- HH:MM format
 */
const getDate = (): string => {
  const date = new Date();
  const dateString = `${date.getDate()}/${date.getMonth() +
    1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
  return dateString;
};

/**
 * Removes empty timelines
 * Splits timelines with WaitForMessage bloqs in new timelines.
 * @param program original program
 * @param bloqTypes array of bloq types
 */
const adjustProgram = (
  program: IBloq[][],
  bloqTypes: Array<Partial<IBloqType>>
): IBloq[][] => {
  const waitMessage2EventMessage = (wait: IBloq): IBloq => {
    return {
      type: "OnMessage",
      parameters: { value: wait.parameters.value }
    };
  };

  let adjustedProgram: IBloq[][] = program.filter(
    timeline => timeline.length > 0
  );

  adjustedProgram = adjustedProgram.flatMap(timeline => {
    const result: IBloq[][] = [];
    timeline.forEach((bloqInstance, index, arr) => {
      const bloqDefinition = getBloqDefinition(bloqTypes, bloqInstance);
      if (bloqDefinition.name === "WaitMessage") {
        arr[index] = waitMessage2EventMessage(bloqInstance);
        const lastIndex = result.flatMap(e => e).length;
        result.push(arr.slice(lastIndex, index));
      }
      if (index === arr.length - 1) {
        const lastIndex = result.flatMap(e => e).length;
        result.push(arr.slice(lastIndex));
      }
    });

    return result;
  });
  return adjustedProgram;
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
  const endloop: string[] = [];
  const definitions: string[] = [];

  const arduinoCode: IArduinoCode = {
    includes,
    globals,
    setup,
    loop,
    endloop,
    definitions
  };

  try {
    // adjust program
    const programFixed: IBloq[][] = adjustProgram(
      cloneDeep(program),
      bloqTypes
    );

    board2code(boards, hardware, arduinoCode);
    const board: IBoard = getBoardDefinition(boards, hardware);
    components2code(components, hardware.components, board, arduinoCode);
    program2code(components, bloqTypes, hardware, programFixed, arduinoCode);
  } catch (e) {
    // console.warn(e);
    throw e;
  }

  // Remove duplicates from includes, globals and setup
  arduinoCode.globals = Array.from(new Set(arduinoCode.globals));
  arduinoCode.includes = Array.from(new Set(arduinoCode.includes));
  arduinoCode.setup = Array.from(new Set(arduinoCode.setup));
  arduinoCode.endloop = Array.from(new Set(arduinoCode.endloop));

  const nunjucksData = { ...arduinoCode, date: getDate() };
  const code: string = nunjucks.renderString(juniorcodetemplate, nunjucksData);

  console.info(code);
  return code;
};

export default bloqs2code;
