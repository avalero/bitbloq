import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Bloq from './Bloq';
import { startDraggingBloq } from '../actions/bloqs';

const Container = styled.svg`
  width: 200px;
  background-color: #eee;
  padding: 12px;
`;

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseDown = this.onMouseDown.bind(this);
  }

  onMouseDown(e) {
    const x = e.clientX;
    const y = e.clientY;
    const offsetX = x - (e.target.clientLeft + e.target.offsetLeft);
    const offsetY = y - (e.target.clientTop + e.target.offsetTop);

    this.props.startDraggingBloq('bloq', x, y, offsetX, offsetY);

  }

  render() {
    return (
      <Container>
        <Bloq onMouseDown={this.onMouseDown} bloq={{}} />
      </Container>
    );
  }
}

const mapStateToProps = ((state) => ({}));
const mapDispatchToProps = {
  startDraggingBloq
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
