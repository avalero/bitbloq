import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorNumberInput } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import SevenSegmentImage from "./images/SevenSegment";

export interface IGetNumberConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const GetNumberConfiguration: FC<IGetNumberConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = Number(bloq.parameters.value);

  return (
    <Container>
      <ImageWrap>
        <p>=</p>
        <SevenSegmentImage value={value} />
      </ImageWrap>
      <JuniorNumberInput
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default GetNumberConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 30px;
  display: flex;
  align-items: center;

  p {
    font-size: 80px;
    margin-right: 16px;
  }
`;
