import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import LightImage from "./images/Light";
import DarkImage from "./images/Dark";

import LightIcon from "./icons/light.svg";
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
        {value === "dark" && <DarkImage />}
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={LightIcon} />, id: "light" },
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
