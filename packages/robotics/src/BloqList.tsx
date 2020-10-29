import React, { FC, useRef } from "react";
import { useRecoilValue } from "recoil";
import styled from "@emotion/styled";
import { IBloq, InstructionType } from "./types";
import { colors, Draggable, Droppable } from "@bitbloq/ui";
import Bloq from "./Bloq";
import { isDraggingParameterState } from "./state";
import useBloqsDefinition from "./useBloqsDefinition";

export interface IBloqListProps {
  bloqs: IBloq[];
  section: string;
  path?: number[];
  readOnly?: boolean;
  inactive?: boolean;
}

const BloqList: FC<IBloqListProps> = ({
  bloqs,
  section,
  path = [],
  readOnly = false,
  inactive
}) => {
  const isDraggingParamater = useRecoilValue(isDraggingParameterState);
  const [first, ...rest] = bloqs;

  const wrapRef = useRef<HTMLDivElement>(null);

  const { getBloqType } = useBloqsDefinition();
  const firstType = first && getBloqType(first.type);
  const isParameter =
    firstType && firstType.instructionType === InstructionType.Parameter;

  return (
    <Draggable
      data={{ type: "bloq-list", bloqs, section, path }}
      draggableHeight={0}
      draggableWidth={0}
      dragThreshold={10}
    >
      {props => (
        <Container {...props}>
          <div
            ref={wrapRef}
            onMouseDown={e =>
              wrapRef.current === e.target && e.stopPropagation()
            }
          >
            {!readOnly && !isParameter && (
              <BloqDroppable
                active={!isDraggingParamater}
                data={{ type: "bloq-droppable", bloqs, section, path }}
                margin={30}
              >
                {active => active && <DropIndicator />}
              </BloqDroppable>
            )}
            {first && (
              <>
                <Bloq
                  bloq={first}
                  section={section}
                  path={path}
                  readOnly={readOnly}
                  inactive={inactive}
                />
                {!isParameter && (
                  <BloqList
                    bloqs={rest}
                    section={section}
                    path={[...path.slice(0, -1), path.slice(-1)[0] + 1]}
                    readOnly={readOnly}
                    inactive={inactive}
                  />
                )}
              </>
            )}
          </div>
        </Container>
      )}
    </Draggable>
  );
};

export default React.memo(BloqList);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const BloqDroppable = styled(Droppable)`
  width: 180px;
`;

const DropIndicator = styled.div`
  height: 6px;
  background-color: ${colors.black};
  border-radius: 3px;
  margin: 2px 0px 4px 0px;
`;
