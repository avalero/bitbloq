import React from 'react';
import chroma from 'chroma-js';
import styled from '@emotion/styled';
import {colors} from '../base-styles';

const fill = colors.green;
const stroke = chroma(colors.green).darken(0.5);

const Path = styled.path`
  cursor: grab;
`;

class CodeBlockShape extends React.Component {
  static getHeight(childrenHeight) {
    return 88 + Math.max(childrenHeight + 8, 16);
  }

  render() {
    const {width, childrenHeight} = this.props;

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
      H ${Math.max(width, 80)}
      a 4,4 0 0,1 4,4
      v 40
      a 4,4 0 0,1 -4,4
      H 64
      c -2,0 -3,1 -4,2
      l -4,4
      c -1,1 -2,2 -4,2
      h -12
      c -2,0 -3,-1 -4,-2
      l -4,-4
      c -1,-1 -2,-2 -4,-2
      h -8
      a 4,4 0 0,0 -4,4
      v ${Math.max(childrenHeight + 8, 16)}
      a 4,4 0 0,0 4,4
      h 8
      c 2,0 3,1 4,2
      l 4,4
      c 1,1 2,2 4,2
      h 12
      c 2,0 3,-1 4,-2
      l 4,-4
      c 1,-1 2,-2 4,-2
      H ${Math.max(width, 80)}
      a 4,4 0 0,1 4,4
      v 24
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

export default CodeBlockShape;
