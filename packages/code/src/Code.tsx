import React, { FC, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Button, Icon } from "@bitbloq/ui";
import Editor from "./Editor";
import FileList from "./FileList";

import { IFile } from "./index";

const Code: FC = () => {
  const files = [
    {
      name: "main.ino",
      content: "ASDASDASD ASDASDASD"
    },
    {
      name: "test.ino",
      content: "adasd asd asdasd"
    }
  ];

  const onDeleteFile = (file: IFile) => {
    console.log("delete File", file);
  };

  return (
    <Container>
      <FileList
        files={files}
        selected={files[0]}
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
          <UploadButton>
            <Icon name="programming" />
            Upload
          </UploadButton>
        </Toolbar>
        <Editor code={sampleCode} onChange={code => console.log("change")} />
      </Main>
    </Container>
  );
};

export default Code;

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
