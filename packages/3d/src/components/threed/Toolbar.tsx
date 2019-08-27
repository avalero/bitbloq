import * as React from "react";
import { connect } from "react-redux";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Markdown from "react-markdown";
import { createObject, undo, redo } from "../../actions/threed";
import { getObjects, getSelectedObjects } from "../../reducers/threed/";
import { Icon, Tooltip, Translate } from "@bitbloq/ui";
import config from "../../config/threed";

const Container = styled.div`
  height: 50px;
  border-bottom: 1px solid #cfcfcf;
  padding: 0px 20px;
  display: flex;
`;

interface ButtonProps {
  disabled?: boolean;
}

const Button = styled.div<ButtonProps>`
  background-color: #ebebeb;
  width: 60px;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -1px;

  img {
    width: 20px;
    height: auto;
  }

  ${props =>
    props.disabled &&
    css`
      color: #bdc0c6;
      cursor: not-allowed;
    `};
`;

const Operations = styled.div`
  flex: 1;
  display: flex;
`;

const UndoRedo = styled.div`
  display: flex;
`;

export interface ToolbarProps {
  createObject: (object: object) => any;
}

class Toolbar extends React.Component<ToolbarProps> {
  private readonly state = {
    canUndo: false,
    canRedo: false
  };

  componentDidUpdate(prevProps) {
    const { objects, scene } = this.props;
    if (objects !== prevProps.objects) {
      this.setState({
        canUndo: scene.canUndo(),
        canRedo: scene.canRedo()
      });
    }
  }

  onComposeObjects(operation: any, label: string) {
    const { createObject, selectedObjects, advancedMode } = this.props;

    const object = {
      ...operation.create(selectedObjects),
      operations: config.defaultOperations(advancedMode),
      viewOptions: {
        name: label
      }
    };

    createObject(object);
  }

  render() {
    const { objects, selectedObjects, advancedMode, undo, redo } = this.props;
    const { canUndo, canRedo } = this.state;

    return (
      <Translate>
        {t => (
          <Container>
            <Operations>
              {config.compositionOperations.map(operation => {
                if (operation.advancedMode && !advancedMode) return;

                const { minObjects = 0, maxObjects = Infinity } = operation;
                const numObjects = selectedObjects.length;
                const topObjects = selectedObjects.every(o =>
                  objects.includes(o)
                );
                const canApply =
                  topObjects &&
                  (numObjects >= minObjects && numObjects <= maxObjects);

                let tooltipContent;
                if (canApply) {
                  tooltipContent = t(operation.label);
                } else {
                  if (!topObjects) {
                    tooltipContent = (
                      <Markdown source={t("tooltip-select-top")} />
                    );
                  } else if (minObjects > 1) {
                    tooltipContent = (
                      <Markdown source={t("tooltip-select-multiple")} />
                    );
                  } else if (maxObjects === 1) {
                    tooltipContent = (
                      <Markdown source={t("tooltip-select-one")} />
                    );
                  }
                }

                return (
                  <Tooltip key={operation.name} content={tooltipContent}>
                    {tooltipProps => (
                      <Button
                        {...tooltipProps}
                        disabled={!canApply}
                        onClick={() =>
                          canApply &&
                          this.onComposeObjects(operation, t(operation.label))
                        }
                      >
                        {operation.icon}
                      </Button>
                    )}
                  </Tooltip>
                );
              })}
            </Operations>
            <UndoRedo>
              <Tooltip content={t("undo")}>
                {tooltipProps => (
                  <Button
                    {...tooltipProps}
                    disabled={!canUndo}
                    onClick={() => canUndo && undo()}
                  >
                    <Icon name="undo" />
                  </Button>
                )}
              </Tooltip>
              <Tooltip content={t("redo")}>
                {tooltipProps => (
                  <Button
                    {...tooltipProps}
                    disabled={!canRedo}
                    onClick={() => canRedo && redo()}
                  >
                    <Icon name="redo" />
                  </Button>
                )}
              </Tooltip>
            </UndoRedo>
          </Container>
        )}
      </Translate>
    );
  }
}

const mapStateToProps = ({ threed }) => ({
  objects: getObjects(threed),
  scene: threed.scene.sceneInstance,
  selectedObjects: getSelectedObjects(threed),
  advancedMode: threed.ui.advancedMode
});

const mapDispatchToProps = {
  createObject,
  undo,
  redo
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
