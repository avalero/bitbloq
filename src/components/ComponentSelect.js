import React from 'react';
import styled from 'react-emotion';
import Select from 'react-select';

const customStyles = {
  control: (base) => ({
    ...base,
    minHeight: '28px',
    fontSize: '0.8em'
  }),
  dropdownIndicator: (base) => ({
    ...base,
    padding: '0 2px'
  })
}

const Wrap = styled.div`
  width: 120px;
  color: black;
`;

class ComponentSelect extends React.Component {
  render() {
    const {components, value, onChange} = this.props;

    const options = components.map((component) => ({
      value: component,
      label: component.name
    }));

    return (
      <Wrap>
        <Select
          getValue={() => value}
          options={options}
          styles={customStyles}
          onChange={({value}) => onChange(value)}
        />
      </Wrap>
    );
  }
}

export default ComponentSelect;
