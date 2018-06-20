import React from 'react';

class ComponentSelect extends React.Component {
  onChange = e => {
    const {components, onChange} = this.props;
    const component = components.find(c => c.name === e.target.value);
    this.props.onChange(component);
  };

  render() {
    const {components, value, onChange} = this.props;
    return (
      <select value={value ? value.name : ''} onChange={this.onChange}>
        <option />
        {components.map((component, i) => (
          <option key={i} value={component.name}>
            {component.name}
          </option>
        ))}
      </select>
    );
  }
}

export default ComponentSelect;
