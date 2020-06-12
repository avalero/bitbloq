import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import { useTranslate } from "@bitbloq/ui";
import { RecoilRoot } from "recoil";
import Hardware from "./Hardware";
import Bloqs from "./Bloqs";
import Diagram from "./Diagram";
import { IRoboticsContent } from "./index";
import { HardwareDefinitionProvider } from "./useHardwareDefinition";

import boardsJSON from "./boards";
import componentsJSON from "./components";

const boards = boardsJSON as IBoard[];
const components = componentsJSON as IComponent[];

export interface IRoboticsCallbackProps {
  hardware: React.ReactElement;
  bloqs: React.ReactElement;
  diagram: React.ReactElement;
}

export interface IRoboticsProps {
  initialContent?: Partial<IRoboticsContent>;
  onContentChange: (content: any) => any;
  children: (props: IRoboticsCallbackProps) => React.ReactElement;
}

const Robotics: FC<IRoboticsProps> = ({
  children,
  initialContent,
  onContentChange
}) => {
  const t = useTranslate();
  const [content, setContent] = useState(initialContent);

  const [undoPast, setUndoPast] = useState<any[]>([]);
  const [undoFuture, setUndoFuture] = useState<any[]>([]);

  const updateContent = (newContent: IRoboticsContent) => {
    setUndoPast([content, ...undoPast]);
    setUndoFuture([]);
    setContent(newContent);
  };

  const undo = () => {
    setUndoPast(undoPast.slice(1));
    setUndoFuture([content, ...undoFuture]);
    setContent(undoPast[0]);
  };

  const redo = () => {
    setUndoPast([content, ...undoPast]);
    setUndoFuture(undoFuture.slice(1));
    setContent(undoFuture[0]);
  };

  useEffect(() => {
    if (content !== initialContent) {
      onContentChange(content);
    }
  }, [content]);

  return (
    <HardwareDefinitionProvider boards={boards} components={components}>
      {children({
        hardware: (
          <Hardware
            hardware={content && content.hardware ? content.hardware : {}}
            onChange={hardware => updateContent({ ...content, hardware })}
          />
        ),
        bloqs: <Bloqs />,
        diagram: <Diagram />
      })}
    </HardwareDefinitionProvider>
  );
};

const RoboticsRoot: FC<IRoboticsProps> = props => (
  <RecoilRoot>
    <Robotics {...props} />
  </RecoilRoot>
);

export default RoboticsRoot;
