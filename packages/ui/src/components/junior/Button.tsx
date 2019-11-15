import styled from "@emotion/styled";
import { css } from "@emotion/core";
import colors from "../../colors";

export interface IButtonProps {
  secondary?: boolean;
  red?: boolean;
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
    } else if (props.secondary) {
      color = colors.black;
      bgColor = "#eeeeee";
      darkColor = "#dddddd";
    }

    return css`
      color: ${color};
      background-color: ${bgColor};
      box-shadow: 0 2px 0 0 ${darkColor};
    `;
  }}

  &[disabled] {
    color: ${colors.disabledColor};
    cursor: not-allowed;
  }
`;

export default Button;
