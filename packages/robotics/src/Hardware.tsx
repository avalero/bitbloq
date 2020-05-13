import React, { FC, useState, useRef, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { IBoard, IComponent, IHardware, IPosition } from "@bitbloq/bloqs";
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

import Component from "./Component";

import boardsJSON from "./boards";
import componentsJSON from "./components";

const boards = boardsJSON as IBoard[];
const components = componentsJSON as IComponent[];

const getCompatibleComponents = (board: IBoard) =>
  components.filter(component =>
    component.connectors.some(connector =>
      board.ports.some(port => port.connectorTypes.includes(connector.type))
    )
  );

export interface IHardwareProps {
  hardware: Partial<IHardware>;
  onChange: (newHardware: Partial<IHardware>) => void;
}

const Hardware: FC<IHardwareProps> = ({ hardware, onChange }) => {
  const t = useTranslate();

  const boardRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const [boardSelected, setBoardSelected] = useState(false);

  const boardObject = boards.find(b => b.name === hardware.board);

  useEffect(() => {
    const onBodyClick = (e: MouseEvent) => {
      if (
        boardRef.current &&
        !boardRef.current.contains(e.target as HTMLElement)
      ) {
        setBoardSelected(false);
      }
    };

    document.addEventListener("click", onBodyClick);
    return () => {
      document.removeEventListener("click", onBodyClick);
    };
  }, []);

  const boardsContent = useMemo(
    () => (
      <TabContent>
        <TabHeader>{t("robotics.boards")}</TabHeader>
        <TabItems>
          {boards.map(board => (
            <TabBoard key={board.name}>
              <Draggable data={{ board }}>
                <TabBoardImage
                  src={board.image.url}
                  onClick={() => onChange({ ...hardware, board: board.name })}
                />
              </Draggable>
              <p>{board.label}</p>
            </TabBoard>
          ))}
        </TabItems>
      </TabContent>
    ),
    [boards]
  );

  const compatibleComponents = useMemo(
    () => (boardObject ? getCompatibleComponents(boardObject) : []),
    [hardware.board]
  );

  const componentsContent = useMemo(
    () => (
      <TabContent>
        <TabHeader>{t("robotics.components")}</TabHeader>
        <TabItems>
          {compatibleComponents.map(component => (
            <TabComponent key={component.name}>
              <TabComponentDraggable data={{ component }}>
                <Component component={component} editable={false} />
              </TabComponentDraggable>
              <p>{t(component.label || "")}</p>
            </TabComponent>
          ))}
        </TabItems>
      </TabContent>
    ),
    [compatibleComponents]
  );

  const onDrop = ({
    draggableData: { board, component },
    droppableData: { id },
    draggableWidth,
    draggableHeight,
    x,
    y
  }) => {
    if (id === "board-placeholder" && board) {
      onChange({ ...hardware, board: board.name });
    }
    if (id === "canvas" && component) {
      if (!canvasRef.current) {
        return;
      }

      const { width, height } = canvasRef.current.getBoundingClientRect();

      onChange({
        ...hardware,
        components: [
          ...(hardware.components || []),
          {
            component: component.name,
            name: component.name + Math.random(),
            position: {
              x: x - width / 2 + draggableWidth / 2,
              y: y - height / 2 + draggableHeight / 2
            }
          }
        ]
      });
    }
  };

  return (
    <DragAndDropProvider onDrop={onDrop}>
      <Container>
        <CanvasWrap data={{ id: "canvas" }}>
          <Canvas ref={canvasRef}>
            {boardObject ? (
              <Board
                ref={boardRef}
                image={boardObject.image.url}
                selected={boardSelected}
                onClick={() => setBoardSelected(true)}
              />
            ) : (
              <BoardPlaceholderWrap data={{ id: "board-placeholder" }}>
                {draggableData => (
                  <BoardPlaceholder active={!!draggableData}>
                    {t("robotics.drag-board-here")}
                  </BoardPlaceholder>
                )}
              </BoardPlaceholderWrap>
            )}
            {(hardware.components || []).map((instance, i) => {
              if (!instance.position) {
                return null;
              }
              const component = components.find(
                c => c.name === instance.component
              );
              if (!component) {
                return null;
              }
              return (
                <CanvasComponent
                  key={instance.name}
                  top={instance.position.y}
                  left={instance.position.x}
                  dragCopy={false}
                  onDragEnd={({ x, y, width, height }) => {
                    const {
                      x: canvasX,
                      y: canvasY
                    } = canvasRef.current!.getBoundingClientRect();
                    onChange(
                      update(hardware, {
                        components: {
                          [i]: {
                            position: {
                              x: { $set: x - canvasX + width / 2 },
                              y: { $set: y - canvasY + height / 2 }
                            }
                          }
                        }
                      })
                    );
                  }}
                >
                  <Component component={component} />
                </CanvasComponent>
              );
            })}
          </Canvas>
        </CanvasWrap>
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

const CanvasWrap = styled(Droppable)`
  flex: 1;
  display: flex;
`;

const Canvas = styled.div`
  position: relative;
  flex: 1;
  transform: translate(50%, 50%);
`;

const CanvasItem = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
`;

const Board = styled(CanvasItem)<{ image: string; selected: boolean }>`
  cursor: pointer;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 300px;
  height: 224px;
  border-radius: 10px;
  border: ${props => (props.selected ? "solid 2px" : "none")};

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const BoardPlaceholderWrap = styled(Droppable)`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 224px;
  display: flex;

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;

const BoardPlaceholder = styled.div<{ active: boolean }>`
  flex: 1;
  background-color: ${colors.gray1};
  background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23bbb' stroke-width='4' stroke-dasharray='6%2c 10' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e");
  color: #bbb;
  font-size: 14px;
  font-style: italic;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContent = styled.div`
  overflow-y: auto;
  min-width: 220px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-width: 250px;
  }
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
  p {
    font-size: 14px;
    margin-top: 10px;
  }
`;

const TabComponentDraggable = styled(Draggable)`
  display: inline-block;
`;

const TabComponentImage = styled.img<{ width: number; height: number }>`
  width: ${props => props.width}px;
  height: ${props => props.height}px;
`;

const CanvasComponent = styled(Draggable)<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
`;
