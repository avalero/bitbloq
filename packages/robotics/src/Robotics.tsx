import React, { FC, useEffect } from "react";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import { RecoilRoot, useRecoilCallback } from "recoil";
import Hardware from "./Hardware";
import Bloqs from "./Bloqs";
import Diagram from "./Diagram";
import { IRoboticsContent } from "./types";
import { BloqsDefinitionProvider } from "./useBloqsDefinition";
import { HardwareDefinitionProvider } from "./useHardwareDefinition";
import { UpdateContentProvider } from "./useUpdateContent";
import {
  bloqsState,
  boardState,
  componentWithIdState,
  componentListState
} from "./state";
import { IBloqType, BloqCategory } from "./types";

import bloqs from "../config/bloqs.yml";
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
        const { board, components } = initialContent.hardware;
        set(boardState, {
          name: board || "",
          width: 0,
          height: 0
        });
        components?.forEach(component =>
          set(componentWithIdState(component.id || ""), component)
        );
        set(
          componentListState,
          components?.map(c => c.id || "")
        );
      }
      if (initialContent.bloqs) {
        set(bloqsState, initialContent.bloqs);
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
        <BloqsDefinitionProvider
          bloqTypes={bloqs as IBloqType[]}
          categories={Object.values(BloqCategory)}
        >
          {children({
            hardware: <Hardware />,
            bloqs: <Bloqs borndateFilesRoot={borndateFilesRoot} />,
            diagram: <Diagram />
          })}
        </BloqsDefinitionProvider>
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
