import { RefObject, useEffect, useRef, useState, CSSProperties } from "react";

interface IState {
  mouseDown: boolean;
  dragging: boolean;
  width: number;
  height: number;
  diffX: number;
  diffY: number;
  startX: number;
  startY: number;
}

export interface IOnDragParams {
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLDivElement;
  data?: any;
}

export interface IUseDragParams {
  onDragStart?: (params: IOnDragParams) => void;
  onDrag?: (params: IOnDragParams) => void;
  onDragEnd?: (params: IOnDragParams) => void;
  offsetX?: number;
  offsetY?: number;
  dragThreshold?: number;
}

export interface IUseDragElementProps {
  ref: RefObject<HTMLDivElement>;
  style: CSSProperties;
  onDragStart: (e: React.DragEvent) => void;
  onMouseDown: (e: React.MouseEvent) => void;
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
}

const useDraggable = (params: IUseDragParams): IUseDragElementProps => {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<IState>({
    mouseDown: false,
    dragging: false,
    width: 0,
    height: 0,
    diffX: 0,
    diffY: 0,
    startX: 0,
    startY: 0
  });
  const { offsetX = 0, offsetY = 0, dragThreshold = 0 } = params;

  const startDrag = (clientX: number, clientY: number) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const { x, y, width, height } = element.getBoundingClientRect();
    setState({
      mouseDown: true,
      dragging: false,
      width,
      height,
      diffX: x - clientX + offsetX,
      diffY: y - clientY + offsetY,
      startX: clientX,
      startY: clientY
    });
  };

  const drag = (clientX: number, clientY: number) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const { dragging, width, height, diffX, diffY, startX, startY } = state;
    if (!dragging) {
      if (
        Math.abs(startX - clientX) > dragThreshold ||
        Math.abs(startY - clientY) > dragThreshold
      ) {
        setState({
          ...state,
          dragging: true
        });
        if (params.onDragStart) {
          params.onDragStart({
            x: startX,
            y: startY,
            width,
            height,
            element
          });
        }
      }
    } else {
      if (params.onDrag) {
        params.onDrag({
          x: clientX + diffX,
          y: clientY + diffY,
          width,
          height,
          element
        });
      }
    }
  };

  const endDrag = (clientX: number, clientY: number) => {
    const element = ref.current;
    if (!element) {
      return;
    }
    const { width, height, diffX, diffY } = state;
    if (params.onDragEnd) {
      params.onDragEnd({
        x: clientX + diffX,
        y: clientY + diffY,
        width,
        height,
        element
      });
    }
    setState({ ...state, dragging: false, mouseDown: false });
  };

  useEffect(() => {
    if (state.mouseDown) {
      const onMouseMove = (e: MouseEvent) => drag(e.clientX, e.clientY);
      const onMouseUp = (e: MouseEvent) => {
        window.removeEventListener("mousemove", onMouseMove);
        endDrag(e.clientX, e.clientY);
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
  }, [state.mouseDown, state.dragging]);

  const onDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    startDrag(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    startDrag(touch.clientX, touch.clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    drag(touch.clientX, touch.clientY);
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    const touch = e.touches[0];
    endDrag(touch.clientX, touch.clientY);
  };

  const style = { cursor: state.dragging ? "grabbing" : "grab" };

  return {
    ref,
    style,
    onDragStart,
    onMouseDown,
    onTouchStart,
    onTouchMove,
    onTouchEnd
  };
};

export default useDraggable;
