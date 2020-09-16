import { useEffect, useState } from "react";

const useKeyPressed = (
  key: string,
  onPress?: () => void,
  effects: any[] = []
): boolean => {
  const [pressed, setPressed] = useState(false);

  const onBodyKeyDown = (e: KeyboardEvent) => {
    if (e.key === key) {
      setPressed(true);
    }
  };

  const onBodyKeyUp = (e: KeyboardEvent) => {
    if (e.key === key) {
      setPressed(false);
      if (onPress) {
        onPress();
      }
    }
  };

  useEffect(() => {
    document.body.addEventListener("keydown", onBodyKeyDown);
    document.body.addEventListener("keyup", onBodyKeyUp);
    return () => {
      document.body.removeEventListener("keydown", onBodyKeyDown);
      document.body.removeEventListener("keyup", onBodyKeyUp);
    };
  }, effects);

  return pressed;
};

export default useKeyPressed;
