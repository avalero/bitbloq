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
  IExtraData
} from "../index";
import nunjucks from "nunjucks";
import cloneDeep from "clone-deep";

import initilizeArduinoCode from "./initializearduinocode";
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

// time in seconds
const createWaitBloq = (time: string): IBloq => {
  const waitBloq: IBloq = {
    type: "WaitSeconds",
    parameters: {
      value: time
    }
  };
  return waitBloq;
};

/**
 * Transforms a Music bloq into a set of bloqs consisting of playTone and Wait Bloqs
 * @param bloq the music bloq
 * @param extraData the melodies array
 */
const transformMusicBloq = (bloq: IBloq, extraData: IExtraData): IBloq[] => {
  const createStopMelodyBloq = (stop: string): IBloq => {
    const muteBloq: IBloq = {
      type: "StopMelody",
      parameters: {
        stop
      }
    };
    return muteBloq;
  };

  const createPlayMelodyBloq = (playing: string): IBloq => {
    const muteBloq: IBloq = {
      type: "PlayMelody",
      parameters: {
        playing
      }
    };
    return muteBloq;
  };

  if (bloq.type !== "Music") {
    return [bloq];
  }

  if (bloq.parameters.melodyIndex === "stop") {
    return [createStopMelodyBloq("true")];
  }

  if (!extraData || !extraData.melodies) {
    throw new Error("No melodies extradata");
  }

  const createPlayToneBloq = (tone: string, time: string): IBloq => {
    const playToneBloq: IBloq = {
      type: "PlayTone",
      parameters: {
        tone,
        time
      }
    };
    return playToneBloq;
  };

  const melody = extraData.melodies[bloq.parameters.melodyIndex];

  const adjustedTimeLine: IBloq[] = [
    // createStopMelodyBloq("true"), // stop if any other melody is playing
    // createWaitBloq("0.005"),
    // createStopMelodyBloq("false"),
  ];
  melody.forEach(tone => {
    if (tone.note && tone.note !== "") {
      const toneDuration =
        (tone.duration > 0 ? tone.duration : 0.5) * 1000 * 0.3;
      adjustedTimeLine.push(
        createPlayToneBloq(tone.note, `!___stop * ${toneDuration}`)
      );
    }
    const waitDuration = (tone.duration > 0 ? tone.duration : 0.5) * 0.3;
    adjustedTimeLine.push(createWaitBloq(`!___stop * ${waitDuration}`));
  });

  adjustedTimeLine.push(createStopMelodyBloq("false"));
  adjustedTimeLine.push(createPlayMelodyBloq("false"));

  return adjustedTimeLine;
};

/**
 * Removes empty timelines
 * Splits timelines with WaitForMessage bloqs in new timelines.
 * @param program original program
 * @param bloqTypes array of bloq types
 */
const adjustProgram = (
  program: IBloq[][],
  bloqTypes: Array<Partial<IBloqType>>,
  extraData: IExtraData
): IBloq[][] => {
  const createOnMessageBloq = (value: string): IBloq => {
    return {
      type: "OnMessage",
      parameters: { value }
    };
  };

  const createRemoveMessageBloq = (value: string): IBloq => {
    return {
      type: "RemoveMessage",
      parameters: { value }
    };
  };

  let adjustedProgram: IBloq[][] = program.filter(
    timeline => timeline.length > 0
  );

  // Any time a message is sent, it must be set to "unsent -> false" after 5 ms
  adjustedProgram.forEach(timeline => {
    timeline.forEach(bloqInstance => {
      const bloqDefinition = getBloqDefinition(bloqTypes, bloqInstance);
      if (bloqDefinition.name === "sendMessage") {
        adjustedProgram.push([
          createOnMessageBloq(bloqInstance.parameters.value as string),
          createWaitBloq("0.005"),
          createRemoveMessageBloq(bloqInstance.parameters.value as string)
        ]);
      }
    });
  });

  adjustedProgram = adjustedProgram.map(timeline => {
    timeline = timeline.flatMap(bloq => {
      const result: IBloq[] =
        bloq.type === "Music"
          ? transformMusicBloq(bloq, extraData) // transform bloq
          : [bloq];

      return result;
    });

    return timeline;
  });
  return adjustedProgram;
};

const compose = (codeArray: IArduinoCode[]): IArduinoCode => {
  const arduinoCode: IArduinoCode = initilizeArduinoCode();

  codeArray.forEach(code => {
    Object.keys(arduinoCode).forEach(section => {
      (arduinoCode[section] as string[]).push(...code[section]);
    });
  });

  // Remove duplicates from defines, includes, globals and setup
  arduinoCode.defines = Array.from(new Set(arduinoCode.defines));
  arduinoCode.includes = Array.from(new Set(arduinoCode.includes));
  arduinoCode.globals = Array.from(new Set(arduinoCode.globals));
  arduinoCode.setup = Array.from(new Set(arduinoCode.setup));

  // I am not sure this should be done - Alberto Valero.
  arduinoCode.endloop = Array.from(new Set(arduinoCode.endloop));

  return arduinoCode;
};

const bloqs2code = (
  boards: IBoard[],
  components: IComponent[],
  bloqTypes: IBloqType[],
  hardware: IHardware,
  program: IBloq[][],
  extraData: IExtraData = {}
) => {
  // adjust program
  const programFixed: IBloq[][] = adjustProgram(
    cloneDeep(program),
    bloqTypes,
    extraData
  );

  const board: IBoard = getBoardDefinition(boards, hardware);
  const arduinoCode: IArduinoCode = compose([
    board2code(board),
    components2code(components, hardware.components, board),
    program2code(components, bloqTypes, hardware, programFixed)
  ]);

  const nunjucksData = { ...arduinoCode, date: getDate() };
  const code: string = nunjucks.renderString(juniorcodetemplate, nunjucksData);

  console.info(code);
  return code;
};

export default bloqs2code;
