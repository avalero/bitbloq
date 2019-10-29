import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import ViewObstacleImage from "./images/ViewObstacle";
import ViewIcon from "./icons/view.svg";
import NotViewIcon from "./icons/not-view.svg";

export interface IObstacleConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const ObstacleConfiguration: FC<IObstacleConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        <ViewObstacleImage closed={value !== "obstacle"} />
      </ImageWrap>
      <SwitchWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={ViewIcon} />, id: "obstacle" },
            { content: <ButtonIcon src={NotViewIcon} />, id: "no_obstacle" }
          ]}
          value={value}
          onChange={(newvalue: string) =>
            onChange(
              update(bloq, {
                parameters: {
                  value: { $set: newvalue }
                }
              })
            )
          }
        />
      </SwitchWrap>
    </Container>
  );
};

export default ObstacleConfiguration;

const Container = styled.div``;

const ImageWrap = styled.div`
  margin-bottom: 20px;
  svg {
    width: 484px;
    height: 200px;
  }
`;

const SwitchWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
