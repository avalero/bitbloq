import { FC, useState, useContext, ReactElement } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";
import useDraggable, {
  IUseDragParams,
  IUseDragElementProps
} from "../hooks/useDraggable";

export interface IDraggableProps extends IUseDragParams {
  data?: any;
  draggableWidth?: number;
  draggableHeight?: number;
  offsetX?: number;
  offsetY?: number;
  children: (
    elementProps: IUseDragElementProps,
    dragging: boolean
  ) => ReactElement;
}

const Draggable: FC<IDraggableProps> = ({
  children,
  data = {},
  draggableWidth,
  draggableHeight,
  offsetX,
  offsetY,
  onDragStart,
  onDrag,
  onDragEnd
}) => {
  const dragAndDropController = useContext(DragAndDropContext);
  const [dragging, setDragging] = useState(false);

  const elementProps = useDraggable({
    onDragStart: params => {
      dragAndDropController.startDrag(
        data,
        draggableWidth !== undefined ? draggableWidth : params.width,
        draggableHeight !== undefined ? draggableHeight : params.height
      );
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
    },
    offsetX,
    offsetY
  });

  return children(elementProps, dragging);
};

export default Draggable;
