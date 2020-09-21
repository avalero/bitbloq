import { RefObject, useEffect } from "react";

interface ICallbackProps {
  x: number;
  y: number;
  width: number;
  height: number;
}

const useResizeObserver = (
  ref: RefObject<HTMLElement>,
  callback: (props: ICallbackProps) => void,
  effects: any[] = []
): void => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        const { x, y, width, height } = ref.current.getBoundingClientRect();
        callback({ x, y, width, height });
      }
    });

    if (ref.current) {
      const { x, y, width, height } = ref.current.getBoundingClientRect();
      callback({ x, y, width, height });
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, effects);
};

export default useResizeObserver;
