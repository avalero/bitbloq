import React from 'react';
import styled from 'react-emotion';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import Document, {Tab} from '../Document';
import ThreeDIcon from '../icons/ThreeD';
import InfoIcon from '../icons/Info';
import DownloadIcon from '../icons/Download';

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

const menuOptions = [
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'download-project',
        label: 'Download Project',
        icon: <DownloadIcon />,
      },
    ],
  },
  {
    id: 'view',
    label: 'View',
    children: [
      {
        id: 'mode',
        label: 'Mode',
        children: [
          {
            id: 'basic-mode',
            label: 'Basic',
          },
          {
            id: 'advanced-mode',
            label: 'Advanced',
          },
        ],
      },
      {
        id: 'change-theme',
        label: 'Change theme',
        children: [
          {
            id: 'color-theme',
            label: 'Color',
          },
          {
            id: 'gray-theme',
            label: 'Gris',
          },
        ],
      },
    ],
  },
  {
    id: 'share',
    label: 'Share',
    children: [
      {
        id: 'publish-explora',
        label: 'Publish in Explora',
      },
    ],
  },
];

class ThreeD extends React.Component {
  render() {
    return (
      <Document menuOptions={menuOptions}>
        <Tab icon={<ThreeDIcon />}>
          <Container>
            <ObjectTree />
            <MainArea>
              <Toolbar />
              <ThreeDViewer />
            </MainArea>
            <PropertiesPanel />
          </Container>
        </Tab>
        <Tab icon={<InfoIcon />} />
      </Document>
    );
  }
}

export default ThreeD;
