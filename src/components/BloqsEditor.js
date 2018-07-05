import React from 'react';
import uuid from 'uuid/v1';
import styled from 'react-emotion';
import Bloq from './Bloq';
import graphPaperImage from '../assets/images/graph-paper.svg';

const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Toolbar = styled.div`
  width: 300px;
  background-color: #fafafa;
  padding: 12px;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
`;

const ToolbarBloqWrap = styled.div`
  position: relative;
  margin-top: 20px;
  height: 60px;
`;

const CanvasContainer = styled.div`
  flex: 1;
  display: flex;
`;

const Canvas = styled.div`
  flex: 1;
  position: relative;

  &::before {
    content: '';
    background-image: url(${graphPaperImage});
    opacity: 0.1;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
  }
`;

const DragCanvas = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
`;

const DraggingBloq = styled(Bloq)`
  position: absolute;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.4);
  cursor: grabbing;
`;

class BloqsEditor extends React.Component {
  state = {
    canvasX: 0,
    canvasY: 0,
    dragCanvasX: 0,
    dragCanvasY: 0,
    draggingBloq: null,
    activeSnapArea: null,
    snapAreas: [],
    offsetX: 0,
    offsetY: 0,
  };

  canvas = React.createRef();
  dragCanvas = React.createRef();

  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getBloqSnapArea(bloq, offsetX, offsetY) {
    return bloq.next
      ? this.getBloqSnapArea(bloq.next, offsetX, offsetY + 48)
      : {
          x: offsetX - 40,
          y: offsetY - 40,
          width: 80,
          height: 80,
          bloq,
        };
  }

  getActiveSnapArea(bloqX, bloqY) {
    const {snapAreas} = this.state;
    return snapAreas.find(
      ({x, y, width, height}) =>
        bloqX > x && bloqX < x + width && bloqY > y && bloqY < y + height,
    );
  }

  getCanvasPosition(e) {
    const canvas = this.canvas.current;
    const {x: offsetX, y: offsetY} = canvas.getBoundingClientRect();
    return {
      x: e.clientX - offsetX,
      y: e.clientY - offsetY,
    };
  }

  onToolbarBloqMouseDown = (e, toolbarBloq) => {
    const {bloqs} = this.props;
    const x = e.clientX;
    const y = e.clientY;
    const {x: elementX, y: elementY} = e.currentTarget.getBoundingClientRect();
    const {
      x: canvasX,
      y: canvasY,
    } = this.canvas.current.getBoundingClientRect();
    const {
      x: dragCanvasX,
      y: dragCanvasY,
    } = this.dragCanvas.current.getBoundingClientRect();

    const snapAreas = bloqs.map(bloq =>
      this.getBloqSnapArea(bloq, bloq.x, bloq.y + 48),
    );

    this.setState(prevState => ({
      ...prevState,
      snapAreas,
      draggingBloq: {
        ...toolbarBloq,
        x: elementX - dragCanvasX,
        y: elementY - dragCanvasY,
      },
      offsetX: x - elementX,
      offsetY: y - elementY,
      canvasX,
      canvasY,
      dragCanvasX,
      dragCanvasY,
    }));
  };

  onMouseMove = e => {
    const {
      draggingBloq,
      offsetX,
      offsetY,
      canvasX,
      canvasY,
      dragCanvasX,
      dragCanvasY,
    } = this.state;

    if (draggingBloq) {
      const x = e.clientX - dragCanvasX - offsetX;
      const y = e.clientY - dragCanvasY - offsetY;
      const activeSnapArea = this.getActiveSnapArea(
        e.clientX - canvasX - offsetX,
        e.clientY - canvasY - offsetY,
      );

      this.setState(prevState => ({
        ...prevState,
        activeSnapArea,
        draggingBloq: {
          ...prevState.draggingBloq,
          x,
          y,
        },
      }));
    }
  };

  onMouseUp = e => {
    const {
      draggingBloq,
      activeSnapArea,
      canvasX,
      canvasY,
      offsetX,
      offsetY,
    } = this.state;
    const {bloqs, onBloqsChange} = this.props;

    if (draggingBloq) {
      const x = e.clientX - canvasX - offsetX;
      const y = e.clientY - canvasY - offsetY;

      const newBloq = {
        ...draggingBloq,
        id: uuid(),
        x: activeSnapArea ? 0 : x,
        y: activeSnapArea ? 0 : y,
        data: {},
      };
      if (activeSnapArea) {
        activeSnapArea.bloq.next = newBloq;
      }

      this.setState(prevState => ({
        ...prevState,
        draggingBloq: null,
        activeSnapArea: null,
      }));
      onBloqsChange(activeSnapArea ? bloqs : [...bloqs, newBloq]);
    }
  };

  replaceBloq = (rootBloq, bloq) => {
    if (rootBloq.id === bloq.id) {
      return bloq;
    } else if (rootBloq.next) {
      rootBloq.next = this.replaceBloq(rootBloq.next, bloq);
    }

    return rootBloq;
  };

  onBloqChange = bloq => {
    const {bloqs, onBloqsChange} = this.props;
    onBloqsChange(bloqs.map(rootBloq => this.replaceBloq(rootBloq, bloq)));
  };

  render() {
    const {draggingBloq, activeSnapArea} = this.state;
    const {bloqs, toolbarBloqs, getBloqOptions, getBloqType} = this.props;

    const ghostBloq = activeSnapArea && {
      ...draggingBloq,
      x: activeSnapArea.x + activeSnapArea.width / 2,
      y: activeSnapArea.y + activeSnapArea.height / 2,
    };

    return (
      <Container>
        <Toolbar>
          {toolbarBloqs.map((bloq, i) => (
            <ToolbarBloqWrap
              onMouseDown={e => this.onToolbarBloqMouseDown(e, bloq)}
              key={i}>
              <Bloq bloq={bloq} getType={getBloqType} />
            </ToolbarBloqWrap>
          ))}
        </Toolbar>
        <CanvasContainer>
          <Canvas innerRef={this.canvas}>
            {bloqs.map((bloq, i) => (
              <Bloq
                key={i}
                bloq={bloq}
                getOptions={getBloqOptions}
                onChange={this.onBloqChange}
                getType={getBloqType}
              />
            ))}
            {ghostBloq && <Bloq bloq={ghostBloq} getType={getBloqType} ghost />}
          </Canvas>
        </CanvasContainer>
        <DragCanvas innerRef={this.dragCanvas}>
          {draggingBloq && (
            <DraggingBloq bloq={draggingBloq} getType={getBloqType} />
          )}
        </DragCanvas>
      </Container>
    );
  }
}

export default BloqsEditor;
