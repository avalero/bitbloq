import React, { FC, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { IComponentInstance } from "@bitbloq/bloqs";
import useHardwareDefinition from "./useHardwareDefinition";
import BloqSelect from "./BloqSelect";
import { componentsState } from "./state";

interface IBloqSelectComponentProps {
  value: IComponentInstance | undefined;
  onChange: (newValue: IComponentInstance) => void;
  componentTypes: string[];
}

const BloqSelectComponent: FC<IBloqSelectComponentProps> = ({
  value,
  onChange,
  componentTypes
}) => {
  const components = useRecoilValue(componentsState);
  const { isInstanceOf } = useHardwareDefinition();

  const options = useMemo(
    () =>
      components
        .filter(c =>
          componentTypes
            ? componentTypes.some(type => isInstanceOf(c.component, type))
            : true
        )
        .map(c => ({
          label: c.name,
          value: c.name
        })),
    [components, componentTypes]
  );

  return (
    <BloqSelect
      options={options}
      value={value?.name}
      onChange={name => {
        const component = components.find(c => c.name === name);
        if (component) {
          onChange(component);
        }
      }}
    />
  );
};

export default BloqSelectComponent;
