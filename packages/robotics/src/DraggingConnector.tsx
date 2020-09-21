import React, { FC } from "react";
import styled from "@emotion/styled";
import { useRecoilValue } from "recoil";
import { colors } from "@bitbloq/ui";
import { draggingConnectorState } from "./state";

const DraggingConnector: FC = () => {
  const connector = useRecoilValue(draggingConnectorState);

  if (!connector) {
    return null;
  }

  return <Container style={{ left: connector.x, top: connector.y }} />;
};

export default DraggingConnector;

const Container = styled.div`
  position: fixed;
  transform: translate(-50%, -50%);
  background-color: ${colors.black};
  width: 10px;
  height: 10px;
  border-radius: 5px;
`;
