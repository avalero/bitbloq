import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import DoubleLedImage from "./images/DoubleLed";
import Led1Icon from "./icons/led1.svg";
import Led2Icon from "./icons/led2.svg";
import OnIcon from "./icons/led-on.svg";
import OffIcon from "./icons/led-off.svg";

interface IDoubleLedConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const DoubleLedConfiguration: FC<IDoubleLedConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;
  const led = bloq.parameters.led as string;

  return (
    <Container>
      <ImageWrap>
        <DoubleLedImage value={value} led={led} />
      </ImageWrap>
      <LedWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={Led1Icon} />, id: "White" },
            { content: <ButtonIcon src={Led2Icon} />, id: "Color" }
          ]}
          value={led}
          onChange={newValue =>
            onChange(update(bloq, { parameters: { led: { $set: newValue } } }))
          }
        />
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={OnIcon} />, id: "on" },
            { content: <ButtonIcon src={OffIcon} />, id: "off" }
          ]}
          value={value}
          onChange={newValue =>
            onChange(
              update(bloq, { parameters: { value: { $set: newValue } } })
            )
          }
        />
      </LedWrap>
    </Container>
  );
};

export default DoubleLedConfiguration;

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
  svg {
    width: 130px;
    height: 91px;
  }
`;

const LedWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
