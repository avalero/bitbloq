import React from 'react';
import {connect} from 'react-redux';
import styled from 'styled-components';
import {resolveType} from '../lib/bloq-types';
import ComponentSelect from './ComponentSelect';

const Path = styled.path`
  cursor: grab;
`;

const Content = styled.div`
  display: flex;
  color: white;
  font-size: 20px;
  user-select: none;
`;

const paths = {
  event:
    'm 0,0 c 25,-22 71,-22 96,0 H 190 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z',
  statement:
    'm 0,4 A 4,4 0 0,1 4,0 H 12 c 2,0 3,1 4,2 l 4,4 c 1,1 2,2 4,2 h 12 c 2,0 3,-1 4,-2 l 4,-4 c 1,-1 2,-2 4,-2 H 145.34479904174805 a 4,4 0 0,1 4,4 v 40  a 4,4 0 0,1 -4,4 H 48   c -2,0 -3,1 -4,2 l -4,4 c -1,1 -2,2 -4,2 h -12 c -2,0 -3,-1 -4,-2 l -4,-4 c -1,-1 -2,-2 -4,-2 H 4 a 4,4 0 0,1 -4,-4 z',
};

const fills = {
  event: 'hsl(45, 80%, 50%)',
  statement: 'hsl(350, 80%, 50%)',
};

const strokes = {
  event: 'hsl(45, 80%, 40%)',
  statement: 'hsl(350, 80%, 40%)',
};

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
      return <span>{props.text}</span>;

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
        <input
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
  renderContent() {
    const {bloq, hardware, onChange} = this.props;
    const bloqType = resolveType(bloq.type) || {};
    const {content = []} = bloqType;

    return (
      <Content>
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
    const {className, bloq, ghost, hardware, onChange} = this.props;
    const bloqType = resolveType(bloq.type) || {};

    return (
      <g transform={`translate(${bloq.x},${bloq.y})`}>
        <Path
          stroke={ghost ? '#ccc' : strokes[bloqType.type]}
          fill={ghost ? '#ccc' : fills[bloqType.type]}
          d={paths[bloqType.type]}
        />
        <foreignObject x="6" y="12" width="200">
          {this.renderContent()}
        </foreignObject>
        {bloq.next && (
          <g transform="translate(0,48)">
            <Bloq bloq={bloq.next} hardware={hardware} onChange={onChange} />
          </g>
        )}
      </g>
    );
  }
}

Bloq.defaultProps = {
  hardware: {components: []},
};

export default Bloq;
