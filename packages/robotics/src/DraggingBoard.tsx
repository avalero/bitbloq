import React, { FC } from "react";
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
    <Container left={x} top={y}>
      <img src={url} width={width} height={height} alt={label} />
    </Container>
  );
};

export default DraggingBoard;

const Container = styled.div<{ top: number; left: number }>`
  position: fixed;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  border-radius: 4px;
  padding: 10px;

  img {
    margin: 10px;
    pointer-events: none;
    width: 300px;
    height: 224px;
  }
`;
