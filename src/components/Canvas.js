import React from 'react';
import styled, {css} from 'react-emotion';
import {connect} from 'react-redux';
import {dragBloq, updateBloq} from '../actions/bloqs';
import Bloq from './Bloq';

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Main = styled.div`
  flex: 1;
  position: relative;
`;

class Canvas extends React.Component {
  render() {
    const {bloqs, svgRef, ghostBloq, hardware, updateBloq} = this.props;

    return (
      <Container>
        <Main innerRef={svgRef}>
          {bloqs.map((bloq, i) => (
            <Bloq
              key={i}
              bloq={bloq}
              hardware={hardware}
              onChange={updateBloq}
            />
          ))}
          {ghostBloq && <Bloq bloq={ghostBloq} ghost />}
        </Main>
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs, hardware}) => ({
  bloqs: bloqs.bloqs,
  ghostBloq: bloqs.snapArea && {
    ...bloqs.draggingBloq,
    x: bloqs.snapArea.x + bloqs.snapArea.width / 2,
    y: bloqs.snapArea.y + bloqs.snapArea.height / 2,
  },
  hardware,
});

const mapDispatchToProps = {
  dragBloq,
  updateBloq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
