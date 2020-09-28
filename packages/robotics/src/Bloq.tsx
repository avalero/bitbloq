import React, { FC, useMemo } from "react";
import styled from "@emotion/styled";
import { Select, useTranslate } from "@bitbloq/ui";
import { bloqCategories } from "./config";
import { IBloq, InstructionType } from "./types";
import bloqs from "../config/bloqs.yml";
import BloqList from "./BloqList";

const bloqsMap = bloqs.reduce(
  (acc, bloq) => ({ ...acc, [bloq.name]: bloq }),
  {}
);

export interface IBloqProps {
  bloq: IBloq;
  section: string;
  path: number[];
}

const Bloq: FC<IBloqProps> = ({ bloq, section, path }) => {
  const t = useTranslate();

  const type = bloqsMap[bloq.type];

  const color = useMemo(() => {
    const category = bloqCategories.find(c => c.name === type.category);
    return category?.color || "";
  }, [type]);

  const { children = [] } = bloq;

  return (
    <Container>
      <Header
        style={{
          backgroundColor: color
        }}
      >
        {type.uiElements.map((uiElement, i) => {
          switch (uiElement.type) {
            case "label":
              return <Label key={i}>{t(uiElement.text)}</Label>;

            case "select":
              return (
                <Select
                  key={i}
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
              <BloqList
                bloqs={children}
                section={section}
                path={[...path, 0]}
              />
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
  margin-bottom: 2px;
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
  width: 20px;
`;

const Children = styled.div`
  box-sizing: border-box;
  min-height: 40px;
  padding: 2px 2px 18px 2px;
`;

const Footer = styled.div`
  height: 20px;
  width: 140px;
`;

const Label = styled.div`
  color: white;
`;
