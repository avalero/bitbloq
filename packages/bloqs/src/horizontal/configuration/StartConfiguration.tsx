import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorNumberInput, JuniorSwitch } from "@bitbloq/ui";

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
  const type = bloq.parameters.type as string;
  const times = bloq.parameters.times as number;

  return (
    <Container>
      <Switch
        buttons={[
          { content: <Icon name="loop" />, id: "loop" },
          { content: <Icon name="times" />, id: "times" }
        ]}
        value={type}
        onChange={value =>
          onChange(update(bloq, { parameters: { type: { $set: value } } }))
        }
      />
      {type === "loop" && (
        <LoopImageWrap>
          <LoopImage />
        </LoopImageWrap>
      )}
      {type === "times" && (
        <JuniorNumberInput
          value={times}
          onChange={value =>
            onChange(update(bloq, { parameters: { times: { $set: value } } }))
          }
        />
      )}
    </Container>
  );
};

export default StartConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const Switch = styled(JuniorSwitch)`
  margin-right: 20px;
`;

const LoopImageWrap = styled.div`
  svg {
    width: 152px;
    height: 92px;
  }
`;
