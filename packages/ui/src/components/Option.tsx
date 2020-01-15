import React, { FC } from "react";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import colors from "../colors";

interface IContainerProps {
  disabled?: boolean;
}

const Container = styled.div<IContainerProps>`
  display: flex;
  align-items: center;
  font-size: 14px;
  cursor: pointer;

  ${props =>
    props.disabled &&
    css`
      color: ${colors.disabledColor};
      pointer-events: none;

      ${Bullet} {
        border-color: ${colors.disabledColor};
      }
      ${InnerBullet} {
        background-color: ${colors.disabledColor};
      }
    `};
`;

const Bullet = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 7px;
  border: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InnerBullet = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${colors.gray5};
`;

export interface IOptionsProps {
  checked?: boolean;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  className?: string;
}

const Option: FC<IOptionsProps> = ({
  checked,
  children,
  className,
  disabled,
  onClick
}) => (
  <Container disabled={disabled} onClick={onClick} className={className}>
    <Bullet>{(checked || disabled) && <InnerBullet />}</Bullet>
    <div>{children}</div>
  </Container>
);

export default Option;
