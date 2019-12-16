import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";
import BalloonPanel from "../BalloonPanel";

import HotImage from "./images/TemperatureHot";
import ColdImage from "./images/TemperatureCold";

import HotIcon from "./icons/hot.svg";
import ColdIcon from "./icons/cold.svg";

interface ITemperatureConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const TemperatureConfiguration: FC<ITemperatureConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        {value === "hot" && <HotImage />}
        {value === "cold" && <ColdImage />}
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={ColdIcon} />, id: "cold" },
          { content: <ButtonIcon src={HotIcon} />, id: "hot" }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default TemperatureConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 55px;
  display: flex;
  align-items: center;
`;

const RightArrow = styled.div`
  svg {
    transform: rotate(180deg);
  }
`;

const ButtonIcon = styled.img`
  width: 36px;
`;
