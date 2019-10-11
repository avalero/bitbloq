import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import WheelImage from "./images/Wheel";

import ClockwiseIcon from "./icons/servo-clockwise.svg";
import CounterclockwiseIcon from "./icons/servo-counterclockwise.svg";
import StopIcon from "./icons/servo-stop.svg";
import SlowIcon from "./icons/servo-slow.svg";
import MediumIcon from "./icons/servo-medium.svg";
import FastIcon from "./icons/servo-fast.svg";

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
  const rotation = bloq.parameters.rotation as string;
  const speed = bloq.parameters.speed as string;

  return (
    <div>
      <ImageWrap>
        <WheelImage />
      </ImageWrap>
      <SwitchWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={ClockwiseIcon} />, id: "clockwise" },
            {
              content: <ButtonIcon src={CounterclockwiseIcon} />,
              id: "counterclockwise"
            },
            { content: <ButtonIcon src={StopIcon} />, id: "stop" }
          ]}
          value={rotation}
          onChange={newValue =>
            onChange(
              update(bloq, {
                parameters: { rotation: { $set: newValue } }
              })
            )
          }
        />
        {rotation !== "stop" && (
          <JuniorSwitch
            buttons={[
              { content: <ButtonIcon src={SlowIcon} />, id: "slow" },
              { content: <ButtonIcon src={MediumIcon} />, id: "medium" },
              { content: <ButtonIcon src={FastIcon} />, id: "fast" }
            ]}
            value={speed}
            onChange={(newValue: string) =>
              onChange(
                update(bloq, {
                  parameters: { speed: { $set: newValue } }
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
  width: 44px;
`;
