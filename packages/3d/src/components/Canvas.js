import React from 'react';
import styled from '@emotion/styled';
import graphPaperImage from '../assets/images/graph-paper.svg';

const Container = styled.div`
  flex: 1;
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

const Items = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  transform: translate(
    ${props => props.translateX}px,
    ${props => props.translateY}px
  );
`;

const Connections = styled.svg`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const Connection = styled('line')`
  stroke: #f1c933;
  stroke-width: 6px;
`;

const DragItems = styled.div`
  position: absolute;
  pointer-events: none;
  width: 100%;
  height: 100%;
  z-index: 3;
  transform: translate(
    ${props => props.translateX}px,
    ${props => props.translateY}px
  );
`;

class Canvas extends React.Component {
  state = {
    containerRect: {left: 0, top: 0, width: 0, height: 0},
    center: {x: 0, y: 0},
  };

  container = React.createRef();

  componentDidMount() {
    window.addEventListener('resize', this.onWindowResize);
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    this.updateContainerRect();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
  }

  getItemPosition(e, offsetX, offsetY) {
    const {
      containerRect: {left, top, width, height},
      center,
    } = this.state;
    const {dragOffsetX, dragOffsetY} = this.props;
    const x = e.clientX - left - offsetX - (width / 2 - center.x);
    const y = e.clientY - top - offsetY - (height / 2 - center.y);

    return {x, y};
  }

  onMouseMove = e => {
    const {
      draggingItem,
      onDragItem,
      dragOffsetX,
      dragOffsetY,
      draggingConnection,
      onDragConnection,
    } = this.props;
    if (draggingItem && onDragItem) {
      const {x, y} = this.getItemPosition(e, dragOffsetX, dragOffsetY);
      onDragItem(x, y);
    }
    if (draggingConnection && onDragConnection) {
      const {x, y} = this.getItemPosition(e, 0, 0);
      onDragConnection(x, y);
    }
  };

  onMouseUp = e => {
    const {
      draggingItem,
      onDragItemStop,
      dragOffsetX,
      dragOffsetY,
      draggingConnection,
      onDragConnectionStop,
    } = this.props;
    if (draggingItem && onDragItemStop) {
      const {x, y} = this.getItemPosition(e, dragOffsetX, dragOffsetY);
      onDragItemStop(x, y);
    }
    if (draggingConnection && onDragConnectionStop) {
      const {x, y} = this.getItemPosition(e, 0, 0);
      onDragConnectionStop(x, y);
    }
  };

  onWindowResize = () => {
    this.updateContainerRect();
  };

  updateContainerRect() {
    if (this.container.current) {
      this.setState({
        containerRect: this.container.current.getBoundingClientRect(),
      });
    }
  }

  render() {
    const {center, containerRect} = this.state;
    const {items, draggingItem, renderItem, connections} = this.props;

    const {width, height} = containerRect;
    const translateX = width / 2 - center.x;
    const translateY = height / 2 - center.y;

    return (
      <Container ref={this.container}>
        <Items translateX={translateX} translateY={translateY}>
          {items.map((item, i) => (
            <div
              key={item.id || i}
              style={{transform: `translate(${item.x}px,${item.y}px`}}>
              {renderItem(item)}
            </div>
          ))}
        </Items>
        {connections && (
          <Connections>
            <g transform={`translate(${translateX} ${translateY})`}>
              {connections.map((connection, i) => (
                <Connection
                  x1={connection.x1}
                  x2={connection.x2}
                  y1={connection.y1}
                  y2={connection.y2}
                  key={i}
                />
              ))}
            </g>
          </Connections>
        )}
        <DragItems translateX={translateX} translateY={translateY}>
          {draggingItem && (
            <div
              style={{
                transform: `translate(${draggingItem.x}px,${draggingItem.y}px`,
              }}>
              {renderItem(draggingItem, true)}
            </div>
          )}
        </DragItems>
      </Container>
    );
  }
}

export default Canvas;
