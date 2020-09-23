import React, { FC, useMemo } from "react";
import styled from "@emotion/styled";
import { colors, Droppable, Select, useTranslate } from "@bitbloq/ui";
import { bloqCategories } from "./config";
import { IBloqType, InstructionType } from "./types";

export interface IBloqProps {
  type: IBloqType;
}

const Bloq: FC<IBloqProps> = ({ type }) => {
  const t = useTranslate();

  const color = useMemo(() => {
    const category = bloqCategories.find(c => c.name === type.category);
    return category?.color || "";
  }, [type]);

  return (
    <Container>
      <Header
        style={{
          backgroundColor: color
        }}
      >
        {type.uiElements.map(uiElement => {
          switch (uiElement.type) {
            case "label":
              return <Label>{t(uiElement.text)}</Label>;

            case "select":
              return (
                <Select
                  options={uiElement.options.map(option => ({
                    value: option.value,
                    label: t("option.label")
                  }))}
                />
              );

            default:
              return null;
          }
        })}
      </Header>
      {type.instructionType === InstructionType.Block && (
        <>
          <ChildrenWrap>
            <ChildrenLeft style={{ backgroundColor: color }} />
            <Children>
              <Droppable margin={20}>
                {active => (
                  <BloqDroppable>{active && <DropIndicator />}</BloqDroppable>
                )}
              </Droppable>
            </Children>
          </ChildrenWrap>
          <Footer style={{ backgroundColor: color }} />
        </>
      )}
    </Container>
  );
};

export default Bloq;

const Container = styled.div`
  display: inline-block;
`;

const Header = styled.div`
  display: flex;
  border-radius: 4px;
  padding: 0px 10px;
  font-size: 14px;
  height: 40px;
  align-items: center;

  > * + * {
    margin-left: 10px;
  }
`;

const ChildrenWrap = styled.div`
  display: flex;
`;

const ChildrenLeft = styled.div`
  height: 40px;
  width: 20px;
`;

const Children = styled.div`
  padding: 4px;
`;

const BloqDroppable = styled.div`
  height: 32px;
  width: 180px;
`;

const DropIndicator = styled.div`
  height: 6px;
  background-color: ${colors.black};
  border-radius: 3px;
`;

const Footer = styled.div`
  height: 20px;
  width: 140px;
`;

const Label = styled.div`
  color: white;
`;
