import { Ref, useEffect, useRef, useState, CSSProperties } from "react";

interface IState {
  dragging: boolean;
  width: number;
  height: number;
  diffX: number;
  diffY: number;
}

interface IOnDragParams {
  x: number;
  y: number;
  width: number;
  height: number;
  element: HTMLDivElement;
}

export interface IUseDragParams {
  onDragStart?: (params: IOnDragParams) => void;
  onDrag?: (params: IOnDragParams) => void;
  onDragEnd?: (params: IOnDragParams) => void;
}

export interface IUseDragElementProps {
  ref: Ref<HTMLDivElement>;
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
    dragging: false,
    width: 0,
    height: 0,
    diffX: 0,
    diffY: 0
  });

  const startDrag = (clientX: number, clientY: number) => {
    const element = ref.current;
    const { x, y, width, height } = element!.getBoundingClientRect();
    if (params.onDragStart) {
      params.onDragStart({ x, y, width, height, element: element! });
    }
    setState({
      dragging: true,
      width,
      height,
      diffX: x - clientX,
      diffY: y - clientY
    });
  };

  const drag = (clientX: number, clientY: number) => {
    const element = ref.current;
    const { width, height, diffX, diffY } = state;
    if (params.onDrag) {
      params.onDrag({
        x: clientX + diffX,
        y: clientY + diffY,
        width,
        height,
        element: element!
      });
    }
  };

  const endDrag = (clientX: number, clientY: number) => {
    const element = ref.current;
    const { width, height, diffX, diffY } = state;
    if (params.onDragEnd) {
      params.onDragEnd({
        x: clientX + diffX,
        y: clientY + diffY,
        width,
        height,
        element: element!
      });
    }
    setState({ ...state, dragging: false });
  };

  useEffect(() => {
    if (state.dragging) {
      const onMouseMove = (e: MouseEvent) => drag(e.clientX, e.clientY);
      const onMouseUp = (e: MouseEvent) => endDrag(e.clientX, e.clientY);

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
  }, [state.dragging]);

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
