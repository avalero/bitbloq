import React, { FC } from "react";
import styled from "@emotion/styled";
import {
  breakpoints,
  colors,
  Draggable,
  Icon,
  Tabs,
  useTranslate
} from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import {
  boardState,
  isDraggingBoardState,
  isDraggingInstanceState
} from "./state";
import useHardwareDefinition from "./useHardwareDefinition";
import DeleteDroppable from "./DeleteDroppable";

const HardwareTabs: FC = () => {
  const t = useTranslate();
  const { boards, components, getBoard } = useHardwareDefinition();
  const board = useRecoilValue(boardState);

  const boardObject = board && getBoard(board.name);

  const compatibleComponents = boardObject
    ? components.filter(
        component =>
          component.connectors &&
          component.connectors.some(connector =>
            boardObject.ports.some(port =>
              port.connectorTypes.includes(connector.type)
            )
          )
      )
    : [];

  const componentsContent = (
    <Content>
      <Header>{t("robotics.components")}</Header>
      <Items>
        {compatibleComponents.map(component => (
          <ComponentWrap key={component.name}>
            <Draggable data={{ component }}>
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
  );

  const boardsContent = (
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
  );

  return (
    <Container>
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
      <HardwareDeleteDroppable />
    </Container>
  );
};

export default HardwareTabs;

const HardwareDeleteDroppable: FC = () => {
  const isDraggingBoard = useRecoilValue(isDraggingBoardState);
  const isDraggingInstance = useRecoilValue(isDraggingInstanceState);

  if (!isDraggingBoard && !isDraggingInstance) {
    return null;
  }

  return <DeleteDroppable />;
};

const Container = styled.div`
  position: relative;
  display: flex;
  border-left: 1px solid ${colors.gray3};
`;

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

const Component = styled.div`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  padding: 10px;

  img {
    pointer-events: none;
  }
`;
