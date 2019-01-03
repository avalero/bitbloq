import * as React from 'react';
import styled from '@emotion/styled';
import {colors} from '@bitbloq/ui';

const Container = styled.div`
  display: flex;
  height: 60px;
  padding: 0px 40px;
  align-items: center;
`;

const AppHeader = () => (
  <Container>
    <Logo>Bitbloq</Logo>
    <UserContainer>
      <UserAvatar />
    </UserContainer>
  </Container>
);

export default AppHeader;

const Logo = styled.div`
  flex: 1;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;
`;

const UserAvatar = styled.div`
  background-color: ${colors.gray2};
  width: 40px;
  height: 40px;
  border-radius: 20px;
`;
