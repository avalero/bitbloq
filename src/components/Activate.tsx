import * as React from "react";
import { navigate } from "gatsby";
import { Mutation } from "react-apollo";
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
    return <div />;
  }
}

export default () =>
  <Mutation
    mutation={ACTIVATE_ACCOUNT_MUTATION}
    onCompleted={({ activateAccount: token }) => {
      debugger;
      window.localStorage.setItem("authToken", token);
      navigate("/app");
    }}
  >
    {mutate => <Activate activateAccount={mutate} />}
  </Mutation>;
