import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, colors } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import ServoPositionImage from "./images/ServoPosition";

interface IServoPositionConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const ServoPositionConfiguration: FC<IServoPositionConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as number;

  return (
    <Container>
      <ImageWrap>
        <ServoPositionImage value={value} />
      </ImageWrap>
      <Buttons>
        <LeftButton
          onClick={() =>
            value >= 10 &&
            onChange(
              update(bloq, { parameters: { value: { $set: value - 10 } } })
            )
          }
        >
          <Icon name="angle" />
        </LeftButton>
        <RightButton
          onClick={() =>
            value <= 170 &&
            onChange(
              update(bloq, { parameters: { value: { $set: value + 10 } } })
            )
          }
        >
          <Icon name="angle" />
        </RightButton>
      </Buttons>
    </Container>
  );
};

export default ServoPositionConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 65px;
  display: flex;
  align-items: center;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;

const Buttons = styled.div`
  display: flex;
  background-color: ${colors.gray2};
  padding: 10px;
`;

const ButtonWrap = styled.div`
  border: 6px solid #979797;
  background-color: #ddd;
  border-radius: 40px;
  &:first-of-type {
    margin-right: 10px;
  }
`;

const Button = styled.button`
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 30px;
  background-color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.black};

  box-shadow: 0 4px 0 0 #c0c3c9;
  transform: translate(0, -4px);

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #c0c3c9;
    box-shadow: none;
    transform: translate(0, 0);
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

const LeftButton = styled(Button)`
  margin-right: 6px;
  svg {
    transform: rotate(90deg);
  }
`;

const RightButton = styled(Button)`
  svg {
    transform: rotate(-90deg);
  }
`;
