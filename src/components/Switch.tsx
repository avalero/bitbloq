import * as React from "react";
import styled, { css } from "react-emotion";
import CloseIcon from "./icons/Close";
import TickIcon from "./icons/Tick";

const Container = styled.div`
  position: relative;
  width: 56px;
  height: 26px;
  border-radius: 14px;
  border: 1px solid #cfcfcf;
  cursor: pointer;
`;

interface ToggleProps {
  active: boolean;
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
    css`
      transform: translate(32px, 2px);
      background-color: #82ad3a;
    `};
`;

interface IconProps {
  visible: boolean;
}
const Icon = styled.div<IconProps>`
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

const DisabledIcon = styled(Icon)`
  color: #cacdd2;
  right: 10px;
`;

const ActiveIcon = styled(Icon)`
  color: #82ad3a;
  left: 10px;
`;

export interface SwitchProps {
  value: boolean;
  onChange: (newValue: boolean) => void;
}

export const Switch: React.SFC<SwitchProps> = ({ value, onChange }) => (
  <Container onClick={() => onChange(!value)}>
    <DisabledIcon visible={!value}>
      <CloseIcon />
    </DisabledIcon>
    <Toggle active={value} />
    <ActiveIcon visible={value}>
      <TickIcon />
    </ActiveIcon>
  </Container>
);

export default Switch;
