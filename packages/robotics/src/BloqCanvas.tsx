import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, Droppable, useTranslate } from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import { bloqsState, BloqSection } from "./state";
import Bloq from "./Bloq";
import bloqs from "../config/bloqs.yml";

interface IBloqCanvasProps {
  section: BloqSection;
}

const bloqsMap = bloqs.reduce(
  (acc, bloq) => ({ ...acc, [bloq.name]: bloq }),
  {}
);

const BloqCanvas: FC<IBloqCanvasProps> = ({ section }) => {
  const t = useTranslate();

  const bloqs = useRecoilValue(bloqsState);
  const sectionBloqs = bloqs[section];

  return (
    <Container>
      {sectionBloqs.length > 0 ? (
        sectionBloqs.map((bloq, i) => (
          <Bloq key={`section-bloq-${i}`} type={bloqsMap[bloq.type]} />
        ))
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
