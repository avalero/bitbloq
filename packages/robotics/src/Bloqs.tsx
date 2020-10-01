import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import {
  breakpoints,
  colors,
  DragAndDropProvider,
  Draggable,
  Icon,
  Tabs,
  useTranslate
} from "@bitbloq/ui";
import {
  useRecoilState,
  useSetRecoilState,
  useResetRecoilState,
  useRecoilCallback
} from "recoil";
import { IBloqType, InstructionType } from "./types";
import { bloqCategories } from "./config";
import {
  boardState,
  bloqsState,
  componentsState,
  draggingBloqsState,
  isDraggingParameterState,
  BloqSection,
  replaceBloqs
} from "./state";
import bloqs from "../config/bloqs.yml";
import Bloq from "./Bloq";
import BloqCanvas from "./BloqCanvas";
import DraggingBloq from "./DraggingBloq";
import ExpandablePanel from "./ExpandablePanel";
import { getCode } from "./code-generation";

const categoryBloqs: Record<string, IBloqType[]> = bloqCategories.reduce(
  (acc, category) => ({
    ...acc,
    [category.name]: bloqs.filter(bloq => bloq.category === category.name)
  }),
  {}
);

const Bloqs: FC = () => {
  const t = useTranslate();

  const setDraggingBloq = useSetRecoilState(draggingBloqsState);
  const setIsDraggingParameter = useSetRecoilState(isDraggingParameterState);
  const resetDraggingBloq = useResetRecoilState(draggingBloqsState);
  const [bloqs, setBloqs] = useRecoilState(bloqsState);

  useEffect(() => {
    console.log(bloqs);
  }, [bloqs]);

  const bloqsTabs = bloqCategories.map(category => ({
    icon: category.icon ? (
      <Icon name={category.icon} />
    ) : (
      t(category.iconText || "")
    ),
    label: t(category.label),
    content: (
      <BloqsTab>
        {categoryBloqs[category.name].map(bloqType => (
          <Draggable
            data={{ bloqs: [{ type: bloqType.name }] }}
            draggableHeight={0}
            draggableWidth={0}
            key={bloqType.name}
            onDragStart={({ x, y }) => {
              setIsDraggingParameter(
                bloqType.instructionType === InstructionType.Parameter
              );
              setDraggingBloq({ x, y, bloqs: [{ type: bloqType.name }] });
            }}
            onDrag={({ x, y }) =>
              setDraggingBloq({ x, y, bloqs: [{ type: bloqType.name }] })
            }
            onDragEnd={() => resetDraggingBloq()}
          >
            {props => (
              <BloqWrap {...props}>
                <Bloq bloq={{ type: bloqType.name }} section="" path={[0]} />
              </BloqWrap>
            )}
          </Draggable>
        ))}
      </BloqsTab>
    ),
    color: category.color
  }));

  const onDrop = ({ draggableData, droppableData }) => {
    if (droppableData.type === "bloq-droppable") {
      const sectionBloqs = draggableData.section
        ? replaceBloqs(
            bloqs[draggableData.section],
            draggableData.path,
            draggableData.bloqs.length,
            []
          )
        : bloqs[droppableData.section];
      const newSectionBloqs = replaceBloqs(
        sectionBloqs,
        droppableData.path,
        0,
        draggableData.bloqs
      );
      setBloqs({
        ...bloqs,
        [droppableData.section]: newSectionBloqs
      });
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
    }
  };

  const onUpload = useRecoilCallback(({ snapshot }) => async () => {
    const board = await snapshot.getPromise(boardState);
    const components = await snapshot.getPromise(componentsState);
    const bloqs = await snapshot.getPromise(bloqsState);

    if (!board) {
      return;
    }

    const code = getCode(board.name, components, bloqs);
    console.log(code);
  });

  return (
    <DragAndDropProvider onDrop={onDrop}>
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
              <ToolbarGreenButton>
                <Icon name="tick" />
              </ToolbarGreenButton>
              <ToolbarGreenButton onClick={onUpload}>
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
        <Tabs tabs={bloqsTabs} />
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

const BloqsTab = styled.div`
  box-sizing: border-box;
  padding: 20px;
  width: 320px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 350px;
  }
`;

const BloqWrap = styled.div`
  display: inline-block;
`;
