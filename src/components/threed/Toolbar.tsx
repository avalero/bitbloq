import * as React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {createObject, undo, redo} from '../../actions/threed';
import {getSelectedObjects} from '../../reducers/threed/';
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
  color: #373b44;
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
  onComposeObjects(operation) {
    const {createObject, selectedObjects} = this.props;
    createObject(operation.create(selectedObjects));
  }

  render() {
    const {selectedObjects, undo, redo, canUndo, canRedo} = this.props;

    return (
      <Container>
        <Operations>
          {config.compositionOperations.map(operation => {
            const canApply = operation.canApply(selectedObjects);
            return (
              <Button
                key={operation.name}
                disabled={!canApply}
                onClick={() => canApply && this.onComposeObjects(operation)}>
                {operation.icon}
              </Button>
            );
          })}
        </Operations>
        <UndoRedo>
          <Button disabled={!canUndo} onClick={() => canUndo && undo()}>
            <UndoIcon />
          </Button>
          <Button disabled={!canRedo} onClick={() => canRedo && redo()}>
            <RedoIcon />
          </Button>
        </UndoRedo>
      </Container>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  selectedObjects: getSelectedObjects(threed),
  canUndo: threed.scene.past.length > 0,
  canRedo: threed.scene.future.length > 0,
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
