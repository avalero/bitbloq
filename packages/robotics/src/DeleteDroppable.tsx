import React, { FC } from "react";
import { colors, Droppable, Icon } from "@bitbloq/ui";
import styled from "@emotion/styled";

const DeleteDroppable: FC = () => {
  return (
    <Container data={{ type: "delete" }}>
      <Icon name="trash" />
    </Container>
  );
};

export default DeleteDroppable;

const Container = styled(Droppable)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  right: 0px;
  background-color: ${colors.gray2};
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 100px;
    height: 100px;
  }
`;
