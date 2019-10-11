import React, { FC } from "react";
import styled from "@emotion/styled";

import WaitIcon from "./icons/WaitIcon";
import ServoPositionIcon from "./icons/ServoPositionIcon";

import { IBloq, IBloqType } from "../index";

interface IIconComponentProps {
  bloq?: IBloq;
  component: string;
}

const iconComponents = {
  WaitIcon,
  ServoPositionIcon
};

const IconComponent: FC<IIconComponentProps> =({ bloq, component }) => {
  const Component = iconComponents[component];

  if (!Component) {
    return null;
  }

  return (
    <Wrap>
      <Component bloq={bloq} />
    </Wrap>
  );
};

export default IconComponent;

const Wrap = styled.div`
  margin-left: 4px;
  z-index: 1;
  svg {
    width: 44px;
    height: 44px;
  }
`;
