import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';
import {Draggable} from 'react-beautiful-dnd';
import PropertyInput from './PropertyInput';
import config from '../../config/threed';
import {Icon, withTranslate} from '@bitbloq/ui';

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
`;

const HeaderContent = styled.div`
  display: flex;
  height: 40px;
  flex: 1;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  padding-left: 10px;

  svg {
    transform: rotate(-90deg);
    margin: 0px 8px 0px 2px;
  }
`;

const HeaderButtons = styled.div`
  display: none;
  margin-right: 15px;
`;

const HeaderButton = styled.div`
  color: #8c919b;
  padding: 0px 5px;
  svg {
    height: auto;
    width: 12px;
  }
`;

const Handler = styled.div`
  height: 18px;
  margin: 0px 6px;
  color: #cccccc;
  display: none;
`;

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

  ${props =>
    props.advancedMode &&
    css`
      ${Handler} {
        display: block;
      }

      ${HeaderContent} {
        padding-left: 0px;
      }
    `}

  &:hover ${HeaderButtons} {
    display: ${props => (props.advancedMode ? 'block' : 'none')};
  }
`;

const Title = styled.div`
  flex: 1;
  text-transform: capitalize;
`;

const Content = styled.div`
  padding: 20px;
  font-size: 13px;
`;

class Operation extends React.Component {

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
      advancedMode,
      t
    } = this.props;

    const {label, basicLabel, parameters, color} = objectOperationsMap[
      operation.type
    ];

    let title;
    if (advancedMode || !basicLabel) {
      title = t(label);
    } else {
      title = t(basicLabel);
    }

    return (
      <Draggable draggableId={operation.id} index={index}>
        {(provided, snapshot) => (
          <Wrap
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging={snapshot.isDragging}
            color={color}>
            <Container>
              <Header isOpen={isOpen} advancedMode={advancedMode}>
                <Handler
                  {...provided.dragHandleProps}
                  onMouseDown={e => {
                    e.persist();
                    onOpen(false, () =>
                      provided.dragHandleProps.onMouseDown(e),
                    );
                  }}>
                  <Icon name="drag" />
                </Handler>
                <HeaderContent onClick={this.onTitleClick}>
                  <Icon name="angle" />
                  <Title>{title}</Title>
                </HeaderContent>
                <HeaderButtons>
                  <HeaderButton onClick={onRemove}>
                    <Icon name="trash" />
                  </HeaderButton>
                </HeaderButtons>
              </Header>
              {isOpen && (
                <Content>
                  {parameters.map(parameter => {
                    if (
                      (parameter.advancedMode && !advancedMode) ||
                      (parameter.basicMode && advancedMode)
                    ) {
                      return;
                    }

                    const value = parameter.getValue
                      ? parameter.getValue(operation)
                      : operation[parameter.name];

                    return (
                      <PropertyInput
                        key={parameter.name}
                        parameter={parameter}
                        value={value}
                        onChange={value => onParameterChange(parameter, value)}
                        onFocus={() => onParameterFocus(parameter)}
                        onBlur={() => onParameterBlur(parameter)}
                      />
                    );
                  })}
                </Content>
              )}
            </Container>
          </Wrap>
        )}
      </Draggable>
    );
  }
}

export default withTranslate(Operation);
