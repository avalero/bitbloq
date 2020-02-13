import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import LedImage from "./images/Led";

import OnIcon from "./icons/led-on.svg";
import OffIcon from "./icons/led-off.svg";
import WhiteIcon from "./icons/color-white.svg";
import BlueIcon from "./icons/color-blue.svg";
import GreenIcon from "./icons/color-green.svg";
import RedIcon from "./icons/color-red.svg";

interface IColorLedConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const ColorLedConfiguration: FC<IColorLedConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;
  const code = bloq.parameters.code as string;

  return (
    <Container>
      <ImageWrap>
        <LedImage color={value} />
      </ImageWrap>
      <SwitchWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={OnIcon} />, id: "on" },
            { content: <ButtonIcon src={OffIcon} />, id: "off" }
          ]}
          value={value === "off" ? "off" : "on"}
          onChange={id =>
            onChange(
              update(bloq, {
                parameters: { value: { $set: id === "on" ? "red" : "off" } }
              })
            )
          }
        />
        <ColorSwitch disabled={value === "off"}>
          <JuniorSwitch
            buttons={[
              { content: <ButtonIcon src={RedIcon} />, id: "red" },
              { content: <ButtonIcon src={GreenIcon} />, id: "green" },
              { content: <ButtonIcon src={BlueIcon} />, id: "blue" },
              { content: <ButtonIcon src={WhiteIcon} />, id: "white" }
            ]}
            value={value}
            onChange={(newValue: string) =>
              onChange(
                update(bloq, {
                  parameters: {
                    value: { $set: newValue }
                  }
                })
              )
            }
          />
        </ColorSwitch>
      </SwitchWrap>
    </Container>
  );
};

export default ColorLedConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 70px;
  display: flex;
  align-items: center;
`;

const SwitchWrap = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ButtonIcon = styled.img`
  width: 36px;
`;

const ColorSwitch = styled.div<{ disabled?: boolean }>`
  margin-left: 10px;
  position: relative;

  ${props =>
    props.disabled &&
    css`
      &::after {
        content: "";
        display: block;
        position: absolute;
        top: 0px;
        left: 0px;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.3);
      }
    `}
`;
