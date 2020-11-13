import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, useTranslate } from "@bitbloq/ui";
import { DIAGRAM_LINE_WIDTH } from "./config";
import { IDiagramItem } from "./types";
import DiagramCondition from "./DiagramCondition";
import Symbol from "./Symbol";

interface IDiagramLineProps {
  items: IDiagramItem[];
}

const getOffset = (items: IDiagramItem[]) =>
  items.reduce(
    (acc, item) => {
      if (item.type === "condition") {
        const [leftOffset, leftColumns] = getOffset(item.leftItems);
        const [rightOffset, rightColumns] = getOffset(item.rightItems);
        const columns = leftColumns + rightColumns;
        const offset =
          (rightOffset + leftColumns - leftOffset) / 2 + leftOffset;
        return [Math.max(acc[0], offset), Math.max(acc[1], columns)];
      } else {
        return acc;
      }
    },
    [1 / 2, 1]
  );

const DiagramLine: FC<IDiagramLineProps> = ({ items }) => {
  const t = useTranslate();
  const [offset, columns] = getOffset(items);
  const translateX = (offset - columns / 2) * DIAGRAM_LINE_WIDTH;

  return (
    <Container>
      {items.length > 0 ? (
        items.map((item, i) => (
          <>
            <Arrow style={{ transform: `translateX(${translateX}px)` }} />
            {item.type === "symbol" ? (
              <Symbol key={i} bloq={item.bloq} />
            ) : item.type === "switch" ? (
              <div />
            ) : (
              <DiagramCondition diagram={item} offset={translateX} />
            )}
            <Line style={{ transform: `translateX(${translateX}px)` }} />
          </>
        ))
      ) : (
        <SymbolPlaceholder>{t("robotics.drop-symbol-here")}</SymbolPlaceholder>
      )}
    </Container>
  );
};

export default DiagramLine;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: ${DIAGRAM_LINE_WIDTH}px;
  box-sizing: border-box;
`;

const Line = styled.div`
  height: 26px;
  background-color: #bbb;
  width: 2px;
`;

const Arrow = styled.div`
  border-color: #bbb transparent transparent transparent;
  border-width: 14px 7px 0px 7px;
  border-style: solid;
`;

const SymbolPlaceholder = styled.div`
  background-color: ${colors.gray1};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23bbb' stroke-width='4' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  color: #bbb;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.2;
  width: 120px;
  height: 80px;
  position: absolute;
  transform: translate(-50%, 0);
`;
