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
  const detect = bloq.parameters.detect as string;

  return (
    <Container>
      <ImageWrap>
        <ViewObstacleImage closed={detect !== "true"} />
      </ImageWrap>
      <SwitchWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={ViewIcon} />, id: "true" },
            { content: <ButtonIcon src={NotViewIcon} />, id: "false" }
          ]}
          value={detect}
          onChange={(value: string) =>
            onChange(
              update(bloq, {
                parameters: {
                  detect: { $set: value }
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
