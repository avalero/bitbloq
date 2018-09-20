import React from 'react';
import styled from 'react-emotion';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer';
import PropertiesPanel from './PropertiesPanel';
import ContextMenu from './ContextMenu';

const Container = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

class ThreeD extends React.Component {
  render() {
    return (
      <Container>
        <ObjectTree />
        <ThreeDViewer />
        <PropertiesPanel />
        <ContextMenu />
      </Container>
    );
  }
}

export default ThreeD;
