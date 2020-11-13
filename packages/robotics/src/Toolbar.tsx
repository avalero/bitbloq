import React, { FC, useState } from "react";
import { useCodeUpload } from "@bitbloq/code/src/useCodeUpload";
import CompilingAlert from "@bitbloq/code/src/CompilingAlert";
import NoBoardWizard from "@bitbloq/code/src/NoBoardWizard";
import styled from "@emotion/styled";
import { breakpoints, colors, Icon } from "@bitbloq/ui";
import { useRecoilState, useRecoilValue } from "recoil";
import { boardState, compilingState } from "./state";
import useCodeGeneration from "./useCodeGeneration";
import useHardwareDefinition from "./useHardwareDefinition";

interface IToolbarProps {
  borndateFilesRoot: string;
}

const Toolbar: FC<IToolbarProps> = ({ borndateFilesRoot }) => {
  const [compiling, setCompiling] = useRecoilState(compilingState);
  const generateCode = useCodeGeneration();
  const { compile, upload, cancel } = useCodeUpload({
    filesRoot: borndateFilesRoot
  });
  const { getBoard } = useHardwareDefinition();

  const board = useRecoilValue(boardState);
  const boardObject = board && getBoard(board.name);

  const [showNoBoardWizard, setShowNoBoardWizard] = useState(false);

  const onCompileClick = async () => {
    if (!boardObject) return;
    const { code, libraries } = await generateCode();
    try {
      setCompiling({ compiling: true, visible: true });
      await compile(
        [{ name: "main.ino", content: code }],
        libraries,
        boardObject.borndateBoard || ""
      );
      setCompiling({ compileSuccess: true, visible: false });
    } catch (e) {
      setCompiling({ compileError: true, visible: false });
      console.log(e, e.data);
    }
  };

  const onUploadClick = async () => {
    if (!boardObject) return;
    const { code, libraries } = await generateCode();
    try {
      setCompiling({ uploading: true, visible: true });
      await upload(
        [{ name: "main.ino", content: code }],
        libraries,
        boardObject.borndateBoard || ""
      );
      setCompiling({ uploadSuccess: true, visible: false });
    } catch (e) {
      setCompiling({ visible: false });
      if (e.type === "board-not-found") {
        setShowNoBoardWizard(true);
      } else if (e.type === "compile-error") {
      }
      console.log(e, e.data);
    }
  };

  return (
    <Container>
      <Left>
        <Button>
          <Icon name="undo" />
        </Button>
        <Button>
          <Icon name="redo" />
        </Button>
      </Left>
      <Right>
        <GreenButton onClick={onCompileClick}>
          <Icon name="tick" />
        </GreenButton>
        <GreenButton onClick={onUploadClick}>
          <UploadIcon name="arrow" />
        </GreenButton>
      </Right>
      <CompilingAlert {...compiling} onCancel={cancel} />
      <NoBoardWizard
        driversUrl={(boardObject && boardObject.driversUrl) || ""}
        isOpen={showNoBoardWizard}
        onClose={() => setShowNoBoardWizard(false)}
      />
    </Container>
  );
};

export default Toolbar;

const Container = styled.div`
  display: flex;
  border-bottom: 1px solid ${colors.gray3};
  height: 40px;
  padding: 0 20px;
  @media screen and (min-width: ${breakpoints.desktop}px) {
    height: 50px;
  }
`;

const Left = styled.div`
  display: flex;
  flex: 1;
`;

const Right = styled.div`
  display: flex;
`;

const Button = styled.div`
  width: 40px;
  background-color: #ebebeb;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  margin-right: -1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  svg {
    width: 18px;
    height: 18px;
  }

  @media screen and (min-width: ${breakpoints.desktop}px) {
    width: 60px;
  }
`;

const GreenButton = styled(Button)`
  background-color: ${colors.green};
  color: white;
  border-color: white;
`;

const UploadIcon = styled(Icon)`
  transform: rotate(90deg);
`;
