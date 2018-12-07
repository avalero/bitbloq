import * as React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import Renderer from '../../lib/object3dts/Renderer';
import {selectObject, deselectAllObjects} from '../../actions/threed';
import Scene, {
  IHelperDescription,
  IObjectPosition,
} from '../../lib/object3dts/Scene';
import {getSelectedObjects} from '../../reducers/threed/';
import {IObjectsCommonJSON} from '../../lib/object3dts/ObjectsCommon';

const Container = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  overflow: hidden;
`;

const StatusBar = styled.div`
  position: absolute;
  height: 24px;
  background-color: #5d6069;
  bottom: 0px;
  left: 0px;
  right: 0px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  z-index: 10;
  color: white;
  font-size: 12px;
`;

const StatusBarGroup = styled.div`
  display: flex;
  margin-right: 40px;

  b, span {
    margin-right: 20px;
  }
  span:last-child {
    margin-right; 0px;
  }
`;

export interface ThreeDViewerProps {
  scene: Scene;
  sceneObjects: IObjectsCommonJSON[];
  selectedObjects: IObjectsCommonJSON[];
  activeOperation: IHelperDescription;
  selectObject: (object: IObjectsCommonJSON) => void;
  deselectAllObjects: () => void;
}

class ThreeDViewerState {
  readonly selectedPosition?: IObjectPosition | null = null;
}

class ThreeDViewer extends React.Component<
  ThreeDViewerProps,
  ThreeDViewerState
> {
  private scene: Scene;
  private renderer: Renderer;
  private rendererContainerRef: React.RefObject<
    HTMLElement
  > = React.createRef();

  readonly state = new ThreeDViewerState();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {scene, sceneObjects, selectedObjects, activeOperation} = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.renderer.updateScene();
    }
    if (selectedObjects !== prevProps.selectedObjects) {
      this.updateStatusBar();
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

  async updateStatusBar() {
    const {scene, selectedObjects} = this.props;
    this.setState({selectedPosition: undefined});
    if (selectedObjects && selectedObjects.length === 1) {
      const selectedPosition = scene.getPosition(selectedObjects[0]);
      this.setState({selectedPosition});
    }
  }

  render() {
    const {selectedPosition} = this.state;

    return (
      <Container innerRef={this.rendererContainerRef}>
        <StatusBar>
          {selectedPosition && (
            <StatusBarGroup>
              <b>Position:</b>
              <span>X={selectedPosition.position.x.toFixed(2)}</span>
              <span>Y={selectedPosition.position.y.toFixed(2)}</span>
              <span>Z={selectedPosition.position.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
          {selectedPosition && (
            <StatusBarGroup>
              <b>Rotation:</b>
              <span>X={selectedPosition.angle.x.toFixed(2)}</span>
              <span>Y={selectedPosition.angle.y.toFixed(2)}</span>
              <span>Z={selectedPosition.angle.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
        </StatusBar>
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  scene: state.threed.scene.sceneInstance,
  sceneObjects: state.threed.scene.objects,
  activeOperation: state.threed.ui.activeOperation,
  selectedObjects: getSelectedObjects(state.threed),
});

const mapDispatchToProps = {
  selectObject,
  deselectAllObjects,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ThreeDViewer);
