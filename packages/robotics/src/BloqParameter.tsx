import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { Draggable, Droppable } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { IBloq } from "./types";
import { isDraggingParameterState } from "./state";
import Bloq from "./Bloq";

interface IBloqParameterProps {
  bloq: IBloq;
  parameterPath: string[];
  section: string;
  path: number[];
}

const BloqParameter: FC<IBloqParameterProps> = ({
  bloq,
  parameterPath,
  section,
  path
}) => {
  const parameterName = parameterPath[parameterPath.length - 1];
  const isDraggingParameter = useRecoilValue(isDraggingParameterState);
  const { parameters = {} } = bloq;
  const param = parameters[parameterName] as IBloq | undefined;

  return (
    <Container
      margin={10}
      active={!param && isDraggingParameter}
      data={{
        type: "bloq-parameter",
        section,
        path,
        parameterPath
      }}
    >
      {active => (
        <>
          <Nodge />
          <Content>
            {param && (
              <Draggable
                data={{
                  type: "bloq-parameter",
                  bloqs: [param],
                  section,
                  path,
                  parameterPath
                }}
                draggableHeight={0}
                draggableWidth={0}
                dragThreshold={10}
              >
                {props => (
                  <BloqWrap {...props}>
                    <Bloq
                      bloq={param}
                      section={section}
                      path={path}
                      parameterPath={parameterPath}
                    />
                  </BloqWrap>
                )}
              </Draggable>
            )}
            {active && <Active />}
          </Content>
        </>
      )}
    </Container>
  );
};

export default BloqParameter;

const Container = styled(Droppable)`
  display: flex;
  align-items: center;
`;

const Nodge = styled.div`
  width: 7px;
  height: 18px;
  overflow: hidden;

  &::before {
    content: "";
    display: block;
    width: 18px;
    height: 18px;
    border-radius: 9px;
    background-color: rgba(0, 0, 0, 0.3);
  }
`;

const Content = styled.div`
  display: flex;
  align-items: stretch;
  min-width: 50px;
  height: 40px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.3);
`;

const Active = styled.div`
  flex: 1;
  margin: 10px;
  border: solid 2px white;
  border-radius: 4px;
`;

const BloqWrap = styled.div`
  margin-left: -5px;
  margin-right: 2px;
`;
