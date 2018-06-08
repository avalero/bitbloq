import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import {dark} from 'react-syntax-highlighter/styles/prism';
import styled, {css} from 'styled-components';
import {connect} from 'react-redux';
import {dragBloq} from '../actions/bloqs';
import Bloq from './Bloq';

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Main = styled.svg`
  flex: 1;
`;

class Canvas extends React.Component {
  render() {
    const {bloqs, code, svgRef, ghostBloq} = this.props;
    const codeString = '(num) => num + 1';

    return (
      <Container>
        <Main innerRef={svgRef}>
          {bloqs.map((bloq, i) => <Bloq key={i} bloq={bloq} />)}
          {ghostBloq && <Bloq bloq={ghostBloq} ghost />}
        </Main>
        <SyntaxHighlighter language="c" style={dark}>
          {code}
        </SyntaxHighlighter>
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs}) => ({
  bloqs: bloqs.bloqs,
  code: bloqs.code,
  ghostBloq: bloqs.snapArea && {
    ...bloqs.draggingBloq,
    x: bloqs.snapArea.x + bloqs.snapArea.width / 2,
    y: bloqs.snapArea.y + bloqs.snapArea.height / 2,
  },
});

const mapDispatchToProps = {
  dragBloq,
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
