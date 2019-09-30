import * as React from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { selectObject, deselectAllObjects } from "../../actions/threed";
import {
  Scene,
  IHelperDescription,
  IObjectPosition,
  IObjectsCommonJSON,
  Renderer
} from "@bitbloq/lib3d";
import { getSelectedObjects } from "../../reducers/threed/";
import { Icon, Tooltip, TooltipProps, withTranslate } from "@bitbloq/ui";

const SLOW_TIMEOUT_MS = 3000;

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

const CameraButtons = styled.div`
  position: absolute;
  top: 150px;
  left: 20px;
  z-index: 10;
`;

interface CameraButtonProps {
  wideIcon?: boolean;
}
const CameraButton = styled.div<CameraButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 33px;
  height: 33px;
  cursor: pointer;
  margin-bottom: 10px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #cfcfcf;

  svg {
    width: ${props => (props.wideIcon ? "18px" : "12px")};
  }
`;

const SlowProgressContainer = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SlowProgressPanel = styled.div`
  width: 200px;
  box-sizing: content-box;
  border-radius: 4px;
  background-color: #373b44;
  padding: 15px 20px;

  p {
    color: white;
    text-align: center;
    font-size: 12px;
  }
`;

const SlowProgressBarContainer = styled.div`
  background-color: #f1f1f1;
  border-radius: 4px;
  height: 8px;
  margin-bottom: 6px;
`;

const SlowProgressBar = styled.div`
  background-color: #59b52e;
  border-radius: 4px;
  height: 8px;
`;

export interface ThreeDViewerProps {
  scene: Scene;
  sceneObjects: IObjectsCommonJSON[];
  selectedObjects: IObjectsCommonJSON[];
  activeOperation: IHelperDescription;
  selectObject: (object: IObjectsCommonJSON, add: boolean) => void;
  deselectAllObjects: () => void;
  controlPressed: boolean;
  shiftPressed: boolean;
}

class ThreeDViewerState {
  readonly selectedPosition?: IObjectPosition | null = null;
  readonly isOrthographic: boolean = false;
  readonly showSlowProgress: boolean = false;
  readonly slowProgressPercentage: number = 0;
}

class ThreeDViewer extends React.Component<
  ThreeDViewerProps,
  ThreeDViewerState
> {
  private scene: Scene;
  private renderer: Renderer;
  private slowInterval: number;
  private rendererContainerRef: React.RefObject<
    HTMLElement
  > = React.createRef();

  readonly state = new ThreeDViewerState();

  componentDidUpdate(prevProps: ThreeDViewerProps) {
    const {
      scene,
      sceneObjects,
      selectedObjects,
      activeOperation
    } = this.props;
    if (sceneObjects !== prevProps.sceneObjects) {
      this.updateScene();
    }
    if (selectedObjects !== prevProps.selectedObjects) {
      this.updateStatusBar();
      if (scene) {
        scene.selectedObjects(selectedObjects);
        this.updateScene();
      }
    }
    if (scene !== prevProps.scene) {
      this.renderer.setScene(scene);
    }

    this.renderer.setActiveHelper(activeOperation);
  }

  componentDidMount() {
    const { scene, selectObject, deselectAllObjects, t } = this.props;
    const container = this.rendererContainerRef.current;

    if (container) {
      this.renderer = new Renderer(scene, container, {
        navigationBoxLabels: {
          top: t("navigation-top"),
          bottom: t("navigation-bottom"),
          left: t("navigation-left"),
          right: t("navigation-right"),
          front: t("navigation-front"),
          back: t("navigation-back")
        }
      });
      this.updateScene();
    }

    this.renderer.onObjectClick(object => {
      const { controlPressed, shiftPressed } = this.props;
      selectObject(object, controlPressed || shiftPressed);
    });
    this.renderer.onBackgroundClick(() => {
      if (this.props.selectedObjects.length > 0) {
        deselectAllObjects();
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.slowInterval);
    this.renderer.destroy();
  }

  async updateStatusBar() {
    const { scene, selectedObjects } = this.props;
    this.setState({ selectedPosition: undefined });
    if (selectedObjects && selectedObjects.length === 1) {
      const selectedPosition = await scene.getPositionAsync(selectedObjects[0]);
      this.setState({ selectedPosition });
    }
  }

  async updateScene() {
    if (this.slowInterval) {
      clearInterval(this.slowInterval);
      this.slowInterval = 0;
      this.setState({
        slowProgressPercentage: 0
      });
    }

    let percentage = 10;
    this.slowInterval = setInterval(() => {
      this.setState({
        showSlowProgress: true,
        slowProgressPercentage: percentage
      });
      document.activeElement.blur();
      percentage += (100 - percentage) / 10;
    }, SLOW_TIMEOUT_MS);

    try {
      await this.renderer.updateScene();
    } catch (e) {}

    clearInterval(this.slowInterval);

    this.setState({
      showSlowProgress: false
    });
  }

  onCenter = () => {
    this.renderer.center();
  };

  onZoomIn = () => {
    this.renderer.zoomIn();
  };

  onZoomOut = () => {
    this.renderer.zoomOut();
  };

  onToggleOrthographic = () => {
    const isOrthographic = !this.state.isOrthographic;
    this.renderer.setOrtographicCamera(isOrthographic);
    this.setState({ isOrthographic });
  };

  render() {
    const {
      selectedPosition,
      isOrthographic,
      showSlowProgress,
      slowProgressPercentage
    } = this.state;
    const { t } = this.props;

    return (
      <Container ref={this.rendererContainerRef}>
        <CameraButtons>
          <Tooltip position="right" content={t("tooltip-center-view")}>
            {(tooltipProps: TooltipProps) => (
              <CameraButton {...tooltipProps} onClick={this.onCenter}>
                <Icon name="center" />
              </CameraButton>
            )}
          </Tooltip>
          <Tooltip position="right" content={t("tooltip-zoom-plus")}>
            {(tooltipProps: TooltipProps) => (
              <CameraButton {...tooltipProps} onClick={this.onZoomIn}>
                <Icon name="plus" />
              </CameraButton>
            )}
          </Tooltip>
          <Tooltip position="right" content={t("tooltip-zoom-minus")}>
            {(tooltipProps: TooltipProps) => (
              <CameraButton {...tooltipProps} onClick={this.onZoomOut}>
                <Icon name="minus" />
              </CameraButton>
            )}
          </Tooltip>
          <Tooltip
            position="right"
            content={
              isOrthographic
                ? t("tooltip-perspective-view")
                : t("tooltip-orthogonal-view")
            }
          >
            {(tooltipProps: TooltipProps) => (
              <CameraButton
                {...tooltipProps}
                onClick={this.onToggleOrthographic}
                wideIcon
              >
                {isOrthographic && <Icon name="perspective" />}
                {!isOrthographic && <Icon name="orthographic" />}
              </CameraButton>
            )}
          </Tooltip>
        </CameraButtons>
        <StatusBar>
          {selectedPosition && (
            <StatusBarGroup>
              <b>{t("status-position")}</b>
              <span>X={selectedPosition.position.x.toFixed(2)}</span>
              <span>Y={selectedPosition.position.y.toFixed(2)}</span>
              <span>Z={selectedPosition.position.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
          {selectedPosition && (
            <StatusBarGroup>
              <b>{t("status-rotation")}</b>
              <span>X={selectedPosition.angle.x.toFixed(2)}</span>
              <span>Y={selectedPosition.angle.y.toFixed(2)}</span>
              <span>Z={selectedPosition.angle.z.toFixed(2)}</span>
            </StatusBarGroup>
          )}
        </StatusBar>
        {showSlowProgress && (
          <SlowProgressContainer>
            <SlowProgressPanel>
              <SlowProgressBarContainer>
                <SlowProgressBar
                  style={{ width: `${slowProgressPercentage}%` }}
                />
              </SlowProgressBarContainer>
              <p>{parseInt(slowProgressPercentage)}%</p>
            </SlowProgressPanel>
          </SlowProgressContainer>
        )}
      </Container>
    );
  }
}

const mapStateToProps = (state: any) => ({
  scene: state.threed.scene.sceneInstance,
  sceneObjects: state.threed.scene.objects,
  activeOperation: state.threed.ui.activeOperation,
  selectedObjects: getSelectedObjects(state.threed),
  controlPressed: state.ui.controlPressed,
  shiftPressed: state.ui.shiftPressed
});

const mapDispatchToProps = {
  selectObject,
  deselectAllObjects
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withTranslate(ThreeDViewer));
