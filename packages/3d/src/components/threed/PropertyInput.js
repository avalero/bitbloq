import React from 'react';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import {
  Checkbox,
  ColorPicker,
  NumberInput,
  Input,
  Select,
  Translate,
} from '@bitbloq/ui';
import { STLLoader } from '@bitbloq/lib3d';

const FormGroup = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;

  label {
    display: block;
    width: 120px;
  }

  input {
    flex: 1;
  }
`;

const ColorPickerWrap = styled.div`
  flex: 1;
`;

const StyledSelect = styled(Select)`
  flex: 1;
`;

const IntegerProperty = ({ label, value, onChange, onFocus, onBlur, unit }) => (
  <FormGroup>
    <Translate>{t => <label>{t(label)}</label>}</Translate>
    <NumberInput
      value={value}
      unit={unit}
      onChange={value => onChange(value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </FormGroup>
);

const StringProperty = ({ label, value, onChange }) => (
  <FormGroup>
    <Translate>{t => <label>{t(label)}</label>}</Translate>
    <Input value={value} onChange={e => onChange(e.target.value)} />
  </FormGroup>
);

const FileProperty = ({ onChange }) => (
  <FormGroup>
    <input
      type="file"
      onChange={e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          const uint8Data = new Uint8Array(reader.result);
          onChange({ uint8Data, filetype: file.type, newfile: true });
        };

        reader.readAsArrayBuffer(file);
      }}
      id="file"
      name="file"
      accept="model/stl, model/x.stl-binary, model/x.stl-ascii"
    />
  </FormGroup>
);

const SelectProperty = ({
  label,
  options = [],
  value,
  onChange,
  onFocus,
  onBlur,
}) => (
  <Translate>
    {t => (
      <FormGroup>
        <label>{t(label)}</label>
        <StyledSelect
          value={value}
          options={options.map(o => ({
            ...o,
            label: o.labelId ? t(o.labelId) : o.label,
          }))}
          selectConfig={{ isSearchable: false }}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      </FormGroup>
    )}
  </Translate>
);

const BooleanProperty = ({ label, value, onChange }) => (
  <FormGroup>
    <Translate>{t => <label>{t(label)}</label>}</Translate>
    <Checkbox checked={value} onChange={onChange} />
  </FormGroup>
);

const ColorProperty = ({ label, value, onChange }) => (
  <FormGroup>
    <Translate>{t => <label>{t(label)}</label>}</Translate>
    <ColorPickerWrap>
      <ColorPicker color={value} onChange={onChange} position="top-right" />
    </ColorPickerWrap>
  </FormGroup>
);

const PropertyInput = ({ parameter, value, onChange, onFocus, onBlur }) => {
  switch (parameter.type) {
    case 'integer':
      return (
        <IntegerProperty
          label={parameter.label}
          unit={parameter.unit}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
        />
      );
    case 'string':
      return (
        <StringProperty
          label={parameter.label}
          value={value}
          onChange={onChange}
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
