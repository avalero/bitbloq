import * as React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import Tooltip from '../Tooltip';
import {createObject, undo, redo} from '../../actions/threed';
import {getObjects, getSelectedObjects} from '../../reducers/threed/';
import UndoIcon from '../icons/Undo';
import RedoIcon from '../icons/Redo';
import config from '../../config/threed';

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

const selectTopObject = (
  <span>
    Selecciona objetos de primer nivel para poder usar esta herramienta
  </span>
);

const selectMultipleMessage = (
  <span>
    Selecciona varios objetos pulsando <i>“Control + clic”</i> en cada uno de
    ellos para utilizar esta herramienta
  </span>
);

const selectOneMessage = (
  <span>Selecciona un único objeto para utilizar esta herramienta</span>
);

class Toolbar extends React.Component<ToolbarProps> {
  onComposeObjects(operation) {
    const {createObject, selectedObjects, advancedMode} = this.props;

    const object = operation.create(selectedObjects);
    if (advancedMode) {
      createObject(object);
    } else {
      const basicModeOperations = config.objectOperations
        .map(operation => {
          if (['translation', 'rotation', 'scale'].includes(operation.name)) {
            return operation.create();
          }
        })
        .filter(operation => operation);

      this.props.createObject({
        ...object,
        operations: basicModeOperations,
      });
    }
  }

  render() {
    const {
      objects,
      selectedObjects,
      advancedMode,
      undo,
      redo,
      canUndo,
      canRedo,
    } = this.props;

    return (
      <Container>
        <Operations>
          {config.compositionOperations.map(operation => {
            if (operation.advancedMode && !advancedMode) return;

            const {minObjects = 0, maxObjects = Infinity} = operation;
            const numObjects = selectedObjects.length;
            const topObjects = selectedObjects.every(o => objects.includes(o));
            const canApply =
              topObjects &&
              (numObjects >= minObjects && numObjects <= maxObjects);

            let tooltipContent;
            if (canApply) {
              tooltipContent = operation.label;
            } else {
              if (!topObjects) {
                tooltipContent = selectTopObject;
              } else if (minObjects > 1) {
                tooltipContent = selectMultipleMessage;
              } else if (maxObjects === 1) {
                tooltipContent = selectOneMessage;
              }
            }

            return (
              <Tooltip key={operation.name} content={tooltipContent}>
                {tooltipProps => (
                  <Button
                    {...tooltipProps}
                    disabled={!canApply}
                    onClick={() =>
                      canApply && this.onComposeObjects(operation)
                    }>
                    {operation.icon}
                  </Button>
                )}
              </Tooltip>
            );
          })}
        </Operations>
        <UndoRedo>
          <Tooltip content="Undo">
            {tooltipProps => (
              <Button
                {...tooltipProps}
                disabled={!canUndo}
                onClick={() => canUndo && undo()}>
                <UndoIcon />
              </Button>
            )}
          </Tooltip>
          <Tooltip content="Redo">
            {tooltipProps => (
              <Button
                {...tooltipProps}
                disabled={!canRedo}
                onClick={() => canRedo && redo()}>
                <RedoIcon />
              </Button>
            )}
          </Tooltip>
        </UndoRedo>
      </Container>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  objects: getObjects(threed),
  selectedObjects: getSelectedObjects(threed),
  advancedMode: threed.ui.advancedMode,
  canUndo: false, //TODO
  canRedo: false, //TODO
});

const mapDispatchToProps = {
  createObject,
  undo,
  redo,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Toolbar);
