import React, { FC, createContext, useRef, useEffect } from "react";

export interface IDropParams {
  draggableData: any;
  droppableData: any;
  x: number;
  y: number;
  draggableWidth: number;
  draggableHeight: number;
}

export interface IDroppableHandler {
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  onDragOver: (draggableData: any) => void;
  onDragOut: () => void;
}

export interface IDragAndDropController {
  registerDroppableHandler: (handler: IDroppableHandler) => () => void;
  startDrag: (data: any, width: number, height: number) => void;
  drag: (x: number, y: number) => void;
  endDrag: () => void;
}

const createController = (
  onDrop?: (params: IDropParams) => any
): IDragAndDropController => {
  let dragging = false;
  let draggingData: any = null;
  let draggableWidth: number = 0;
  let draggableHeight: number = 0;
  let activeHandler: IDroppableHandler | undefined;
  let lastX = 0;
  let lastY = 0;
  const droppableHandlers: IDroppableHandler[] = [];

  return {
    registerDroppableHandler: (handler: IDroppableHandler) => {
      droppableHandlers.push(handler);

      return () => {
        droppableHandlers.splice(droppableHandlers.indexOf(handler), 1);
      };
    },
    startDrag: (data: any, width: number, height: number) => {
      dragging = true;
      draggingData = data;
      draggableWidth = width;
      draggableHeight = height;
    },
    drag: (dragX: number, dragY: number) => {
      const handler = droppableHandlers.find(
        ({ x, y, width, height }) =>
          dragX >= x &&
          dragX + draggableWidth <= x + width &&
          dragY >= y &&
          dragY + draggableHeight <= y + height
      );

      if (activeHandler && handler !== activeHandler) {
        activeHandler.onDragOut();
      }

      if (handler) {
        handler.onDragOver(draggingData);
      }

      activeHandler = handler;
      lastX = dragX;
      lastY = dragY;
    },
    endDrag: () => {
      if (onDrop && activeHandler) {
        const { data, x, y } = activeHandler;
        onDrop({
          draggableData: draggingData,
          droppableData: data,
          x: lastX - x,
          y: lastY - y,
          draggableWidth,
          draggableHeight
        });
      }
      activeHandler = undefined;
      draggingData = null;
      dragging = false;
    }
  };
};

export const DragAndDropContext = createContext<IDragAndDropController>(
  createController()
);

export interface IDragAndDropContextProps {
  onDrop: (params: IDropParams) => void;
}

const DragAndDropProvider: FC<IDragAndDropContextProps> = ({
  onDrop,
  children
}) => {
  const onDropRef = useRef(onDrop);
  const controller = useRef(
    createController(params => {
      onDropRef.current(params);
    })
  );

  useEffect(() => {
    onDropRef.current = onDrop;
  }, [onDrop]);

  return (
    <DragAndDropContext.Provider value={controller.current}>
      {children}
    </DragAndDropContext.Provider>
  );
};

export default DragAndDropProvider;
