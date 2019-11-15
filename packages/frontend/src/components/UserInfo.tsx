import React, { FC } from "react";
import styled from "@emotion/styled";

interface IUserInfoProps {
  name: string;
  img?: string;
}

const UserInfo: FC<IUserInfoProps> = props => {
  return (
    <Info>
      <UserName href="/app">{props.name}</UserName>
      <UserImg img={props.img} />
    </Info>
  );
};

export default UserInfo;

const Info = styled.div`
  align-items: center;
  display: flex;
  border-left: solid 1px #cfcfcf;
  height: 100%;
  padding-left: 19px;
`;

const UserImg = styled.div<{ img?: string }>`
  background: url(${props => props.img}) center/40px 40px, #3b3e45;
  border-radius: 100%;
  height: 40px;
  width: 40px;
`;

const UserName = styled.a`
  align-items: center;
  color: #3b3e45 !important;
  display: flex;
  font-family: Roboto;
  font-size: 14px;
  height: 16px;
  margin-right: 10px;
  max-width: 210px;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
