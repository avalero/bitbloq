import React from 'react';
import styled, {css} from 'react-emotion';
import {Draggable} from 'react-beautiful-dnd';
import PropertyInput from './PropertyInput';
import config from '../../config/threed';
import DragIcon from '../icons/Drag';
import AngleIcon from '../icons/Angle';
import TrashIcon from '../icons/Trash';

const objectOperationsMap = {};
config.objectOperations.forEach(
  operation => (objectOperationsMap[operation.name] = operation),
);

const Wrap = styled.div`
  border-radius: 3px;
  border-left: 5px solid ${props => props.color};
  margin: 4px 0px;
  ${props =>
    props.isDragging &&
    css`
      box-shadow: 0 0 0 2px #4dc3ff;
    `};
`;

const Container = styled.div`
  background-color: white;
  border: 1px solid #ebebeb;
  border-radius: 0px 3px 3px 0px;
  color: #373b44;
`;

const HeaderContent = styled.div`
  display: flex;
  height: 40px;
  flex: 1;
  align-items: center;
  font-weight: bold;
  font-size: 14px;

  svg {
    transform: rotate(-90deg);
    margin: 0px 8px 0px 2px;
  }
`;

const HeaderButtons = styled.div`
  display: none;
  margin-right: 15px;
`

const HeaderButton = styled.div`
  color: #8c919b;
  padding: 0px 5px;
  svg {
    height: auto;
    width: 12px;
  }
`

const Header = styled.div`
  height: 40px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #ebebeb;

  ${props =>
    props.isOpen &&
    css`
      ${HeaderContent} svg {
        transform: rotate(0deg);
      }
    `};

  &:hover ${HeaderButtons} {
    display: block;
  }
`;

const Handler = styled.div`
  height: 18px;
  margin: 0px 6px;
  color: #cccccc;
`;

const Title = styled.div`
  flex: 1;
`;

const Content = styled.div`
  padding: 20px;
  font-size: 13px;
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
      onRemove,
    } = this.props;

    const {label, parameters, color} = objectOperationsMap[operation.type];

    return (
      <Draggable draggableId={operation.id} index={index}>
        {(provided, snapshot) => (
          <Wrap
            {...provided.draggableProps}
            innerRef={provided.innerRef}
            isDragging={snapshot.isDragging}
            color={color}>
            <Container>
              <Header isOpen={isOpen}>
                <Handler
                  {...provided.dragHandleProps}
                  onMouseDown={e => {
                    e.persist();
                    onOpen(false, () =>
                      provided.dragHandleProps.onMouseDown(e),
                    );
                  }}
                >
                  <DragIcon />
                </Handler>
                <HeaderContent onClick={this.onTitleClick}>
                  <AngleIcon />
                  <Title>{label}</Title>
                </HeaderContent>
                <HeaderButtons>
                  <HeaderButton onClick={onRemove}>
                    <TrashIcon />
                  </HeaderButton>
                </HeaderButtons>
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
          </Wrap>
        )}
      </Draggable>
    );
  }
}
