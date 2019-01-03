import React from 'react';
import chroma from 'chroma-js';
import styled from '@emotion/styled';
import {colors} from '../base-styles';

const fill = colors.blue;
const stroke = chroma(colors.blue).darken(0.5);

const Path = styled.path`
  cursor: grab;
`;

class BooleanShape extends React.Component {
  static getHeight() {
    return 40;
  }

  render() {
    const {width = 0, isPlaceholder} = this.props;

    const path = `
      m 20,0
      H ${Math.max(width, 40)}
      l 20 20
      l -20 20
      H 20
      l -20 -20
      l 20 -20
      z
    `;

    return (
      <Path fill={isPlaceholder ? 'white' : fill} stroke={stroke} d={path} />
    );
  }
}

export default BooleanShape;
