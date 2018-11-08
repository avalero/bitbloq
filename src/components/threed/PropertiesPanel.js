import React from 'react';
import {connect} from 'react-redux';
import styled, {css} from 'react-emotion';
import {Spring} from 'react-spring';
import {DragDropContext} from 'react-beautiful-dnd';
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
  color: #373b44;
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
  color: #373b44;
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

    this.props.reorderOperation(
      object,
      operation,
      source.index,
      destination.index,
    );
  };

  onAddOperation(object, operationName) {
    this.props.addOperation(object, operationName);
  }

  onRemoveOperation(object, operation) {
    this.props.removeOperation(object, operation);
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

    let baseParameters;
    let icon;

    const shapeConfig = config.shapes.find(s => s.name === object.type);
    if (shapeConfig) {
      baseParameters = shapeConfig.parameters || [];
      icon = shapeConfig.icon
    } else {
      const compositionConfig = config.compositionOperations.find(
        c => c.name === object.type,
      );
      if (compositionConfig) {
        baseParameters = compositionConfig.parameters || [];
        icon = compositionConfig.icon;
      }
    }

    const parameters = [
      ...baseParameters,
      {
        name: 'color',
        label: 'Color',
        type: 'color',
      },
    ];

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
          </ParametersPanel>
          <ObjectButtons>
            {config.objectOperations.map(operation => (
              <OperationButton
                key={operation.name}
                color={operation.color}
                onClick={() => this.onAddOperation(object, operation.name)}>
                {operation.icon}
              </OperationButton>
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
          onRemoveOperation={operation => this.onRemoveOperation(object, operation)}
        />
      </DragDropContext>
    );
  }

  render() {
    const {selectedObjects} = this.props;
    let content;

    if (selectedObjects.length === 1) {
      content = this.renderObjectPanel(selectedObjects[0]);
    }

    return (
      <Spring
        from={{width: 0}}
        to={{width: selectedObjects.length === 1 ? 310 : 0}}>
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
