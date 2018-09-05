import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import NotificationsBar from './NotificationsBar';
import Hardware from './Hardware';
import Software from './Software';
import ThreeD from './threed/ThreeD';
import {openSection, keyDown, keyUp} from '../actions/ui';
import {uploadCode} from '../actions/software';
import {colors} from '../base-styles';
import HardwareIcon from '../assets/images/hardware.svg';
import SoftwareIcon from '../assets/images/software.svg';
import ThreeDIcon from '../assets/images/3d.svg';
import UploadIcon from '../assets/images/rocket.svg';

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
  display: flex;
  height: 72px;
  box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.2);
  z-index: 4;
  background-color: white;
`;

const Tabs = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const Tab = styled.div`
  padding: 0px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 69px;
  min-width: 120px;
  color: #333;
  cursor: pointer;

  ${props =>
    props.selected &&
    css`
      border-bottom: 3px solid ${colors.brand};
    `};
`;

const TabIcon = styled.img`
  height: 24px;
  margin-right: 12px;
`;

const Buttons = styled.div`
  display: flex;
`;

const Button = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 72px;
  border-left: 1px solid #ddd;
  cursor: pointer;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const ButtonIcon = styled.img`
  height: 30px;
`;


const sections = [
  {
    id: 'hardware',
    title: 'Hardware',
    icon: HardwareIcon,
    component: Hardware,
  },
  {
    id: 'software',
    title: 'Software',
    icon: SoftwareIcon,
    component: Software,
  },
  {
    id: '3d',
    title: '3D',
    icon: ThreeDIcon,
    component: ThreeD,
  },
];

class App extends React.Component {
  componentDidMount() {
    document.body.addEventListener('keydown', this.onBodyKeyDown);
    document.body.addEventListener('keyup', this.onBodyKeyUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.onBodyKeyDown);
    document.body.removeEventListener('keyup', this.onBodyKeyUp);
  }

  onBodyKeyDown = (e) => {
    this.props.keyDown(e.key);
  }

  onBodyKeyUp = (e) => {
    this.props.keyUp(e.key);
  }

  render() {
    const {currentSectionId, openSection, uploadCode} = this.props;
    const currentSection = sections.find(
      section => section.id === currentSectionId,
    );

    return (
      <Container>
        <Header>
          <Tabs>
            {sections.map(section => (
              <Tab
                key={section.id}
                selected={section === currentSection}
                onClick={() => openSection(section.id)}>
                <TabIcon src={section.icon} />
                {section.title}
              </Tab>
            ))}
          </Tabs>
          <Buttons>
            <Button onClick={uploadCode}>
              <ButtonIcon src={UploadIcon} />
            </Button>
          </Buttons>
        </Header>
        <NotificationsBar />
        {currentSection &&
          currentSection.component &&
          React.createElement(currentSection.component)}
      </Container>
    );
  }
};

const mapStateToProps = ({ui}) => ({
  currentSectionId: ui.currentSectionId,
});

const mapDispatchToProps = {openSection, uploadCode, keyDown, keyUp};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
