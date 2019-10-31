import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import logoBetaImage from "../images/logo-beta.svg";

export interface AppHeaderProps {
  isSticky?: boolean;
}

const AppHeader: FC<AppHeaderProps> = ({
  children,
  isSticky = false
}) => {
  return (
    <Container isSticky={isSticky}>
      <Logo isSticky={isSticky} src={logoBetaImage} alt="Bitbloq" />
      {children}
    </Container>
  );
};

export default AppHeader;

/* styled components */

const Container = styled.div<AppHeaderProps>`
  background-color: white;
  display: flex;
  margin-top: ${props => (props.isSticky ? "10" : "0")}px;
  min-height: ${props => (props.isSticky ? "80" : "60")}px;
  padding: 0px 50px;
  align-items: center;
  border-bottom: ${props => (props.isSticky ? "0" : "1")}px solid ${colors.gray3};
  justify-content: space-between;
`;

const Logo = styled.img<AppHeaderProps>`
  height: ${props => (props.isSticky ? "40" : "30")}px;
`;
