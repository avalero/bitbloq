import React, { FC, useRef } from "react";
import styled from "@emotion/styled";
import {
  breakpoints,
  colors,
  Droppable,
  useClickOutside,
  useKeyPressed,
  useResizeObserver,
  useTranslate
} from "@bitbloq/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  boardState,
  boardSelectedState,
  connectedPortsState,
  draggingConnectorState,
  selectedComponentState
} from "./state";
import useHardwareDefinition from "./useHardwareDefinition";
import useUpdateContent from "./useUpdateContent";

const Board: FC = () => {
  const t = useTranslate();
  const containerRef = useRef<HTMLDivElement>(null);
  const [board, setBoard] = useRecoilState(boardState);
  const [boardSelected, setBoardSelected] = useRecoilState(boardSelectedState);
  const connectedPorts = useRecoilValue(connectedPortsState);
  const draggingConnector = useRecoilValue(draggingConnectorState);
  const selectedComponent = useRecoilValue(selectedComponentState);
  const { getBoard } = useHardwareDefinition();
  const updateContent = useUpdateContent();

  const boardObject = board && getBoard(board.name);

  useClickOutside(containerRef, () => setBoardSelected(false));
  useResizeObserver(
    containerRef,
    ({ width, height }) => {
      if (board?.name) {
        setBoard({
          name: board?.name,
          width,
          height
        });
        updateContent();
      }
    },
    [board?.name]
  );

  useKeyPressed(
    "Delete",
    () => {
      if (boardSelected) {
        setBoard(null);
        updateContent();
      }
    },
    [boardSelected]
  );

  if (!boardObject) {
    return (
      <BoardPlaceholderWrap data={{ type: "board-placeholder" }} priority={1}>
        {draggableData => (
          <BoardPlaceholder active={!!draggableData}>
            {t("robotics.drag-board-here")}
          </BoardPlaceholder>
        )}
      </BoardPlaceholderWrap>
    );
  }

  return (
    <>
      <Container
        ref={containerRef}
        selected={boardSelected}
        image={boardObject.image.url}
        dragging={!!draggingConnector}
        onClick={() => setBoardSelected(true)}
      />
      {boardObject.ports.map(port => (
        <PortDroppable
          active={!!draggingConnector}
          key={port.name}
          data={{ type: "port", port }}
          priority={2}
          style={{
            top: port.position.y * (board?.height || 0),
            left: port.position.x * (board?.width || 0)
          }}
        >
          {connector => (
            <Port
              active={!!connector}
              connected={!!connectedPorts[port.name]}
              dragging={!!draggingConnector}
              selected={connectedPorts[port.name] === selectedComponent}
              style={{
                height: (port.height || 0) * (board?.height || 0),
                width: (port.width || 0) * (board?.width || 0)
              }}
            />
          )}
        </PortDroppable>
      ))}
    </>
  );
};

export default Board;

const Container = styled.div<{
  image: string;
  selected: boolean;
  dragging: boolean;
}>`
  position: absolute;
  top: 0px;
  left: 0px;
  transform: translate(-50%, -50%);
  cursor: pointer;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 300px;
  height: 224px;
  border-radius: 10px;
  border: ${props => (props.selected ? "solid 2px" : "none")};
  opacity: ${props => (props.dragging ? 0.3 : 1)};

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

const PortDroppable = styled(Droppable)`
  position: absolute;
`;

const Port = styled.div<{
  active?: boolean;
  connected?: boolean;
  dragging?: boolean;
  selected?: boolean;
}>`
  margin: -1px;
  border-radius: 2px;
  border: solid 1px
    ${props =>
      props.connected && !props.selected ? colors.green : colors.black};
  background-color: ${props =>
    props.active || (props.connected && props.selected)
      ? "#373b44"
      : props.connected
      ? colors.green
      : "rgba(55, 59, 68, 0.3)"};
  opacity: ${props => (props.dragging || props.connected ? 1 : 0)};
`;
