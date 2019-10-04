import React, { FC } from "react";
import styled from "@emotion/styled";

interface UserInfoProps {
  name: string;
  img?: string;
}

const UserInfo: FC<UserInfoProps> = (props: UserInfoProps) => {
  return (
    <Info>
      <UserName>{props.name}</UserName>
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

interface UserImgProps {
  img?: string;
}

const UserImg = styled.div<UserImgProps>`
  background: url(${(props: UserImgProps) => props.img}) center/40px 40px,
    #3b3e45;
  border-radius: 100%;
  height: 40px;
  width: 40px;
`;

const UserName = styled.p`
  align-items: center;
  color: #3b3e45;
  display: flex;
  font-family: Roboto;
  font-size: 14px;
  height: 16px;
  margin-right: 10px;
  max-width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
