import React, { FC, useRef, useEffect, useContext, useState } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";

export interface IDroppableProps {
  data?: any;
  className?: string;
}

const Droppable: FC<IDroppableProps> = ({ data = {}, children, className }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragAndDropController = useContext(DragAndDropContext);
  const [draggableData, setDraggableData] = useState(false);

  useEffect(() => {
    if (!wrapRef.current) {
      return;
    }
    const { x, y, width, height } = wrapRef.current.getBoundingClientRect();

    return dragAndDropController.registerDroppableHandler({
      x,
      y,
      width,
      height,
      onDragOver: () => setDraggableData(true),
      onDragOut: () => setDraggableData(false),
      data
    });
  });

  const content =
    typeof children === "function" ? children(draggableData) : children;

  return (
    <div ref={wrapRef} className={className}>
      {content}
    </div>
  );
};

export default Droppable;
