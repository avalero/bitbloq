import React from 'react';
import styled, { css } from 'react-emotion';
import NumberInput from '../NumberInput';
import Select from '../Select';
import ColorPicker from '../ColorPicker';
import STLLoader from '../lib/object3dts/STLLoader'

const FormGroup = styled.div`
  margin-bottom: 6px;
  display: flex;
  align-items: center;

  label {
    display: block;
    flex: 1;
  }

  input {
    flex: 1;
  }
`;

const IntegerProperty = ({
 label, value, onChange, onFocus, onBlur
 }) => (
  <FormGroup>
    <label>{label}</label>
    <NumberInput
      value={value}
      onChange={e => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </FormGroup>
);

const FileProperty = ({ onChange }) => (
  <FormGroup>
    <input
      type="file"
      onChange={(e) => {
        console.log(e.target.files[0].name);
        const file = e.target.files[0];
        if (file.type.match('model/x.stl-binary')) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const blob = reader.result;
            const geom = STLLoader.loadBinaryStl(blob);
            onChange(geom);
          };
          reader.readAsArrayBuffer(file);
        } else if (file.type.match('model/x.stl-ascii')) {
          const reader = new FileReader();

          reader.onload = (e) => {
            const blob = reader.result;
            const geom = STLLoader.loadBinaryStl(blob);
            onChange(geom);
          };
          reader.readAsArrayBuffer(file);
        } else {
          throw 'Error: Not recognized file type';
        }
      }}
      id="stlFile"
      name="stlFile"
      accept="model/stl, model/x.stl-binary, model/x.stl-ascii"
    />
  </FormGroup>
);

const SelectProperty = ({ 
label, options, value, onChange, onFocus, onBlur
 }) => (
  <FormGroup>
    <label>{label}</label>
    <Select
      value={value}
      options={options}
      selectConfig={{ isSearchable: false }}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </FormGroup>
);

const BooleanProperty = ({ label, value, onChange }) => (
  <FormGroup>
    <label>{label}</label>
    <input
      type="checkbox"
      checked={value}
      onChange={e => onChange(e.target.checked)}
    />
  </FormGroup>
);

const ColorProperty = ({ label, value, onChange }) => (
  <FormGroup>
    <label>{label}</label>
    <ColorPicker color={value} onChange={onChange} position="top-right" />
  </FormGroup>
);

const PropertyInput = ({ 
parameter, value, onChange, onFocus, onBlur 
}) => {
  switch (parameter.type) {
    case 'integer':
      return (
        <IntegerProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
    case 'select':
      return (
        <SelectProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          options={parameter.options}
        />
      );
    case 'boolean':
      return (
        <BooleanProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
        />
      );
    case 'color':
      return (
        <ColorProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
        />
      );
    case 'file':
      return (
        <FileProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};

export default PropertyInput;
