import React, { FC, useEffect, useState } from "react";
import { useSubscription, useMutation } from "@apollo/react-hooks";
import { ISessionExpires } from "@bitbloq/api";
import { DialogModal, useTranslate } from "@bitbloq/ui";
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
  const t = useTranslate();
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
          title={t("session-warning-modal.other-opened.title")}
          text={t("session-warning-modal.other-opened.text")}
          onOk={() => logout()}
        />
      )}
      <DialogModal
        isOpen={isOpen}
        title={t("session-warning-modal.expires.title")}
        content={
          <p>
            {t("session-warning-modal.expires.text-1")}{" "}
            <b>
              {t("session-warning-modal.expires.text-2", [
                String(secondsRemaining)
              ])}
            </b>
            .
          </p>
        }
        okText={t("session-warning-modal.expires.ok-text")}
        onOk={() => onContinue()}
      />
    </>
  );
};

export default SessionWarningModal;
