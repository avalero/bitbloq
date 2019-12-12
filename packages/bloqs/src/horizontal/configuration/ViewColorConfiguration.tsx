import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import ViewColorImage from "./images/ViewColor";
import ViewIcon from "./icons/view.svg";
import NotViewIcon from "./icons/not-view.svg";
import BlackIcon from "./icons/color-black.svg";
import WhiteIcon from "./icons/color-white.svg";
import BlueIcon from "./icons/color-blue.svg";
import GreenIcon from "./icons/color-green.svg";
import RedIcon from "./icons/color-red.svg";

export interface IViewColorConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const ViewColorConfiguration: FC<IViewColorConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const detect = bloq.parameters.detect as string;
  const color = bloq.parameters.color as string;

  return (
    <Container>
      <ImageWrap>
        <ViewColorImage color={color} closed={detect !== "true"} />
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
        <ColorSwitch
          buttons={[
            { content: <ButtonIcon src={RedIcon} />, id: "red" },
            { content: <ButtonIcon src={GreenIcon} />, id: "green" },
            { content: <ButtonIcon src={BlueIcon} />, id: "blue" },
            { content: <ButtonIcon src={WhiteIcon} />, id: "white" },
            { content: <ButtonIcon src={BlackIcon} />, id: "black" }
          ]}
          value={color}
          onChange={(value: string) =>
            onChange(
              update(bloq, {
                parameters: { color: { $set: value } }
              })
            )
          }
        />
      </SwitchWrap>
    </Container>
  );
};

export default ViewColorConfiguration;

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
  justify-content: space-between;
`;

const ButtonIcon = styled.img`
  width: 36px;
`;

const ColorSwitch = styled(JuniorSwitch)`
  margin-left: 10px;
`;
