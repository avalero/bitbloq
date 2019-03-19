import React, { useState } from "react";
import styled from "@emotion/styled";
import ComponentPlaceholder from "./ComponentPlaceholder";
import AddComponentPanel from "./AddComponentPanel";

import { IBoard, IComponent } from "./index.d";

interface IHardwareDesignerProps {
  boards: IBoard[];
  components: IComponent[];
}

const HardwareDesigner: React.FunctionComponent<IHardwareDesignerProps> = ({
  boards,
  components
}) => {
  const [selectedPort, setSelectedPort] = useState(-1);
  const board = boards[0];
  const { width, height } = board.image;

  return (
    <Container>
      <CanvasWrap onClick={() => setSelectedPort(-1)}>
        <Canvas>
          {board.ports.map((port, i) => (
            <ComponentPlaceholder
              key={i}
              selected={selectedPort === i}
              top={(-port.placeholderPosition.y * height) / 2}
              left={(port.placeholderPosition.x * width) / 2}
              onClick={e => {
                e.stopPropagation();
                setSelectedPort(i);
              }}
            />
          ))}
          <Board width={width} height={height} src={board.image.url} />
        </Canvas>
      </CanvasWrap>
      <AddComponentPanel
        isOpen={selectedPort >= 0}
        board={board}
        components={components}
      />
    </Container>
  );
};

export default HardwareDesigner;

/* styled components */

const Container = styled.div`
  position: relative;
  flex: 1;
  display: flex;
`;

const CanvasWrap = styled.div`
  flex: 1;
`;

const Canvas = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

interface IBoardProps {
  width: number;
  height: number;
}
const Board = styled.img<IBoardProps>`
  position: absolute;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  transform: translate(-50%, -50%);
`;
