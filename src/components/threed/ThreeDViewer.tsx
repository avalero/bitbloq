import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import Renderer from '../../lib/object3dts/Renderer'
import Scene from '../../lib/object3dts/Scene'
import {IObjectsCommonJSON} from '../../lib/object3dts/ObjectsCommon'

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
`;

interface ThreeDViewerProps {
  scene: Scene,
  sceneObjects: IObjectsCommonJSON[]
}

class ThreeDViewer extends React.Component<ThreeDViewerProps> {

  private scene: Scene
  private renderer: Renderer;
  private rendererContainerRef: React.RefObject<HTMLElement> = React.createRef();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {sceneObjects} = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.renderer.updateScene();
    }
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
  sceneObjects: state.threed.scene.objects
});

const mapDispatchToProps = () => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreeDViewer);
