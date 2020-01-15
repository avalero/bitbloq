import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import ClockwiseImage from "./images/ServoClockwise";
import CounterClockwiseImage from "./images/ServoCounterClockwise";
import StopImage from "./images/ServoStop";

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
    <Container>
      <ImageWrap>
        {rotation === "clockwise" && <ClockwiseImage />}
        {rotation === "counterclockwise" && <CounterClockwiseImage />}
        {rotation === "stop" && <StopImage />}
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
        <SpeedSwitch disabled={rotation === "stop"}>
          <JuniorSwitch
            buttons={[
              { content: <ButtonIcon src={FastIcon} />, id: "fast" },
              { content: <ButtonIcon src={MediumIcon} />, id: "medium" },
              { content: <ButtonIcon src={SlowIcon} />, id: "slow" }
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
        </SpeedSwitch>
      </SwitchWrap>
    </Container>
  );
};

export default TurnOnConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 50px;
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

const SpeedSwitch = styled.div<{ disabled?: boolean }>`
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
