import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import ButtonPressedImage from "./images/ButtonPressed";
import ButtonReleasedImage from "./images/ButtonReleased";

import PressedIcon from "./icons/button-pressed.svg";
import ReleasedIcon from "./icons/button-released.svg";

interface IButtonConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const ButtonConfiguration: FC<IButtonConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ButtonImageWrap>
        {value === "pressed" && <ButtonPressedImage />}
        {value === "released" && <ButtonReleasedImage />}
      </ButtonImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={PressedIcon} />, id: "pressed" },
          { content: <ButtonIcon src={ReleasedIcon} />, id: "released" }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default ButtonConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ButtonImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 55px;
  display: flex;
  align-items: center;
  svg {
    width: 80px;
    height: 80px;
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
