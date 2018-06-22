import React from 'react';
import styled from 'react-emotion';
import EventShape from './EventShape';
import StatementShape from './StatementShape';

const components = {
  event: EventShape,
  statement: StatementShape,
};

const Wrap = styled.g`
  opacity: ${props => (props.ghost ? 0.2 : 1)};
`;

const BloqShape = ({type, ghost, width}) => (
  <svg>
    <Wrap ghost={ghost}>{React.createElement(components[type], {width})}</Wrap>
  </svg>
);

export default BloqShape;
