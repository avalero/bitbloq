import React, { FC, useEffect } from "react";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import { RecoilRoot, useRecoilCallback } from "recoil";
import Hardware from "./Hardware";
import Bloqs from "./Bloqs";
import Diagram from "./Diagram";
import { IRoboticsContent } from "./index";
import { HardwareDefinitionProvider } from "./useHardwareDefinition";
import { UpdateContentProvider } from "./useUpdateContent";
import { boardState } from "./state";

import boards from "../config/boards.yml";
import components from "../config/components.yml";

export interface IRoboticsCallbackProps {
  hardware: React.ReactElement;
  bloqs: React.ReactElement;
  diagram: React.ReactElement;
}

export interface IRoboticsProps {
  initialContent?: Partial<IRoboticsContent>;
  onContentChange: (content: IRoboticsContent) => any;
  children: (props: IRoboticsCallbackProps) => React.ReactElement;
  borndateFilesRoot: string;
}

const Robotics: FC<IRoboticsProps> = ({
  children,
  initialContent,
  onContentChange,
  borndateFilesRoot
}) => {
  const initState = useRecoilCallback(({ set }) => () => {
    if (initialContent) {
      if (initialContent.hardware) {
        set(boardState, {
          name: initialContent.hardware.board || "",
          width: 0,
          height: 0
        });
      }
    }
  });

  useEffect(() => initState(), []);

  return (
    <UpdateContentProvider onContentChange={onContentChange}>
      <HardwareDefinitionProvider
        boards={boards as IBoard[]}
        components={components as IComponent[]}
      >
        {children({
          hardware: <Hardware />,
          bloqs: <Bloqs borndateFilesRoot={borndateFilesRoot} />,
          diagram: <Diagram />
        })}
      </HardwareDefinitionProvider>
    </UpdateContentProvider>
  );
};

const RoboticsRoot: FC<IRoboticsProps> = props => (
  <RecoilRoot>
    <Robotics {...props} />
  </RecoilRoot>
);

export default RoboticsRoot;
