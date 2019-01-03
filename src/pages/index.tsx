import * as React from 'react';
import styled from '@emotion/styled';
import {navigate} from 'gatsby';
import {Global, css} from '@emotion/core';
import {baseStyles, colors, Input, Panel, Button} from '@bitbloq/ui';
import SEO from '../components/SEO';

enum TabType {
  Teacher,
  Student,
}

interface IndexPageProps {}

class IndexPageState {
  readonly currentTab: TabType = TabType.Teacher;
}

class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
  readonly state = new IndexPageState();

  onTeacherLogin = () => {
    navigate('/app');
  };

  onStudentLogin = () => {
    navigate('/app');
  };

  render() {
    const {currentTab} = this.state;

    return (
      <>
        <SEO title="Home" keywords={[`bitbloq`]} />
        <Global styles={baseStyles} />
        <Wrap>
          <Container>
            <h1>Bitbloq!</h1>
            <LoginPanel>
              <Tabs>
                <Tab
                  active={currentTab === TabType.Teacher}
                  onClick={() => this.setState({currentTab: TabType.Teacher})}>
                  Profesor
                </Tab>
                <Tab
                  active={currentTab === TabType.Student}
                  onClick={() => this.setState({currentTab: TabType.Student})}>
                  Alumno
                </Tab>
              </Tabs>
              {this.renderTabContent()}
            </LoginPanel>
          </Container>
        </Wrap>
      </>
    );
  }

  renderTabContent() {
    const {currentTab} = this.state;

    if (currentTab === TabType.Teacher) {
      return (
        <TabContent key={TabType.Teacher}>
          <TabInfo />
          <DashedLine />
          <LoginForm>
            <Input placeholder="Correo electrónico" type="email" />
            <Input placeholder="Contraseña" type="password" />
            <LoginButton onClick={this.onTeacherLogin}>Entrar</LoginButton>
          </LoginForm>
        </TabContent>
      );
    }

    if (currentTab === TabType.Student) {
      return (
        <TabContent key={TabType.Student}>
          <TabInfo />
          <DashedLine />
          <LoginForm>
            <Input placeholder="Nombre de usuario" />
            <Input placeholder="Código de ejercicio" />
            <LoginButton onClick={this.onStudentLogin}>Entrar</LoginButton>
          </LoginForm>
        </TabContent>
      );
    }
  }
}

export default IndexPage;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 1085px;
  margin: 60px;
  width: 100%;
`;

const LoginPanel = styled(Panel)`
  display: flex;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 180px;
  padding-top: 40px;
  border-right: 1px solid ${colors.gray3};
`;

interface TabProps {
  active: boolean;
}
const Tab =
  styled.div <
  TabProps >
  `
  background-color: ${colors.gray2};
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  border-color: ${colors.gray2} white
    ${colors.gray2} ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray4};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 60px;
  border-radius: 4px 0 0 4px;
  margin-right: -1px;
  cursor: pointer;

  ${props =>
    props.active &&
    css`
      background-color: white;
      border-color: ${colors.gray3} white ${colors.gray3} ${colors.gray3};
      color: ${colors.black};
    `}
`;

const TabContent = styled.div`
  display: flex;
  flex: 1;
`;

const TabInfo = styled.div`
  flex: 1;
`;

const DashedLine = styled.div`
  width: 1px;
  background-image: linear-gradient(${colors.gray3} 55%, white 45%);
  background-size: 100% 24px;
`;

const LoginForm = styled.div`
  box-sizing: border-box;
  width: 360px;
  padding: 40px;

  ${Input} {
    margin-bottom: 20px;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
`;
