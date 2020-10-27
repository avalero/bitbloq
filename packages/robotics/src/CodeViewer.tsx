import React, { FC } from "react";
import { useRecoilValue } from "recoil";
import styled from "@emotion/styled";
import { breakpoints, colors, Icon, useTranslate } from "@bitbloq/ui";
import CodeEditor from "@bitbloq/ui/src/components/CodeEditor";
import {
  bloqsState,
  boardState,
  componentsState,
  selectedBloqState
} from "./state";
import { getCode } from "./useCodeGeneration";
import { selectedCodeStartToken, selectedCodeEndToken } from "./config";

export interface ICodeViewerProps {
  onClose: () => void;
}

const getPosition = (code: string, index: number) => {
  const lines = code.substring(0, index).split("\n");
  return [
    lines.length,
    index -
      lines.slice(0, -1).reduce((acc, l) => acc + l.length, 0) -
      lines.length +
      2
  ];
};

const CodeViewer: FC<ICodeViewerProps> = ({ onClose }) => {
  const t = useTranslate();

  const bloqs = useRecoilValue(bloqsState);
  const board = useRecoilValue(boardState);
  const components = useRecoilValue(componentsState);
  const selectedBloq = useRecoilValue(selectedBloqState);

  let code = board ? getCode(board.name, components, bloqs, selectedBloq) : "";

  let selectedRange;
  if (selectedBloq) {
    const startIndex = code.indexOf(selectedCodeStartToken);
    code = code.replace(selectedCodeStartToken, "");
    const endIndex = code.indexOf(selectedCodeEndToken);
    code = code.replace(selectedCodeEndToken, "");
    const [startLine, startColumn] = getPosition(code, startIndex);
    const [endLine, endColumn] = getPosition(code, endIndex);
    selectedRange = {
      startLine,
      startColumn,
      endLine,
      endColumn
    };
  }

  return (
    <Container>
      <Header>
        <span>{t("robotics.code-preview")}</span>
        <CloseIcon onClick={onClose}>
          <Icon name="close" />
        </CloseIcon>
      </Header>
      <CodeEditor
        disableMinimap
        readOnly
        code={code}
        selectedRange={selectedRange}
      />
    </Container>
  );
};

export default CodeViewer;

const Container = styled.div`
  min-width: 360px;
  border-left: 1px solid ${colors.gray3};
  display: flex;
  flex-direction: column;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-width: 400px;
  }
`;

const Header = styled.div`
  min-height: 40px;
  display: flex;
  padding: 0 10px 0 20px;
  align-items: center;

  span {
    flex: 1;
    font-weight: 500;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    min-height: 50px;
    padding: 0 20px;
  }
`;

const CloseIcon = styled.div`
  cursor: pointer;
  svg {
    width: 14px;
    height: 14px;
  }
`;
