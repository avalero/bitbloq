import React, { FC, useMemo } from "react";
import styled from "@emotion/styled";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import { breakpoints, Draggable, Icon, Tabs, useTranslate } from "@bitbloq/ui";
import Component from "./Component";
import useHardwareDefinition from "./useHardwareDefinition";

export interface IHardwareTabsProps {
  selectedBoard?: IBoard;
}

const HardwareTabs: FC<IHardwareTabsProps> = ({ selectedBoard }) => {
  const t = useTranslate();
  const { boards, components } = useHardwareDefinition();

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
              <ComponentDraggable data={{ component }}>
                <Component component={component} editable={false} />
              </ComponentDraggable>
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
                <BoardImage src={board.image.url} />
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
