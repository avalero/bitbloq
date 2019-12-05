import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { colors, DropDown, Icon, useTranslate } from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import { logout } from "../lib/session";
import CloudModal from "./CloudModal";
import MenuButton from "./MenuButton";

const UserSession: FC = () => {
  const { userData } = useUserData();
  const router = useRouter();
  const t = useTranslate();
  const [cloudModalOpen, setCloudModalOpen] = useState(false);

  return (
    <>
      <UserName>{userData && userData.name}</UserName>
      <UserAvatar src={userData ? userData.avatar : ""} />
      <DropDown>
        {(isOpen: boolean) => <MenuButton isOpen={isOpen} />}
        <ContextMenu>
          <ContextMenuOption onClick={() => setCloudModalOpen(true)}>
            <CloudIcon name="cloud-logo" />
            {t("user.cloud.access")}
          </ContextMenuOption>
          <ContextMenuOption onClick={() => router.push("/app/account")}>
            {t("user.session.account")}
          </ContextMenuOption>
          <ContextMenuOption onClick={logout}>
            {t("user.session.logout")}
          </ContextMenuOption>
        </ContextMenu>
      </DropDown>
      <CloudModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </>
  );
};

export default UserSession;

/* styled components */

const UserName = styled.div`
  font-size: 14px;
`;

const UserAvatar = styled.div<{ src: string }>`
  background-color: ${colors.grayAvatar};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  border-radius: 50%;
  height: 40px;
  margin: 0 10px;
  width: 40px;
`;

const ContextMenu = styled.div`
  background-color: white;
  margin-top: 6px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: solid 1px #cfcfcf;
`;

const ContextMenuOption = styled.div`
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  display: flex;
  font-size: 14px;
  padding: 10px 14px;

  svg {
    margin-right: 10px;
  }

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }
`;

const CloudIcon = styled(Icon)`
  color: #6878f5;
`;
