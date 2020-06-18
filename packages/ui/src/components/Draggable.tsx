import React, { FC, useRef, useState, useContext, ReactElement } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";
import useDraggable, {
  IUseDragParams,
  IUseDragElementProps
} from "../hooks/useDraggable";
import { createPortal } from "react-dom";

export interface IDraggableProps extends IUseDragParams {
  data?: any;
  children: (
    elementProps: IUseDragElementProps,
    dragging: boolean
  ) => ReactElement;
}

const Draggable: FC<IDraggableProps> = ({
  children,
  data = {},
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const dragAndDropController = useContext(DragAndDropContext);
  const [dragging, setDragging] = useState(false);

  const elementProps = useDraggable({
    onDragStart: params => {
      dragAndDropController.startDrag(data, params.width, params.height);
      setDragging(true);
      if (onDragStart) {
        onDragStart(params);
      }
    },
    onDrag: params => {
      dragAndDropController.drag(params.x, params.y);
      if (onDrag) {
        onDrag(params);
      }
    },
    onDragEnd: params => {
      dragAndDropController.endDrag();
      setDragging(false);
      if (onDragEnd) {
        onDragEnd(params);
      }
    }
  });

  return children(elementProps, dragging);
};

export default Draggable;
