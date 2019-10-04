import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import BulbImage from "./images/Bulb";

import OnIcon from "./icons/led-on.svg";
import OffIcon from "./icons/led-off.svg";

interface ITurnOnConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const TurnOnConfiguration: FC<ITurnOnConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        <BulbImage isOn={value === "on"} />
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={OnIcon} />, id: "on" },
          { content: <ButtonIcon src={OffIcon} />, id: "off" }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default TurnOnConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const ImageWrap = styled.div`
  margin-right: 20px;
  svg {
    width: 200px;
    height: 200px;
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
