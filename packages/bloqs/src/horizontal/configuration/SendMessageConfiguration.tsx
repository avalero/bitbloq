import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import SendMessage from "./images/SendMessage";
import Symbol1Icon from "./icons/symbol-1.svg";
import Symbol2Icon from "./icons/symbol-2.svg";
import Symbol3Icon from "./icons/symbol-3.svg";
import Symbol4Icon from "./icons/symbol-4.svg";
import Symbol5Icon from "./icons/symbol-5.svg";

interface ISendMessageConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const SendMessageConfiguration: FC<ISendMessageConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const value = bloq.parameters.value as string;

  return (
    <Container>
      <ImageWrap>
        <SendMessage message={value} />
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={Symbol1Icon} />, id: "messageA" },
          { content: <ButtonIcon src={Symbol2Icon} />, id: "messageB" },
          { content: <ButtonIcon src={Symbol3Icon} />, id: "messageC" },
          { content: <ButtonIcon src={Symbol4Icon} />, id: "messageD" },
          { content: <ButtonIcon src={Symbol5Icon} />, id: "messageE" }
        ]}
        value={value}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { value: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default SendMessageConfiguration;

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImageWrap = styled(BalloonPanel)`
  height: 150px;
  padding: 0px 55px;
  display: flex;
  align-items: center;
`;

const ButtonIcon = styled.img`
  width: 36px;
`;
