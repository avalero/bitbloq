import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import Renderer from '../../lib/object3dts/Renderer';
import {selectObject, deselectAllObjects} from '../../actions/threed';
import Scene, {IHelperDescription} from '../../lib/object3dts/Scene';
import {IObjectsCommonJSON} from '../../lib/object3dts/ObjectsCommon';

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
`;

export interface ThreeDViewerProps {
  scene: Scene;
  sceneObjects: IObjectsCommonJSON[];
  activeOperation: IHelperDescription;
  selectObject: (object: IObjectsCommonJSON) => void;
  deselectAllObjects: () => void;
}

class ThreeDViewer extends React.Component<ThreeDViewerProps> {
  private scene: Scene;
  private renderer: Renderer;
  private rendererContainerRef: React.RefObject<
    HTMLElement
  > = React.createRef();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {
      scene,
      sceneObjects,
      activeOperation,
    } = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.renderer.updateScene();
    }
    this.renderer.setActiveHelper(activeOperation);
  }

  componentDidMount() {
    const {scene, selectObject, deselectAllObjects} = this.props;
    const container = this.rendererContainerRef.current;
    if (container) {
      this.renderer = new Renderer(scene, container);
      this.renderer.updateScene();
    }

    this.renderer.onObjectClick(object => selectObject(object));
    this.renderer.onBackgroundClick(() => deselectAllObjects());
  }

  render() {
    return <Container innerRef={this.rendererContainerRef} />;
  }
}

const mapStateToProps = (state: any) => ({
  scene: state.threed.scene.sceneInstance,
  sceneObjects: state.threed.scene.objects,
  activeOperation: state.threed.ui.activeOperation,
});

const mapDispatchToProps = {
  selectObject,
  deselectAllObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeDViewer);
