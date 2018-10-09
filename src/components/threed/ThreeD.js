import React from 'react';
import styled from 'react-emotion';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './DummyThreeDViewer';
import PropertiesPanel from './PropertiesPanel';
import PropertiesPanelBloqs from './PropertiesPanelBloqs';
import ContextMenu from './ContextMenu';

const Container = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

class ThreeD extends React.Component {
  render() {
    const PropertiesPanelComponent =
      window.location.hash.indexOf('opcion2') >= 0
        ? PropertiesPanelBloqs
        : PropertiesPanel;

    return (
      <Container>
        <ObjectTree />
        <ThreeDViewer />
        <PropertiesPanelComponent />
        <ContextMenu />
      </Container>
    );
  }
}

export default ThreeD;
