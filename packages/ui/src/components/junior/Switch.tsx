import React, { FC } from "react";
import styled from "@emotion/styled";
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

const Switch: FC<ISwitchProps> = ({ buttons, value, onChange, className }) => {
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
  background-color: ${colors.gray2};
  padding: 10px;
  display: inline-flex;
`;

interface IButtonProps {
  selected: boolean;
}
const Button = styled.button<IButtonProps>`
  border: none;
  width: 60px;
  height: 60px;
  background-color: ${props => (props.selected ? "#c0c3c9" : "#fff")};
  margin-right: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 ${props => (props.selected ? 0 : 4)}px 0 0 #c0c3c9;
  transform: translate(0, ${props => (props.selected ? 0 : -4)}px);
  color: ${colors.black};

  &:focus {
    outline: none;
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
    width: 36px;
    height: 36px;
  }
`;
