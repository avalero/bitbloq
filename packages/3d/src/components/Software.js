import React from 'react';
import {connect} from 'react-redux';
import styled from '@emotion/styled';
import {Spring, animated, interpolate} from 'react-spring';
import {resolveSoftwareType} from '../lib/bloq-types';
import {resolveComponentClass} from '../lib/hardware';
import {updateBloqs} from '../actions/software';
import BloqsEditor from './BloqsEditor';
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

const toolbarBloqs = [
  {type: 'OnButtonPressed'},
  {type: 'TurnOnLed'},
  {type: 'TurnOffLed'},
  {type: 'Delay'},
  {type: 'If'},
  {type: 'True'}
];

class Software extends React.Component {
  state = {
    tab: 'bloqs',
  };

  onCodeClick = () => this.setState({tab: 'code'});
  onBloqsClick = () => this.setState({tab: 'bloqs'});

  getBloqOptions = (options) => {
    const {hardware: {components = []} = {}} = this.props;

    return components
      .filter(component => {
        const componentClass = resolveComponentClass(component.className);
        return componentClass.isInstanceOf(options.componentClass);
      })
      .map(component => ({label: component.name, value: component}));
  };

  render() {
    const {bloqs, updateBloqs} = this.props;
    const {tab} = this.state;

    return (
      <Container>
        <Spring native from={{x: 0}} to={{x: tab === 'code' ? -50 : 0}}>
          {({x}) => (
            <Wrap
              style={{
                transform: interpolate([x], x => `translate(${x}%, 0)`),
              }}>
              <BloqsEditor
                bloqs={bloqs}
                toolbarBloqs={toolbarBloqs}
                onBloqsChange={updateBloqs}
                getBloqType={resolveSoftwareType}
                getBloqOptions={this.getBloqOptions}
              />
              <CodeButton onClick={this.onCodeClick}>Code</CodeButton>
              <BloqsButton onClick={this.onBloqsClick}>Bloqs</BloqsButton>
              <CodeEditor />
            </Wrap>
          )}
        </Spring>
      </Container>
    );
  }
}

const mapStateToProps = ({software, hardware}) => ({
  bloqs: software.bloqs,
  hardware,
});

const mapDispatchToProps = dispatch => ({
  updateBloqs: bloqs => dispatch(updateBloqs(bloqs)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Software);
