import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorSwitch } from "@bitbloq/ui";
import BalloonPanel from "../BalloonPanel";

import { IBloq } from "../../index";

import MusicImage from "./images/Music";

import Music1Icon from "./icons/music1.svg";
import Music2Icon from "./icons/music2.svg";
import Music3Icon from "./icons/music3.svg";
import Music4Icon from "./icons/music4.svg";
import MusicStopIcon from "./icons/music-stop.svg";

interface IMusicConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const MusicConfiguration: FC<IMusicConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const melody = bloq.parameters.melody as string;

  return (
    <Container>
      <ImageWrap>
        <MusicImage melody={melody} />
      </ImageWrap>
      <JuniorSwitch
        buttons={[
          { content: <ButtonIcon src={Music1Icon} />, id: "1" },
          { content: <ButtonIcon src={Music2Icon} />, id: "2" },
          { content: <ButtonIcon src={Music3Icon} />, id: "3" },
          { content: <ButtonIcon src={Music4Icon} />, id: "4" },
          { content: <ButtonIcon src={MusicStopIcon} />, id: "stop" }
        ]}
        value={melody}
        onChange={newValue =>
          onChange(update(bloq, { parameters: { melody: { $set: newValue } } }))
        }
      />
    </Container>
  );
};

export default MusicConfiguration;

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

const ButtonIcon = styled.img`
  width: 30px;
`;
