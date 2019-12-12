import React, { FC, useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { DialogModal } from "@bitbloq/ui";
import { useSessionEvent, onSessionActivity, logout } from "../lib/session";
import {
  USER_SESSION_EXPIRES_SUBSCRIPTION,
  RENEW_SESSION_MUTATION
} from "../apollo/queries";
import { ISessionExpires } from "../../../api/src/api-types";
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
      console.log(subscriptionData);
      if (sessionExpires.expiredSession) {
        if (
          subscriptionData.data.submissionSessionExpires &&
          subscriptionData.data.submissionSessionExpires.expiredSession &&
          setActivteToFalse
        ) {
          console.log("entra en quitar bolita verde");
          await setActivteToFalse();
        }
        console.log("entra en logout");
        logout();
      }
      if (Number(sessionExpires.secondsRemaining) < 120) {
        setIsOpen(true);
        setSecondsRemaining(Math.ceil(Number(sessionExpires.secondsRemaining)));
      }
      if (
        !sessionExpires.expiredSession &&
        Number(sessionExpires.secondsRemaining) > 120
      ) {
        setIsOpen(false);
      }
    }
  });

  useEffect(() => {
    const interval = setInterval(
      () => setSecondsRemaining(secondsRemaining - 1),
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
