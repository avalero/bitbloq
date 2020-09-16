import React, { FC } from "react";
import { breakpoints } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { draggingBoardState } from "./state";
import useHardwareDefinition from "./useHardwareDefinition";

const DraggingBoard: FC = () => {
  const { getBoard } = useHardwareDefinition();
  const { board, x, y } = useRecoilValue(draggingBoardState);
  const boardObject = board && getBoard(board);

  if (!boardObject) {
    return null;
  }

  const {
    image: { url, width, height },
    label
  } = boardObject;

  return (
    <Container style={{ left: x, top: y }}>
      <img src={url} width={width} height={height} alt={label} />
    </Container>
  );
};

export default DraggingBoard;

const Container = styled.div`
  position: fixed;
  opacity: 0.5;

  img {
    pointer-events: none;
    width: 180px;
    @media screen and (min-width: ${breakpoints.desktop}px) {
      width: 210px;
    }
  }
`;
