import React from 'react';
import styled, {css} from 'react-emotion';
import {Droppable} from 'react-beautiful-dnd';
import Operation from './Operation';

const Container = styled.div`
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
`;

export default class OperationsList extends React.Component {
  render() {
    const {
      object,
      onParameterChange,
      onParameterFocus,
      onParameterBlur,
    } = this.props;

    return (
      <Droppable droppableId="operations">
        {provided => (
          <Container innerRef={provided.innerRef} {...provided.droppableProps}>
            {object.operations.map((operation, i) => (
              <Operation
                key={operation.id}
                index={i}
                operation={operation}
                onParameterChange={(parameter, value) =>
                  onParameterChange(operation, parameter, value)
                }
                onParameterFocus={parameter =>
                  onParameterFocus(operation, parameter)
                }
                onParameterBlur={parameter =>
                  onParameterBlur(operation, parameter)
                }
              />
            ))}
            {provided.placeholder}
          </Container>
        )}
      </Droppable>
    );
  }
}
