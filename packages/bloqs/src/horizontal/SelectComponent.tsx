import React from "react";
import styled from "@emotion/styled";
import { Select } from "@bitbloq/ui";

import { IComponentInstance } from "../index";

interface ISelectComponentProps {
  value: string;
  onChange: (newValue: string) => any;
  components: IComponentInstance[];
  className?: string;
}

const SelectComponent: React.FunctionComponent<ISelectComponentProps> = ({
  value,
  onChange,
  components,
  className
}) => {
  const options = components.map(c => ({
    value: c
  }));

  const component = components.find(c => c.name === value);

  return (
    <Select
      className={className}
      options={options}
      selectConfig={{
        isSearchable: false
      }}
      components={{
        Option: CustomOption,
        SingleValue: CustomValueContainer
      }}
      value={component}
      onChange={(newValue: IComponentInstance) => onChange(newValue.name)}
    />
  );
};

export default SelectComponent;

const CustomOption = (props: any) => {
  return (
    <Option {...props.innerProps}>
      <Port>{props.value.port}</Port>
      {props.value.name}
    </Option>
  );
};

const CustomValueContainer = (props: any) => {
  const component = props.data.value;
  return (
    <Value {...props.innerProps}>
      {component && (
        <>
          <Port>{component.port}</Port>
          {component.name}
        </>
      )}
    </Value>
  );
};

const Option = styled.div`
  cursor: pointer;
  display: flex;
  padding: 6px 8px;
  align-items: center;
  &:hover {
    background-color: #e4e4e4;
  }
`;

const Value = styled.div`
  display: flex;
  align-items: center;
`;

const Port = styled.div`
  height: 16px;
  width: 16px;
  border-radius: 10px;
  border: 1px solid #979797;
  background-color: #d8d8d8;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000;
  margin-right: 8px;
`;
