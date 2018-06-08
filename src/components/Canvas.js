import React from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { dark } from 'react-syntax-highlighter/styles/prism';
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
  constructor(props) {
    super(props);

    this.getPosition = this.getPosition.bind(this);
  }

  getPosition(clientX, clientY) {
    if (this.svg) {
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      return pt.matrixTransform(svg.getScreenCTM().inverse());
    }
  }

  render() {
    const {bloqs, code} = this.props;
    const codeString = '(num) => num + 1';

    return (
      <Container>
        <Main ref={(svg) => this.svg = svg}>
          {bloqs.map((bloq, i) => (
            <Bloq key={i} bloq={bloq} />
          ))}
        </Main>
        <SyntaxHighlighter language='c' style={dark}>{code}</SyntaxHighlighter>
      </Container>
    );
  }
}

const mapStateToProps = ({bloqs}) => ({
  bloqs: bloqs.bloqs,
  code: bloqs.code
});

const mapDispatchToProps = {
  dragBloq
};

export default connect(mapStateToProps, mapDispatchToProps)(Canvas);
