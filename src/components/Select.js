import React from 'react';
import styled from 'react-emotion';
import ReactSelect from 'react-select';

const customStyles = {
  control: base => ({
    ...base,
    minHeight: '28px',
    fontSize: '0.8em',
  }),
  dropdownIndicator: base => ({
    ...base,
    padding: '0 2px',
  }),
};

const Wrap = styled.div`
  width: 120px;
  color: black;
`;

class Select extends React.Component {
  render() {
    const {options, value, onChange, onMouseDown, selectConfig} = this.props;

    return (
      <Wrap onMouseDown={onMouseDown}>
        <ReactSelect
          {...selectConfig}
          defaultValue={options[0]}
          getValue={() => value}
          options={options}
          styles={customStyles}
          onChange={({value}) => onChange(value)}
        />
      </Wrap>
    );
  }
}

export default Select;
