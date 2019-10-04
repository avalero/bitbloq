import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

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
  const detect = bloq.parameters.detect as string;

  return (
    <Container>
      <ImageWrap>
        {detect === "hot" && <HotImage />}
        {detect === "cold" && <ColdImage />}
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={HotIcon} />, id: "hot" },
          { content: <ButtonIcon src={ColdIcon} />, id: "cold" }
        ]}
        value={detect}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { detect: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default TemperatureConfiguration;

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

const RightArrow = styled.div`
  svg {
    transform: rotate(180deg);
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
