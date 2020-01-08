import React, { FC, useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { ISessionExpires } from "@bitbloq/api";
import { DialogModal } from "@bitbloq/ui";
import { logout } from "../lib/session";
import { RENEW_SESSION_MUTATION } from "../apollo/queries";
import { DocumentNode } from "apollo-link";

export interface ISessionWarningModalProps {
  subscription: DocumentNode;
  setActivteToFalse?: () => any;
}
const SessionWarningModal: FC<ISessionWarningModalProps> = ({
  subscription,
  setActivteToFalse
}) => {
  const [isOpen, setIsOpen] = useState(false);
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
      if (sessionExpires.expiredSession) {
        if (
          subscriptionData.data.submissionSessionExpires &&
          subscriptionData.data.submissionSessionExpires.expiredSession &&
          setActivteToFalse
        ) {
          await setActivteToFalse();
        }
        return logout();
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
        setSecondsRemaining(Math.ceil(Number(sessionExpires.secondsRemaining)));
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
  };

  return (
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
  );
};

export default SessionWarningModal;
