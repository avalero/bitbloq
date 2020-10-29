import React, { FC, useMemo, useRef } from "react";
import { useRecoilCallback, useRecoilState } from "recoil";
import styled from "@emotion/styled";
import { IComponentInstance } from "@bitbloq/bloqs";
import { colors, useTranslate } from "@bitbloq/ui";
import { bloqCategories } from "./config";
import { IBloq, InstructionType } from "./types";
import BloqList from "./BloqList";
import BloqParameter from "./BloqParameter";
import BloqSelect from "./BloqSelect";
import BloqSelectComponent from "./BloqSelectComponent";
import BloqTextInput from "./BloqTextInput";
import {
  getBloq,
  replaceBloqs,
  replaceParameter,
  bloqsState,
  selectedBloqState
} from "./state";
import useBloqsDefinition from "./useBloqsDefinition";
import useUpdateContent from "./useUpdateContent";
import BackgroundInactive from "./images/background-inactive.svg";

export interface IBloqProps {
  bloq: IBloq;
  section: string;
  path: number[];
  parameterPath?: string[];
  readOnly?: boolean;
  inactive?: boolean;
}

const Bloq: FC<IBloqProps> = ({
  bloq,
  section,
  parameterPath = [],
  path,
  readOnly,
  inactive
}) => {
  const t = useTranslate();
  const updateContent = useUpdateContent();
  const { getBloqType } = useBloqsDefinition();

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedBloq, setSelectedBloq] = useRecoilState(selectedBloqState);
  const isSelected = selectedBloq === bloq;

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
      const newSectionBloqs = replaceBloqs(sectionBloqs, path, 1, [
        isParameter
          ? replaceParameter(
              getBloq(sectionBloqs, path),
              parameterPath,
              newBloq
            )
          : newBloq
      ]);
      set(bloqsState, {
        ...bloqs,
        [section]: newSectionBloqs
      });
      updateContent();
    }
  );

  const onClick = (e: React.MouseEvent) => {
    if (readOnly) return;
    e.stopPropagation();
    setSelectedBloq(bloq);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    if (containerRef.current === e.target) {
      e.stopPropagation();
    }
  };

  return (
    <Container
      onClick={onClick}
      onMouseDown={onMouseDown}
      ref={containerRef}
      inactive={inactive}
    >
      {false && <ErrorContainer />}
      <Header>
        {isParameter && (
          <HeaderNodgeWrap>
            {isSelected && <HeaderNodgeSelected />}
            <HeaderNodge
              style={{ backgroundColor: inactive ? "#ffffff" : color }}
            />
          </HeaderNodgeWrap>
        )}
        <HeaderContentWrap>
          {isSelected && (
            <HeaderContentSelected
              style={{ borderBottomLeftRadius: isBlock ? 0 : 4 }}
            />
          )}
          <HeaderContent
            style={{
              backgroundColor: inactive ? "#ffffff" : color,
              borderBottomLeftRadius: isBlock ? 0 : 4,
              pointerEvents: readOnly ? "none" : "all",
              backgroundImage: inactive ? `url(${BackgroundInactive})` : ""
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
                      inactive={inactive}
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
                      inactive={inactive}
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
                      parameterPath={[
                        ...parameterPath,
                        uiElement.parameterName
                      ]}
                    />
                  );
                }

                case "text-input": {
                  return (
                    <BloqTextInput
                      size={2}
                      type={uiElement.inputType || "text"}
                      key={i}
                      value={
                        (bloq.parameters?.[
                          uiElement.parameterName
                        ] as string) || ""
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
        </HeaderContentWrap>
      </Header>
      {isBlock && (
        <>
          <ChildrenWrap>
            <ChildrenLeftWrap>
              {isSelected && <ChildrenLeftSelected />}
              <ChildrenLeft
                style={{
                  backgroundColor: inactive ? "#ffffff" : color,
                  backgroundImage: inactive ? `url(${BackgroundInactive})` : ""
                }}
              />
            </ChildrenLeftWrap>
            <Children>
              <BloqList
                bloqs={children}
                section={section}
                path={[...path, 0]}
                inactive={inactive}
              />
            </Children>
          </ChildrenWrap>
          <FooterWrap>
            {isSelected && <FooterSelected />}
            <Footer
              style={{
                backgroundColor: inactive ? "#ffffff" : color,
                backgroundImage: inactive ? `url(${BackgroundInactive})` : ""
              }}
            />
          </FooterWrap>
        </>
      )}
    </Container>
  );
};

export default Bloq;

const Container = styled.div<{ inactive?: boolean }>`
  display: inline-flex;
  flex-direction: column;
  align-items: start;
  margin-bottom: 2px;
  color: ${props => (props.inactive ? colors.black : "white")};
`;

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const HeaderNodgeWrap = styled.div`
  width: 14px;
  height: 14px;
  display: flex;
  position: relative;
  margin-right: -7px;
`;

const HeaderNodgeSelected = styled.div`
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  background-color: ${colors.black};
  border-radius: 9px;
`;

const HeaderNodge = styled.div`
  position: relative;
  border-radius: 7px;
  overflow: hidden;
  flex: 1;
  z-index: 1;
`;

const HeaderContentWrap = styled.div`
  position: relative;
  display: flex;
  height: 40px;
`;

const HeaderContentSelected = styled.div`
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  background-color: ${colors.black};
  border-radius: 6px;
`;

const HeaderContent = styled.div`
  display: flex;
  position: relative;
  border-radius: 4px;
  padding: 0px 10px;
  font-size: 14px;
  align-items: center;

  > * + * {
    margin-left: 10px;
  }
`;

const ChildrenWrap = styled.div`
  display: flex;
  cursor: pointer;
`;

const ChildrenLeftWrap = styled.div`
  position: relative;
  display: flex;
`;

const ChildrenLeftSelected = styled.div`
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: 0;
  bottom: 0;
  background-color: ${colors.black};
`;

const ChildrenLeft = styled.div`
  position: relative;
  width: 20px;
  z-index: 1;
`;

const Children = styled.div`
  box-sizing: border-box;
  min-height: 40px;
  padding: 2px 2px 18px 2px;
`;

const FooterWrap = styled.div`
  position: relative;
  height: 20px;
  width: 140px;
  display: flex;
`;

const FooterSelected = styled.div`
  content: "";
  position: absolute;
  left: -2px;
  right: -2px;
  top: -2px;
  bottom: -2px;
  background-color: ${colors.black};
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`;

const Footer = styled.div`
  position: relative;
  width: 140px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  border-bottom-left-radius: 4px;
  cursor: pointer;
`;

const Label = styled.div`
  white-space: nowrap;
`;

const ErrorContainer = styled.div`
  position: absolute;
  height: 40px;
  left: 0px;
  right: 0px;
  background-color: #ffd6d6;
`;
