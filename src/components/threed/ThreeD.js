import React from 'react';
import styled from 'react-emotion';
import ThreeDIcon from '../icons/ThreeD';
import InfoIcon from '../icons/Info';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer';
import PropertiesPanel from './PropertiesPanel';
import PropertiesPanelBloqs from './PropertiesPanelBloqs';
import Document, {Tab} from '../Document';
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
      <Document>
        <Tab icon={<ThreeDIcon />}>
          <Container>
            <ObjectTree />
            <ThreeDViewer />
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
