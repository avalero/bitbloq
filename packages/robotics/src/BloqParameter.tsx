import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import { Droppable } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { IBloq } from "./types";
import { isDraggingParameterState } from "./state";
import Bloq from "./Bloq";

interface IBloqParameterProps {
  bloq: IBloq;
  parameterName: string;
  section: string;
  path: number[];
}

const BloqParameter: FC<IBloqParameterProps> = ({
  bloq,
  parameterName,
  section,
  path
}) => {
  const isDraggingParameter = useRecoilValue(isDraggingParameterState);
  const { parameters = {} } = bloq;
  const param = parameters[parameterName] as IBloq | undefined;

  return (
    <Container
      margin={10}
      active={!param && isDraggingParameter}
      data={{
        type: "bloq-parameter",
        bloq,
        section,
        path,
        parameterName: parameterName
      }}
    >
      {active => (
        <>
          <Nodge />
          <Content>
            {param && (
              <BloqWrap>
                <Bloq
                  bloq={param}
                  section={section}
                  path={path}
                  parameterName={parameterName}
                />
              </BloqWrap>
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
