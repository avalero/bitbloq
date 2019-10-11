import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, colors } from "@bitbloq/ui";

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
    <div>
      <ImageWrap>
        <ServoPositionImage value={value} />
      </ImageWrap>
      <Buttons>
        <ButtonWrap>
          <LeftButton
            onClick={() =>
              value >= 20 &&
              onChange(
                update(bloq, { parameters: { value: { $set: value - 10 } } })
              )
            }
          >
            <Icon name="angle" />
          </LeftButton>
        </ButtonWrap>
        <ButtonWrap>
          <RightButton
            onClick={() =>
              value <= 160 &&
              onChange(
                update(bloq, { parameters: { value: { $set: value + 10 } } })
              )
            }
          >
            <Icon name="angle" />
          </RightButton>
        </ButtonWrap>
      </Buttons>
    </div>
  );
};

export default ServoPositionConfiguration;

const ImageWrap = styled.div`
  margin-bottom: 10px;
  svg {
    width: 150px;
    height: 130px;
  }
`;

const ButtonIcon = styled.img`
  width: 30px;
`;

const Buttons = styled.div`
  display: flex;
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
  cursor: pointer;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.black};

  box-shadow: 0 14px 0 0 #ddd;
  transform: translate(0, -14px);

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: 0 12px 0 0 #ddd;
    transform: translate(0, -12px);
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;

const LeftButton = styled(Button)`
  svg {
    transform: rotate(90deg);
  }
`;

const RightButton = styled(Button)`
  svg {
    transform: rotate(-90deg);
  }
`;
