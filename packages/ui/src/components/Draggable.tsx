import React, { FC, useEffect, useRef, useReducer, useContext } from "react";
import { DragAndDropContext } from "./DragAndDropProvider";
import { createPortal } from "react-dom";

interface IDraggableState {
  dragging: boolean;
  draggedX: number;
  draggedY: number;
  diffX: number;
  diffY: number;
}

type IDraggableAction =
  | { type: "start"; x: number; y: number }
  | { type: "drag"; x: number; y: number }
  | { type: "end" };

interface IDragEndParams {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IDraggableProps {
  data?: any;
  className?: string;
  dragCopy?: boolean;
  onDragEnd?: (params: IDragEndParams) => void;
}

const Draggable: FC<IDraggableProps> = ({
  data = {},
  className,
  dragCopy = true,
  onDragEnd,
  children
}) => {
  const dragAndDropController = useContext(DragAndDropContext);
  const wrapRef = useRef<HTMLDivElement>(null);
  const draggedRef = useRef<HTMLDivElement>(null);

  const [{ dragging, draggedX, draggedY }, dispatch] = useReducer(
    (state: IDraggableState, action: IDraggableAction): IDraggableState => {
      switch (action.type) {
        case "start": {
          if (!wrapRef.current) {
            return state;
          }
          const {
            x,
            y,
            width,
            height
          } = wrapRef.current.getBoundingClientRect();
          dragAndDropController.startDrag(data, width, height);

          return {
            dragging: true,
            draggedX: x,
            draggedY: y,
            diffX: x - action.x,
            diffY: y - action.y
          };
        }

        case "drag": {
          const x = action.x + state.diffX;
          const y = action.y + state.diffY;
          dragAndDropController.drag(action.x, action.y);

          if (draggedRef.current) {
            draggedRef.current.style.left = `${x}px`;
            draggedRef.current.style.top = `${y}px`;
          }

          return {
            ...state,
            draggedX: x,
            draggedY: y
          };
        }

        case "end": {
          dragAndDropController.endDrag();
          if (onDragEnd) {
            const {
              width,
              height
            } = draggedRef.current!.getBoundingClientRect();
            onDragEnd({ x: state.draggedX, y: state.draggedY, width, height });
          }
          return {
            ...state,
            dragging: false
          };
        }
      }

      return state;
    },
    {
      dragging: false,
      draggedX: 0,
      draggedY: 0,
      diffX: 0,
      diffY: 0
    }
  );

  useEffect(() => {
    if (dragging) {
      const onMouseMove = (e: MouseEvent) => {
        dispatch({ type: "drag", x: e.clientX, y: e.clientY });
      };

      const onMouseUp = (e: MouseEvent) => {
        dispatch({ type: "end" });
      };

      document.body.style.cursor = "grabbing";

      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      return () => {
        document.body.style.cursor = "inherit";
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    }

    return undefined;
  }, [dragging]);

  const onDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dispatch({ type: "start", x: e.clientX, y: e.clientY });
    e.stopPropagation();
  };

  const onTouchStart = (e: React.TouchEvent) => {
    if (!wrapRef.current) {
      return;
    }
    const touch = e.touches[0];
    dispatch({ type: "start", x: touch.clientX, y: touch.clientY });
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    dispatch({ type: "drag", x: touch.clientX, y: touch.clientY });
  };

  const onTouchEnd = () => {
    dispatch({ type: "end" });
  };

  const content =
    typeof children === "function" ? children(dragging) : children;

  const draggedElement = dragging
    ? createPortal(
        <div
          ref={draggedRef}
          style={{
            left: draggedX,
            top: draggedY,
            position: "fixed",
            zIndex: 100,
            pointerEvents: "none"
          }}
        >
          {content}
        </div>,
        document.body
      )
    : null;

  return (
    <div
      className={className}
      ref={wrapRef}
      onDragStart={onDragStart}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ cursor: dragging ? "grabbing" : "grab" }}
    >
      {(!dragging || dragCopy) && content}
      {draggedElement}
    </div>
  );
};

export default Draggable;
