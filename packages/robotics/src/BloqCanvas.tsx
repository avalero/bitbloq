import React, { FC } from "react";
import styled from "@emotion/styled";
import { Droppable, useTranslate } from "@bitbloq/ui";

const BloqCanvas: FC = () => {
  const t = useTranslate();

  return (
    <Container>
      <InitialPlaceholder>{t("robotics.drop-bloq-here")}</InitialPlaceholder>
    </Container>
  );
};

export default BloqCanvas;

const Container = styled.div`
  padding: 20px;
  min-height: 260px;
`;

const InitialPlaceholder = styled.div`
  padding: 12px 20px;
  color: #bbbbbb;
  font-style: italic;
  border: dashed 2px #bbbbbb;
  font-size: 14px;
  display: inline-block;
`;
