import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import Icon from "./Icon";

interface ContainerProps {
  checked: boolean;
  error?: boolean;
}

const Container = styled.div<ContainerProps>`
  border-radius: 3px;
  width: 14px;
  height: 14px;
  background-color: white;
  border-style: solid;
  border-width: 1px;
  border-color: #c0c3c9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 12px;
    height: 12px;
  }

  ${props =>
    props.checked &&
    css`
      border-color: #5d6069;
      background-color: #5d6069;
      color: white;
    `} &:hover {
    border-color: #5d6069;
  }

  ${props =>
    props.error &&
    css`
      box-shadow: 0 0 2px 2px rgba(255, 51, 51, 0.7);
      background-color: #ffd6d6;
      border: 1px solid white;
      color: #d82b32;
    `}
`;

type ChangeHandler = (cheked: boolean) => void;

export interface CheckboxProps {
  className?: string;

  /** If the checkbox is checked or not */
  checked: boolean;

  /** Called everytime the checkbox is changed */
  onChange?: ChangeHandler;

  error?: boolean;
}

/**
 * Component that displays a checkbox component
 */
export default class Checkbox extends React.Component<CheckboxProps> {
  render() {
    const { className, checked, error, onChange } = this.props;
    return (
      <Container
        className={className}
        checked={checked}
        error={error}
        onClick={() => onChange && onChange(!checked)}
      >
        {checked && <Icon name="tick" />}
      </Container>
    );
  }
}
