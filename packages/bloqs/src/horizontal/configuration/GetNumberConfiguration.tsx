import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorNumberInput } from "@bitbloq/ui";

import { IBloq } from "../../index";

export interface IGetNumberConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const GetNumberConfiguration: FC<IGetNumberConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as number;

  return (
    <Container>
      <JuniorNumberInput
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default GetNumberConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

