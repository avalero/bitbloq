import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorNumberInput } from "@bitbloq/ui";

import { IBloq } from "../../index";

import LoopImage from "./images/LoopImage";

export interface IStartConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const StartConfiguration: FC<IStartConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as number;

  return (
    <Container>
      <p>¿Cuántos segundos esperamos?</p>
      <JuniorNumberInput
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default StartConfiguration;

const Container = styled.div`
  display: flex;

  p {
    margin-top: 22px;
    font-size: 20px;
    margin-right: 10px;
    max-width: 180px;
    text-align: right;
    line-height: normal;
  }
`;

