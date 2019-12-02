import React, { FC, useState } from "react";
import { colors, Layout, HorizontalRule } from "@bitbloq/ui";
import styled from "@emotion/styled";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import UserSession from "./UserSession";
import CloudModal from "./CloudModal";

interface IAppLayoutProps {
  header?: JSX.Element | string;
}

const AppLayout: FC<IAppLayoutProps> = ({ header, children }) => {
  const [cloudModalOpen, setCloudModalOpen] = useState(false);

  return (
    <Container>
      <AppHeader>
        <UserSession cloudClick={() => setCloudModalOpen(true)} />
      </AppHeader>
      <Content>
        {header && (
          <>
            <Header>{header}</Header>
            <Rule />
          </>
        )}
        {children}
      </Content>
      <AppFooter />
      <CloudModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </Container>
  );
};

export default AppLayout;

/* Styled components */

const Header = styled.div`
  align-items: center;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  height: 80px;
`;

const Container = styled.div`
  background-color: ${colors.gray1};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled(Layout)`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  width: 100%;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
`;
