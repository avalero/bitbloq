import styled from "@emotion/styled";
import { css } from "@emotion/core";
import colors from "../colors";

interface ButtonProps {
  small?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
}
const Button = styled.button<ButtonProps>`
  border-radius: 4px;
  border: none;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 24px;
  color: white;
  font-size: 14px;
  font-weight: bold;
  background-color: ${colors.green};
  cursor: pointer;

  &:hover {
    background-color: ${colors.greenHover};
  }

  &:active {
    background-color: ${colors.greenPressed};
  }

  &:focus {
    outline: none;
  }

  ${props =>
    props.small &&
    css`
      height: 30px;
    `}

  ${props =>
    props.secondary &&
    css`
      background-color: ${colors.black};
      &:hover {
        background-color: ${colors.blackHover};
      }
      &:active {
        background-color: ${colors.blackPressed};
      }
    `}

  ${props =>
    props.tertiary &&
    css`
      color: ${colors.black};
      background-color: ${colors.tertiary};
      &:hover {
        background-color: ${colors.tertiaryHover};
      }
      &:active {
        background-color: ${colors.tertiaryPressed};
      }
    `}

  &[disabled] {
    color: ${colors.disabledColor};
    background-color: ${colors.disabledBackground};
    cursor: not-allowed;
  }
`;

/** @component */
export default Button;
