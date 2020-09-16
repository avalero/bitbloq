import { RefObject, useEffect } from "react";

const useResizeObserver = (
  ref: RefObject<HTMLElement>,
  callback: (width: number, height: number) => void,
  effects: any[] = []
): void => {
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (ref.current) {
        const { width, height } = ref.current.getBoundingClientRect();
        callback(width, height);
      }
    });

    if (ref.current) {
      resizeObserver.observe(ref.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, effects);
};

export default useResizeObserver;
