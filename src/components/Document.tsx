import * as React from 'react';
import styled, {css} from 'react-emotion';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  user-select: none;
`;

const Header = styled.div`
  height: 70px;
  display: flex;
`;

const DocumentIcon = styled.div`
  width: 70px;
  background-color: #4dc3ff;
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  padding-left: 18px;
  background-color: #ebebeb;
  flex: 1;
  font-weight: 500;
  font-style: italic;
`;

const Menu = styled.div`
  height: 40px;
  border-bottom: 1px solid #cfcfcf;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
`;

const Tabs = styled.div`
  width: 70px;
  min-width: 70px;
  background-color: #373b44;
  color: white;
`;

interface TabIconProps {
  selected: boolean;
}
const TabIcon = styled.div<TabIconProps>`
  height: 70px;
  border-bottom: 1px solid #797c81;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  svg {
    width: 24px;
    height: 24px;
    opacity: 0.5;
  }

  ${props =>
    props.selected &&
    css`
      background-color: #1e1f21;

      svg {
        opacity: 1;
      }
    `};
`;

interface ContentProps {
  active: boolean;
}
const Content = styled.div<ContentProps>`
  display: none;
  flex: 1;
  overflow: hidden;

  ${props =>
    props.active &&
    css`
      display: flex;
    `};
`;

export interface TabProps {
  icon: string;
}

export const Tab: React.SFC<TabProps> = props => null;

export interface DocumentProps {
  children?: React.ReactElement<Tab>[] | React.ReactElement<Tab>;
}

interface State {
  currentTabIndex: number;
}

class Document extends React.Component<Document, State> {
  state = {
    currentTabIndex: 0,
  };

  render() {
    const {children} = this.props;
    const {currentTabIndex} = this.state;

    const currentTab = React.Children.toArray(children)[currentTabIndex];

    return (
      <Container>
        <Header>
          <DocumentIcon />
          <Title>Proyecto sin título</Title>
        </Header>
        <Menu />
        <Main>
          <Tabs>
            {React.Children.map(children, (tab, i) => (
              <TabIcon
                selected={i === currentTabIndex}
                onClick={() => this.setState({currentTabIndex: i})}>
                {tab.props.icon}
              </TabIcon>
            ))}
          </Tabs>
          {React.Children.map(children, (tab, i) => (
            <Content active={i === currentTabIndex}>
              {tab.props.children}
            </Content>
          ))}
        </Main>
      </Container>
    );
  }
}

export default Document;
