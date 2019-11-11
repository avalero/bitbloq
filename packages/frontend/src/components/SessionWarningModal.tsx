import React, { FC, useState } from "react";
import { DialogModal } from "@bitbloq/ui";
import { useSessionEvent, onSessionActivity } from "../lib/session";

export interface ISessionWarningModalProps {
  tempSession?: string;
}
const SessionWarningModal: FC<ISessionWarningModalProps> = ({
  tempSession
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useSessionEvent(
    "expiration-warning",
    e => {
      if (e.tempSession === tempSession) {
        setIsOpen(true);
        setRemainingSeconds(e.remainingSeconds || 0);
      }
    },
    tempSession
  );

  useSessionEvent("new-token", () => setIsOpen(false), tempSession);

  const onContinue = async () => {
    onSessionActivity();
    setIsOpen(false);
  };

  return (
    <DialogModal
      isOpen={isOpen}
      title="¿Sigues ahí?"
      content={
        <p>
          Parece que te has ido, si no quieres seguir trabajando saldrás de tu
          cuenta en <b>{remainingSeconds} segundos</b>.
        </p>
      }
      okText="Aceptar"
      onOk={() => onContinue()}
    />
  );
};

export default SessionWarningModal;
