import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Bloq from './Bloq';
import { startDraggingBloq } from '../actions/bloqs';

const Container = styled.div`
  width: 200px;
  background-color: #eee;
  padding: 12px;
`;

const BloqWrap = styled.svg`
  margin-top: 20px;
  height: 60px;
`;

class Toolbar extends React.Component {
  onMouseDown(e, bloq) {
    const x = e.clientX;
    const y = e.clientY;
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = x;
    pt.y = y;
    const { x: offsetX, y: offsetY } = pt.matrixTransform(svg.getScreenCTM().inverse());

    this.props.startDraggingBloq(bloq, x, y, offsetX, offsetY);
  }

  render() {
    const toolbarBloqs = [
      { type: 'OnButtonPressed' },
      { type: 'TurnOnLed' },
      { type: 'TurnOffLed' },
      { type: 'Delay' }
    ];

    return (
      <Container>
        {toolbarBloqs.map((bloq, i) => (
          <BloqWrap onMouseDown={(e) => this.onMouseDown(e, bloq)} key={i}>
            <Bloq bloq={bloq} />
          </BloqWrap>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = ((state) => ({}));
const mapDispatchToProps = {
  startDraggingBloq
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Toolbar);
