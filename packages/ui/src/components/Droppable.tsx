import React, {
  CSSProperties,
  FC,
  useRef,
  useEffect,
  useContext,
  useState
} from "react";
import { DragAndDropContext } from "./DragAndDropProvider";
import useResizeObserver from "../hooks/useResizeObserver";

export interface IDroppableProps {
  data?: any;
  active?: boolean;
  className?: string;
  priority?: number;
  margin?: number;
  style?: CSSProperties;
  onDrop?: (draggableData: any) => void;
}

const Droppable: FC<IDroppableProps> = ({
  data = {},
  active = true,
  children,
  priority,
  margin,
  className,
  style,
  onDrop
}) => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const dragAndDropController = useContext(DragAndDropContext);
  const [draggableData, setDraggableData] = useState(false);
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!active || !wrapRef.current) {
      return;
    }
    const { x, y } = wrapRef.current.getBoundingClientRect();
    return dragAndDropController.registerDroppableHandler({
      x,
      y,
      element: wrapRef.current,
      width,
      height,
      priority,
      margin,
      onDragOver: () => setDraggableData(true),
      onDragOut: () => setDraggableData(false),
      onDrop,
      data
    });
  }, [active, width, height]);

  useResizeObserver(
    wrapRef,
    ({ width: wrapWidth, height: wrapHeight }) => {
      setWidth(wrapWidth);
      setHeight(wrapHeight);
    },
    []
  );

  const content =
    typeof children === "function" ? children(draggableData) : children;

  return (
    <div ref={wrapRef} className={className} style={style}>
      {content}
    </div>
  );
};

export default Droppable;
