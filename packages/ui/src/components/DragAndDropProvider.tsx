import React, { FC, createContext, useRef, useEffect } from "react";

export interface IDragStartParams {
  draggableData: any;
  x: number;
  y: number;
}

export interface IDragParams {
  draggableData: any;
  x: number;
  y: number;
}

export interface IDropParams {
  draggableData: any;
  droppableData: any;
  x: number;
  y: number;
  draggableWidth?: number;
  draggableHeight?: number;
}

export interface IDroppableHandler {
  x: number;
  y: number;
  element: HTMLDivElement;
  width: number;
  height: number;
  data: any;
  priority?: number;
  margin?: number;
  onDragOver: (draggableData: any) => void;
  onDragOut: () => void;
  onDrop?: (draggableData: any) => void;
}

export interface IDraggableMouseDownParams {
  data: any;
  element: HTMLDivElement;
  startX: number;
  startY: number;
  offsetX: number;
  offsetY: number;
  draggableWidth?: number;
  draggableHeight?: number;
  dragThreshold: number;
  onDragging?: (dragging: boolean) => void;
}

export interface IDragAndDropController {
  registerDroppableHandler: (handler: IDroppableHandler) => () => void;
  draggableMouseDown: (params: IDraggableMouseDownParams) => void;
}

export interface IControllerParms {
  onDragStart?: (params: IDragStartParams) => void;
  onDrag?: (params: IDragParams) => void;
  onDragEnd?: () => void;
  onDrop?: (params: IDropParams) => any;
}

const createController = ({
  onDragStart,
  onDrag,
  onDragEnd,
  onDrop
}: IControllerParms): IDragAndDropController => {
  let dragging = false;
  let draggingCallback: ((dragging: boolean) => void) | undefined;
  let dragThreshold = 0;
  let draggingData: any = null;
  let draggableWidth = 0;
  let draggableHeight = 0;
  let activeHandler: IDroppableHandler | undefined;
  let startX = 0;
  let startY = 0;
  let diffX = 0;
  let diffY = 0;
  const droppableHandlers: IDroppableHandler[] = [];

  const onMouseMove = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const dragX = clientX + diffX;
    const dragY = clientY + diffY;

    if (!dragging) {
      if (
        Math.abs(startX - clientX) > dragThreshold ||
        Math.abs(startY - clientY) > dragThreshold
      ) {
        dragging = true;
        if (onDragStart) {
          onDragStart({
            draggableData: draggingData,
            x: dragX,
            y: dragY
          });
        }
        if (draggingCallback) {
          draggingCallback(true);
        }

        setTimeout(() => {
          droppableHandlers.forEach(handler => {
            const { x, y } = handler.element.getBoundingClientRect();
            handler.x = x;
            handler.y = y;
          });
        }, 100);
      } else {
        return;
      }
    }

    if (onDrag) {
      onDrag({ draggableData: draggingData, x: dragX, y: dragY });
    }

    const handler = droppableHandlers.find(
      ({ x, y, width, height, margin = 0 }) =>
        dragX >= x - margin &&
        dragX + draggableWidth <= x + width + margin &&
        dragY >= y - margin &&
        dragY + draggableHeight <= y + height + margin
    );

    if (activeHandler && handler !== activeHandler) {
      activeHandler.onDragOut();
    }

    if (handler) {
      handler.onDragOver(draggingData);
    }

    activeHandler = handler;
  };

  const onMouseUp = (e: MouseEvent) => {
    const { clientX, clientY } = e;
    const droppableData = activeHandler?.data;
    document.body.style.cursor = "inherit";
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
    if (onDrop && activeHandler) {
      const { x, y } = activeHandler;
      activeHandler.onDragOut();
      if (activeHandler.onDrop) {
        activeHandler.onDrop(draggingData);
      }
      onDrop({
        draggableData: draggingData,
        droppableData,
        x: clientX + diffX - x,
        y: clientY + diffY - y,
        draggableWidth,
        draggableHeight
      });
    }
    if (onDragEnd) {
      onDragEnd();
    }
    activeHandler = undefined;
    draggingData = null;
    dragging = false;
    if (draggingCallback) {
      draggingCallback(false);
    }
    return droppableData;
  };

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

    draggableMouseDown: params => {
      const { x, y, width, height } = params.element.getBoundingClientRect();
      draggingData = params.data;
      draggingCallback = params.onDragging;
      draggableWidth =
        params.draggableWidth !== undefined ? params.draggableWidth : width;
      draggableHeight =
        params.draggableHeight !== undefined ? params.draggableHeight : height;
      dragThreshold = params.dragThreshold;
      startX = params.startX;
      startY = params.startY;
      diffX = x - startX + params.offsetX;
      diffY = y - startY + params.offsetY;

      document.body.style.cursor = "grabbing";
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    }
  };
};

export const DragAndDropContext = createContext<IDragAndDropController>(
  createController({})
);

export interface IDragAndDropContextProps {
  onDragStart?: (params: IDragStartParams) => void;
  onDrag?: (params: IDragParams) => void;
  onDragEnd?: () => void;
  onDrop?: (params: IDropParams) => void;
}

const DragAndDropProvider: FC<IDragAndDropContextProps> = ({
  onDragStart,
  onDrag,
  onDragEnd,
  onDrop,
  children
}) => {
  const onDragStartRef = useRef(onDragStart);
  const onDragRef = useRef(onDrag);
  const onDragEndRef = useRef(onDragEnd);
  const onDropRef = useRef(onDrop);

  const controller = useRef(
    createController({
      onDragStart: params => {
        if (onDragStartRef.current) {
          onDragStartRef.current(params);
        }
      },
      onDrag: params => {
        if (onDragRef.current) {
          onDragRef.current(params);
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
