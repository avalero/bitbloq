import * as React from 'react';
import { navigate } from "gatsby";
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {colors, DropDown, Icon} from '@bitbloq/ui';
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
    <Query
      query={ME_QUERY}
      fetchPolicy="network-only"
    >
      {({ loading, error, data }) => {
        if (loading) return null;

        if (error) {
          localStorage.setItem('authToken', '');
          navigate('/');
          return null;
        }

        return (
          <UserContainer>
            <UserName>{data.me && data.me.name}</UserName>
            <DropDown>
              {(isOpen: boolean) => (
                <ContextButton isOpen={isOpen}>
                  <Icon name="ellipsis" />
                </ContextButton>
              )}
              <ContextMenu>
                <ContextMenuOption onClick={() => {
                  localStorage.setItem('authToken', '');
                  navigate('/');
                }}>
                  Cerrar sesión
                </ContextMenuOption>
              </ContextMenu>
            </DropDown>
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

interface ContextButtonProps {
  isOpen: boolean;
}
const ContextButton = styled.div<ContextButtonProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;
  border: solid 1px white;

  ${props =>
    props.isOpen &&
    css`
      border: solid 1px #dddddd;
      background-color: #e8e8e8;
    `} svg {
    transform: rotate(90deg);
  }
`;

const ContextMenu = styled.div`
  background-color: white;
  margin-top: 6px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: solid 1px #cfcfcf;
`;

const ContextMenuOption = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1px solid #ebebeb;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 20px;

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }
`;
