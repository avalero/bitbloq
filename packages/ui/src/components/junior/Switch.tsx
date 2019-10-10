import React, { FC } from "react";
import styled from "@emotion/styled";
import Icon from "../Icon";
import colors from "../../colors";

export interface ISwitchButtonDefinition {
  content: JSX.Element;
  id: string;
}

export interface ISwitchProps {
  buttons: ISwitchButtonDefinition[];
  value: string;
  onChange: (newValue: string) => any;
  className?: string;
}

const Switch: FC<ISwitchProps> = ({
  buttons,
  value,
  onChange,
  className
}) => {
  return (
    <Container className={className}>
      {buttons.map(button => (
        <Button
          key={button.id}
          selected={button.id === value}
          onClick={() => button.id !== value && onChange(button.id)}
        >
          {button.content}
        </Button>
      ))}
    </Container>
  );
};

export default Switch;

/* Styled components */

const Container = styled.div`
  border: 6px solid #979797;
  background-color: #979797;
  border-radius: 10px;
  display: inline-flex;
`;

interface IButtonProps {
  selected: boolean;
}
const Button = styled.button<IButtonProps>`
  border: none;
  width: 60px;
  height: 60px;
  background-color: #eee;
  margin-right: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 ${props => props.selected ? 2: 14}px 0 0 #ddd;
  transform: translate(0, ${props => props.selected ? -2 : -14}px);
  color: ${colors.black};

  &:focus {
    outline: none;
  }

  &:active {
    box-shadow: 0 ${props => props.selected ? 2: 12}px 0 0 #ddd;
    transform: translate(0, ${props => props.selected ? -2 : -12}px);
  }

  &:first-of-type {
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }

  &:last-of-type {
    margin-right: 0px;
    border-top-right-radius: 10px;
    border-bottom-right-radius: 10px;
  }

  svg {
    width: 30px;
    height: 30px;
  }
`;
