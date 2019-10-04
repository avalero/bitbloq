import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { JuniorSwitch } from "@bitbloq/ui";

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

const colorValues = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#00FF00",
  blue: "#0000FF"
};

const ViewColorConfiguration: FC<IViewColorConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const detect = bloq.parameters.detect as string;
  const color = bloq.parameters.color as string;

  return (
    <Container>
      <ImageWrap>
        <ViewColorImage color={colorValues[color]} closed={detect !== "true"} />
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
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={BlackIcon} />, id: "black" },
            { content: <ButtonIcon src={WhiteIcon} />, id: "white" },
            { content: <ButtonIcon src={RedIcon} />, id: "red" },
            { content: <ButtonIcon src={GreenIcon} />, id: "green" },
            { content: <ButtonIcon src={BlueIcon} />, id: "blue" }
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
  justify-content: space-between;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
