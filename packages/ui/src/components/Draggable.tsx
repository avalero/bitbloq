import {
  FC,
  RefObject,
  useContext,
  ReactElement,
  useRef,
  useState
} from "react";
import { DragAndDropContext } from "./DragAndDropProvider";

export interface IDraggableElementProps {
  ref: RefObject<HTMLDivElement>;
  onDragStart: (e: React.DragEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface IDraggableProps {
  data?: any;
  draggableWidth?: number;
  draggableHeight?: number;
  dragThreshold?: number;
  offsetX?: number;
  offsetY?: number;
  children: (
    elementProps: IDraggableElementProps,
    dragging: boolean
  ) => ReactElement;
}

const Draggable: FC<IDraggableProps> = ({
  children,
  data = {},
  draggableWidth,
  draggableHeight,
  dragThreshold = 0,
  offsetX = 0,
  offsetY = 0
}) => {
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const dragAndDropController = useContext(DragAndDropContext);

  const elementProps = {
    onDragStart: (e: React.DragEvent) => {
      e.preventDefault();
    },
    onMouseDown: (e: React.MouseEvent) => {
      e.stopPropagation();
      const element = ref.current;
      if (!element) {
        return;
      }
      const { clientX, clientY } = e;
      dragAndDropController.draggableMouseDown({
        data,
        element,
        startX: clientX,
        startY: clientY,
        draggableHeight,
        draggableWidth,
        offsetX,
        offsetY,
        dragThreshold,
        onDragging: setDragging
      });
    },
    ref
  };

  return children(elementProps, dragging);
};

export default Draggable;
