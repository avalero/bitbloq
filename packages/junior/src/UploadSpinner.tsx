import React, { FC } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/core";
import { Icon, colors } from "@bitbloq/ui";

export interface IUploadSpinnerProps {
  visible: boolean;
  uploading: boolean;
  success: boolean;
  text: string;
  onClick: () => void;
}

const UploadSpinner: FC<IUploadSpinnerProps> = ({
  visible,
  uploading,
  success,
  text,
  onClick
}) => {
  if (!visible) {
    return null;
  }

  let icon = "";
  if (uploading) {
    icon = "programming-board";
  } else if (success) {
    icon = "tick";
  } else if (!success) {
    icon = "close";
  }

  return (
    <Overlay onClick={onClick}>
      <Container uploading={uploading} success={success}>
        <Icon name={icon} />
        <Spinner uploading={uploading} success={success} />
        <Text>{text}</Text>
      </Container>
    </Overlay>
  );
};

export default UploadSpinner;

const Overlay = styled.div`
  position: fixed;
  z-index: 20;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface IContainerProps {
  uploading: boolean;
  success: boolean;
}
const Container = styled.div<IContainerProps>`
  width: 200px;
  height: 216px;
  border-radius: 4px;
  background-color: #373b44;
  color: ${props => {
    if (props.uploading) {
      return "white";
    } else if (props.success) {
      return colors.green;
    } else if (!props.success) {
      return colors.red;
    } else {
      return "white";
    }
  }};
  position: relative;

  svg {
    position: absolute;
    top: 50px;
    left: 70px;
    width: 60px;
    height: 60px;
  }
`;

const rotation = keyframes`
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
`;

interface ISpinnerProps {
  uploading: boolean;
  success: boolean;
}
const Spinner = styled.div<ISpinnerProps>`
  position: absolute;
  top: 18px;
  left: 38px;
  width: 116px;
  height: 116px;
  border-radius: 64px;
  border-width: 4px;
  border-style: solid;

  ${props => {
    if (props.uploading) {
      return css`
        animation: ${rotation} 2s ease infinite;
        border-color: white white white rgba(255, 255, 255, 0.4);
      `;
    }
    if (props.success) {
      return css`
        border-color: ${colors.green};
      `;
    }
    if (!props.success) {
      return css`
        border-color: ${colors.red};
      `;
    }
    return css``;
  }}
`;

const Text = styled.div`
  position: absolute;
  bottom: 20px;
  left: 0px;
  right: 0px;
  padding: 0px 20px;
  text-align: center;
  min-height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  line-height: normal;
`;
