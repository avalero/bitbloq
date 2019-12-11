import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

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

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 33px;
  display: flex;
  align-items: center;
`;

const SwitchWrap = styled.div`
  display: flex;
  justify-content: center;
`;

const ButtonIcon = styled.img`
  width: 36px;
`;
