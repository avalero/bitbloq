import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch, JuniorNumberInput } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import SevenSegmentImage from "./images/SevenSegment";

export interface ISetNumberConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const symbol = {
  writeNumber: "=",
  incrementNumber: "+",
  decrementNumber: "-"
};

const SetNumberConfiguration: FC<ISetNumberConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = Number(bloq.parameters.value);
  const action = bloq.parameters.action as string;

  return (
    <Container>
      <ImageWrap>
        <p>{symbol[action]}</p>
        <SevenSegmentImage value={value} />
      </ImageWrap>
      <SwitchWrap>
        <Switch
          buttons={[
            { content: <Icon name="equal" />, id: "writeNumber" },
            { content: <Icon name="plus" />, id: "incrementNumber" },
            { content: <Icon name="minus" />, id: "decrementNumber" }
          ]}
          value={action}
          onChange={newValue =>
            onChange(
              update(bloq, { parameters: { action: { $set: newValue } } })
            )
          }
        />
        <JuniorNumberInput
          value={value}
          onChange={newValue =>
            onChange(
              update(bloq, { parameters: { value: { $set: newValue } } })
            )
          }
        />
      </SwitchWrap>
    </Container>
  );
};

export default SetNumberConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 30px;
  display: flex;
  align-items: center;

  p {
    font-size: 80px;
    margin-right: 16px;
  }
`;

const SwitchWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Switch = styled(JuniorSwitch)`
  margin-right: 10px;
`;
