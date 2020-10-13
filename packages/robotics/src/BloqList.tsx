import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import styled from "@emotion/styled";
import { IBloq } from "./types";
import { colors, Draggable, Droppable } from "@bitbloq/ui";
import Bloq from "./Bloq";
import { isDraggingParameterState } from "./state";

export interface IBloqListProps {
  bloqs: IBloq[];
  section: string;
  path: number[];
}

const BloqList: FC<IBloqListProps> = ({ bloqs, section, path }) => {
  const isDraggingParamater = useRecoilValue(isDraggingParameterState);
  const [first, ...rest] = bloqs;

  return (
    <Draggable
      data={{ type: "bloq-list", bloqs, section, path }}
      draggableHeight={0}
      draggableWidth={0}
      dragThreshold={10}
    >
      {props => (
        <div {...props}>
          <Droppable
            active={!isDraggingParamater}
            data={{ type: "bloq-droppable", bloqs, section, path }}
            margin={30}
          >
            {active => (
              <BloqDroppable>{active && <DropIndicator />}</BloqDroppable>
            )}
          </Droppable>
          {first && (
            <>
              <Bloq bloq={first} section={section} path={path} />
              <BloqList
                bloqs={rest}
                section={section}
                path={[...path.slice(0, -1), path.slice(-1)[0] + 1]}
              />
            </>
          )}
        </div>
      )}
    </Draggable>
  );
};

export default BloqList;

const BloqDroppable = styled.div`
  width: 180px;
`;

const DropIndicator = styled.div`
  height: 6px;
  background-color: ${colors.black};
  border-radius: 3px;
  margin: 2px 0px 4px 0px;
`;
