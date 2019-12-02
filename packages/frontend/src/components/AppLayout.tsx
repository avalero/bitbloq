import React, { FC, useState } from "react";
import { colors } from "@bitbloq/ui";
import styled from "@emotion/styled";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import Layout from "./Layout";
import UserSession from "./UserSession";
import CloudModal from "./CloudModal";

const AppLayout: FC = ({ children }) => {
  const [cloudModalOpen, setCloudModalOpen] = useState(false);

  return (
    <Container>
      <AppHeader>
        <UserSession cloudClick={() => setCloudModalOpen(true)} />
      </AppHeader>
      <Content>{children}</Content>
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
