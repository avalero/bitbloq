import React, { FC, useMemo } from "react";
import styled from "@emotion/styled";
import { useTranslate } from "@bitbloq/ui";
import { IBloq, InstructionType } from "./types";
import { bloqCategories } from "./config";
import useBloqsDefinition from "./useBloqsDefinition";

export interface ISymbolProps {
  bloq: IBloq;
}

const Symbol: FC<ISymbolProps> = ({ bloq }) => {
  const t = useTranslate();
  const { getBloqType } = useBloqsDefinition();
  const type = getBloqType(bloq.type);
  const color = useMemo(() => {
    const category = bloqCategories.find(c => c.name === type.category);
    return category?.color || "";
  }, [type]);

  const symbolText = type.diagram?.symbolText ? (
    t(type.diagram.symbolText)
  ) : (
    <>
      {type.uiElements.map((element, i) => (
        <React.Fragment key={i}>
          {element.type === "label" ? t(element.text) : ""}{" "}
        </React.Fragment>
      ))}
    </>
  );

  const isCondition = type.instructionType === InstructionType.Block;

  return (
    <Container isCondition={isCondition}>
      <Background
        style={{ backgroundColor: color }}
        isCondition={isCondition}
      />
      <TextWrap isCondition={isCondition}>
        <SymbolText>{symbolText}</SymbolText>
      </TextWrap>
    </Container>
  );
};

export default Symbol;

const Container = styled.div<{ isCondition: boolean }>`
  position: relative;
  width: ${props => (props.isCondition ? 140 : 120)}px;
  height: ${props => (props.isCondition ? 140 : 80)}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Background = styled.div<{ isCondition: boolean }>`
  width: ${props => (props.isCondition ? 99 : 120)}px;
  height: ${props => (props.isCondition ? 99 : 80)}px;
  transform: ${props => (props.isCondition ? "rotate(45deg)" : "none")};
  border-radius: 4px;
`;

const TextWrap = styled.div<{ isCondition: boolean }>`
  position: absolute;
  width: ${props => (props.isCondition ? 80 : 100)}px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SymbolText = styled.div`
  -webkit-line-clamp: 4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  color: white;
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
`;
