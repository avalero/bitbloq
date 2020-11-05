import React, { FC, useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { ISessionExpires } from "@bitbloq/api";
import { DialogModal } from "@bitbloq/ui";
import { RENEW_SESSION_MUTATION } from "../apollo/queries";
import { DocumentNode } from "apollo-link";
import ErrorLayout from "./ErrorLayout";
import { logout } from "../lib/session";

export interface ISessionWarningModalProps {
  subscription: DocumentNode;
  onExpired?: () => any;
}
const SessionWarningModal: FC<ISessionWarningModalProps> = ({
  subscription,
  onExpired
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [otherSessionOpened, setOtherSessionOpened] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(0);
  const [renewSession] = useMutation(RENEW_SESSION_MUTATION);

  useSubscription(subscription, {
    shouldResubscribe: true,
    onSubscriptionData: async ({ subscriptionData }) => {
      const sessionExpires: ISessionExpires =
        (subscriptionData.data &&
          (subscriptionData.data.userSessionExpires ||
            subscriptionData.data.submissionSessionExpires)) ||
        {};
      if (sessionExpires.reason === "OTHER_SESSION_OPEN") {
        setOtherSessionOpened(true);
      } else {
        if (sessionExpires.expiredSession && onExpired) {
          console.log("entra expired");
          onExpired();
        }
        if (
          !sessionExpires.expiredSession &&
          Number(sessionExpires.secondsRemaining) >
            (sessionExpires.showSessionWarningSecs
              ? sessionExpires.showSessionWarningSecs
              : 350)
        ) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
          setSecondsRemaining(
            Math.ceil(Number(sessionExpires.secondsRemaining))
          );
        }
      }
    }
  });

  useEffect(() => {
    const interval = setInterval(
      () =>
        secondsRemaining > 0 ? setSecondsRemaining(secondsRemaining - 1) : null,
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, [secondsRemaining]);

  const onContinue = async () => {
    await renewSession();
    setIsOpen(false);
  };

  return (
    <>
      {otherSessionOpened && (
        <ErrorLayout
          title="Has iniciado sesión en otro dispositivo"
          text="Solo se puede tener una sesión abierta al mismo tiempo"
          onOk={() => logout()}
        />
      )}
      <DialogModal
        isOpen={isOpen}
        title="¿Sigues ahí?"
        content={
          <p>
            Parece que te has ido, si no quieres seguir trabajando saldrás de tu
            cuenta en <b>{secondsRemaining} segundos</b>.
          </p>
        }
        okText="Si, quiero seguir trabajando"
        onOk={() => onContinue()}
      />
    </>
  );
};

export default SessionWarningModal;
