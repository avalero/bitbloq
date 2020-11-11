import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import {
  colors,
  DragAndDropProvider,
  Droppable,
  useTranslate
} from "@bitbloq/ui";
import BloqsTabs from "./BloqsTabs";
import CodeViewer from "./CodeViewer";
import DiagramCanvas from "./DiagramCanvas";
import ExpandablePanel from "./ExpandablePanel";
import Toolbar from "./Toolbar";
import { BloqSection } from "./state";

export interface IDiagramProps {
  borndateFilesRoot: string;
}

const Diagram: FC<IDiagramProps> = ({ borndateFilesRoot }) => {
  const t = useTranslate();

  const [viewCode, setViewCode] = useState(false);

  const onDrag = ({ draggableData, x, y }) => {
    return null;
  };

  const onDragStart = ({ draggableData }) => {
    return null;
  };

  const onDragEnd = () => {
    return null;
  };

  const onDrop = ({ draggableData, droppableData, x, y }) => {
    return null;
  };

  return (
    <DragAndDropProvider
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDrop={onDrop}
    >
      <Container>
        <Main>
          <Toolbar borndateFilesRoot={borndateFilesRoot} />
          <DiagramContent>
            <ExpandablePanel
              title={t("robotics.global-variables-and-functions")}
            >
              <DiagramCanvas section={BloqSection.Global} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.setup-instructions")}>
              <DiagramCanvas section={BloqSection.Setup} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.main-loop")} startsOpen>
              <DiagramCanvas section={BloqSection.Loop} />
            </ExpandablePanel>
          </DiagramContent>
        </Main>
        <BloqsTabs
          onViewCode={() => setViewCode(true)}
          viewingCode={viewCode}
          symbol
        />
        {viewCode && <CodeViewer onClose={() => setViewCode(false)} />}
      </Container>
    </DragAndDropProvider>
  );
};

export default Diagram;

const Container = styled.div`
  flex: 1;
  display: flex;
  max-width: 100%;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const DiagramContent = styled(Droppable)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;
`;
