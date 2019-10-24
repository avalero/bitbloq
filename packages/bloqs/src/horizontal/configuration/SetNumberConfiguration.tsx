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
  const value = Number(bloq.parameters.value);
  const action = bloq.parameters.action as string;

  return (
    <Container>
      <Switch
        buttons={[
          { content: <Icon name="equal" />, id: "writeNumber" },
          { content: <Icon name="plus" />, id: "incrementNumber" },
          { content: <Icon name="minus" />, id: "decrementNumber" }
        ]}
        value={action}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { action: { $set: newValue } } }))
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
