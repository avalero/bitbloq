import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { DragAndDropProvider, Droppable, useTranslate } from "@bitbloq/ui";
import { InstructionType } from "./types";
import { useRecoilState, useResetRecoilState, useSetRecoilState } from "recoil";
import {
  bloqsState,
  BloqSection,
  detachedBloqsState,
  draggingBloqsState,
  isDraggingParameterState,
  getBloq,
  replaceBloqs,
  replaceParameter
} from "./state";
import BloqCanvas from "./BloqCanvas";
import BloqList from "./BloqList";
import BloqsTabs from "./BloqsTabs";
import CodeViewer from "./CodeViewer";
import DraggingBloq from "./DraggingBloq";
import ExpandablePanel from "./ExpandablePanel";
import Toolbar from "./Toolbar";
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

  const [viewCode, setViewCode] = useState(false);

  const [bloqs, setBloqs] = useRecoilState(bloqsState);
  const [detachedBloqs, setDetachedBloqs] = useRecoilState(detachedBloqsState);

  const onDragStart = ({ draggableData }) => {
    if (draggableData.bloqs && draggableData.bloqs.length) {
      const bloqType = getBloqType(draggableData.bloqs[0].type);
      setIsDraggingParameter(
        bloqType.instructionType === InstructionType.Parameter
      );
      if (draggableData.type === "bloq-list") {
        if (draggableData.section === "detached") {
          setDetachedBloqs(
            detachedBloqs.filter((b, i) => i !== draggableData.path[0])
          );
        } else {
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
      if (draggableData.type === "bloq-parameter") {
        setBloqs({
          ...bloqs,
          [draggableData.section]: replaceBloqs(
            bloqs[draggableData.section],
            draggableData.path,
            1,
            [
              replaceParameter(
                getBloq(bloqs[draggableData.section], draggableData.path),
                draggableData.parameterPath,
                undefined
              )
            ]
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

  const onDrop = ({ draggableData, droppableData, x, y }) => {
    if (droppableData.type === "bloq-droppable") {
      if (droppableData.section === "detached") {
        const [index, ...path] = droppableData.path;
        const newDetachedBloqs = replaceBloqs(
          detachedBloqs[index].bloqs,
          path,
          0,
          draggableData.bloqs
        );
        setDetachedBloqs(
          detachedBloqs.map((d, i) =>
            i === index ? { ...d, bloqs: newDetachedBloqs } : d
          )
        );
      } else {
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
    }
    if (droppableData.type === "bloq-parameter") {
      const sectionBloqs = bloqs[droppableData.section];
      const newSectionBloqs = replaceBloqs(
        sectionBloqs,
        droppableData.path,
        1,
        [
          replaceParameter(
            getBloq(sectionBloqs, droppableData.path),
            droppableData.parameterPath,
            draggableData.bloqs[0]
          )
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
    if (droppableData.type === "main") {
      setDetachedBloqs([
        ...detachedBloqs,
        { bloqs: draggableData.bloqs, x, y }
      ]);
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
          <Toolbar borndateFilesRoot={borndateFilesRoot} />
          <BloqsContent data={{ type: "main" }} priority={-1}>
            <ExpandablePanel
              title={t("robotics.global-variables-and-functions")}
            >
              <BloqCanvas section={BloqSection.Global} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.setup-instructions")}>
              <BloqCanvas section={BloqSection.Setup} />
            </ExpandablePanel>
            <ExpandablePanel title={t("robotics.main-loop")} startsOpen>
              <BloqCanvas section={BloqSection.Loop} />
            </ExpandablePanel>
            {detachedBloqs.map(({ x, y, bloqs }, i) => (
              <DetachedBloq
                key={`detached-bloq-${i}`}
                style={{ transform: `translate(${x}px, ${y}px)` }}
              >
                <BloqList
                  bloqs={bloqs}
                  section="detached"
                  path={[i, 0]}
                  inactive
                />
              </DetachedBloq>
            ))}
          </BloqsContent>
        </Main>
        <BloqsTabs
          onViewCode={() => setViewCode(true)}
          viewingCode={viewCode}
        />
        {viewCode && <CodeViewer onClose={() => setViewCode(false)} />}
        <DraggingBloq />
      </Container>
    </DragAndDropProvider>
  );
};

export default Bloqs;

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

const BloqsContent = styled(Droppable)`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  position: relative;
`;

const DetachedBloq = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;
