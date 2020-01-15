import React, { FC } from "react";

import StartConfiguration from "./configuration/StartConfiguration";
import DoubleSwitchConfiguration from "./configuration/DoubleSwitchConfiguration";
import DoubleLedConfiguration from "./configuration/DoubleLedConfiguration";
import ButtonConfiguration from "./configuration/ButtonConfiguration";
import ViewColorConfiguration from "./configuration/ViewColorConfiguration";
import DetectLightConfiguration from "./configuration/DetectLightConfiguration";
import ObstacleConfiguration from "./configuration/ObstacleConfiguration";
import TemperatureConfiguration from "./configuration/TemperatureConfiguration";
import ReceiveMessageConfiguration from "./configuration/ReceiveMessageConfiguration";
import SendMessageConfiguration from "./configuration/SendMessageConfiguration";
import GetNumberConfiguration from "./configuration/GetNumberConfiguration";
import SetNumberConfiguration from "./configuration/SetNumberConfiguration";

import ColorLedConfiguration from "./configuration/ColorLedConfiguration";
import ServoConfiguration from "./configuration/ServoConfiguration";
import WaitConfiguration from "./configuration/WaitConfiguration";
import MusicConfiguration from "./configuration/MusicConfiguration";
import ServoPositionConfiguration from "./configuration/ServoPositionConfiguration";

import { IBloq, IBloqType } from "../index";

const configurationComponents = {
  StartConfiguration,
  DoubleLedConfiguration,
  DoubleSwitchConfiguration,
  ButtonConfiguration,
  ViewColorConfiguration,
  DetectLightConfiguration,
  ObstacleConfiguration,
  TemperatureConfiguration,
  ReceiveMessageConfiguration,
  SendMessageConfiguration,
  GetNumberConfiguration,
  SetNumberConfiguration,
  ColorLedConfiguration,
  ServoConfiguration,
  WaitConfiguration,
  MusicConfiguration,
  ServoPositionConfiguration
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

  return <ConfigurationComponent bloq={bloq} onChange={onChange} />;
};

export default Configuration;
