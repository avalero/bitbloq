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

const DragCanvas = styled.svg`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
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

    this.canvasSvgRef = React.createRef();
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getCanvasPosition(e) {
    const svg = this.canvasSvgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  onMouseMove(e) {
    const {draggingBloq, dragBloq} = this.props;
    if (draggingBloq) {
      const {x, y} = this.getCanvasPosition(e);
      dragBloq(e.clientX, e.clientY, x, y);
    }
  }

  onMouseUp(e) {
    const {x, y} = this.getCanvasPosition(e);
    this.props.stopDraggingBloq(x, y);
  }

  render() {
    const {bloqs, draggingBloq} = this.props;

    return (
      <Container>
        <Toolbar />
        <Canvas svgRef={this.canvasSvgRef} />
        <DragCanvas ref={(svg) => this.dragCanvas = svg}>
          {draggingBloq && <DraggingBloq bloq={draggingBloq} />}
        </DragCanvas>
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs}) => ({
  bloqs: bloqs.bloqs,
  draggingBloq: bloqs.draggingBloq
});

const mapDispatchToProps = {
  dragBloq,
  stopDraggingBloq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Editor);
