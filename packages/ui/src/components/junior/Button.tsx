import styled from "@emotion/styled";
import { css } from "@emotion/core";
import colors from "../../colors";

export interface IButtonProps {
  secondary?: boolean;
  tertiary?: boolean;
  red?: boolean;
  orange?: boolean;
  active?: boolean;
}

const Button = styled.button<IButtonProps>`
  border-radius: 3px;
  border: none;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 22px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;

  &:focus {
    outline: none;
  }

  ${props => {
    let color = "white";
    let bgColor = colors.green;
    let darkColor = colors.greenPressed;

    if (props.red) {
      bgColor = colors.red;
      darkColor = colors.redPressed;
    } else if (props.orange) {
      bgColor = colors.brandOrange;
      darkColor = colors.brandOrangePressed;
    } else if (props.secondary) {
      color = colors.black;
      bgColor = "#ffffff";
      darkColor = "#dddddd";
    } else if (props.tertiary) {
      color = colors.black;
      bgColor = "#ebebeb";
      darkColor = "#c0c3c9";
    }

    return css`
      color: ${color};
      background-color: ${props.active ? darkColor : bgColor};
      box-shadow: 0 ${props.active ? -3 : 3}px 0 0
        ${props.active ? bgColor : darkColor};
      margin-bottom: ${props.active ? 0 : 3}px;
      margin-top: ${props.active ? 3 : 0}px;
    `;
  }}

  &[disabled] {
    color: ${colors.disabledColor};
    cursor: not-allowed;
  }
`;

export default Button;
