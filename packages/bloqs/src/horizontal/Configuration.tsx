import React, { FC } from "react";
import styled from "@emotion/styled";

import StartConfiguration from "./configuration/StartConfiguration";
import SwitchConfiguration from "./configuration/SwitchConfiguration";
import ButtonConfiguration from "./configuration/ButtonConfiguration";
import ViewColorConfiguration from "./configuration/ViewColorConfiguration";
import DetectLightConfiguration from "./configuration/DetectLightConfiguration";
import ObstacleConfiguration from "./configuration/ObstacleConfiguration";
import TemperatureConfiguration from "./configuration/TemperatureConfiguration";
import ReceiveMessageConfiguration from "./configuration/ReceiveMessageConfiguration";
import SendMessageConfiguration from "./configuration/SendMessageConfiguration";
import GetNumberConfiguration from "./configuration/GetNumberConfiguration";
import SetNumberConfiguration from "./configuration/SetNumberConfiguration";
import TurnOnConfiguration from "./configuration/TurnOnConfiguration";

import { IBloq, IBloqType } from "../index";

const configurationComponents = {
  StartConfiguration,
  SwitchConfiguration,
  ButtonConfiguration,
  ViewColorConfiguration,
  DetectLightConfiguration,
  ObstacleConfiguration,
  TemperatureConfiguration,
  ReceiveMessageConfiguration,
  SendMessageConfiguration,
  GetNumberConfiguration,
  SetNumberConfiguration,
  TurnOnConfiguration
};

interface IConfigurationProps {
  bloq: IBloq;
  bloqType: IBloqType;
  onChange: (newBloq: IBloq) => any;
}
const Configuration: FC<IConfigurationProps> = ({
  bloq,
  bloqType,
  onChange
}) => {
  if (!bloqType.configurationComponent) {
    return null;
  }

  const ConfigurationComponent =
    configurationComponents[bloqType.configurationComponent];

  if (!ConfigurationComponent) {
    return null;
  }

  return (
    <Wrap>
      <ConfigurationComponent bloq={bloq} onChange={onChange} />
    </Wrap>
  );
};

export default Configuration;

const Wrap = styled.div`
  border: 1px dashed;
  padding: 10px;
`;
