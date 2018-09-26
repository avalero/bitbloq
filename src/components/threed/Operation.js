import React from 'react';
import styled, {css} from 'react-emotion';
import {Draggable} from 'react-beautiful-dnd';
import PropertyInput from './PropertyInput';
import config from '../../config/threed';
import HandlerImage from '../../assets/images/draganddrop-handler.svg';
import ChevronImage from '../../assets/images/chevron-left.svg';

const objectOperationsMap = {};
config.objectOperations.forEach(
  operation => (objectOperationsMap[operation.name] = operation),
);

const Container = styled.div`
  background-color: white;
  border: 1px solid #979797;
  margin: -1px;
  color: #4a4a4a;
`;

const HeaderContent = styled.div`
  display: flex;
  height: 42px;
  flex: 1;
  align-items: center;

  img {
    margin: 0px 12px;
  }
`;

const Header = styled.div`
  height: 42px;
  display: flex;
  align-items: center;
  cursor: pointer;

  ${props =>
    props.isOpen &&
    css`
      border-bottom: 1px solid #ccc;

      ${HeaderContent} img {
        transform: rotate(-90deg);
      }
    `};
`;

const Handler = styled.img`
  height: 24px;
  margin: 0px 6px;
  opacity: 0.8;
`;

const Title = styled.div`
  flex: 1;
`;

const Content = styled.div`
  padding: 12px;
`;

export default class Operation extends React.Component {
  onTitleClick = e => {
    const {onOpen, isOpen} = this.props;
    if (onOpen) {
      onOpen(!isOpen);
    }
  };

  render() {
    const {
      index,
      operation,
      onParameterChange,
      onParameterFocus,
      onParameterBlur,
      isOpen,
      onOpen,
    } = this.props;

    const {label, icon, parameters} = objectOperationsMap[operation.type];

    return (
      <Draggable draggableId={operation.id} index={index}>
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            innerRef={provided.innerRef}
            isDragging={snapshot.isDragging}>
            <Header isOpen={isOpen}>
              <Handler
                {...provided.dragHandleProps}
                src={HandlerImage}
                onMouseDown={e => {
                  e.persist();
                  onOpen(false, () => provided.dragHandleProps.onMouseDown(e));
                }}
              />
              <HeaderContent onClick={this.onTitleClick}>
                <Title>{label}</Title>
                <img src={isOpen ? ChevronImage : ChevronImage} />
              </HeaderContent>
            </Header>
            {isOpen && (
              <Content>
                {parameters.map(parameter => (
                  <PropertyInput
                    key={parameter.name}
                    parameter={parameter}
                    value={operation[parameter.name]}
                    onChange={value => onParameterChange(parameter, value)}
                    onFocus={() => onParameterFocus(parameter)}
                    onBlur={() => onParameterBlur(parameter)}
                  />
                ))}
              </Content>
            )}
          </Container>
        )}
      </Draggable>
    );
  }
}
