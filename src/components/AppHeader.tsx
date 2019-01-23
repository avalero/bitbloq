import * as React from 'react';
import styled from '@emotion/styled';
import {colors} from '@bitbloq/ui';
import { Query } from "react-apollo";
import logoBetaImage from '../images/logo-horizontal.svg';
import gql from "graphql-tag";

const ME_QUERY = gql`
  query Me {
    me {
      name
    }
  }
`;

const AppHeader = () => (
  <Container>
    <Logo src={logoBetaImage} alt="Bitbloq" />
    <Query query={ME_QUERY}>
      {({ loading, error, data }) => {
        if (loading || error) return null;

        return (
          <UserContainer>
            <UserName>{data.me.name}</UserName>
            <UserAvatar />
          </UserContainer>
        );
      }}
    </Query>
  </Container>
);

export default AppHeader;

/* styled components */

const Container = styled.div`
  background-color: white;
  display: flex;
  min-height: 60px;
  padding: 0px 20px;
  align-items: center;
  border-bottom: 1px solid ${colors.gray3};
  justify-content: space-between;
`;

const Logo = styled.img`
  height: 20px;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 14px;
  margin-right: 10px;
`;

const UserAvatar = styled.div`
  background-color: ${colors.gray2};
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
