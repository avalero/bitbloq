import React from 'react';
import styled from 'react-emotion';
import {OOMLView} from 'ooml.js';

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
    const {code} = this.props;
    this.oomlView = new OOMLView(this.canvasRef.current, code);
    window.addEventListener('resize', this.onWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onWindowResize);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.code !== this.props.code) {
      this.update();
    }
  }

  onWindowResize = () => {
    this.oomlView.updateSize();
  }

  update() {
    const { code } = this.props;
    this.oomlView.updateCode(code);
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
