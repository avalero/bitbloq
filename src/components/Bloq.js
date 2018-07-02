import React from 'react';
import {connect} from 'react-redux';
import styled from 'react-emotion';
import {resolveType} from '../lib/bloq-types';
import ComponentSelect from './ComponentSelect';
import BloqShape from './bloqs/BloqShape';

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  cursor: grab;
`;

const Wrap = styled.div`
  height: 48px;
`;

const Content = styled.div`
  position: absolute;
  top: 10px;
  left: 0px;
  display: flex;
  color: white;
  user-select: none;
  align-items: center;
  padding: 0px 6px;

  & > * {
    margin: 0px 6px;
  }
`;

const Label = styled.span`
  white-space: nowrap;
`;

const Input = styled.input`
  width: 80px;
  font-family: Jua;
  height: 26px;
  padding: 0px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  border: 1px solid hsl(0,0%,80%);
`;

const getCompatibleComponents = (componentClass, hardware) => {
  const {components = []} = hardware;
  return components.filter(
    component => component.componentClass === componentClass,
  );
};

const ContentItem = ({type, bloq, hardware, onChange, ...props}) => {
  const value = bloq.data && bloq.data[props.dataField];

  switch (type) {
    case 'label':
      return <Label>{props.text}</Label>;

    case 'selectComponent':
      const components = getCompatibleComponents(
        props.componentClass,
        hardware,
      );
      return (
        <ComponentSelect
          components={components}
          value={value}
          onChange={onChange}
        />
      );

    case 'input':
      return (
        <Input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
        />
      );

    default:
      return null;
  }
};

class Bloq extends React.Component {
  state = {contentWidth: 0};
  contentRef = React.createRef();

  componentDidMount() {
    this.updateContentWidth();
  }

  componentDidUpdate() {
    this.updateContentWidth();
  }

  updateContentWidth() {
    if (this.contentRef.current) {
      const {width} = this.contentRef.current.getBoundingClientRect();
      if (width !== this.state.contentWidth) {
        this.setState(state => ({ ...state, contentWidth: width }));
      }
    }
  }

  renderContent() {
    const {bloq, hardware, onChange} = this.props;
    const bloqType = resolveType(bloq.type) || {};
    const {content = []} = bloqType;

    return (
      <Content innerRef={this.contentRef}>
        {content.map((item, i) => (
          <ContentItem
            {...item}
            key={i}
            bloq={bloq}
            hardware={hardware}
            onChange={value =>
              onChange({
                ...bloq,
                data: {...bloq.data, [item.dataField]: value},
              })
            }
          />
        ))}
      </Content>
    );
  }

  render() {
    const {contentWidth} = this.state;
    const {className, bloq, ghost, hardware, onChange} = this.props;
    const bloqType = resolveType(bloq.type) || {};

    return (
      <Container style={{transform: `translate(${bloq.x}px,${bloq.y}px)`}}>
        <Wrap>
          <BloqShape type={bloqType.type} ghost={ghost} width={contentWidth} />
          {this.renderContent()}
        </Wrap>
        {bloq.next && (
          <div style={{transform: 'translate(0,0)'}}>
            <Bloq bloq={bloq.next} hardware={hardware} onChange={onChange} />
          </div>
        )}
      </Container>
    );
  }
}

Bloq.defaultProps = {
  hardware: {components: []},
};

export default Bloq;
