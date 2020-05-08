import React, { FC, useEffect, useRef, useState, useContext } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";
import styled from "@emotion/styled";
import { createPortal } from "react-dom";

export interface IDraggableProps {
  data?: any;
}

const Draggable: FC<IDraggableProps> = ({ data = {}, children }) => {
  const dragAndDropController = useContext(DragAndDropContext);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [wrapX, setWrapX] = useState(0);
  const [wrapY, setWrapY] = useState(0);
  const [draggedX, setDraggedX] = useState(0);
  const [draggedY, setDraggedY] = useState(0);

  const onDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!wrapRef.current) {
      return;
    }
    const touch = e.touches[0];
    const { x, y } = wrapRef.current.getBoundingClientRect();
    setStartX(touch.clientX);
    setStartY(touch.clientY);
    setWrapX(x);
    setWrapY(y);
    setDraggedX(x);
    setDraggedY(y);
    setDragging(true);

    dragAndDropController.startDrag(data);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setDraggedX(wrapX + (touch.clientX - startX));
    setDraggedY(wrapY + (touch.clientY - startY));

    dragAndDropController.drag(touch.clientX, touch.clientY);
  };

  const onTouchEnd = () => {
    dragAndDropController.endDrag();
    setDragging(false);
  };

  const draggedElement = dragging
    ? createPortal(
        <DraggedContainer style={{ left: draggedX, top: draggedY }}>
          {children}
        </DraggedContainer>,
        document.body
      )
    : null;

  return (
    <div
      ref={wrapRef}
      onDragStart={onDragStart}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {children}
      {draggedElement}
    </div>
  );
};

export default Draggable;

const DraggedContainer = styled.div`
  position: fixed;
  z-index: 100;
`;
