import React, { FC } from "react";
import styled from "@emotion/styled";
import { Global, css } from "@emotion/core";
import { baseStyles, colors, HorizontalRule } from "@bitbloq/ui";
import SEO from "../components/SEO";
import logoBetaImage from "../images/logo-beta.svg";

export enum AccessLayoutSize {
  SMALL,
  MEDIUM,
  BIG
}

interface AccessLayoutProps {
  title: string;
  panelTitle: string;
  size?: AccessLayoutSize;
}

const AccessLayout: FC<AccessLayoutProps> = ({
  title,
  panelTitle,
  size,
  children
}) => {
  return (
    <>
      <SEO title={title} keywords={[`bitbloq login`]} />
      <Global styles={baseStyles} />
      <Wrap>
        <Container size={size}>
          <Logo src={logoBetaImage} alt="Bitbloq Beta" />
          <MainPanel>
            <Title>{panelTitle}</Title>
            <HorizontalRule small />
            <PanelContent>{children}</PanelContent>
          </MainPanel>
        </Container>
      </Wrap>
    </>
  );
};

AccessLayout.defaultProps = {
  size: AccessLayoutSize.SMALL
};

export default AccessLayout;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  justify-content: center;
  background-color: ${colors.gray1};
`;

interface ContainerProps {
  size?: AccessLayoutSize;
}
const Container = styled.div<ContainerProps>`
  max-width: ${props => {
    switch (props.size) {
      case AccessLayoutSize.SMALL:
        return "380px";
      case AccessLayoutSize.MEDIUM:
        return "500px";
      case AccessLayoutSize.BIG:
        return "800px";
    }
  }};
  margin: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
`;

const Logo = styled.img`
  height: 40px;
  margin-bottom: 40px;
`;

const MainPanel = styled.div`
  border-radius: 10px;
  box-shadow: 0 10px 40px 0 rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
`;

const Title = styled.div`
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: Roboto;
  font-size: 18px;
  font-weight: bold;
`;

const PanelContent = styled.div`
  padding: 40px;
`;
