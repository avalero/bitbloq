import React from 'react';
import {connect} from 'react-redux';
import {setAdvancedMode} from '../../actions/threed';
import styled from 'react-emotion';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer.tsx';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import Document, {Tab} from '../Document';
import Switch from '../Switch';
import {Icon} from '@bitbloq/ui';

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

const AdvanceModeWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  span {
    font-size: 14px;
    margin-right: 10px;
  }
`;

const menuOptions = props => [
  {
    id: 'file',
    label: 'File',
    children: [
      {
        id: 'download-project',
        label: 'Download Project',
        icon: <Icon name="download" />,
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
        icon: <Icon name="difficulty" />,
        children: [
          {
            id: 'basic-mode',
            label: 'Basic',
            checked: !props.advancedMode,
          },
          {
            id: 'advanced-mode',
            label: 'Advanced',
            checked: props.advancedMode,
          },
        ],
      },
      {
        id: 'change-theme',
        label: 'Change theme',
        icon: <Icon name="brush" />,
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
        icon: <Icon name="publish" />,
      },
    ],
  },
];

class ThreeD extends React.Component {
  onMenuOptionClick = (option) => {
    const {setAdvancedMode} = this.props;
    switch (option.id) {
      case 'basic-mode':
        setAdvancedMode(false);
        return;

      case 'advanced-mode':
        setAdvancedMode(true);
        return;

      default:
        return;
    }
  };

  render() {
    const {advancedMode, setAdvancedMode} = this.props;

    const menuRightContent = (
      <AdvanceModeWrap>
        <span>Modo avanzado</span>
        <Switch value={advancedMode} onChange={setAdvancedMode} />
      </AdvanceModeWrap>
    );

    return (
      <Document
        menuOptions={menuOptions(this.props)}
        onMenuOptionClick={this.onMenuOptionClick}
        menuRightContent={menuRightContent}>
        <Tab icon={<Icon name="threed" />} label="3D">
          <Container>
            <ObjectTree />
            <MainArea>
              <Toolbar />
              <ThreeDViewer />
            </MainArea>
            <PropertiesPanel />
          </Container>
        </Tab>
        <Tab icon={<Icon name="info" />} label="Información del proyecto" />
      </Document>
    );
  }
}

const mapStateToProps = state => ({
  advancedMode: state.threed.ui.advancedMode,
});

const mapDispatchToProps = dispatch => ({
  setAdvancedMode: active => dispatch(setAdvancedMode(active)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeD);
