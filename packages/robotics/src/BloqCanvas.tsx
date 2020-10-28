import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, Droppable, useTranslate } from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import { bloqsState, BloqSection } from "./state";
import BloqList from "./BloqList";

interface IBloqCanvasProps {
  section: BloqSection;
}

const BloqCanvas: FC<IBloqCanvasProps> = ({ section }) => {
  const t = useTranslate();

  const bloqs = useRecoilValue(bloqsState);
  const sectionBloqs = bloqs[section];

  return (
    <Container>
      {sectionBloqs.length > 0 ? (
        <BloqList bloqs={sectionBloqs} section={section} path={[0]} />
      ) : (
        <InitialDroppable
          data={{ type: "initial-placeholder", section }}
          margin={20}
        >
          {bloq => (
            <InitialPlaceholder active={!!bloq}>
              {t("robotics.drop-bloq-here")}
            </InitialPlaceholder>
          )}
        </InitialDroppable>
      )}
    </Container>
  );
};

export default BloqCanvas;

const Container = styled.div`
  padding: 20px;
  min-height: 260px;
  position: relative;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const InitialDroppable = styled(Droppable)`
  display: inline-block;
`;

const InitialPlaceholder = styled.div<{ active: boolean }>`
  padding: 12px 20px;
  color: ${props => (props.active ? colors.black : "#bbbbbb")};
  font-style: italic;
  border: dashed 2px ${props => (props.active ? colors.black : "#bbbbbb")};
  font-size: 14px;
`;
