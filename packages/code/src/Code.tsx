import React, {
  RefForwardingComponent,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslate, Button, Icon, Select } from "@bitbloq/ui";
import Editor from "./Editor";
import FileList from "./FileList";
import useCodeUpload, { UploadErrorType } from "./useCodeUpload";
import { IFile, ILibrary, ICodeContent } from "./index";

export interface ICodeRef {
  addLibrary: (library: ILibrary) => void;
}

export interface ICodeProps {
  initialContent?: ICodeContent;
  onContentChange: (content: ICodeContent) => any;
  chromeAppID: string;
  borndateFilesRoot: string;
  codeRef?: { current: ICodeRef | null };
}

const Code: RefForwardingComponent<ICodeRef, ICodeProps> = (
  { initialContent, onContentChange, chromeAppID, borndateFilesRoot, codeRef },
  ref
) => {
  const t = useTranslate();
  const content = useRef<ICodeContent | null>(
    getInitialContent(initialContent)
  );
  const [files, setFiles] = useState<IFile[]>([]);
  const [libraries, setLibraries] = useState<ILibrary[]>([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    setFiles(content.current!.files);
    setLibraries(content.current!.libraries || []);
  }, []);

  useImperativeHandle(ref, () => ({
    addLibrary: (library: ILibrary) => {
      content.current = update(content.current!, {
        libraries: {
          $push: [library]
        }
      });
      setLibraries(content.current.libraries);
      onContentChange(content.current);
    }
  }));

  const [upload, uploadContent] = useCodeUpload(
    "zumjunior",
    borndateFilesRoot,
    chromeAppID
  );

  const onNewFile = (type: string) => {
    content.current = update(content.current!, {
      files: {
        $push: [
          {
            name: `new.${type}`,
            content: ""
          }
        ]
      }
    });

    setFiles(content.current!.files);
    onContentChange(content.current);
  };

  const onDeleteFile = (file: IFile) => {
    console.log("delete File", file);
  };

  const onCodeChange = (code: string) => {
    content.current = update(content.current!, {
      files: {
        [selectedFileIndex]: {
          content: { $set: code }
        }
      }
    });
    onContentChange(content.current);
  };

  const onUpload = async () => {
    try {
      await upload(content.current!.files, libraries);
      setErrors([]);
    } catch (e) {
      switch (e.type) {
        case UploadErrorType.COMPILE_ERROR:
          setErrors(e.data);
          break;

        default:
          console.log(e);
      }
    }
  };

  if (!content.current) {
    return null;
  }

  const selectedFile = files[selectedFileIndex];

  return (
    <Container>
      <FileList
        files={files}
        libraries={libraries}
        selected={selectedFile}
        onDelete={onDeleteFile}
        onSelect={file => console.log("Select", file)}
        onNew={onNewFile}
      />
      <Main>
        <Toolbar>
          <ToolbarButtons>
            <ToolbarButton>
              <Icon name="undo" />
            </ToolbarButton>
            <ToolbarButton>
              <Icon name="redo" />
            </ToolbarButton>
          </ToolbarButtons>
          <BoardSelectWrap>
            <p>Placa:</p>
            <BoardSelect
              value="zumjunior"
              options={[
                {
                  label: "ZUM Junior",
                  value: "zumjunior"
                }
              ]}
              selectConfig={{ isSearchable: false, blurInputOnSelect: false }}
            />
          </BoardSelectWrap>
          <UploadButton onClick={() => onUpload()}>
            <Icon name="programming" />
            Upload
          </UploadButton>
        </Toolbar>
        {selectedFile && (
          <Editor
            key={selectedFileIndex}
            code={selectedFile.content}
            onChange={onCodeChange}
            errors={errors}
          />
        )}
        <StatusBar></StatusBar>
      </Main>
      {uploadContent}
    </Container>
  );
};

export default forwardRef(Code);

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
      ],
      libraries: []
    };
  }
};

/* Styled components */

const Container = styled.div`
  flex: 1 1 0;
  overflow: hidden;
  display: flex;
`;

const Main = styled.div`
  flex: 1 1 0;
  overflow: hidden;
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

const BoardSelectWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right: 20px;
  p {
    margin-right: 10px;
    font-weight: 500;
  }
`;

const BoardSelect = styled(Select)`
  width: 200px;
`;

const UploadButton = styled(Button)`
  svg {
    margin-right: 10px;
  }
`;

const StatusBar = styled.div`
  height: 24px;
  background-color: #5d6069;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  z-index: 10;
  color: white;
  font-size: 12px;
`;
