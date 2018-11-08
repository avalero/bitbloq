import React from 'react';
import styled, {css} from 'react-emotion';
import {Droppable} from 'react-beautiful-dnd';
import Operation from './Operation';

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  padding: 10px;
`;

export default class OperationsList extends React.Component {
  state = {
    openOperation: null,
  };

  componentDidUpdate(prevProps) {
    const {openOperation} = this.state;
    const {object} = this.props;
    const {object: prevObject} = prevProps;

    if (object !== prevObject) {
      const {operations = []} = object || {};
      const {operations: prevOperations = []} = prevObject || {};
      const newOperation = operations.find(
        o => !prevOperations.find(p => p.id === o.id),
      );

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

  render() {
    const {
      object,
      onParameterChange,
      onParameterFocus,
      onParameterBlur,
      onRemoveOperation,
    } = this.props;
    const {openOperation} = this.state;

    return (
      <Droppable droppableId="operations">
        {provided => (
          <Container innerRef={provided.innerRef} {...provided.droppableProps}>
            {object.operations.map((operation, i) => (
              <Operation
                key={operation.id}
                index={i}
                operation={operation}
                isOpen={openOperation === operation.id}
                onOpen={(isOpen, cb) =>
                  this.onOperationOpen(operation, isOpen, cb)
                }
                onParameterChange={(parameter, value) =>
                  onParameterChange(operation, parameter, value)
                }
                onParameterFocus={parameter =>
                  onParameterFocus(operation, parameter)
                }
                onParameterBlur={parameter =>
                  onParameterBlur(operation, parameter)
                }
                onRemove={() => onRemoveOperation(operation)}
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}
