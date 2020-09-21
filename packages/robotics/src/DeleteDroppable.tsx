import React, { FC } from "react";
import { breakpoints, colors, Droppable, Icon } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { isDraggingBoardState } from "./state";

const DeleteDroppable: FC = () => {
  const isDraggingBoard = useRecoilValue(isDraggingBoardState);

  if (!isDraggingBoard) {
    return null;
  }

  return (
    <Container data={{ type: "delete" }}>
      <Icon name="trash" />
    </Container>
  );
};

export default DeleteDroppable;

const Container = styled(Droppable)`
  position: absolute;
  width: 261px;
  height: 100%;
  right: 0px;
  background-color: ${colors.gray2};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid #cfcfcf;

  svg {
    width: 100px;
    height: 100px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 301px;
  }
`;
