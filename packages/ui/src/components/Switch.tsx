import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Icon from "./Icon";

interface ContainerProps {
  leftRight?: boolean;
}
const Container = styled.div<ContainerProps>`
  position: relative;
  width: ${props => (props.leftRight ? "48px" : "56px")};
  height: 26px;
  border-radius: 14px;
  border: 1px solid #cfcfcf;
  cursor: pointer;
`;

interface ToggleProps {
  active: boolean;
  leftRight?: boolean;
}
const Toggle = styled.div<ToggleProps>`
  width: 22px;
  height: 22px;
  border-radius: 11px;
  background-color: #9b9da1;
  transition: transform 100ms ease-out;
  transform: translate(2px, 2px);

  ${props =>
    props.active &&
    !props.leftRight &&
    css`
      transform: translate(32px, 2px);
      background-color: #82ad3a;
    `};

  ${props =>
    props.active &&
    props.leftRight &&
    css`
      transform: translate(24px, 2px);
    `};
`;

interface SwitchIconProps {
  visible: boolean;
}
const SwitchIcon = styled.div<SwitchIconProps>`
  display: none;
  position: absolute;
  top: 6px;

  svg {
    width: 13px;
    height: auto;
  }
  ${props =>
    props.visible &&
    css`
      display: block;
    `};
`;

const DisabledIcon = styled(SwitchIcon)`
  color: #cacdd2;
  right: 10px;
`;

const ActiveIcon = styled(SwitchIcon)`
  color: #82ad3a;
  left: 10px;
`;

export interface SwitchProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
  leftRight?: boolean;
}

export const Switch: React.SFC<SwitchProps> = ({
  value,
  onChange,
  leftRight
}) => (
  <Container onClick={() => onChange(!value)} leftRight={leftRight}>
    <DisabledIcon visible={!value && !leftRight}>
      <Icon name="close" />
    </DisabledIcon>
    <Toggle active={value} leftRight={leftRight} />
    <ActiveIcon visible={value && !leftRight}>
      <Icon name="tick" />
    </ActiveIcon>
  </Container>
);

export default Switch;
