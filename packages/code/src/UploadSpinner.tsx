import React, { FC } from "react";
import styled from "@emotion/styled";
import { css, keyframes } from "@emotion/core";
import { Icon, colors } from "@bitbloq/ui";

const UploadSpinner: FC = () => {
  return (
    <Overlay>
      <Container>
        <Icon name="programming-board" />
        <Spinner />
      </Container>
    </Overlay>
  );
};

export default UploadSpinner;

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
`;

const Container = styled.div`
  width: 164px;
  height: 164px;
  border-radius: 4px;
  background-color: #373b44;
  color: white;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
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

const Spinner = styled.div`
  position: absolute;
  top: 18px;
  left: 18px;
  width: 120px;
  height: 120px;
  border-radius: 64px;
  border-width: 4px;
  border-style: solid;
  animation: ${rotation} 2s ease infinite;
  border-color: white white white rgba(255, 255, 255, 0.4);
`;
