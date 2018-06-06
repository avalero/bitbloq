import React from 'react';
import {connect} from 'react-redux';
import {dragBloq, stopDraggingBloq} from '../actions/bloqs';
import styled, {css} from 'styled-components';
import Toolbar from './Toolbar';
import Bloq from './Bloq';
import Canvas from './Canvas';

const Container = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const DragCanvas = styled.div`
  position: absolute;
  /*pointer-events: none;*/
`;

const DraggingBloq = styled(Bloq).attrs({
  style: ({x, y}) => ({
    transform: `translate(${x}px, ${y}px)`
  }),
})`
  position: absolute;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.4);
  cursor: grabbing;
`;

class Editor extends React.Component {
  constructor(props) {
    super(props);

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove(e) {
    const {draggingBloq, dragBloq} = this.props;
    if (draggingBloq) {
      dragBloq(e.clientX, e.clientY);
    }
  }

  onMouseUp() {
    this.props.stopDraggingBloq();
  }

  render() {
    const {bloqs, draggingBloq, draggingBloqX, draggingBloqY} = this.props;

    return (
      <Container>
        <Toolbar />
        <Canvas />
        <DragCanvas>
          {draggingBloq && <DraggingBloq x={draggingBloqX} y={draggingBloqY} />}
        </DragCanvas>
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs}) => ({
  bloqs: bloqs.bloqs,
  draggingBloq: bloqs.draggingBloq,
  draggingBloqX: bloqs.draggingX - bloqs.draggingOffsetX,
  draggingBloqY: bloqs.draggingY - bloqs.draggingOffsetY
});

const mapDispatchToProps = {
  dragBloq,
  stopDraggingBloq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
