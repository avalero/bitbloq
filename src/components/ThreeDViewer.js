import React from 'react';
import styled from 'react-emotion';
import JSCadViewer from '../lib/openjscad/jscad-viewer';
import {rebuildSolids} from '@jscad/core/code-evaluation/rebuildSolids';

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  position: relative;
`;

const CanvasWrap = styled.div`
  flex: 1;
`;

const Pre = styled('pre')`
  pointer-events: none;
  position: absolute;
  height: 100%;
  width: 400px;
  right: 0px;
  background-color: rgba(255,255,255,0.4);
  padding-left: 30px;
`;

const Code = styled('code')`
  padding-left: 40px;
`;

class ThreeDViewer extends React.Component {
  canvasRef = React.createRef();

  componentDidMount() {
    this.jscad = JSCadViewer(this.canvasRef.current, {});
    this.jscad.setCameraOptions({ position: { x: -15, y: 5, z: 30 }});
    this.update();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.update();
    }
  }

  update() {
    const { code } = this.props;
    rebuildSolids(code, '3d.jscad', {}, (err, objects) => {
      if (!err) {
        this.jscad.setCsg(objects[0]);
        this.jscad.resetCamera();
      }
    });
  }

  render() {
    return (
      <Container>
        <CanvasWrap innerRef={this.canvasRef} />
        <Pre>
          <Code>{this.props.code}</Code>
        </Pre>
      </Container>
    );
  }
}

export default ThreeDViewer;
