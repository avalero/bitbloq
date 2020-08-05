import React, { FC, useEffect } from "react";
import styled from "@emotion/styled";
import { breakpoints } from "@bitbloq/ui";

export interface IBoardProps {
}

const Board: FC<IBoardProps> = () => {
  const boardObject

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentBoxSize) {
          h1Elem.style.fontSize =
            Math.max(1.5, entry.contentBoxSize.inlineSize / 200) + "rem";
          pElem.style.fontSize =
            Math.max(1, entry.contentBoxSize.inlineSize / 600) + "rem";
        } else {
          h1Elem.style.fontSize =
            Math.max(1.5, entry.contentRect.width / 200) + "rem";
          pElem.style.fontSize =
            Math.max(1, entry.contentRect.width / 600) + "rem";
        }
      }
    });

    resizeObserver.observe(

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return <Container></Container>;
};

export default Board;

const Container = styled.div<{
  image: string;
  selected: boolean;
  dragging: boolean;
}>`
  cursor: pointer;
  background-image: url(${props => props.image});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  width: 300px;
  height: 224px;
  border-radius: 10px;
  border: ${props => (props.selected ? "solid 2px" : "none")};
  opacity: ${props => (props.dragging ? 0.3 : 1)};

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 355px;
    height: 265px;
  }
`;
