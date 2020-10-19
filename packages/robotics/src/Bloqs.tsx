import React, { FC } from "react";
import styled from "@emotion/styled";
import {
  breakpoints,
  colors,
  DragAndDropProvider,
  Icon,
  useTranslate
} from "@bitbloq/ui";
import { InstructionType } from "./types";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  bloqsState,
  BloqSection,
  draggingBloqsState,
  isDraggingParameterState,
  replaceBloqs
} from "./state";
import BloqCanvas from "./BloqCanvas";
import BloqsTabs from "./BloqsTabs";
import DraggingBloq from "./DraggingBloq";
import ExpandablePanel from "./ExpandablePanel";
import useCodeGeneration from "./useCodeGeneration";
import useBloqsDefinition from "./useBloqsDefinition";
import useUpdateContent from "./useUpdateContent";

export interface IBloqsProps {
  borndateFilesRoot: string;
}

const Bloqs: FC<IBloqsProps> = ({ borndateFilesRoot }) => {
  const t = useTranslate();
  const updateContent = useUpdateContent();
  const { getBloqType } = useBloqsDefinition();

  const setDraggingBloq = useSetRecoilState(draggingBloqsState);
  const setIsDraggingParameter = useSetRecoilState(isDraggingParameterState);
  const resetDraggingBloq = useResetRecoilState(draggingBloqsState);

  const { compile, upload } = useCodeGeneration({
    filesRoot: borndateFilesRoot
  });
  const [bloqs, setBloqs] = useRecoilState(bloqsState);

  const onDragStart = ({ draggableData }) => {
    if (draggableData.bloqs && draggableData.bloqs.length) {
      const bloqType = getBloqType(draggableData.bloqs[0].type);
      setIsDraggingParameter(
        bloqType.instructionType === InstructionType.Parameter
      );
      if (draggableData.type === "bloq-list") {
        setBloqs({
          ...bloqs,
          [draggableData.section]: replaceBloqs(
            bloqs[draggableData.section],
            draggableData.path,
            draggableData.bloqs.length,
            []
          )
        });
      }
    }
  };

  const onDrag = ({ draggableData, x, y }) => {
    const { bloqs } = draggableData;
    if (bloqs) {
      setDraggingBloq({ x, y, bloqs });
    }
  };

  const onDragEnd = () => {
    resetDraggingBloq();
  };

  const onDrop = ({ draggableData, droppableData }) => {
    if (droppableData.type === "bloq-droppable") {
      const newSectionBloqs = replaceBloqs(
        bloqs[droppableData.section],
        droppableData.path,
        0,
        draggableData.bloqs
      );
      setBloqs({
        ...bloqs,
        [droppableData.section]: newSectionBloqs
      });
      updateContent();
    }
    if (droppableData.type === "bloq-parameter") {
      const sectionBloqs = bloqs[droppableData.section];
      const newSectionBloqs = replaceBloqs(
        sectionBloqs,
        droppableData.path,
        1,
        [
          {
            ...droppableData.bloq,
            parameters: {
              ...droppableData.bloq.parameters,
              [droppableData.parameterName]: draggableData.bloqs[0]
            }
          }
        ]
      );
      setBloqs({
        ...bloqs,
        [droppableData.section]: newSectionBloqs
      });
      updateContent();
    }
    if (droppableData.type === "initial-placeholder") {
      setBloqs({
        ...bloqs,
        [droppableData.section]: draggableData.bloqs
      });
      updateContent();
    }
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
          <Toolbar>
            <ToolbarLeft>
              <ToolbarButton>
                <Icon name="undo" />
              </ToolbarButton>
              <ToolbarButton>
                <Icon name="redo" />
              </ToolbarButton>
            </ToolbarLeft>
            <ToolbarRight>
              <ToolbarGreenButton onClick={compile}>
                <Icon name="tick" />
              </ToolbarGreenButton>
              <ToolbarGreenButton onClick={upload}>
                <UploadIcon name="arrow" />
              </ToolbarGreenButton>
            </ToolbarRight>
          </Toolbar>
          <BloqsContent>
            <ExpandablePanel
              title={t("robotics.global-variables-and-functions")}
              startsOpen
            >
              <BloqCanvas section={BloqSection.Global} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.setup-instructions")}>
              <BloqCanvas section={BloqSection.Setup} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.main-loop")}>
              <BloqCanvas section={BloqSection.Loop} />
            </ExpandablePanel>
          </BloqsContent>
        </Main>
        <BloqsTabs />
        <DraggingBloq />
      </Container>
    </DragAndDropProvider>
  );
};

export default Bloqs;

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.gray3};
  height: 40px;
  padding: 0 20px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const ToolbarLeft = styled.div`
  display: flex;
  flex: 1;
`;

const ToolbarRight = styled.div`
  display: flex;
`;

const ToolbarButton = styled.div`
  width: 40px;
  background-color: #ebebeb;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  margin-right: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 60px;
  }
`;

const ToolbarGreenButton = styled(ToolbarButton)`
  background-color: ${colors.green};
  color: white;
  border-color: white;
`;

const UploadIcon = styled(Icon)`
  transform: rotate(90deg);
`;

const BloqsContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;
