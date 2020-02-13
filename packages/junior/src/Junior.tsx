import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { useTranslate } from "@bitbloq/ui";
import { useCodeUpload } from "@bitbloq/code";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  IBloq,
  IBloqLine,
  IBloqType,
  IBoard,
  IComponent,
  IHardware,
  isBloqSelectComponentParameter
} from "@bitbloq/bloqs";

export interface IJuniorProps {
  bloqTypes: IBloqType[];
  initialContent?: any;
  onContentChange: (content: any) => any;
  boards: IBoard[];
  components: IComponent[];
  children: (
    hardware: JSX.Element,
    software: (isActive: boolean) => JSX.Element | null
  ) => JSX.Element;
  chromeAppID: string;
  borndateFilesRoot: string;
  arduinoLibraries: any[];
}

const Junior: React.FunctionComponent<IJuniorProps> = ({
  children,
  bloqTypes,
  initialContent,
  onContentChange,
  boards,
  components,
  chromeAppID,
  borndateFilesRoot,
  arduinoLibraries
}) => {
  const t = useTranslate();

  const [upload, uploadContent] = useCodeUpload(
    "zumjunior",
    borndateFilesRoot,
    chromeAppID
  );

  const [content, setContent] = useState(initialContent);
  const program: IBloqLine[] = content.program || [];
  const hardware: IHardware = content.hardware || {
    board: "zumjunior",
    components: []
  };

  useEffect(() => {
    if (content !== initialContent) {
      onContentChange(content);
    }
  }, [content]);

  const board: IBoard = getBoardDefinition(boards, hardware);
  if (hardware.components.length === 0) {
    // Add board integrated components to hardware list
    if (board && board.integrated) {
      board.integrated.forEach(integratedComponent =>
        hardware.components.push({ ...integratedComponent, integrated: true })
      );
    }
  }

  if (!board.integrated) {
    board.integrated = [];
  }

  const componentMapRef = useRef<{ [key: string]: IComponent }>(
    [...components, ...board.integrated].reduce((map, c) => {
      map[c.name] = c;
      return map;
    }, {})
  );
  const componentMap = componentMapRef.current;

  const getComponents = (types: string[]) =>
    hardware.components.filter(c =>
      types.some(name =>
        isInstanceOf(componentMap[c.component], name, componentMap)
      )
    );

  const getBloqPort = (bloq: IBloq): string | undefined => {
    if (!bloq) {
      return;
    }

    const bloqType = bloqTypes.find(type => type.name === bloq.type);

    if (bloqType) {
      const componentParameter =
        bloqType.parameters &&
        bloqType.parameters.find(isBloqSelectComponentParameter);
      const componentName =
        componentParameter && bloq.parameters[componentParameter.name];

      if (!componentName) {
        return;
      }

      const component = hardware.components.find(c => c.name === componentName);

      return component ? component.port : "?";
    }

    return;
  };

  const availableBloqs = bloqTypes.filter(
    bloq =>
      !bloq.components ||
      bloq.components.some(bloqComponent =>
        hardware.components.some(c =>
          isInstanceOf(componentMap[c.component], bloqComponent, componentMap)
        )
      )
  );

  const onUpload = () => {
    const programBloqs = program
      .filter(line => !line.disabled)
      .map(line => line.bloqs);

    const code = bloqs2code(
      boards,
      components,
      bloqTypes,
      hardware,
      programBloqs
    );

    // upload([{ name: "main.ino", content: code }], arduinoLibraries);
  };

  return children(
    <HardwareDesigner
      boards={boards}
      components={components}
      hardware={hardware}
      onHardwareChange={newHardware =>
        setContent({ hardware: newHardware, program })
      }
    />,
    (isActive: boolean) =>
      isActive ? (
        <>
          <HorizontalBloqEditor
            lines={program}
            components={components}
            getComponents={getComponents}
            getBloqPort={getBloqPort}
            bloqTypes={bloqTypes}
            availableBloqs={availableBloqs}
            onLinesChange={(newProgram: IBloqLine[]) =>
              setContent({ program: newProgram, hardware })
            }
            onUpload={onUpload}
            board={board}
          />
          {uploadContent}
        </>
      ) : null
  );
};

export const isInstanceOf = (
  component: IComponent,
  name: string,
  componentsMap: { [key: string]: IComponent }
): boolean => {
  if (component.name === name) {
    return true;
  }

  if (component.extends) {
    const parentComponent = componentsMap[component.extends];
    if (parentComponent) {
      return isInstanceOf(parentComponent, name, componentsMap);
    }
  }

  return false;
};

export default Junior;
