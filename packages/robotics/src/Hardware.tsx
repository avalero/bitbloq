import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { IBoard, IComponent } from "@bitbloq/bloqs";
import {
  breakpoints,
  colors,
  Draggable,
  Droppable,
  DragAndDropProvider,
  Icon,
  Tabs,
  useTranslate
} from "@bitbloq/ui";

import boardsJSON from "../boards";
import componentsJSON from "../components";

const boards = boardsJSON as IBoard[];
const components = componentsJSON as IComponent[];

const getCompatibleComponents = (board: IBoard) =>
  components.filter(component =>
    component.connectors.some(connector =>
      board.ports.some(port => port.connectorTypes.includes(connector.type))
    )
  );

const Hardware: FC = () => {
  const t = useTranslate();

  const [board, setBoard] = useState<IBoard | null>(null);

  const boardsContent = (
    <TabContent>
      <TabHeader>{t("robotics.boards")}</TabHeader>
      <TabItems>
        {boards.map(board => (
          <TabBoard onClick={() => setBoard(board)}>
            <Draggable key={board.name}>
              <TabBoardImage src={board.image.url} />
            </Draggable>
            <p>{board.label}</p>
          </TabBoard>
        ))}
      </TabItems>
    </TabContent>
  );

  const compatibleComponents = board ? getCompatibleComponents(board) : [];

  const componentsContent = (
    <TabContent>
      <TabHeader>{t("robotics.components")}</TabHeader>
      <TabItems>
        {compatibleComponents.map(component => (
          <TabComponent key={component.name}>
            <img src={component.image.url} />
            <p>{t(component.label || "")}</p>
          </TabComponent>
        ))}
      </TabItems>
    </TabContent>
  );

  return (
    <DragAndDropProvider onDrop={(a, b) => console.log(a, b)}>
      <Container>
        <Canvas>
          {board ? (
            <Board image={board.image.url} />
          ) : (
            <Droppable data={{ id: "board-placeholder" }}>
              <BoardPlaceholder>
                {t("robotics.drag-board-here")}
              </BoardPlaceholder>
            </Droppable>
          )}
        </Canvas>
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
      </Container>
    </DragAndDropProvider>
  );
};

export default Hardware;

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Canvas = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Board = styled.div<{ image: string }>`
  background-image: url(${props => props.image});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 10px;
  border: solid 2px;
  width: 300px;
  height: 224px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const BoardPlaceholder = styled.div`
  background-color: ${colors.gray1};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23bbb' stroke-width='4' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  color: #bbb;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 224px;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const TabContent = styled.div`
  overflow-y: auto;
`;

const TabHeader = styled.div`
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

const TabItems = styled.div`
  padding: 10px 20px;
`;

const TabBoard = styled.div`
  cursor: pointer;
  margin-bottom: 25px;

  p {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const TabBoardImage = styled.img`
  width: 180px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 210px;
  }
`;

const TabComponent = styled.div`
  cursor: pointer;
  margin-bottom: 25px;
`;
