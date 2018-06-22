import React from 'react';
import {connect} from 'react-redux';
import {dragBloq, stopDraggingBloq} from '../actions/bloqs';
import styled, {css} from 'react-emotion';
import Toolbar from './Toolbar';
import Bloq from './Bloq';
import Canvas from './Canvas';

const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const DragCanvas = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const DraggingBloq = styled(Bloq)`
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
    const {x: offsetX, y: offsetY} = svg.getBoundingClientRect();
    return {
      x: e.clientX - offsetX,
      y: e.clientY - offsetY
    };
  }

  onMouseMove(e) {
    const {draggingBloq, dragBloq} = this.props;
    if (draggingBloq) {
      const {x, y} = this.getCanvasPosition(e);
      dragBloq(e.clientX, e.clientY-100, x, y);
    }
  }

  onMouseUp(e) {
    const {draggingBloq} = this.props;
    const {x, y} = this.getCanvasPosition(e);
    if (draggingBloq) {
      this.props.stopDraggingBloq(x, y);
    }
  }

  render() {
    const {bloqs, draggingBloq} = this.props;

    return (
      <Container>
        <Toolbar />
        <Canvas svgRef={this.canvasSvgRef} />
        <DragCanvas>
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
