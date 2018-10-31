import React from 'react';
import styled from 'react-emotion';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import PropertiesPanelBloqs from './PropertiesPanelBloqs';
import ContextMenu from './ContextMenu';

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

const MainArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

class ThreeD extends React.Component {
  render() {
    const PropertiesPanelComponent =
      window.location.hash.indexOf('opcion2') >= 0
        ? PropertiesPanelBloqs
        : PropertiesPanel;

    return (
      <Document>
        <Tab icon={<ThreeDIcon />}>
          <Container>
            <ObjectTree />
            <MainArea>
              <Toolbar />
              <ThreeDViewer />
            </MainArea>
            <PropertiesPanelComponent />
            <ContextMenu />
          </Container>
        </Tab>
        <Tab icon={<InfoIcon />}>
        </Tab>
      </Document>
    );
  }
}

export default ThreeD;
