import React from 'react';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import Canvas from './Canvas';
import {
  resolveBoardClass,
  resolveComponentClass,
  getCompatibleComponents,
  getCompatiblePorts,
  getConnectorPosition,
  getPortPosition,
  generateInstanceName
} from '../lib/hardware';
import graphPaperImage from '../assets/images/graph-paper.svg';
import {updateComponents} from '../actions/hardware';

const Container = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Toolbar = styled.div`
  width: 300px;
  background-color: #fafafa;
  border-right: 1px solid rgba(0, 0, 0, 0.15);
  z-index: 2;
`;

const CanvasWrap = styled.div`
  flex: 1;
  display: flex;
  position: relative;
`;

const Board = styled.div`
  position: absolute;
  width: ${props => props.image.width}px;
  height: ${props => props.image.height}px;
  transform: translate(
    ${props => 0 - props.image.width / 2}px,
    ${props => 0 - props.image.height / 2}px
  );
  background: url(${props => props.image.url});
  background-size: contain;
`;

const Component = styled.div`
  position: absolute;
  width: ${props => props.image.width}px;
  height: ${props => props.image.height}px;
  background: url(${props => props.image.url});
  background-size: contain;
`;

const ToolbarComponent = styled(Component)`
  position: relative;
`;

const ComponentWrap = styled.div`
  position: relative;
`;

const Connector = styled.div`
  border-radius: 100%;
  width: 14px;
  height: 14px;
  background-color: #f1c933;
  border: 1px solid #f19833;
  position: absolute;
  margin: -8px;
  left: ${props => props.x * 100}%;
  top: ${props => props.y * 100}%;

  &:hover {
    background-color: #f19833;
  }
`;

const Port = styled.div`
  width: 14px;
  height: 14px;
  background-color: #f1c933;
  border: 1px solid #f19833;
  position: absolute;
  margin: -8px;
  left: ${props => props.x * 100}%;
  top: ${props => props.y * 100}%;

  &:hover {
    background-color: #f19833;
  }
`;

class ConnectionEditor extends React.Component {
  state = {
    draggingComponent: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    draggingConnection: null,
    compatiblePorts: [],
  };

  canvas = React.createRef();

  onToolbarComponentMouseDown(e, componentClass) {
    const {components} = this.props;
    const newComponent = {
      name: generateInstanceName(componentClass, components),
      className: componentClass.name,
    };
    this.startDraggingComponent(e, newComponent);
  }

  onComponentMouseDown(e, component) {
    const {components, updateComponents} = this.props;
    const newComponents = components.filter(c => c !== component);
    updateComponents(newComponents);
    this.startDraggingComponent(e, component);
  }

  onConnectorMouseDown(e, component, connector) {
    e.stopPropagation();
    const {board} = this.props;

    const {x, y} = getConnectorPosition(component, connector.name);
    this.setState(prevState => ({
      draggingConnection: {
        component,
        connector: connector.name,
        x2: x,
        y2: y,
      },
      compatiblePorts: getCompatiblePorts(board, connector.type),
    }));
  }

  startDraggingComponent(e, component) {
    const {x: elementX, y: elementY} = e.currentTarget.getBoundingClientRect();
    const dragOffsetX = e.clientX - elementX;
    const dragOffsetY = e.clientY - elementY;
    const {x, y} = this.canvas.current.getItemPosition(
      e,
      dragOffsetX,
      dragOffsetY,
    );

    this.setState(prevState => ({
      ...prevState,
      draggingComponent: {...component, x, y},
      dragOffsetX,
      dragOffsetY,
    }));
  }

  onDragItem = (x, y) => {
    this.setState(prevState => ({
      ...prevState,
      draggingComponent: {
        ...prevState.draggingComponent,
        x,
        y,
      },
    }));
  };

  onDragItemStop = (x, y) => {
    const {components, updateComponents} = this.props;
    const {draggingComponent} = this.state;

    this.setState(prevState => ({
      ...prevState,
      draggingComponent: null,
    }));
    updateComponents([...components, draggingComponent]);
  };

  onDragConnection = (x, y) => {
    this.setState(prevState => ({
      ...prevState,
      draggingConnection: {
        ...prevState.draggingConnection,
        x2: x,
        y2: y,
      },
    }));
  };

  onDragConnectionStop = (x, y) => {
    const {components, updateComponents} = this.props;
    const {draggingConnection} = this.state;
    const {component, connector, port} = draggingConnection;

    if (port) {
      const {connections = []} = component;
      const updatedComponent = {
        ...component,
        connections: [...connections, {connector, port}],
      };

      updateComponents(
        components.map(c => (c === component ? updatedComponent : c)),
      );
    }

    this.setState(prevState => ({
      ...prevState,
      draggingConnection: null,
      compatiblePorts: [],
    }));
  };

  onPortMouseOver = port => {
    this.setState(prevState => ({
      ...prevState,
      draggingConnection: {
        ...prevState.draggingConnection,
        port: port.name,
      },
    }));
  };

  onPortMouseOut = () => {
    this.setState(prevState => ({
      ...prevState,
      draggingConnection: {
        ...prevState.draggingConnection,
        port: null,
      },
    }));
  };

  renderComponent = (component, isDragging) => {
    const {board} = this.props;
    if (component === board) {
      const {draggingConnection, compatiblePorts} = this.state;
      const boardClass = resolveBoardClass(board.className);
      const {image} = boardClass;

      return (
        <Board image={image}>
          {draggingConnection &&
            compatiblePorts.map(port => (
              <Port
                onMouseOver={() => this.onPortMouseOver(port)}
                onMouseOut={this.onPortMouseOut}
                key={port.name}
                x={port.x}
                y={port.y}
              />
            ))}
        </Board>
      );
    } else {
      const componentClass = resolveComponentClass(component.className);
      const {image, connectors = []} = componentClass;

      return (
        <Component
          image={image}
          onMouseDown={e => this.onComponentMouseDown(e, component)}>
          {connectors.map(connector => (
            <Connector
              x={connector.x}
              y={connector.y}
              key={connector.name}
              onMouseDown={e =>
                this.onConnectorMouseDown(e, component, connector)
              }
            />
          ))}
        </Component>
      );
    }
  };

  render() {
    const {
      draggingComponent,
      draggingConnection,
      dragOffsetX,
      dragOffsetY,
    } = this.state;
    const {board, components} = this.props;
    const boardClass = resolveBoardClass(board.className);
    const compatibleComponents = getCompatibleComponents(boardClass).filter(
      ({image}) => image,
    );

    const canvasItems = [board, ...components];

    const allConnections = [];

    components.forEach(component => {
      const {connections = []} = component;
      connections.forEach(({connector, port}) => {
        const {x: x1, y: y1} = getConnectorPosition(component, connector);
        const {x: x2, y: y2} = getPortPosition(board, port);
        allConnections.push({x1, y1, x2, y2});
      });
    });

    if (draggingConnection) {
      const {component, connector, x2, y2} = draggingConnection;
      const {x: x1, y: y1} = getConnectorPosition(component, connector);
      allConnections.push({x1, y1, x2, y2});
    }

    return (
      <Container>
        <Toolbar>
          {compatibleComponents
            .filter(componentClass => componentClass.image)
            .map(componentClass => (
              <ToolbarComponent
                image={componentClass.image}
                key={componentClass.name}
                onMouseDown={e =>
                  this.onToolbarComponentMouseDown(e, componentClass)
                }
              />
            ))}
        </Toolbar>
        <Canvas
          ref={this.canvas}
          items={canvasItems}
          renderItem={this.renderComponent}
          dragOffsetX={dragOffsetX}
          dragOffsetY={dragOffsetY}
          draggingItem={draggingComponent}
          onDragItem={this.onDragItem}
          onDragItemStop={this.onDragItemStop}
          draggingConnection={draggingConnection}
          onDragConnection={this.onDragConnection}
          onDragConnectionStop={this.onDragConnectionStop}
          connections={allConnections}
        />
      </Container>
    );
  }
}

const mapStateToProps = ({hardware}) => ({
  board: hardware.board,
  components: hardware.components,
});

const mapDispatchToProps = dispatch => ({
  updateComponents: components => dispatch(updateComponents(components)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConnectionEditor);
