import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {Spring} from 'react-spring';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {
  updateObjectName,
  updateObjectParameter,
  updateOperationParameter,
  createObject,
  deleteObject,
  addOperation,
  removeOperation,
  reorderOperation,
  setActiveOperation,
  unsetActiveOperation,
  showContextMenu,
  stopEditingObjectName,
} from '../../actions/threed';
import {getObjects, getSelectedObjects} from '../../reducers/threed/';
import {colors} from '../../base-styles';
import TrashIcon from '../../assets/images/trash-green.svg';
import GroupIcon from '../../assets/images/shape-group.svg';
import PointsIcon from '../../assets/images/three-points.svg';
import PropertyInput from './PropertyInput';
import OperationsList from './OperationsList';
import ColorPicker from '../ColorPicker';
import config from '../../config/threed';

const Wrap = styled.div`
  display: flex;
`;

const Container = styled.div`
  width: 310px;
  min-width: 310px;
  overflow: hidden;
  border-left: 1px solid #979797;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const Button = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background-color: ${colors.brand};
  padding: 6px;
  border-radius: 6px;
  margin-bottom: 12px;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
`;

const ButtonIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const Header = styled.div`
  height: 42px;
  padding: 0px 12px;
  background-color: #d8d8d8;
  border-bottom: 1px solid #979797;
  color: #4a4a4a;
  display: flex;
  align-items: center;
  font-size: 1.1em;

  img {
    cursor: pointer;
  }
`;

const HeaderColorPicker = styled(ColorPicker)`
  margin-right: 6px;
`;

const ObjectName = styled.div`
  flex: 1;
`;

const ObjectProperties = styled.div`
  padding: 12px;
  border-bottom: 1px solid #979797;
  position: relative;
`;

const ParametersPanel = styled.div`
  display: flex;
  margin-bottom: 18px;
  min-height: 120px;
`;

const ObjectIcon = styled.div`
  margin-right: 12px;
  background-color: #eee;
  width: 140px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100px;
  }
`;

const ParametersForm = styled.div`
  flex: 1;
`;

const ObjectButtons = styled.div`
  display: flex;
  margin: 6px -6px;

  ${Button} {
    flex: 1;
    margin: 0px 6px;
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

const RemoveOperationArea = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: white;
  opacity: 0;
  pointer-events: none;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 60px;
    height: 84px;
    margin-left: -30px;
    margin-top: -42px;
  }

  ${props =>
    props.visible &&
    css`
      opacity: 1;
      pointer-events: auto;
    `} ${props =>
    props.active &&
    css`
      img {
        opacity: 0.8;
      }
    `};
`;

const GroupSelection = styled.div`
  padding: 12px;

  ${ObjectIcon} {
    width: 100%;
    margin-bottom: 12px;
    min-height: 120px;
  }
`;

const GroupButton = styled(Button)`
  justify-content: flex-start;
`;

class PropertiesPanel extends React.Component {
  state = {
    draggingOperations: false,
  };

  nameInputRef = React.createRef();

  componentDidUpdate(prevProps) {
    if (this.props.editingName && !prevProps.editingName) {
      this.nameInputRef.current.focus();
    }
  }

  onObjectNameChange = (object, name) => {
    this.props.updateObjectName(object, name);
  };

  onObjectParameterChange = (object, parameter, value) => {
    this.props.updateObjectParameter(object, parameter, value);
  };

  onOperationParameterChange = (object, operation, parameter, value) => {
    this.props.updateOperationParameter(object, operation, parameter, value);
  };

  onDragStart = () => {
    this.setState({draggingOperations: true});
  };

  onDragEnd = (result, object) => {
    const {destination, source, draggableId} = result;
    const operation = object.operations.find(({id}) => id === draggableId);

    this.setState({draggingOperations: false});

    if (!destination || !operation) return;

    if (destination.droppableId !== 'remove') {
      this.props.reorderOperation(
        object,
        operation,
        source.index,
        destination.index,
      );
    } else {
      this.props.removeOperation(object, operation);
    }
  };

  onAddOperation(object, operationName) {
    this.props.addOperation(object, operationName);
  }

  onComposeObjects(operation) {
    const {createObject, selectedObjects} = this.props;
    createObject(operation.create(selectedObjects));
  }

  onRemoveOperation(object, operation) {
    this.props.removeOperation(object, operation);
  }

  renderCombineOptions() {

    return (
      <GroupSelection>
        <ObjectIcon>
          <img src={GroupIcon} />
        </ObjectIcon>
        {config.compositionOperations.map(operation => (
          <GroupButton
            key={operation.name}
            onClick={() => this.onComposeObjects(operation)}>
            <ButtonIcon src={operation.icon} />
            <div>{operation.label}</div>
          </GroupButton>
        ))}
      </GroupSelection>
    );
  }

  renderObjectPanel(object) {
    const {draggingOperations} = this.state;
    const {
      editingName,
      setActiveOperation,
      unsetActiveOperation,
      showContextMenu,
      stopEditingObjectName,
    } = this.props;
    const {color} = object.parameters;

    const shapeConfig = config.shapes.find(s => s.name === object.type);
    const {parameters = []} = shapeConfig || {};
    const icon = (shapeConfig && shapeConfig.icon) || GroupIcon;

    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragEnd={result => this.onDragEnd(result, object)}>
        <Header>
          <HeaderColorPicker
            color={color}
            onChange={color =>
              this.onObjectParameterChange(object, 'color', color)
            }
          />
          {editingName && (
            <NameInput
              type="text"
              innerRef={this.nameInputRef}
              value={object.name}
              onChange={e => this.onObjectNameChange(object, e.target.value)}
              onBlur={() => stopEditingObjectName()}
            />
          )}
          {!editingName && <ObjectName>{object.name}</ObjectName>}
          <img
            src={PointsIcon}
            onClick={e => {
              e.stopPropagation();
              showContextMenu(object, e);
            }}
          />
        </Header>
        <ObjectProperties>
          <ParametersPanel>
            <ObjectIcon>
              <img src={icon} />
            </ObjectIcon>
            <ParametersForm>
              {parameters.map(parameter => (
                <PropertyInput
                  key={parameter.name}
                  parameter={parameter}
                  value={object.parameters[parameter.name]}
                  onChange={value =>
                    this.onObjectParameterChange(object, parameter.name, value)
                  }
                />
              ))}
            </ParametersForm>
            <Droppable droppableId="remove" ignoreContainerClipping>
              {(provided, snapshot) => (
                <RemoveOperationArea
                  innerRef={provided.innerRef}
                  {...provided.droppableProps}
                  visible={draggingOperations}
                  active={snapshot.isDraggingOver}>
                  <img src={TrashIcon} />
                  {provided.placeholder}
                </RemoveOperationArea>
              )}
            </Droppable>
          </ParametersPanel>
          <ObjectButtons>
            {config.objectOperations.map(operation => (
              <Button
                key={operation.name}
                onClick={() => this.onAddOperation(object, operation.name)}>
                <ButtonIcon src={operation.icon} />
              </Button>
            ))}
          </ObjectButtons>
        </ObjectProperties>
        <OperationsList
          object={object}
          onParameterChange={(operation, parameter, value) =>
            this.onOperationParameterChange(
              object,
              operation,
              parameter.name,
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
        />
      </DragDropContext>
    );
  }

  render() {
    const {selectedObjects} = this.props;
    let content;

    if (selectedObjects.length === 1) {
      content = this.renderObjectPanel(selectedObjects[0]);
    } else if (selectedObjects.length > 1) {
      content = this.renderCombineOptions();
    }

    return (
      <Spring
        from={{width: 0}}
        to={{width: selectedObjects.length > 0 ? 310 : 0}}>
        {style => (
          <Wrap style={style}>
            <Container>{content}</Container>
          </Wrap>
        )}
      </Spring>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  objects: getObjects(threed),
  selectedObjects: getSelectedObjects(threed),
  editingName: threed.ui.editingObjectName,
});

const mapDispatchToProps = dispatch => ({
  updateObjectName: (object, name) => dispatch(updateObjectName(object, name)),
  updateObjectParameter: (object, parameter, value) =>
    dispatch(updateObjectParameter(object, parameter, value)),
  updateOperationParameter: (object, operation, parameter, value) =>
    dispatch(updateOperationParameter(object, operation, parameter, value)),
  createObject: object => dispatch(createObject(object)),
  deleteObject: object => dispatch(deleteObject(object)),
  addOperation: (object, operationName) =>
    dispatch(addOperation(object, operationName)),
  removeOperation: (object, operation) =>
    dispatch(removeOperation(object, operation)),
  reorderOperation: (object, operation, from, to) =>
    dispatch(reorderOperation(object, operation, from, to)),
  setActiveOperation: ({object, type, axis, relative}) =>
    dispatch(setActiveOperation(object, type, axis, relative)),
  unsetActiveOperation: () => dispatch(unsetActiveOperation()),
  showContextMenu: (object, e) =>
    dispatch(showContextMenu(object, e.clientX, e.clientY)),
  stopEditingObjectName: () => dispatch(stopEditingObjectName()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanel);
