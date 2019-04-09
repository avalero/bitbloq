import React from "react";
import styled from "@emotion/styled";

export interface LoadingBarOverlayProps {
  isOpen?: boolean;
  percentage?: number;
}

const LoadingBarOverlay: React.FunctionComponent<LoadingBarOverlayProps> = ({
  isOpen,
  percentage = 0
}) => {
  if (!isOpen) {
    return null;
  }

  const normalizedPercentage = Math.max(Math.min(percentage, 100), 0);

  return (
    <Overlay>
      <LoadingPanel>
        <BarWrap>
          <Bar percentage={percentage} />
        </BarWrap>
        <Percentage>{Math.round(normalizedPercentage)}%</Percentage>
      </LoadingPanel>
    </Overlay>
  );
};

export default LoadingBarOverlay;

/* styled components */

const Overlay = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingPanel = styled.div`
  background-color: #373b44;
  border-radius: 4px;
  width: 200px;
  padding: 15px 20px;
`;

const BarWrap = styled.div`
  background-color: #f1f1f1;
  border-radius: 4px;
  height: 8px;
`;

interface BarProps {
  percentage: number;
}
const Bar = styled.div<BarProps>`
  background-color: #59b52e;
  transition: width 150ms ease-out;
  width: ${props => props.percentage}%;
  height: 8px;
  border-radius: 4px;
`;

const Percentage = styled.div`
  color: white;
  font-size: 12px;
  text-align: center;
  margin-top: 8px;
`;
