import React from 'react';
import chroma from 'chroma-js';
import styled from '@emotion/styled';
import {colors} from '../base-styles';

const fill = colors.red;
const stroke = chroma(colors.red).darken(0.5);

const Path = styled.path`
  cursor: grab;
`;

class StatementShape extends React.Component {
  static getHeight() {
    return 48;
  }

  render() {
    const {width} = this.props;

    const path = `
      m 0,4
      A 4,4 0 0,1 4,0
      H 12
      c 2,0 3,1 4,2
      l 4,4
      c 1,1 2,2 4,2
      h 12
      c 2,0 3,-1 4,-2
      l 4,-4
      c 1,-1 2,-2 4,-2
      H ${width}
      a 4,4 0 0,1 4,4
      v 40
      a 4,4 0 0,1 -4,4
      H 48
      c -2,0 -3,1 -4,2
      l -4,4
      c -1,1 -2,2 -4,2
      h -12
      c -2,0 -3,-1 -4,-2
      l -4,-4
      c -1,-1 -2,-2 -4,-2
      H 4
      a 4,4 0 0,1 -4,-4
      z
    `;

    return (
      <Path fill={fill} stroke={stroke} d={path} />
    );
  }
}

export default StatementShape;
