import React from 'react';
import styled, {css} from 'styled-components';
import {connect} from 'react-redux';
import {dragBloq} from '../actions/bloqs';
import Bloq from './Bloq';

const Container = styled.svg`
  flex: 1;
`;

class Canvas extends React.Component {
  render() {
    const {bloqs} = this.props;
    return (
      <Container>
        {bloqs.map((bloq, i) => (
          <Bloq key={i} bloq={bloq} />
        ))}
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs}) => ({
  bloqs: bloqs.bloqs
});

const mapDispatchToProps = {
  dragBloq
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
