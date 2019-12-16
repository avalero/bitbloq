import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";
import BalloonPanel from "../BalloonPanel";

import LightImage from "./images/Light";
import SunsetImage from "./images/Sunset";
import DarkImage from "./images/Dark";

import LightIcon from "./icons/light.svg";
import SunsetIcon from "./icons/sunset.svg";
import DarkIcon from "./icons/dark.svg";

interface ILightConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const DetectLightConfiguration: FC<ILightConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        {value === "light" && <LightImage />}
        {value === "sunset" && <SunsetImage />}
        {value === "dark" && <DarkImage />}
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={LightIcon} />, id: "light" },
          { content: <ButtonIcon src={SunsetIcon} />, id: "sunset" },
          { content: <ButtonIcon src={DarkIcon} />, id: "dark" }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default DetectLightConfiguration;

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

const ButtonIcon = styled.img`
  width: 36px;
`;
