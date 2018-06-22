import React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import Bloq from './Bloq';
import {startDraggingBloq} from '../actions/bloqs';

const Container = styled.div`
  width: 300px;
  background-color: #eee;
  padding: 12px;
`;

const BloqWrap = styled.div`
  position: relative;
  margin-top: 20px;
  height: 60px;
`;

class Toolbar extends React.Component {
  onMouseDown(e, bloq) {
    const x = e.clientX;
    const y = e.clientY;
    const element = e.currentTarget;
    const {x: elementX, y: elementY} = element.getBoundingClientRect();
    this.props.startDraggingBloq(bloq, x, y-100, x - elementX, y - elementY);
  }

  render() {
    const toolbarBloqs = [
      {type: 'OnButtonPressed'},
      {type: 'TurnOnLed'},
      {type: 'TurnOffLed'},
      {type: 'Delay'},
    ];

    return (
      <Container>
        {toolbarBloqs.map((bloq, i) => (
          <BloqWrap onMouseDown={e => this.onMouseDown(e, bloq)} key={i}>
            <Bloq bloq={bloq} />
          </BloqWrap>
        ))}
      </Container>
    );
  }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = {
  startDraggingBloq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Toolbar);
