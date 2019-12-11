import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorNumberInput } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

export interface IStartConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const StartConfiguration: FC<IStartConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = (bloq.parameters.value || 0) as number;

  return (
    <Container>
      <NumberContainer>{value.toString().padStart(2, "0")}</NumberContainer>
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
  align-items: center;
  flex-direction: column;
`;

const NumberContainer = styled(BalloonPanel)`
  font-size: 80px;
  padding: 30px 50px;
`;
