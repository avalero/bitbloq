import * as React from "react";
import TetherComponent from "react-tether";
import styled from "@emotion/styled";
import { css } from "@emotion/core";

interface ContainerProps {
  position: string;
}
const Container = styled.div<ContainerProps>`
  background-color: #373b44;
  border-radius: 2px;
  pointer-events: none;
  color: white;
  font-size: 12px;
  padding: 10px;
  text-align: center;
  margin-top: 16px;
  line-height: normal;
  max-width: 220px;

  i,
  em {
    color: #4dc3ff;
  }

  &::before {
    content: "";
    background-color: #373b44;
    width: 8px;
    height: 8px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: 12px;
    left: 50%;

    ${props =>
      props.position === "right" &&
      css`
        transform: translate(0, -50%) rotate(45deg);
        top: 50%;
        left: 12px;
      `};
  }

  ${props =>
    props.position === "right" &&
    css`
      margin-top: 0px;
      margin-left: 16px;
    `};
`;

const attachmentPostion = {
  top: "bottom center",
  bottom: "top center",
  left: "middle right",
  right: "middle left"
};

const targetPosition = {
  top: "top center",
  bottom: "bottom center",
  left: "middle left",
  right: "middle right"
};

export interface TooltipChildrenProps {
  ref?: React.RefObject<HTMLDivElement>;
  onMouseOver?: (ev: React.MouseEvent) => void;
  onMouseOut?: (ev: React.MouseEvent) => void;
}

export interface TooltipProps {
  content: React.ReactChild;
  position: string;
  children: (props: TooltipChildrenProps) => React.ReactChild;
}

interface State {
  isVisible: boolean;
}

class Tooltip extends React.Component<TooltipProps, State> {
  state = { isVisible: false };

  onMouseOver = () => {
    this.setState({ isVisible: true });
  };

  onMouseOut = () => {
    this.setState({ isVisible: false });
  };

  render() {
    const { isVisible } = this.state;
    const { children, content, position = "bottom" } = this.props;
    const { onMouseOver, onMouseOut } = this;

    if (!content) {
      return children({});
    }

    return (
      <TetherComponent
        attachment={attachmentPostion[position]}
        targetAttachment={targetPosition[position]}
        style={{ zIndex: 20 }}
        renderTarget={ref =>
          children({
            ref: ref as React.RefObject<HTMLDivElement>,
            onMouseOver,
            onMouseOut
          })
        }
        renderElement={ref =>
          isVisible && (
            <Container
              ref={ref as React.RefObject<HTMLDivElement>}
              position={position}
            >
              {content}
            </Container>
          )
        }
      />
    );
  }
}

export default Tooltip;
