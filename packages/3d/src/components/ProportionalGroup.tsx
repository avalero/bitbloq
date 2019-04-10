import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, Icon, useTranslate } from "@bitbloq/ui";
import PropertyInput from "./PropertyInput";

import { IObjectParameter, IOperationParameter } from "../types";

type Parameter = IObjectParameter | IOperationParameter;

export interface IProportionalGroupProps {
  parameters: Parameter[];
  object: object;
  onObjectChange: (object: object) => any;
}

const ProportionalGroup: FC<IProportionalGroupProps> = ({
  parameters,
  object,
  onObjectChange
}) => {
  const [isLocked, setIsLocked] = useState(true);

  const onParameterChange = (parameter: Parameter, value: any) => {
    const oldValue = object[parameter.name!];
    const ratio = value / oldValue;

    const newObject = parameters.reduce((o, p) => {
      if (p === parameter) {
        return { ...o, [p.name!]: value };
      } else if (isLocked) {
        const newValue = Math.round(o[p.name!] * ratio * 100) / 100;
        return { ...o, [p.name!]: newValue };
      } else {
        return o;
      }
    }, object);

    onObjectChange(newObject);
  };

  return (
    <Container>
      {parameters.map((parameter, i) => (
        <React.Fragment key={parameter.name}>
          {i > 0 && (
            <Line style={{ transform: `translate(0, ${(i - 1) * 46}px)` }} />
          )}
          <PropertyInput
            parameter={{ ...parameter, type: "integer" }}
            value={object[parameter.name!]}
            onChange={(newValue: any) => onParameterChange(parameter, newValue)}
          />
        </React.Fragment>
      ))}
      <LockButton onClick={() => setIsLocked(!isLocked)}>
        <Icon name={isLocked ? "padlock-close" : "padlock-open"} />
      </LockButton>
    </Container>
  );
};

export default ProportionalGroup;

const Container = styled.div`
  position: relative;
`;

const LockButton = styled.div`
  position: absolute;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border: 1px solid #cfcfcf;
  background-color: white;
  color: #9b9da1;
  top: 50%;
  left: 60px;
  transform: translate(0, -50%);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;

  svg {
    width: 14px;
    height: 14px;
  }
`;

const Line = styled.div`
  position: absolute;
  top: 20px;
  left: 75px;
  width: 45px;
  height: 45px;
  border-style: solid none solid solid;
  border-color: #d8d8d8;
  border-width: 1px;
`;
