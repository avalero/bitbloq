import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch, JuniorNumberInput } from "@bitbloq/ui";

import { IBloq } from "../../index";

export interface ISetNumberConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const SetNumberConfiguration: FC<ISetNumberConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as number;
  const operation = bloq.parameters.operation as string;

  return (
    <Container>
      <Switch
        buttons={[
          { content: <Icon name="equal" />, id: "set" },
          { content: <Icon name="plus" />, id: "increment" },
          { content: <Icon name="minus" />, id: "decrement" }
        ]}
        value={operation}
        onChange={newValue =>
          onChange(
            update(bloq, { parameters: { operation: { $set: newValue } } })
          )
        }
      />
      <JuniorNumberInput
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default SetNumberConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled(JuniorSwitch)`
  margin-right: 20px;
`;
