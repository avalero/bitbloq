import React from 'react';
import styled from 'react-emotion';
import {Spring, animated, interpolate} from 'react-spring';
import Editor from './Editor';
import CodeEditor from './CodeEditor';

const Container = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const Wrap = styled(animated.div)`
  display: flex;
  position: absolute;
  width: 200%;
  height: 100%;
`;

const CodeButton = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: #1e1e1e;
  color: white;
  padding: 20px;
  font-size: 10px;
  margin-left: -50px;
  cursor: pointer;
`;

const BloqsButton = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  background-color: white;
  padding: 20px;
  font-size: 10px;
  z-index: 1;
  cursor: pointer;
`;

class Software extends React.Component {
  state = {
    tab: 'bloqs',
  };

  onCodeClick = () => this.setState({tab: 'code'});
  onBloqsClick = () => this.setState({tab: 'bloqs'});

  render() {
    const {tab} = this.state;

    return (
      <Container>
        <Spring native from={{x: 0}} to={{x: tab === 'code' ? -50 : 0}}>
          {({x}) => (
            <Wrap
              style={{
                transform: interpolate([x], x => `translate(${x}%, 0)`),
              }}>
              <Editor />
              <CodeButton onClick={this.onCodeClick}>
                Code
              </CodeButton>
              <BloqsButton onClick={this.onBloqsClick}>Bloqs</BloqsButton>
              <CodeEditor />
            </Wrap>
          )}
        </Spring>
      </Container>
    );
  }
}

export default Software;
