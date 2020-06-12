import React, { FC } from "react";
import { IComponentInstance } from "@bitbloq/bloqs";
import styled from "@emotion/styled";
import { useRecoilState } from "recoil";
import { componentWithIdState } from "./state";
import Component from "./Component";
import useDraggable from "./useDraggable";
import useHardwareDefinition from "./useHardwareDefinition";

export interface IDraggableComponentProps {
  id: string;
}

const DraggableComponent: FC<IDraggableComponentProps> = ({ id }) => {
  const [instance, setInstance] = useRecoilState<IComponentInstance>(
    componentWithIdState(id)
  );
  const { getComponent } = useHardwareDefinition();
  const component = getComponent(instance.component);

  const containerProps = useDraggable({
    onDrag: ({ x, y, height, width, element }) => {
      const {
        x: canvasX,
        y: canvasY
      } = element.parentElement!.getBoundingClientRect();
      setInstance({
        ...instance,
        position: { x: x - canvasX + width / 2, y: y - canvasY + height / 2 }
      });
    }
  });

  if (!instance || !instance.position) {
    return null;
  }

  return (
    <Container
      left={instance.position.x}
      top={instance.position.y}
      {...containerProps}
    >
      <Component
        component={component}
        instance={instance}
        onChange={setInstance}
      />
    </Container>
  );
};

export default DraggableComponent;

const Container = styled.div<{ top: number; left: number }>`
  position: absolute;
  top: ${props => props.top}px;
  left: ${props => props.left}px;
  transform: translate(-50%, -50%);
`;
