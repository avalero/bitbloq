import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import SwitchOffImage from "./images/SwitchOff";
import SwitchOnImage from "./images/SwitchOn";

interface ISwitchConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const SwitchConfiguration: FC<ISwitchConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <SwitchImageWrap>
        {value === "pos2" && <SwitchOffImage />}
        {value === "pos1" && <SwitchOnImage />}
      </SwitchImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <Icon name="arrow" />, id: "pos2" },
          {
            content: (
              <RightArrow>
                <Icon name="arrow" />
              </RightArrow>
            ),
            id: "pos1"
          }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default SwitchConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const SwitchImageWrap = styled.div`
  margin-right: 20px;
  svg {
    width: 200px;
    height: 200px;
  }
`;

const RightArrow = styled.div`
  svg {
    transform: rotate(180deg);
  }
`;
