import React from 'react';
import styled from '@emotion/styled';
import {css} from '@emotion/core';

const Wrap = styled.div`
  position: relative;
`;

const Container = styled.div`
  position: relative;
`;

const BloqShapeContainer = styled.svg`
  position: absolute;
  top: -10px;
  left: -10px;
`;

export default class PropertiesBloq extends React.Component {
  containerRef = React.createRef();

  state = {
    width: 0,
    height: 0,
  };

  componentDidMount() {
    this.updateSize();
  }

  componentDidUpdate() {
    this.updateSize();
  }

  updateSize() {
    const container = this.containerRef.current;
    if (container) {
      const {width, height} = container.getBoundingClientRect();
      if (width !== this.state.width || height !== this.state.height) {
        this.setState({width, height});
      }
    }
  }

  render() {
    const {children, isTop} = this.props;
    const {width, height} = this.state;

    const path = `
      m 10,16
      a 6,6 0 0,1 6,-6
      ${
        !isTop
          ? 'H 60 a 9,9 0 0,0 18,0'
          : ''
      }
      H ${width + 4}
      a 6,6 0 0,1 6,6
      V ${height + 4}
      a 6,6 0 0,1 -6,6
      H 78
      a 9,9 0 0,1 -18,0
      H 16
      a 6,6 0 0,1 -6,-6
      V 16
    `;

    return (
      <Wrap>
        <BloqShapeContainer width={width + 20} height={height + 20}>
          <path fill="#ffffff" stroke="#979797" d={path} />
        </BloqShapeContainer>
        <Container ref={this.containerRef}>{children}</Container>
      </Wrap>
    );
  }
}
