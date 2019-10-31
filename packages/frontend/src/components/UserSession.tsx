import React, { FC } from "react";
import styled from "@emotion/styled";
import { DropDown, Icon } from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import useLogout from "../lib/useLogout";
import MenuButton from "./MenuButton";

const UserSession = () => {
  const userData = useUserData();
  const logout = useLogout();

  return (
    <Container>
      <UserName>{userData && userData.name}</UserName>
      <DropDown>
        {(isOpen: boolean) => (
          <MenuButton isOpen={isOpen} />
        )}
        <ContextMenu>
          <ContextMenuOption onClick={() => logout()}>
            Cerrar sesión
          </ContextMenuOption>
        </ContextMenu>
      </DropDown>
    </Container>
  );
};

export default UserSession;

/* styled components */

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const UserName = styled.div`
  font-size: 14px;
  margin-right: 10px;
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
