import React, { FC } from "react";
import { colors, Layout, HorizontalRule, Spinner } from "@bitbloq/ui";
import styled from "@emotion/styled";
import AppFooter from "./AppFooter";
import AppHeader from "./AppHeader";
import UserSession from "./UserSession";

interface IAppLayoutProps {
  header?: JSX.Element | string;
  loading?: boolean;
}

const AppLayout: FC<IAppLayoutProps> = ({ header, loading, children }) => {
  return (
    <Container>
      <AppHeader>
        <UserSession />
      </AppHeader>
      <Wrapper>
        {loading ? (
          <Loading />
        ) : (
          <Content>
            {header && (
              <>
                <Header>{header}</Header>
                <Rule />
              </>
            )}
            {children}
          </Content>
        )}
      </Wrapper>
      <AppFooter />
    </Container>
  );
};

export default AppLayout;

/* Styled components */

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled(Layout)`
  padding-bottom: 60px;
`;

const Header = styled.div`
  align-items: center;
  display: flex;
  font-size: 24px;
  font-weight: bold;
  height: 80px;
`;

const Loading = styled(Spinner)`
  height: 100%;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
  margin-bottom: 20px;
`;

const Wrapper = styled.div`
  background-color: ${colors.gray1};
  flex: 1;
`;
