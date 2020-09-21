import React, { FC } from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { draggingInstanceState } from "./state";
import useHardwareDefinition from "./useHardwareDefinition";

const DraggingComponent: FC = () => {
  const { getComponent } = useHardwareDefinition();
  const instance = useRecoilValue(draggingInstanceState);
  const component = instance && getComponent(instance.component);

  if (!component) {
    return null;
  }

  return (
    <Container style={{ left: instance.position.x, top: instance.position.y }}>
      <img
        src={component.image.url}
        width={component.image.width}
        height={component.image.height}
        alt={component.label}
      />
    </Container>
  );
};

export default DraggingComponent;

const Container = styled.div`
  position: fixed;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  background: #d7d7d7;
  border-radius: 4px;
  padding: 10px;
  z-index: 20;

  img {
    margin: 10px;
    pointer-events: none;
  }
`;
