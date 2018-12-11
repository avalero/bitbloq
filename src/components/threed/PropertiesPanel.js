import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {Spring} from 'react-spring';
import {DragDropContext} from 'react-beautiful-dnd';
import {
  updateObject,
  updateObjectParameter,
  updateObjectViewOption,
  updateOperation,
  createObject,
  deleteObject,
  undoComposition,
  duplicateObject,
  addOperation,
  removeOperation,
  reorderOperation,
  setActiveOperation,
  unsetActiveOperation,
  stopEditingObjectName,
} from '../../actions/threed';
import {getObjects, getSelectedObjects} from '../../reducers/threed/';
import {colors} from '../../base-styles';
import EllipsisIcon from '../icons/Ellipsis';
import DuplicateIcon from '../icons/Duplicate';
import PencilIcon from '../icons/Pencil';
import TrashIcon from '../icons/Trash';
import UndoIcon from '../icons/Undo';
import UngroupIcon from '../icons/Ungroup';
import PropertyInput from './PropertyInput';
import OperationsList from './OperationsList';
import ColorPicker from '../ColorPicker';
import DropDown from '../DropDown';
import Tooltip from '../Tooltip';
import config from '../../config/threed';

const Wrap = styled.div`
  display: flex;
`;

const Container = styled.div`
  width: 310px;
  min-width: 310px;
  overflow: hidden;
  border-left: 1px solid #cfcfcf;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  height: 50px;
  padding: 0px 20px;
  background-color: white;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  align-items: center;
  font-size: 1.1em;

  img {
    cursor: pointer;
  }
`;

const HeaderIcon = styled.div`
  margin-right: 10px;
  color: #4dc3ff;

  svg {
    width: 30px;
    height: auto;
  }
`;

const ObjectName = styled.div`
  flex: 1;
  font-weigth: bold;
  font-style: italic;
  font-size: 13px;
`;

const ObjectProperties = styled.div`
  border-bottom: 1px solid #cfcfcf;
  position: relative;
  font-size: 13px;
`;

const ParametersPanel = styled.div`
  padding: 20px;
`;

const ParametersForm = styled.div`
  flex: 1;
`;

const ObjectButtons = styled.div`
  display: flex;
  padding: 0px 4px 10px 4px;
`;

const OperationButton = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  border-radius: 3px;
  background-color: #ebebeb;
  flex: 1;
  margin: 0px 2px;
  border-bottom: 5px solid ${props => props.color};

  svg {
    width: 24px;
    height: auto;
  }
`;

const NameInput = styled.input`
  flex: 1;
  font-size: 1em;
  margin: -2px 0px -4px 0px;
  padding: 0px;
  color: #4a4a4a;
  border-width: 0 0 1px 0;
  border-color: #4a4a4a;
  width: 100%;
  background: transparent;

  &:focus {
    outline: none;
  }
`;

const ContextButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  border-radius: 4px;
  background-color: white;
  cursor: pointer;

  ${props =>
    props.isOpen &&
    css`
      border: solid 1px #dddddd;
      background-color: #e8e8e8;
    `} svg {
    transform: rotate(90deg);
  }
`;

const ContextMenu = styled.div`
  background-color: white;
  margin-top: 6px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  border: solid 1px #cfcfcf;
`;

const ContextMenuOption = styled.div`
  width: 220px;
  display: flex;
  align-items: center;
  height: 34px;
  border-bottom: 1px solid #ebebeb;
  font-size: 14px;
  cursor: pointer;

  svg {
    margin: 0px 14px;
    width: 13px;
    height: auto;
  }

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }

  ${props =>
    props.danger &&
    css`
      color: #d82b32;
    `};
`;

class PropertiesPanel extends React.Component {
  state = {
    draggingOperations: false,
    contextMenuOpen: false,
    editingName: false,
  };

  nameInputRef = React.createRef();

  componentDidUpdate(prevProps, prevState) {
    if (this.state.editingName && !prevState.editingName) {
      this.nameInputRef.current.focus();
    }
  }

  onObjectNameChange = (object, name) => {
    this.props.updateObjectViewOption(object, 'name', name);
  };

  onObjectParameterChange = (object, parameter, value) => {
    if (parameter.name === 'baseObject') {
      const newChildren = object.children.filter(c => c !== value);
      newChildren.unshift(value);
      this.props.updateObject({
        ...object,
        children: newChildren,
      });
    } else if (parameter.isViewOption) {
      this.props.updateObjectViewOption(object, parameter.name, value);
    } else {
      this.props.updateObjectParameter(object, parameter.name, value);
    }
  };

  onOperationParameterChange = (object, operation, parameter, value) => {
    if (parameter.setValue) {
      this.props.updateOperation(object, parameter.setValue(operation, value));
    } else {
      this.props.updateOperation(object, {
        ...operation,
        [parameter.name]: value
      });
    }
  };

  onDragStart = () => {
    this.setState({draggingOperations: true});
  };

  onDragEnd = (result, object) => {
    const {destination, source, draggableId} = result;
    const operation = object.operations.find(({id}) => id === draggableId);

    this.setState({draggingOperations: false});

    if (!destination || !operation) return;

    this.props.reorderOperation(
      object,
      operation,
      source.index,
      destination.index,
    );
  };

  onRenameClick = () => {
    this.setState({editingName: true});
  };

  onDeleteClick = () => {
    const {object, deleteObject} = this.props;
    deleteObject(object);
  };

  onDuplicateClick = () => {
    const {object, duplicateObject} = this.props;
    duplicateObject(object);
  };

  onUngroupClick = () => {
    // TODO: Ungroup
  };

  onUndoClick = () => {
    const {object, undoComposition} = this.props;
    undoComposition(object);
  };

  onAddOperation(object, operation) {
    this.props.addOperation(object, operation.create());
  }

  onRemoveOperation(object, operation) {
    this.props.removeOperation(object, operation);
  }

  renderObjectPanel(object) {
    const {draggingOperations, contextMenuOpen, editingName} = this.state;

    const {setActiveOperation, unsetActiveOperation, advancedMode} = this.props;
    const {color} = object.viewOptions;

    const typeConfig =
      config.objectTypes.find(s => s.name === object.type) || {};
    const {parameters: baseParameters, icon} = typeConfig;

    const {canUndo, undoLabel, canUngroup} = typeConfig;

    const parameters = [...baseParameters(object)];

    if (typeConfig.showBaseObject) {
      parameters.push({
        name: 'baseObject',
        label: 'Base object',
        type: 'select',
        options: object.children.map(child => ({
          label: child.viewOptions.name,
          value: child,
        })),
      });
    }

    if (!typeConfig.withoutColor) {
      parameters.push({
        name: 'color',
        label: 'Color',
        type: 'color',
        isViewOption: true,
      });
    }

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={result => this.onDragEnd(result, object)}>
        <Header>
          <HeaderIcon>{icon}</HeaderIcon>
          {editingName && (
            <NameInput
              type="text"
              innerRef={this.nameInputRef}
              value={object.viewOptions.name}
              onChange={e => this.onObjectNameChange(object, e.target.value)}
              onBlur={() => this.setState({editingName: false})}
            />
          )}
          {!editingName && <ObjectName>{object.viewOptions.name}</ObjectName>}
          <DropDown>
            {isOpen => (
              <ContextButton isOpen={isOpen}>
                <EllipsisIcon />
              </ContextButton>
            )}
            <ContextMenu>
              <ContextMenuOption onClick={this.onDuplicateClick}>
                <DuplicateIcon /> Duplicate
              </ContextMenuOption>
              <ContextMenuOption onClick={this.onRenameClick}>
                <PencilIcon /> Rename
              </ContextMenuOption>
              {canUngroup && (
                <ContextMenuOption onClick={this.onUngroupClick}>
                  <UngroupIcon /> Ungroup
                </ContextMenuOption>
              )}
              {canUndo && (
                <ContextMenuOption onClick={this.onUndoClick}>
                  <UndoIcon /> {undoLabel}
                </ContextMenuOption>
              )}
              <ContextMenuOption danger={true} onClick={this.onDeleteClick}>
                <TrashIcon /> Delete
              </ContextMenuOption>
            </ContextMenu>
          </DropDown>
        </Header>
        <ObjectProperties>
          <ParametersPanel>
            {parameters.map(parameter => (
              <PropertyInput
                key={parameter.name}
                parameter={parameter}
                value={
                  parameter.isViewOption
                    ? object.viewOptions && object.viewOptions[parameter.name]
                    : object.parameters && object.parameters[parameter.name]
                }
                onChange={value =>
                  this.onObjectParameterChange(object, parameter, value)
                }
              />
            ))}
          </ParametersPanel>
          {advancedMode && (
            <ObjectButtons>
              {config.objectOperations.map(operation => (
                <Tooltip key={operation.name} content={operation.label}>
                  {tooltipProps => (
                    <OperationButton
                      {...tooltipProps}
                      color={operation.color}
                      onClick={() => this.onAddOperation(object, operation)}>
                      {operation.icon}
                    </OperationButton>
                  )}
                </Tooltip>
              ))}
            </ObjectButtons>
          )}
        </ObjectProperties>
        <OperationsList
          operations={object.operations}
          advancedMode={advancedMode}
          onParameterChange={(operation, parameter, value) =>
            this.onOperationParameterChange(
              object,
              operation,
              parameter,
              value,
            )
          }
          onParameterFocus={(operation, parameter) => {
            if (parameter.activeOperation) {
              setActiveOperation(parameter.activeOperation(object, operation));
            }
          }}
          onParameterBlur={(operation, parameter) => {
            if (parameter.activeOperation) {
              unsetActiveOperation();
            }
          }}
          onRemoveOperation={operation =>
            this.onRemoveOperation(object, operation)
          }
        />
      </DragDropContext>
    );
  }

  render() {
    const {object} = this.props;

    return (
      <Spring from={{width: 0}} to={{width: object ? 310 : 0}}>
        {style => (
          <Wrap style={style}>
            <Container>{object && this.renderObjectPanel(object)}</Container>
          </Wrap>
        )}
      </Spring>
    );
  }
}

const mapStateToProps = ({threed}) => {
  const selectedObjects = getSelectedObjects(threed) || [];
  return {
    object: selectedObjects.length === 1 ? selectedObjects[0] : null,
    advancedMode: threed.ui.advancedMode,
  };
};

const mapDispatchToProps = dispatch => ({
  updateObject: object => dispatch(updateObject(object)),
  updateObjectParameter: (object, parameter, value) =>
    dispatch(updateObjectParameter(object, parameter, value)),
  updateObjectViewOption: (object, option, value) =>
    dispatch(updateObjectViewOption(object, option, value)),
  updateOperation: (object, operation, parameter, value) =>
    dispatch(updateOperation(object, operation, parameter, value)),
  createObject: object => dispatch(createObject(object)),
  deleteObject: object => dispatch(deleteObject(object)),
  undoComposition: object => dispatch(undoComposition(object)),
  duplicateObject: object => dispatch(duplicateObject(object)),
  addOperation: (object, operation) =>
    dispatch(addOperation(object, operation)),
  removeOperation: (object, operation) =>
    dispatch(removeOperation(object, operation)),
  reorderOperation: (object, operation, from, to) =>
    dispatch(reorderOperation(object, operation, from, to)),
  setActiveOperation: ({object, type, axis, relative}) =>
    dispatch(setActiveOperation(object, type, axis, relative)),
  unsetActiveOperation: () => dispatch(unsetActiveOperation()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanel);
