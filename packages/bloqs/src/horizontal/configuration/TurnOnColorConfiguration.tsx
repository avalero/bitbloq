import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import BulbColorImage from "./images/BulbColor";

import OnIcon from "./icons/led-on.svg";
import OffIcon from "./icons/led-off.svg";
import WhiteIcon from "./icons/color-white.svg";
import BlueIcon from "./icons/color-blue.svg";
import GreenIcon from "./icons/color-green.svg";
import RedIcon from "./icons/color-red.svg";

interface ITurnOnConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const bulbColors = {
  red: "rgb(255, 0, 0)",
  green: "rgb(0, 255, 0)",
  blue: "rgb(0, 0, 255)",
  white: "rgba(255, 230, 50, 0.8)"
};

const TurnOnConfiguration: FC<ITurnOnConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <div>
      <ImageWrap>
        <BulbColorImage isOn={value !== "off"} color={bulbColors[value]} />
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
                parameters: { value: { $set: id === "on" ? "white" : "off" } }
              })
            )
          }
        />
        {value !== "off" && (
          <JuniorSwitch
            buttons={[
              { content: <ButtonIcon src={WhiteIcon} />, id: "white" },
              { content: <ButtonIcon src={RedIcon} />, id: "red" },
              { content: <ButtonIcon src={GreenIcon} />, id: "green" },
              { content: <ButtonIcon src={BlueIcon} />, id: "blue" }
            ]}
            value={value}
            onChange={(newValue: string) =>
              onChange(
                update(bloq, {
                  parameters: { value: { $set: newValue } }
                })
              )
            }
          />
        )}
      </SwitchWrap>
    </div>
  );
};

export default TurnOnConfiguration;

const ImageWrap = styled.div`
  margin-bottom: 20px;
  svg {
    width: 484px;
    height: 200px;
  }
`;

const SwitchWrap = styled.div`
  display: flex;
  justify-content: space-around;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
