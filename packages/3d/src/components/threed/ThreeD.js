import React from 'react';
import {connect} from 'react-redux';
import {withTranslate} from '../TranslateProvider';
import {setAdvancedMode, newScene} from '../../actions/threed';
import styled from '@emotion/styled';
import ObjectTree from './ObjectTree';
import ThreeDViewer from './ThreeDViewer.tsx';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';
import {Document, Icon, Switch} from '@bitbloq/ui';

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

const menuOptions = ({advancedMode}, t) => [
  {
    id: 'file',
    label: t('menu-file'),
    children: [
      {
        id: 'download-project',
        label: t('menu-download-project'),
        icon: <Icon name="download" />,
      },
    ],
  },
  {
    id: 'view',
    label: t('menu-view'),
    children: [
      {
        id: 'mode',
        label: t('menu-mode'),
        icon: <Icon name="difficulty" />,
        children: [
          {
            id: 'basic-mode',
            label: t('menu-basic'),
            checked: !advancedMode,
          },
          {
            id: 'advanced-mode',
            label: t('menu-advanced'),
            checked: advancedMode,
          },
        ],
      },
      {
        id: 'change-theme',
        label: t('menu-change-theme'),
        icon: <Icon name="brush" />,
        children: [
          {
            id: 'color-theme',
            label: t('menu-color'),
          },
          {
            id: 'gray-theme',
            label: t('menu-gray'),
          },
        ],
      },
    ],
  },
  {
    id: 'share',
    label: t('menu-share'),
    children: [
      {
        id: 'publish-explora',
        label: t('menu-publish-in-explora'),
        icon: <Icon name="publish" />,
      },
    ],
  },
];

class ThreeD extends React.Component {

  componentDidMount() {
    const {initialContent, newScene} = this.props;

    if (initialContent) {
      newScene(initialContent);
    }
  }

  onMenuOptionClick = option => {
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
    const {children, advancedMode, setAdvancedMode, t} = this.props;

    const menuRightContent = (
      <AdvanceModeWrap>
        <span>{t('menu-advanced-mode')}</span>
        <Switch value={advancedMode} onChange={setAdvancedMode} />
      </AdvanceModeWrap>
    );

    const mainTab = (
      <Document.Tab
        key="3d"
        icon={<Icon name="threed" />}
        label={t('tab-3d')}>
        <Container>
          <ObjectTree />
          <MainArea>
            <Toolbar />
            <ThreeDViewer />
          </MainArea>
          <PropertiesPanel />
        </Container>
      </Document.Tab>
    );

    return (
      <Document
        title={t('untitled-project')}
        menuOptions={menuOptions(this.props, t)}
        onMenuOptionClick={this.onMenuOptionClick}
        menuRightContent={menuRightContent}>
        {(typeof children === 'function') ? children(mainTab) : mainTab}
      </Document>
    );
  }
}

const mapStateToProps = state => ({
  advancedMode: state.threed.ui.advancedMode,
});

const mapDispatchToProps = dispatch => ({
  setAdvancedMode: active => dispatch(setAdvancedMode(active)),
  newScene: json => dispatch(newScene(json)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withTranslate(ThreeD));
