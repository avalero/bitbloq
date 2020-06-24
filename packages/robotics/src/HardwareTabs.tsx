import React, { FC, useMemo } from "react";
import styled from "@emotion/styled";
import { IBoard, IComponent, IComponentInstance } from "@bitbloq/bloqs";
import { breakpoints, Draggable, Icon, Tabs, useTranslate } from "@bitbloq/ui";
import { useSetRecoilState } from "recoil";
import { draggingInstanceState } from "./state";
import useHardwareDefinition from "./useHardwareDefinition";

export interface IHardwareTabsProps {
  selectedBoard?: IBoard;
}

const HardwareTabs: FC<IHardwareTabsProps> = ({ selectedBoard }) => {
  const t = useTranslate();
  const { boards, components } = useHardwareDefinition();
  const setDraggingInstance = useSetRecoilState<IComponentInstance>(
    draggingInstanceState
  );

  const compatibleComponents = useMemo(
    () =>
      selectedBoard
        ? components.filter(component =>
            component.connectors.some(connector =>
              selectedBoard.ports.some(port =>
                port.connectorTypes.includes(connector.type)
              )
            )
          )
        : [],
    [selectedBoard, components]
  );

  const componentsContent = useMemo(
    () => (
      <Content>
        <Header>{t("robotics.components")}</Header>
        <Items>
          {compatibleComponents.map(component => (
            <ComponentWrap key={component.name}>
              <Draggable
                data={{ component }}
                onDragStart={params =>
                  setDraggingInstance({
                    component: component.name,
                    x: params.x,
                    y: params.y
                  })
                }
                onDrag={params =>
                  setDraggingInstance({
                    component: component.name,
                    x: params.x,
                    y: params.y
                  })
                }
                onDragEnd={() => setDraggingInstance({ component: "" })}
              >
                {props => (
                  <Component {...props}>
                    <img
                      src={component.image.url}
                      width={component.image.width}
                      height={component.image.height}
                      alt={component.label}
                    />
                  </Component>
                )}
              </Draggable>
              <p>{t(component.label || "")}</p>
            </ComponentWrap>
          ))}
        </Items>
      </Content>
    ),
    [compatibleComponents]
  );

  const boardsContent = useMemo(
    () => (
      <Content>
        <Header>{t("robotics.boards")}</Header>
        <Items>
          {boards.map(board => (
            <Board key={board.name}>
              <Draggable data={{ board }}>
                {props => (
                  <div {...props}>
                    <BoardImage src={board.image.url} />
                  </div>
                )}
              </Draggable>
              <p>{board.label}</p>
            </Board>
          ))}
        </Items>
      </Content>
    ),
    [boards]
  );

  return (
    <Tabs
      tabs={[
        {
          icon: <Icon name="board" />,
          label: t("robotics.boards"),
          content: boardsContent
        },
        {
          icon: <Icon name="led-on" />,
          label: t("robotics.components"),
          content: componentsContent
        },
        {
          icon: <Icon name="robot" />,
          label: t("robotics.robots"),
          content: <div>Robots</div>
        }
      ]}
    />
  );
};

export default HardwareTabs;

const Content = styled.div`
  overflow-y: auto;
  min-width: 220px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-width: 250px;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  height: 40px;
  font-size: 16px;
  font-weight: 500;
  padding-left: 20px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const Items = styled.div`
  padding: 10px 20px;
`;

const Board = styled.div`
  cursor: pointer;
  margin-bottom: 25px;

  p {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const BoardImage = styled.img`
  width: 180px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 210px;
  }
`;

const ComponentWrap = styled.div`
  cursor: pointer;
  margin-bottom: 25px;
  p {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const ComponentDraggable = styled(Draggable)`
  display: inline-block;
`;

const Component = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  padding: 10px;

  img {
    margin: 10px;
    pointer-events: none;
  }
`;
