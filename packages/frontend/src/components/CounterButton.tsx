import React, { FC, useState, useEffect } from "react";
import { Button } from "@bitbloq/ui";

export interface ICounterButtonProps {
  onClick: () => void;
}

const CounterButton: FC<ICounterButtonProps> = ({ onClick, children }) => {
  const [disableRetry, setDisableRetry] = useState(false);
  const [retryTime, setRetryTime] = useState(0);

  useEffect(() => {
    let interval: number;
    if (disableRetry) {
      let time = retryTime;
      interval = window.setInterval(() => {
        if (time > 0) {
          time = time - 1;
          setRetryTime(time);
        } else {
          clearInterval(interval);
          setDisableRetry(false);
        }
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [disableRetry]);

  const onResendClick = () => {
    setRetryTime(59);
    setDisableRetry(true);
    onClick();
  };

  return (
    <Button onClick={onResendClick} disabled={disableRetry}>
      {children} {disableRetry && `(0:${retryTime})`}
    </Button>
  );
};

export default CounterButton;
