import React, { FC, ReactElement } from "react";
import styled from "@emotion/styled";
import Icon from "../Icon";
import colors from "../../colors";

export interface IUpDownButton {
  upContent?: ReactElement;
  downContent?: ReactElement;
  onUpClick?: () => void;
  onDownClick?: () => void;
  className?: string;
}

const UpDownButton: FC<IUpDownButton> = ({
  upContent,
  downContent,
  onUpClick,
  onDownClick,
  className
}) => {
  return (
    <div className={className}>
      <UpButton type="button" onClick={onUpClick}>
        {upContent || <UpIcon name="angle" />}
      </UpButton>
      <DownButton type="button" onClick={onDownClick}>
        {downContent || <Icon name="angle" />}
      </DownButton>
    </div>
  );
};

export default UpDownButton;

const Button = styled.button`
  border: none;
  width: 60px;
  height: 30px;
  cursor: pointer;
  background-color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.black};

  box-shadow: 0 4px 0 0 #c0c3c9;
  transform: translate(0, -4px);

  &:focus {
    outline: none;
  }

  &:active {
    background-color: #c0c3c9;
    box-shadow: none;
    transform: translate(0, 0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const UpButton = styled(Button)`
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  margin-bottom: 6px;
`;

const DownButton = styled(Button)`
  border-bottom-left-radius: 40px;
  border-bottom-right-radius: 40px;
`;

const UpIcon = styled(Icon)`
  transform: rotate(180deg);
`;
