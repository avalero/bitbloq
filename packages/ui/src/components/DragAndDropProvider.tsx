import React, { FC, createContext, useRef, useEffect } from "react";

export interface IDragStartParams {
  draggableData: any;
}

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
  priority?: number;
  onDragOver: (draggableData: any) => void;
  onDragOut: () => void;
}

export interface IDragAndDropController {
  registerDroppableHandler: (handler: IDroppableHandler) => () => void;
  startDrag: (data: any, width: number, height: number) => void;
  drag: (x: number, y: number) => void;
  endDrag: () => void;
}

export interface IControllerParms {
  onDragStart?: (params: IDragStartParams) => void;
  onDragEnd?: () => void;
  onDrop?: (params: IDropParams) => any;
}

const createController = ({
  onDragStart,
  onDragEnd,
  onDrop
}: IControllerParms): IDragAndDropController => {
  let draggingData: any = null;
  let draggableWidth = 0;
  let draggableHeight = 0;
  let activeHandler: IDroppableHandler | undefined;
  let lastX = 0;
  let lastY = 0;
  const droppableHandlers: IDroppableHandler[] = [];

  return {
    registerDroppableHandler: (handler: IDroppableHandler) => {
      droppableHandlers.push(handler);
      droppableHandlers.sort(
        ({ priority: a = 0 }, { priority: b = 0 }) => b - a
      );

      return () => {
        droppableHandlers.splice(droppableHandlers.indexOf(handler), 1);
      };
    },
    startDrag: (data: any, width: number, height: number) => {
      draggingData = data;
      draggableWidth = width;
      draggableHeight = height;

      if (onDragStart) {
        onDragStart({ draggableData: data });
      }
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
        activeHandler.onDragOut();
        onDrop({
          draggableData: draggingData,
          droppableData: data,
          x: lastX - x,
          y: lastY - y,
          draggableWidth,
          draggableHeight
        });
      }
      if (onDragEnd) {
        onDragEnd();
      }
      activeHandler = undefined;
      draggingData = null;
    }
  };
};

export const DragAndDropContext = createContext<IDragAndDropController>(
  createController({})
);

export interface IDragAndDropContextProps {
  onDragStart?: (params: IDragStartParams) => void;
  onDragEnd?: () => void;
  onDrop?: (params: IDropParams) => void;
}

const DragAndDropProvider: FC<IDragAndDropContextProps> = ({
  onDragStart,
  onDragEnd,
  onDrop,
  children
}) => {
  const onDragStartRef = useRef(onDragStart);
  const onDragEndRef = useRef(onDragEnd);
  const onDropRef = useRef(onDrop);

  const controller = useRef(
    createController({
      onDragStart: params => {
        if (onDragStartRef.current) {
          onDragStartRef.current(params);
        }
      },
      onDrop: params => {
        if (onDropRef.current) {
          onDropRef.current(params);
        }
      },
      onDragEnd: () => {
        if (onDragEndRef.current) {
          onDragEndRef.current();
        }
      }
    })
  );

  useEffect(() => {
    onDragStartRef.current = onDragStart;
  }, [onDragStart]);

  useEffect(() => {
    onDragEndRef.current = onDragEnd;
  }, [onDragEnd]);

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
