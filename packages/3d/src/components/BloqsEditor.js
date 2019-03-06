import React from 'react';
import uuid from 'uuid/v1';
import styled from '@emotion/styled';
import BloqFactory from './BloqFactory';
import Canvas from './Canvas';

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
  z-index: 2;
`;

const ToolbarBloqWrap = styled.div`
  position: relative;
  margin-top: 20px;
  height: ${props => props.height}px;
`;

const CanvasBloqWrap = styled.div`
  position: ${props => (props.isTop ? 'absolute' : 'relative')};
`;

const BloqChildrenWrap = styled.div`
  position: absolute;
  top: 48px;
  left: 16px;
`;

class BloqsEditor extends React.Component {
  state = {
    draggingBloq: null,
    activeSnapArea: null,
    snapAreas: [],
    offsetX: 0,
    offsetY: 0,
    bloqsPreview: [],
  };

  canvas = React.createRef();
  bloqRefs = {};

  constructor(props) {
    super(props);

    this.Bloq = BloqFactory(props.getBloqType, props.getBloqOptions);
  }

  getSnapAreas(bloq, offsetX, offsetY) {
    const {getBloqType} = this.props;
    let areas = [];
    const bloqType = getBloqType(bloq.type) || {};
    const bloqHeight = this.Bloq.getHeight(bloq);
    const {children = []} = bloq;

    if (bloq.next) {
      areas = areas.concat(
        this.getSnapAreas(bloq.next, offsetX, offsetY + bloqHeight),
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
          this.getSnapAreas(children[0], offsetX + 24, offsetY + 40),
        );
      }
    }

    const bloqRef = this.getBloqRef(bloq);
    const contentRects =
      bloqRef && bloqRef.current ? bloqRef.current.getContentRects() : [];
    bloqType.content.forEach((contentItem, i) => {
      if (contentItem.type === 'bloq') {
        areas.push({
          x: contentRects[i].x - SNAP_DISTANCE,
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
    this.startDraggingBloq(bloqs, toolbarBloq, e);
  };

  onCanvasBloqMouseDown = (e, bloq) => {
    const {bloqs, onBloqsChange} = this.props;
    e.stopPropagation();

    const newBloqs = bloqs
      .filter(rootBloq => rootBloq.id !== bloq.id)
      .map(rootBloq => this.deleteBloq(rootBloq, bloq));

    onBloqsChange(newBloqs);
    this.startDraggingBloq(newBloqs, bloq, e);
  };

  startDraggingBloq(bloqs, bloq, e) {
    const snapAreas = bloqs.reduce(
      (areas, bloq) => areas.concat(this.getSnapAreas(bloq, bloq.x, bloq.y)),
      [],
    );

    const {x: elementX, y: elementY} = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - elementX;
    const offsetY = e.clientY - elementY;
    const {x, y} = this.canvas.current.getItemPosition(e, offsetX, offsetY);

    this.setState(prevState => ({
      ...prevState,
      snapAreas,
      draggingBloq: {...bloq, x, y},
      offsetX,
      offsetY,
      bloqsPreview: bloqs,
    }));
  }

  onDragItem = (x, y) => {
    const {draggingBloq} = this.state;
    const {bloqs} = this.props;

    const activeSnapArea = this.getActiveSnapArea(x, y);

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
  };

  onDragItemStop = (x, y) => {
    const {draggingBloq, activeSnapArea} = this.state;
    const {bloqs, onBloqsChange} = this.props;

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

  renderCanvasBloq = (bloq, isDragging, isTop = true) => {
    const {next, children = []} = bloq;

    return (
      <CanvasBloqWrap
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
  };

  render() {
    const {draggingBloq, bloqsPreview, offsetX, offsetY} = this.state;
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
        <Canvas
          ref={this.canvas}
          items={canvasBloqs}
          draggingItem={draggingBloq}
          renderItem={this.renderCanvasBloq}
          dragOffsetX={offsetX}
          dragOffsetY={offsetY}
          onDragItem={this.onDragItem}
          onDragItemStop={this.onDragItemStop}
        />
      </Container>
    );
  }
}

export default BloqsEditor;
