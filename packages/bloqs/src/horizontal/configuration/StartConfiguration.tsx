import React, { FC } from "react";
import styled from "@emotion/styled";
import update from "immutability-helper";
import { Icon, JuniorNumberInput, JuniorSwitch } from "@bitbloq/ui";

import { IBloq } from "../../index";

import StartLoopIcon from "./icons/start-loop.svg";
import Start1TimeIcon from "./icons/start-1-time.svg";
import Start2TimesIcon from "./icons/start-2-times.svg";
import Start5TimesIcon from "./icons/start-5-times.svg";
import Start10TimesIcon from "./icons/start-10-times.svg";

export interface IStartConfigurationProps {
  bloq: IBloq;
  onChange: (newBloq: IBloq) => any;
}

const StartConfiguration: FC<IStartConfigurationProps> = ({
  bloq,
  onChange
}) => {
  const type = bloq.parameters.type as string;
  const times = bloq.parameters.times as number;

  return (
    <JuniorSwitch
      buttons={[
        { content: <ButtonIcon src={StartLoopIcon} />, id: "loop" },
        { content: <ButtonIcon src={Start1TimeIcon} />, id: "1" },
        { content: <ButtonIcon src={Start2TimesIcon} />, id: "2" },
        { content: <ButtonIcon src={Start5TimesIcon} />, id: "5" },
        { content: <ButtonIcon src={Start10TimesIcon} />, id: "10" }
      ]}
      value={type === "loop" ? "loop" : times.toString()}
      onChange={value => {
        if (value === "loop") {
          onChange(update(bloq, { parameters: { type: { $set: "loop" } } }));
        } else {
          onChange(
            update(bloq, {
              parameters: {
                type: { $set: "times" },
                times: { $set: parseInt(value, 10) }
              }
            })
          );
        }
      }}
    />
  );
};

export default StartConfiguration;

const ButtonIcon = styled.img`
  width: 30px;
`;
