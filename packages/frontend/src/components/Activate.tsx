import { ApolloError } from "apollo-client";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import { Spinner } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { ACTIVATE_ACCOUNT_MUTATION } from "../apollo/queries";
import { setToken } from "../lib/session";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import ModalLayout from "./ModalLayout";

interface IActivateProps {
  token: string;
}

const Activate: FC<IActivateProps> = ({ token }) => {
  const router = useRouter();

  const [activateAccount] = useMutation(ACTIVATE_ACCOUNT_MUTATION);
  const [activate, setActivate] = useState<boolean>(false);
  const [error, setError] = useState<ApolloError>();

  useEffect(() => {
    activateAccount({ variables: { token } })
      .then(({ data }) => {
        setToken(data.activateAccount);
        setActivate(true);
      })
      .catch(e => setError(e));
  }, []);

  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
  }

  if (activate) {
    return (
      <ModalLayout
        title="Cuenta validada"
        modalTitle="Cuenta validada"
        text={
          "Tu cuenta ha sido validada con éxito. ¡Ahora puedes acceder y disfrutar de todas las ventajas de formar parte de Bitbloq!"
        }
        okText="¡Entrar en Bitbloq!"
        onOk={() => router.push("/app")}
        isOpen={true}
      />
    );
  }

  return (
    <Container>
      <Loading />
    </Container>
  );
};

export default Activate;

/* styled components */

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Loading = styled(Spinner)`
  flex: 1;
`;
