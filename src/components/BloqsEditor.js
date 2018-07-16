import React from 'react';
import uuid from 'uuid/v1';
import styled from 'react-emotion';
import BloqFactory from './BloqFactory';
import graphPaperImage from '../assets/images/graph-paper.svg';

const SNAP_DISTANCE = 32;

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
  height: ${props => props.height}px;
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

const CanvasBloqWrap = styled.div`
  position: ${props => (props.isTop ? 'absolute' : 'relative')};
`;

const BloqChildrenWrap = styled.div`
  position: absolute;
  top: 48px;
  left: 16px;
`;

const DragCanvas = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
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
    bloqsPreview: [],
  };

  canvas = React.createRef();
  dragCanvas = React.createRef();
  bloqRefs = {};

  constructor(props) {
    super(props);

    this.Bloq = BloqFactory(props.getBloqType, props.getBloqOptions);
  }

  componentDidMount() {
    document.body.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
  }

  componentWillUnmount() {
    document.body.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getSnapAreas(bloq, offsetX, offsetY, canvasX, canvasY) {
    const {getBloqType} = this.props;
    let areas = [];
    const bloqType = getBloqType(bloq.type) || {};
    const bloqHeight = this.Bloq.getHeight(bloq);
    const {children = []} = bloq;

    if (bloq.next) {
      areas = areas.concat(
        this.getSnapAreas(
          bloq.next,
          offsetX,
          offsetY + bloqHeight,
          canvasX,
          canvasY,
        ),
      );
    }

    areas.push({
      x: offsetX - SNAP_DISTANCE,
      y: offsetY + bloqHeight - SNAP_DISTANCE,
      width: SNAP_DISTANCE * 2,
      height: SNAP_DISTANCE * 2,
      type: 'next',
      bloq,
    });

    if (bloqType.type === 'codeblock') {
      areas.push({
        x: offsetX + 16 - SNAP_DISTANCE,
        y: offsetY + 40 - SNAP_DISTANCE,
        width: SNAP_DISTANCE * 2,
        height: SNAP_DISTANCE * 2,
        type: 'children',
        bloq,
      });
      if (children[0]) {
        areas = areas.concat(
          this.getSnapAreas(
            children[0],
            offsetX + 24,
            offsetY + 40,
            canvasX,
            canvasY,
          ),
        );
      }
    }

    const bloqRef = this.getBloqRef(bloq);
    const contentRects =
      bloqRef && bloqRef.current ? bloqRef.current.getContentRects() : [];
    bloqType.content.forEach((contentItem, i) => {
      if (contentItem.type === 'bloq') {
        areas.push({
          x: contentRects[i].x - canvasX - SNAP_DISTANCE,
          y: offsetY - SNAP_DISTANCE,
          width: SNAP_DISTANCE * 2,
          height: SNAP_DISTANCE * 2,
          type: 'content',
          contentItem,
          bloq,
        });
      }
    });

    return areas;
  }

  getActiveSnapArea(bloqX, bloqY) {
    const {snapAreas} = this.state;
    return snapAreas.find(
      ({x, y, width, height}) =>
        bloqX > x && bloqX < x + width && bloqY > y && bloqY < y + height,
    );
  }

  getBloqRef(bloq) {
    if (!bloq || !bloq.id) return;
    if (!this.bloqRefs[bloq.id]) {
      this.bloqRefs[bloq.id] = React.createRef();
    }
    return this.bloqRefs[bloq.id];
  }

  onToolbarBloqMouseDown = (e, toolbarBloq) => {
    const {bloqs} = this.props;
    const {x: elementX, y: elementY} = e.currentTarget.getBoundingClientRect();
    this.startDraggingBloq(
      bloqs,
      toolbarBloq,
      elementX,
      elementY,
      e.clientX,
      e.clientY,
    );
  };

  onCanvasBloqMouseDown = (e, bloq) => {
    const {bloqs, onBloqsChange} = this.props;
    e.stopPropagation();
    const {x: elementX, y: elementY} = e.currentTarget.getBoundingClientRect();

    const newBloqs = bloqs
      .filter(rootBloq => rootBloq.id !== bloq.id)
      .map(rootBloq => this.deleteBloq(rootBloq, bloq));

    onBloqsChange(newBloqs);
    this.startDraggingBloq(
      newBloqs,
      bloq,
      elementX,
      elementY,
      e.clientX,
      e.clientY,
    );
  };

  startDraggingBloq(bloqs, bloq, elementX, elementY, mouseX, mouseY) {
    const {
      x: canvasX,
      y: canvasY,
    } = this.canvas.current.getBoundingClientRect();
    const {
      x: dragCanvasX,
      y: dragCanvasY,
    } = this.dragCanvas.current.getBoundingClientRect();

    const snapAreas = bloqs.reduce(
      (areas, bloq) =>
        areas.concat(
          this.getSnapAreas(bloq, bloq.x, bloq.y, canvasX, canvasY),
        ),
      [],
    );

    this.setState(prevState => ({
      ...prevState,
      snapAreas,
      draggingBloq: {
        ...bloq,
        x: elementX - dragCanvasX,
        y: elementY - dragCanvasY,
      },
      offsetX: mouseX - elementX,
      offsetY: mouseY - elementY,
      canvasX,
      canvasY,
      dragCanvasX,
      dragCanvasY,
      bloqsPreview: bloqs,
    }));
  }

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
    const {bloqs} = this.props;

    if (draggingBloq) {
      const x = e.clientX - dragCanvasX - offsetX;
      const y = e.clientY - dragCanvasY - offsetY;
      const activeSnapArea = this.getActiveSnapArea(
        e.clientX - canvasX - offsetX,
        e.clientY - canvasY - offsetY,
      );

      let bloqsPreview;
      if (activeSnapArea) {
        if (activeSnapArea !== this.state.activeSnapArea) {
          let areaBloq;
          if (activeSnapArea.type === 'next') {
            areaBloq = {
              ...activeSnapArea.bloq,
              next: {
                ...draggingBloq,
                isGhost: true,
                x: 0,
                y: 0,
                next: activeSnapArea.bloq.next,
              },
            };
          } else if (activeSnapArea.type === 'children') {
            const {children = []} = activeSnapArea.bloq;
            areaBloq = {
              ...activeSnapArea.bloq,
              children: [
                {...draggingBloq, isGhost: true, x: 0, y: 0, next: children[0]},
              ],
            };
          } else if (activeSnapArea.type === 'content') {
            const {bloq, contentItem} = activeSnapArea;
            areaBloq = {
              ...bloq,
              data: {
                ...bloq.data,
                [contentItem.dataField]: {
                  ...draggingBloq,
                  isGhost: true,
                  x: 0,
                  y: 0,
                },
              },
            };
          }
          bloqsPreview = bloqs.map(rootBloq =>
            this.replaceBloq(rootBloq, areaBloq),
          );
        } else {
          bloqsPreview = this.state.bloqsPreview;
        }
      } else {
        bloqsPreview = bloqs;
      }

      this.setState(prevState => ({
        ...prevState,
        activeSnapArea,
        draggingBloq: {
          ...prevState.draggingBloq,
          x,
          y,
        },
        bloqsPreview,
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
        if (activeSnapArea.type === 'next') {
          newBloq.next = activeSnapArea.bloq.next;
          activeSnapArea.bloq.next = newBloq;
        }
        if (activeSnapArea.type === 'children') {
          activeSnapArea.bloq.children = [newBloq];
        }
        if (activeSnapArea.type === 'content') {
          const {bloq, contentItem} = activeSnapArea;
          bloq.data[contentItem.dataField] = newBloq;
        }
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
    const {children = [], next} = rootBloq;
    if (rootBloq.id === bloq.id) {
      return bloq;
    } else {
      return {
        ...rootBloq,
        next: next && this.replaceBloq(rootBloq.next, bloq),
        children: children[0]
          ? [this.replaceBloq(children[0], bloq)]
          : children,
      };
    }
  };

  deleteBloq = (rootBloq, bloq) => {
    if (rootBloq.next) {
      if (rootBloq.next.id === bloq.id) {
        return {
          ...rootBloq,
          next: null,
        };
      } else {
        return {
          ...rootBloq,
          next: this.deleteBloq(rootBloq.next, bloq),
        };
      }
    }

    return rootBloq;
  };

  onBloqChange = bloq => {
    const {bloqs, onBloqsChange} = this.props;
    onBloqsChange(bloqs.map(rootBloq => this.replaceBloq(rootBloq, bloq)));
  };

  renderCanvasBloq(bloq, isDragging, isTop = true) {
    const {next, children = []} = bloq;

    return (
      <CanvasBloqWrap
        key={bloq.id}
        style={{transform: `translate(${bloq.x}px,${bloq.y}px)`}}
        onMouseDown={e => this.onCanvasBloqMouseDown(e, bloq)}
        isTop={isTop}>
        <this.Bloq
          bloq={bloq}
          onChange={this.onBloqChange}
          isDragging={isDragging}
          ref={this.getBloqRef(bloq)}
        />
        {next && this.renderCanvasBloq(next, false, false)}
        {children.length > 0 && (
          <BloqChildrenWrap>
            {this.renderCanvasBloq(children[0])}
          </BloqChildrenWrap>
        )}
      </CanvasBloqWrap>
    );
  }

  render() {
    const {draggingBloq, activeSnapArea, bloqsPreview} = this.state;
    const {bloqs, toolbarBloqs, getBloqOptions, getBloqType} = this.props;

    const canvasBloqs = draggingBloq ? bloqsPreview : bloqs;

    return (
      <Container>
        <Toolbar>
          {toolbarBloqs.map((bloq, i) => (
            <ToolbarBloqWrap
              height={this.Bloq.getHeight(bloq)}
              onMouseDown={e => this.onToolbarBloqMouseDown(e, bloq)}
              key={i}>
              <this.Bloq bloq={bloq} />
            </ToolbarBloqWrap>
          ))}
        </Toolbar>
        <CanvasContainer>
          <Canvas innerRef={this.canvas}>
            {canvasBloqs.map(bloq => this.renderCanvasBloq(bloq))}
          </Canvas>
        </CanvasContainer>
        <DragCanvas innerRef={this.dragCanvas}>
          {draggingBloq && this.renderCanvasBloq(draggingBloq, true)}
        </DragCanvas>
      </Container>
    );
  }
}

export default BloqsEditor;
