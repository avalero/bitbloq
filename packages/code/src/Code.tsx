import React, { FC, useState, useEffect, useRef } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Button, Icon } from "@bitbloq/ui";
import Editor from "./Editor";
import FileList from "./FileList";
import useCodeUpload from "./useCodeUpload";

import { IFile, ICodeContent } from "./index";

export interface ICodeProps {
  initialContent?: ICodeContent;
  onContentChange: (content: ICodeContent) => any;
  chromeAppID: string;
  borndateFilesRoot: string;
}

const Code: FC<ICodeProps> = ({
  initialContent,
  onContentChange,
  chromeAppID,
  borndateFilesRoot
}) => {
  const [content, setContent] = useState(getInitialContent(initialContent));
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const selectedFile = content.files[selectedFileIndex];

  const [upload, uploadContent] = useCodeUpload(
    "zumjunior",
    borndateFilesRoot,
    chromeAppID
  );

  const onDeleteFile = (file: IFile) => {
    console.log("delete File", file);
  };

  const onCodeChange = (code: string) => {
    const newContent = update(content, {
      files: {
        [selectedFileIndex]: {
          content: { $set: code }
        }
      }
    });
    setContent(newContent);
    onContentChange(newContent);
  };

  const onUpload = () => {
    upload([{ name: "main.ino", content: selectedFile.content }], []);
  };

  return (
    <Container>
      <FileList
        files={content.files}
        selected={selectedFile}
        onDelete={onDeleteFile}
        onSelect={file => console.log("Select", file)}
      />
      <Main>
        <Toolbar>
          <ToolbarButtons>
            <ToolbarButton>
              <Icon name="pencil" />
            </ToolbarButton>
            <ToolbarButton>
              <Icon name="trash" />
            </ToolbarButton>
            <ToolbarButton>
              <Icon name="brush" />
            </ToolbarButton>
          </ToolbarButtons>
          <UploadButton onClick={() => onUpload()}>
            <Icon name="programming" />
            Upload
          </UploadButton>
        </Toolbar>
        <Editor
          code={selectedFile.content}
          onChange={onCodeChange}
          errors={[]}
        />
      </Main>
      {uploadContent}
    </Container>
  );
};

export default Code;

const defaultCode = `
void setup() {

}

void loop() {

}
`;

const getInitialContent = (initialContent?: ICodeContent) => {
  if (initialContent && initialContent.files && initialContent.files.length) {
    return initialContent;
  } else {
    return {
      files: [
        {
          name: "main.ino",
          content: defaultCode
        }
      ]
    };
  }
};

/* Styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Toolbar = styled.div`
  height: 50px;
  border-bottom: 1px solid #cfcfcf;
  display: flex;
  padding: 0px 20px;
  align-items: center;
`;

const ToolbarButtons = styled.div`
  flex: 1;
  display: flex;
  align-self: stretch;
  height: 50px;
`;

const ToolbarButton = styled.div<{ disabled?: boolean }>`
  background-color: #ebebeb;
  width: 60px;
  border-width: 0px 1px;
  border-style: solid;
  border-color: #cfcfcf;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: -1px;

  img {
    width: 20px;
    height: auto;
  }

  ${props =>
    props.disabled &&
    css`
      color: #bdc0c6;
      cursor: not-allowed;
    `};
`;

const UploadButton = styled(Button)`
  svg {
    margin-right: 10px;
  }
`;
