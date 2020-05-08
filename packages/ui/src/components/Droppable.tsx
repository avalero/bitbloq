import React, { FC, useRef, useEffect, useContext } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";

export interface IDroppableProps {
  data?: any;
}

const Droppable: FC<IDroppableProps> = ({ data = {}, children }) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragAndDropController = useContext(DragAndDropContext);

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
      onDragOver: () => console.log("Drag over"),
      data
    });
  });

  return <div ref={wrapRef}>{children}</div>;
};

export default Droppable;
