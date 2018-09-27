import React from 'react';
import {connect} from 'react-redux';
import uuid from 'uuid/v1';
import styled, {css} from 'react-emotion';
import {Spring} from 'react-spring';
import {DragDropContext, Droppable} from 'react-beautiful-dnd';
import {
  updateObject,
  composeObjects,
  deleteObject,
  addOperation,
  removeOperation,
  setActiveOperation,
  unsetActiveOperation,
} from '../../actions/threed';
import {getSelectedObjects} from '../../reducers/threed';
import {colors} from '../../base-styles';
import TrashIcon from '../../assets/images/trash-green.svg';
import GroupIcon from '../../assets/images/shape-group.svg';
import ObjectBloq from './ObjectBloq';
import OperationBloq from './OperationBloq';
import config from '../../config/threed';

const Wrap = styled.div`
  display: flex;
`;

const Container = styled.div`
  min-width: 310px;
  width: 310px;
  overflow: hidden;
  border-left: 1px solid #979797;
  display: flex;
  flex-direction: column;
`;

const PropertiesContainer = styled.div`
  flex: 1;
  background-color: #eee;
  padding: 12px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;

const BloqsContainer = styled.div`
  flex: 1;
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
  margin: 6px;
  flex: 1;
  box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
`;

const ButtonsContainer = styled.div`
  position: relative;
  background-color: white;
  padding: 18px 12px;
  border-top: 1px solid #979797;
  display: flex;
  flex-direction: ${props => props.direction};
  margin: 0px -6px;
`;

const ButtonIcon = styled.img`
  height: 24px;
  margin-right: 6px;
`;

const GroupPlaceholder = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 6px;
  background-color: white;
  border: 1px solid #979797;

  img {
    width: 40px;
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
    width: 28px;
    height: 40px;
    margin-left: -14px;
    margin-top: -20px;
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

const GroupButton = styled(Button)`
  justify-content: flex-start;
`;

class PropertiesPanelBloqs extends React.Component {
  state = {
    draggingOperations: false,
    openOperation: null,
  };

  componentDidUpdate(prevProps) {
    const {selectedObjects = []} = this.props;
    const {openOperation} = this.state;

    const object = selectedObjects[0];
    const prevObject = prevProps.selectedObjects[0];

    if (object && object !== prevObject) {
      const {operations = []} = object || {};
      const {operations: prevOperations = []} = prevObject || {};
      const newOperation = operations.find(o => !prevOperations.find(p => p.id === o.id));

      if (newOperation && newOperation.id !== openOperation) {
        this.setState({openOperation: newOperation.id});
      }
    }
  }

  onOperationOpen(operation, isOpen, cb) {
    const {openOperation} = this.state;
    if (isOpen && openOperation !== operation.id) {
      this.setState({openOperation: operation.id}, cb);
    } else if (!isOpen && openOperation === operation.id) {
      this.setState({openOperation: null}, cb);
    } else {
      cb();
    }
  }

  onOperationParameterChange = (object, operation, parameter, value) => {
    this.props.updateObject({
      ...object,
      operations: object.operations.map(
        o => (o === operation ? {...o, [parameter]: value} : o),
      ),
    });
  };

  onDragStart = () => {
    this.setState({draggingOperations: true});
  };

  onDragEnd = (result, object) => {
    const {destination, source, draggableId} = result;
    const operation = object.operations.find(({id}) => id === draggableId);

    this.setState({draggingOperations: false});

    if (!destination || !operation) return;

    const operations = [...object.operations];
    operations.splice(source.index, 1);
    if (destination.droppableId !== 'remove') {
      operations.splice(destination.index, 0, operation);
    }

    this.props.updateObject({
      ...object,
      operations,
    });
  };

  onAddOperation(object, operationName) {
    this.props.addOperation(object, operationName);
  }

  onComposeObjects(operationName) {
    const {composeObjects, selectedObjects} = this.props;
    composeObjects(selectedObjects, operationName);
  }

  onRemoveOperation(object, operation) {
    this.props.removeOperation(object, operation);
  }

  renderObjectBloqs(object) {
    const {setActiveOperation, unsetActiveOperation} = this.props;
    const {openOperation} = this.state;

    return (
      <PropertiesContainer>
        <ObjectBloq
          object={object}
        />
        <Droppable droppableId="operations">
          {provided => (
            <BloqsContainer
              innerRef={provided.innerRef} {...provided.droppableProps}
            >
              {object.operations.map((operation, i) => (
                <OperationBloq
                  key={operation.id}
                  index={i}
                  operation={operation}
                  isOpen={openOperation === operation.id}
                  onOpen={(isOpen, cb) =>
                    this.onOperationOpen(operation, isOpen, cb)
                  }
                  onParameterChange={(parameter, value) =>
                    this.onOperationParameterChange(
                      object,
                      operation,
                      parameter.name,
                      value,
                    )
                  }
                  onParameterFocus={parameter => {
                    if (parameter.activeOperation) {
                      setActiveOperation(parameter.activeOperation(object, operation));
                    }
                  }}
                  onParameterBlur={parameter => {
                    if (parameter.activeOperation) {
                      unsetActiveOperation();
                    }
                  }}
                />
              ))}
              {provided.placeholder}
            </BloqsContainer>
          )}
        </Droppable>
      </PropertiesContainer>
    );
  }

  render() {
    const {selectedObjects} = this.props;
    const {draggingOperations} = this.state;

    let content;
    if (selectedObjects.length === 1) {
      const object = selectedObjects[0];
      content = (
        <DragDropContext
          onDragStart={this.onDragStart}
          onDragEnd={result => this.onDragEnd(result, object)}>
          <Container>
            {this.renderObjectBloqs(object)}
            <ButtonsContainer direction="row">
              {config.objectOperations.map(operation => (
                <Button
                  key={operation.name}
                  onClick={() => this.onAddOperation(object, operation.name)}>
                  <ButtonIcon src={operation.icon} />
                </Button>
              ))}
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
            </ButtonsContainer>
          </Container>
        </DragDropContext>
      );
    } else if (selectedObjects.length > 1) {
      content = (
        <Container>
          <PropertiesContainer>
            <GroupPlaceholder>
              <img src={GroupIcon} />
            </GroupPlaceholder>
          </PropertiesContainer>
          <ButtonsContainer direction="column">
            {config.compositionOperations.map(operation => (
              <GroupButton
                key={operation.name}
                onClick={() => this.onComposeObjects(operation.name)}>
                <ButtonIcon src={operation.icon} />
                <div>{operation.label}</div>
              </GroupButton>
            ))}
          </ButtonsContainer>
        </Container>
      );
    } else {
      content = <Container />;
    }

    return (
      <Spring
        from={{width: 0}}
        to={{width: selectedObjects.length > 0 ? 310 : 0}}>
        {style =>
          <Wrap style={style}>{content}</Wrap>
        }
      </Spring>
    );
  }
}

const mapStateToProps = ({threed}) => ({
  objects: threed.present.objects,
  selectedObjects: getSelectedObjects(threed),
  editingName: threed.present.editingObjectName,
});

const mapDispatchToProps = dispatch => ({
  updateObject: object => dispatch(updateObject(object)),
  composeObjects: (objects, operationName) =>
    dispatch(composeObjects(objects, operationName)),
  deleteObject: object => dispatch(deleteObject(object)),
  addOperation: (object, operationName) =>
    dispatch(addOperation(object, operationName)),
  removeOperation: (object, operation) =>
    dispatch(removeOperation(object, operation)),
  setActiveOperation: ({object, type, axis, relative}) =>
    dispatch(setActiveOperation(object, type, axis, relative)),
  unsetActiveOperation: () => dispatch(unsetActiveOperation()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PropertiesPanelBloqs);
