import React, { FC, useState, useEffect, useRef } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Button, Icon } from "@bitbloq/ui";
import Editor from "./Editor";
import FileList from "./FileList";
import Borndate from "@bitbloq/borndate";
import UploadSpinner from "./UploadSpinner";

import { IFile, ICodeContent } from "./index";

export interface ICodeProps {
  initialContent?: ICodeContent;
  onContentChange: (content: ICodeContent) => any;
}

const borndate = new Borndate("zumjunior");

const Code: FC<ICodeProps> = ({ initialContent, onContentChange }) => {
  const [content, setContent] = useState(getInitialContent(initialContent));
  const [uploading, setUploading] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const selectedFile = content.files[selectedFileIndex];

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

  const onUpload = async () => {
    setUploading(true);
    await borndate.compileAndUpload(selectedFile.content);
    setUploading(false);
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
        <Editor code={selectedFile.content} onChange={onCodeChange} />
      </Main>
      {uploading && <UploadSpinner />}
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

const sampleCode = `
String inputString = "";         // a String to hold incoming data
bool stringComplete = false;  // whether the string is complete

void setup() {
  // initialize serial:
  Serial.begin(9600);
  // reserve 200 bytes for the inputString:
  inputString.reserve(200);
}

void loop() {
  // print the string when a newline arrives:
  if (stringComplete) {
    Serial.println(inputString);
    // clear the string:
    inputString = "";
    stringComplete = false;
  }
}

/*
  SerialEvent occurs whenever a new data comes in the hardware serial RX. This
  routine is run between each time loop() runs, so using delay inside loop can
  delay response. Multiple bytes of data may be available.
*/
void serialEvent() {
  while (Serial.available()) {
    // get the new byte:
    char inChar = (char)Serial.read();
    // add it to the inputString:
    inputString += inChar;
    // if the incoming character is a newline, set a flag so the main loop can
    // do something about it:
    if (inChar == '\\n') {
      stringComplete = true;
    }
  }
}
`;
