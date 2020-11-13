import React, { FC } from "react";
import styled from "@emotion/styled";
import { DIAGRAM_LINE_WIDTH } from "./config";
import { IDiagramCondition, IDiagramItem } from "./types";
import Symbol from "./Symbol";
import DiagramLine from "./DiagramLine";

interface IDiagramConditionProps {
  diagram: IDiagramCondition;
  offset?: number;
}

const DiagramCondition: FC<IDiagramConditionProps> = ({ diagram, offset }) => {
  return (
    <Container>
      <Top style={{ transform: `translateX(${offset}px)` }}>
        <Symbol bloq={diagram.bloq} />
        <TopLine />
      </Top>
      <Lines>
        <DiagramLine items={diagram.leftItems} />
        <DiagramLine items={diagram.rightItems} />
      </Lines>
    </Container>
  );
};

export default DiagramCondition;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Top = styled.div`
  position: relative;
`;

const TopLine = styled.div`
  position: absolute;
  top: 69px;
  border-top: 2px solid #bbb;
  border-radius: 3px 3px 0 0;
  width: 100%;
  height: 3px;
  box-sizing: border-box;
`;

const Lines = styled.div`
  display: flex;
`;
