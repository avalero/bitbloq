import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {Droppable} from 'react-beautiful-dnd';
import Operation from './Operation';

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  padding: 10px;
  height: 0;
`;

export default class OperationsList extends React.Component {
  state = {
    openOperations: [],
  };

  componentDidUpdate(prevProps, prevState) {
    const {openOperations} = this.state;
    const {operations} = this.props;
    const {operations: prevOperations} = prevProps;

    if (operations && prevOperations) {
      const newOperation = operations.find(
        o => !prevOperations.find(p => p.id === o.id),

      );

      if (newOperation) {
        this.setState(state => ({
          ...state,
          openOperations: [...state.openOperations, newOperation.id],
        }));
      }
    }

    const lastOperation = operations[operations.length - 1] || {};
    if (
      openOperations.includes(lastOperation.id) &&
      !prevState.openOperations.includes(lastOperation.id)
    ) {
      if (this.container) {
        this.container.scrollTop = 100000000;
      }
    }
  }

  onOperationOpen(operation, isOpen, cb) {
    const {openOperations} = this.state;
    if (isOpen) {
      this.setState(
        state => ({
          ...state,
          openOperations: [...state.openOperations, operation.id],
        }),
        cb,
      );
    } else {
      this.setState(
        state => ({
          ...state,
          openOperations: state.openOperations.filter(
            id => id !== operation.id,
          ),
        }),
        cb,
      );
    }
  }

  render() {
    const {
      operations,
      onParameterChange,
      onParameterFocus,
      onParameterBlur,
      onRemoveOperation,
      advancedMode,
    } = this.props;
    const {openOperations} = this.state;

    return (
      <Droppable droppableId="operations" ref={this.wrapRef}>
        {provided => (
          <Container
            ref={el => {
              this.container = el;
              provided.innerRef(el);
            }}
            {...provided.droppableProps}>
            {operations.map((operation, i) => (
              <Operation
                key={operation.id}
                index={i}
                operation={operation}
                advancedMode={advancedMode}
                isOpen={openOperations.includes(operation.id)}
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
