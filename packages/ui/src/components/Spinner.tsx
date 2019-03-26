import * as React from "react";
import styled from "@emotion/styled";
import { keyframes } from "@emotion/core";
import Icon from "./Icon";

export interface SpinnerProps {
  className?: string;
}

const Spinner: React.SFC<SpinnerProps> = ({ className }) => (
  <Container className={className}>
    <Icon name="spinner" />
  </Container>
);

export default Spinner;

/* styled components */

const rotation = keyframes`
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    animation: ${rotation} 2s ease infinite;
    width: 200px;
    height: 200px;
  }
`;
