import { colors, DialogModal, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import Router from "next/router";
import queryString from "query-string";
import { FC, useEffect, useRef, useState } from "react";
import { useMutation } from "react-apollo";
import {
  CHECK_EMAIL_TOKEN_MUTATION,
  CONFIRM_NEW_EMAIL
} from "../../../apollo/queries";
import withApollo from "../../../apollo/withApollo";
import EditInputModal from "../../../components/EditInputModal";
import Loading from "../../../components/Loading";
import { setToken, useSessionEvent } from "../../../lib/session";
import useUserData from "../../../lib/useUserData";

const ChangeEmailPage: FC = () => {
  const [confirmEmail] = useMutation(CONFIRM_NEW_EMAIL);
  const [checkToken] = useMutation(CHECK_EMAIL_TOKEN_MUTATION);
  const tokenRef = useRef<string>("");
  const [disabledButton, setDisabledButton] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [queryToken, setQueryToken] = useState<string>("");
  const [valid, setValid] = useState<boolean>(true);
  const t = useTranslate();
  const { fetchUserData } = useUserData();

  useEffect(() => {
    const { token } = queryString.parse(window.location.search);
    if (token) {
      const parsedToken = typeof token === "string" ? token : token[0];
      checkToken({
        variables: {
          token: parsedToken
        }
      })
        .then(result => {
          const {
            data: { checkTokenChangeEmail }
          } = result;
          if (checkTokenChangeEmail) {
            setQueryToken(parsedToken);
          } else {
            setValid(false);
          }
        })
        .catch(() => {
          setValid(false);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  useSessionEvent("new-token", event => {
    if (
      event.event === "new-token" &&
      tokenRef.current &&
      tokenRef.current === event.data
    ) {
      fetchUserData();
      Router.replace("/app");
    }
  });

  const onSaveEmail = (newPassword: string) => {
    if (!newPassword) {
      setError(t("change-email-page.password-empty"));
      return;
    }
    setDisabledButton(true);
    confirmEmail({
      variables: {
        password: newPassword,
        token: queryToken
      }
    })
      .then(result => {
        const {
          data: { confirmChangeEmail }
        } = result;
        if (confirmChangeEmail) {
          setToken(confirmChangeEmail);
          tokenRef.current = confirmChangeEmail;
        }
      })
      .catch(e => {
        setDisabledButton(false);
        if (
          e.graphQLErrors &&
          e.graphQLErrors[0] &&
          e.graphQLErrors[0].extensions.code === "PASSWORD_INCORRECT"
        ) {
          setError(t("change-email-page.password-error"));
        }
      });
  };

  return loading ? (
    <Loading />
  ) : (
    <Container>
      <ConfirmPasswordModal
        disabledSave={disabledButton}
        errorText={error}
        isOpen={valid}
        label={t("change-email-page.placeholder")}
        modalText={t("change-email-page.text")}
        modalTitle={t("change-email-page.title")}
        onCancel={() => Router.replace("/")}
        onChange={() => setError("")}
        onSave={onSaveEmail}
        placeholder={t("change-email-page.placeholder")}
        saveButton={t("change-email-page.confirm")}
        transparentOverlay={true}
        title=""
        type="password"
        validateInput={false}
      />
      <DialogModal
        isOpen={!valid}
        okText={t("change-email-page.error.button")}
        onOk={() => Router.replace("/")}
        text={t("change-email-page.error.text")}
        title={t("change-email-page.error.title")}
        transparentOverlay={true}
      />
    </Container>
  );
};

export default withApollo(ChangeEmailPage, { requiresSession: false });

const ConfirmPasswordModal = styled(EditInputModal)`
  p {
    color: #5d6069;
    line-height: 1.57;
    margin: 10px 0 40px !important;
  }
`;

const Container = styled.div`
  background-color: ${colors.gray1};
  height: 100vh;
  width: 100vw;
`;
