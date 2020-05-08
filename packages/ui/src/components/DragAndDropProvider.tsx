import React, { FC, createContext, useRef } from "react";

export interface IDroppableHandler {
  x: number;
  y: number;
  width: number;
  height: number;
  data: any;
  onDragOver: (draggableData: any) => void;
}

export interface IDragAndDropController {
  registerDroppableHandler: (handler: IDroppableHandler) => () => void;
  startDrag: (data: any) => void;
  drag: (x: number, y: number) => void;
  endDrag: () => void;
}

const createController = (
  onDrop?: (draggableData: any, droppableData: any) => any
): IDragAndDropController => {
  let dragging = false;
  let draggingData: any = null;
  let activeHandler: IDroppableHandler | undefined;
  const droppableHandlers: IDroppableHandler[] = [];

  return {
    registerDroppableHandler: (handler: IDroppableHandler) => {
      droppableHandlers.push(handler);

      return () => {
        droppableHandlers.splice(droppableHandlers.indexOf(handler), 1);
      };
    },
    startDrag: (data: any) => {
      dragging = true;
      draggingData = data;
    },
    drag: (x: number, y: number) => {
        activeHandler = droppableHandlers.find(
          handler =>
            x >= handler.x &&
            x <= handler.x + handler.width &&
            y >= handler.y &&
            y <= handler.y + handler.height
        );

      if (activeHandler) {
          activeHandler.onDragOver(draggingData);
      }
    },
    endDrag: () => {
      dragging = false;
      draggingData = null;

      if (onDrop && activeHandler) {
        onDrop(draggingData, activeHandler.data);
      }
      activeHandler = undefined;
    }
  };
};

export const DragAndDropContext = createContext<IDragAndDropController>(
  createController()
);

export interface IDragAndDropContextProps {
  onDrop: (draggableData: any, droppableData: any) => void;
}

const DragAndDropProvider: FC<IDragAndDropContextProps> = ({
  onDrop,
  children
}) => {
  const controller = useRef(createController(onDrop));

  return (
    <DragAndDropContext.Provider value={controller.current}>
      {children}
    </DragAndDropContext.Provider>
  );
};

export default DragAndDropProvider;
