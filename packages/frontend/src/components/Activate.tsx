import * as React from "react";
import styled from '@emotion/styled';
import { navigate } from "gatsby";
import { Mutation } from "react-apollo";
import { Spinner } from '@bitbloq/ui';
import gql from "graphql-tag";

const ACTIVATE_ACCOUNT_MUTATION = gql`
  mutation ActivateAccount($token: String!) {
    activateAccount(token: $token)
  }
`;

interface ActivateProps {
  activateAccount: (any) => any;
}

class Activate extends React.Component<ActivateProps> {
  componentDidMount() {
    const token = location.search.split("?token=")[1];
    this.props.activateAccount({ variables: { token } });
  }

  render() {
    return <Container><Loading /></Container>;
  }
}

export default () =>
  <Mutation
    mutation={ACTIVATE_ACCOUNT_MUTATION}
    onCompleted={({ activateAccount: token }) => {
      window.localStorage.setItem("authToken", token);
      navigate("/app");
    }}
  >
    {mutate => <Activate activateAccount={mutate} />}
  </Mutation>;

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
