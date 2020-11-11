import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors, useTranslate } from "@bitbloq/ui";
import { useRecoilValue } from "recoil";
import { IBloqType, IDiagramItem } from "./types";
import { bloqsState, BloqSection } from "./state";
import DiagramLine from "./DiagramLine";

interface IDiagramCanvasProps {
  section: BloqSection;
}

const DiagramCanvas: FC<IDiagramCanvasProps> = ({ section }) => {
  const t = useTranslate();

  const bloqs = useRecoilValue(bloqsState);
  const sectionBloqs = bloqs[section];

  const diagram: IDiagramItem[] = [
    {
      type: "symbol",
      bloq: { type: "play-zumjunior-buzz" }
    },
    {
      type: "condition",
      bloq: { type: "if-zumjunior-button-pressed" },
      leftItems: [
        {
          type: "condition",
          bloq: { type: "if-zumjunior-button-pressed" },
          leftItems: [
            {
              type: "symbol",
              bloq: { type: "play-zumjunior-buzz" }
            }
          ],
          rightItems: [
            {
              type: "symbol",
              bloq: { type: "play-zumjunior-buzz" }
            }
          ]
        }
      ],
      rightItems: [
        {
          type: "symbol",
          bloq: { type: "play-zumjunior-buzz" }
        },
        {
          type: "condition",
          bloq: { type: "if-zumjunior-button-pressed" },
          leftItems: [
            {
              type: "symbol",
              bloq: { type: "play-zumjunior-buzz" }
            },
            {
              type: "condition",
              bloq: { type: "if-zumjunior-button-pressed" },
              leftItems: [
                {
                  type: "symbol",
                  bloq: { type: "play-zumjunior-buzz" }
                }
              ],
              rightItems: [
                {
                  type: "symbol",
                  bloq: { type: "play-zumjunior-buzz" }
                }
              ]
            },
            {
              type: "symbol",
              bloq: { type: "play-zumjunior-buzz" }
            }
          ],
          rightItems: [
            {
              type: "symbol",
              bloq: { type: "play-zumjunior-buzz" }
            }
          ]
        }
      ]
    }
  ];

  return (
    <Container>
      <Canvas>
        <Circle></Circle>
        <DiagramLine items={diagram} />
      </Canvas>
    </Container>
  );
};

export default DiagramCanvas;

const Container = styled.div`
  min-height: 260px;
  position: relative;
`;

const Canvas = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 20px;
  border: solid 2px #bbb;
  box-sizing: border-box;
`;
