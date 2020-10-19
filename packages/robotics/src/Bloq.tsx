import React, { FC, useMemo } from "react";
import { useRecoilCallback } from "recoil";
import styled from "@emotion/styled";
import { IComponentInstance } from "@bitbloq/bloqs";
import { useTranslate } from "@bitbloq/ui";
import { bloqCategories } from "./config";
import { IBloq, InstructionType } from "./types";
import BloqList from "./BloqList";
import BloqParameter from "./BloqParameter";
import BloqSelect from "./BloqSelect";
import BloqSelectComponent from "./BloqSelectComponent";
import BloqTextInput from "./BloqTextInput";
import { getBloq, replaceBloqs, bloqsState } from "./state";
import useBloqsDefinition from "./useBloqsDefinition";
import useUpdateContent from "./useUpdateContent";

export interface IBloqProps {
  bloq: IBloq;
  section: string;
  path: number[];
  parameterName?: string;
}

const Bloq: FC<IBloqProps> = ({ bloq, section, parameterName, path }) => {
  const t = useTranslate();
  const updateContent = useUpdateContent();
  const { getBloqType } = useBloqsDefinition();

  const type = getBloqType(bloq.type);

  const color = useMemo(() => {
    const category = bloqCategories.find(c => c.name === type.category);
    return category?.color || "";
  }, [type]);

  const { children = [] } = bloq;

  const isBlock = type.instructionType === InstructionType.Block;
  const isParameter = type.instructionType === InstructionType.Parameter;

  const onBloqChange = useRecoilCallback(
    ({ set, snapshot }) => async (newBloq: IBloq) => {
      const bloqs = await snapshot.getPromise(bloqsState);
      const sectionBloqs = bloqs[section];
      let updatedBloq;
      if (isParameter && parameterName) {
        const parentBloq = getBloq(sectionBloqs, path);
        updatedBloq = {
          ...parentBloq,
          parameters: {
            ...(parentBloq.parameters || {}),
            [parameterName]: newBloq
          }
        };
      } else {
        updatedBloq = newBloq;
      }
      console.log("UPDATE BLOQ", updatedBloq);
      const newSectionBloqs = replaceBloqs(sectionBloqs, path, 1, [
        updatedBloq
      ]);
      set(bloqsState, {
        ...bloqs,
        [section]: newSectionBloqs
      });
      updateContent();
    }
  );

  return (
    <Container>
      {false && <ErrorContainer />}
      <Header>
        {isParameter && <HeaderNodge style={{ backgroundColor: color }} />}
        <HeaderContent
          style={{
            backgroundColor: color,
            borderBottomLeftRadius: isBlock ? 0 : 4
          }}
        >
          {type.uiElements.map((uiElement, i) => {
            switch (uiElement.type) {
              case "label":
                return <Label key={i}>{t(uiElement.text)}</Label>;

              case "select": {
                return (
                  <BloqSelect
                    key={i}
                    options={uiElement.options.map(option => ({
                      value: option.value,
                      label: t(option.label)
                    }))}
                    value={bloq.parameters?.[uiElement.parameterName]}
                    onChange={newValue =>
                      onBloqChange({
                        ...bloq,
                        parameters: {
                          ...(bloq.parameters || {}),
                          [uiElement.parameterName]: newValue
                        }
                      })
                    }
                  />
                );
              }

              case "select-component": {
                return (
                  <BloqSelectComponent
                    key={i}
                    componentTypes={uiElement.componentTypes}
                    value={
                      bloq.parameters?.[uiElement.parameterName] as
                        | IComponentInstance
                        | undefined
                    }
                    onChange={newValue =>
                      onBloqChange({
                        ...bloq,
                        parameters: {
                          ...(bloq.parameters || {}),
                          [uiElement.parameterName]: newValue
                        }
                      })
                    }
                  />
                );
              }

              case "parameter": {
                return (
                  <BloqParameter
                    key={i}
                    bloq={bloq}
                    section={section}
                    path={path}
                    parameterName={uiElement.parameterName}
                  />
                );
              }

              case "text-input": {
                return (
                  <BloqTextInput
                    size={2}
                    type="text"
                    key={i}
                    value={
                      (bloq.parameters?.[uiElement.parameterName] as string) ||
                      ""
                    }
                    onChange={e =>
                      onBloqChange({
                        ...bloq,
                        parameters: {
                          ...(bloq.parameters || {}),
                          [uiElement.parameterName]: e.target.value
                        }
                      })
                    }
                  />
                );
              }

              default:
                return null;
            }
          })}
        </HeaderContent>
      </Header>
      {isBlock && (
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
  position: relative;
  display: flex;
  align-items: center;
`;

const HeaderNodge = styled.div`
  border-radius: 7px;
  width: 14px;
  height: 14px;
  overflow: hidden;
  margin-right: -7px;
`;

const HeaderContent = styled.div`
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
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
`;

const Label = styled.div`
  color: white;
  white-space: nowrap;
`;

const ErrorContainer = styled.div`
  position: absolute;
  height: 40px;
  left: 0px;
  right: 0px;
  background-color: #ffd6d6;
`;
