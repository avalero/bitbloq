import { useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import Router from "next/router";
import queryString from "query-string";
import { FC, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { CONFIRM_NEW_EMAIL } from "../../../apollo/queries";
import withApollo from "../../../apollo/withApollo";
import EditTitleModal from "../../../components/EditTitleModal";

const ChangeEmailPage: FC = () => {
  const [confirmEmail] = useMutation(CONFIRM_NEW_EMAIL);
  const [error, setError] = useState<string>("");
  const [queryToken, setQueryToken] = useState<string>("");
  const t = useTranslate();

  useEffect(() => {
    const { token } = queryString.parse(window.location.search);
    if (token) {
      setQueryToken(typeof token === "string" ? token : token[0]);
    }
  }, []);

  const onSaveEmail = (newPassword: string) => {
    if (!newPassword) {
      setError(t("change-email-page.password-empty"));
      return;
    }
    confirmEmail({
      variables: {
        password: newPassword,
        token: queryToken
      }
    }).catch(e => {
      if (
        e.graphQLErrors &&
        e.graphQLErrors[0] &&
        e.graphQLErrors[0].extensions.code === "PASSWORD_INCORRECT"
      ) {
        setError(t("change-email-page.password-error"));
      }
    });
  };

  return (
    <Container>
      <ConfirmPasswordModal
        // errorText={error}
        isOpen={true}
        label={t("change-email-page.placeholder")}
        modalText={t("change-email-page.text")}
        modalTitle={t("change-email-page.title")}
        onCancel={() => Router.replace("/")}
        onSave={onSaveEmail}
        placeholder={t("change-email-page.placeholder")}
        saveButton={t("change-email-page.confirm")}
        transparentOverlay={true}
        type="password"
        validateInput={false}
      />
    </Container>
  );
};

export default withApollo(ChangeEmailPage);

const ConfirmPasswordModal = styled(EditTitleModal)`
  p {
    color: #5d6069;
    line-height: 1.57;
    margin: 10px 0 40px !important;
  }
`;

const Container = styled.div`
  background-color: #fbfbfb;
  height: 100vh;
  width: 100vw;
`;
