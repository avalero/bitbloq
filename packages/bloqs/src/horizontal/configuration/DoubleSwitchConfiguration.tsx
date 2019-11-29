import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import DoubleSwitchImage from "./images/DoubleSwitch";
import Switch1Icon from "./icons/switch1.svg";
import Switch2Icon from "./icons/switch2.svg";
import SwitchOffIcon from "./icons/switch-off.svg";
import SwitchOnIcon from "./icons/switch-on.svg";

interface IDoubleSwitchConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const DoubleSwitchConfiguration: FC<IDoubleSwitchConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;
  const switchValue = bloq.parameters.switch as string;

  return (
    <Container>
      <ImageWrap>
        <DoubleSwitchImage value={value} switchValue={switchValue} />
      </ImageWrap>
      <SwitchWrap>
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={Switch1Icon} />, id: "0" },
            { content: <ButtonIcon src={Switch2Icon} />, id: "1" }
          ]}
          value={switchValue}
          onChange={newValue =>
            onChange(
              update(bloq, { parameters: { switch: { $set: newValue } } })
            )
          }
        />
        <JuniorSwitch
          buttons={[
            { content: <ButtonIcon src={SwitchOffIcon} />, id: "pos2" },
            { content: <ButtonIcon src={SwitchOnIcon} />, id: "pos1" }
          ]}
          value={value}
          onChange={newValue =>
            onChange(
              update(bloq, { parameters: { value: { $set: newValue } } })
            )
          }
        />
      </SwitchWrap>
    </Container>
  );
};

export default DoubleSwitchConfiguration;

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

const SwitchWrap = styled.div`
  display: flex;
  justify-content: space-between;
`;

const ButtonIcon = styled.img`
  width: 30px;
`;
