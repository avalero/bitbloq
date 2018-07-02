import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import Hardware from './Hardware';
import Software from './Software';
import ThreeD from './ThreeD';
import {openSection} from '../actions/ui';
import {colors} from '../base-styles';
import HardwareIcon from '../assets/images/hardware.svg';
import SoftwareIcon from '../assets/images/software.svg';
import ThreeDIcon from '../assets/images/3d.svg';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  height: 72px;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
  z-index: 2;
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

const sections = [
  {
    id: 'hardware',
    title: 'Hardware',
    icon: HardwareIcon,
    component: Hardware
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
    component: ThreeD
  },
];

const App = ({currentSectionId, openSection}) => {
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
      </Header>
      {currentSection &&
        currentSection.component &&
        React.createElement(currentSection.component)}
    </Container>
  );
};

const mapStateToProps = ({ui}) => ({
  currentSectionId: ui.currentSectionId,
});

const mapDispatchToProps = {openSection};

export default connect(mapStateToProps, mapDispatchToProps)(App);
