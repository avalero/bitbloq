import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import Renderer from '../../lib/object3dts/Renderer'
import Scene, {IHelperDescription} from '../../lib/object3dts/Scene'
import {IObjectsCommonJSON} from '../../lib/object3dts/ObjectsCommon'

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
}

class ThreeDViewer extends React.Component<ThreeDViewerProps> {

  private scene: Scene
  private renderer: Renderer;
  private rendererContainerRef: React.RefObject<HTMLElement> = React.createRef();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {scene, sceneObjects, activeOperation} = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.renderer.updateScene();
    }
    this.renderer.setActiveHelper(activeOperation);
  }

  componentDidMount() {
    const {scene} = this.props;
    const container = this.rendererContainerRef.current;
    if (container) {
      this.renderer = new Renderer(scene, container);
      this.renderer.updateScene();
    }
  }

  render() {
    return (
      <Container innerRef={this.rendererContainerRef}>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  scene: state.threed.scene.sceneInstance,
  sceneObjects: state.threed.scene.objects,
  activeOperation: state.threed.ui.activeOperation,
});

const mapDispatchToProps = () => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeDViewer);
