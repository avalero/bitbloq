import React, {
  RefForwardingComponent,
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef
} from "react";
import { v1 as uuid } from "uuid";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslate, Button, Icon, Select } from "@bitbloq/ui";
import Editor from "@bitbloq/ui/src/components/CodeEditor";
import FileTree from "./FileTree";
import NewFileModal from "./NewFileModal";
import NewFolderModal from "./NewFolderModal";
import useCodeUpload, { UploadErrorType } from "./useCodeUpload";
import { unzipLibrary } from "./util";
import {
  IError,
  IFile,
  IFolder,
  IFileItem,
  ILibrary,
  ICodeContent
} from "./index";
import { knownBoards } from "./config";

export interface ICodeRef {
  addLibrary: (library: ILibrary) => void;
}

export interface ICodeProps {
  initialContent?: ICodeContent;
  onContentChange: (content: ICodeContent) => any;
  borndateFilesRoot: string;
  codeRef?: { current: ICodeRef | null };
}

const updateFile = (files: IFileItem[], newFile: IFileItem): IFileItem[] =>
  files.map(file => {
    if (file.id === newFile.id) {
      return newFile;
    }
    if (file.type === "folder") {
      return update(file, { files: { $set: updateFile(file.files, newFile) } });
    }

    return file;
  });

const findFile = (files: IFileItem[], fileId: string) => {
  if (!files.length) {
    return undefined;
  }
  const [first, ...rest] = files;
  if (first.id === fileId) {
    return first;
  }

  return (
    (first.type === "folder" && findFile(first.files, fileId)) ||
    findFile(rest, fileId)
  );
};

const parseErrors = (borndateErrors: any[]) =>
  borndateErrors.map(e => {
    const [location] = e.locations;
    const { file, line, column } = location.caret;
    return {
      message: e.message,
      file: file === "main.ino.cpp" ? "main.ino" : file,
      line: file === "main.ino.cpp" ? line - 5 : line,
      column
    };
  });

const Code: RefForwardingComponent<ICodeRef, ICodeProps> = (
  { initialContent, onContentChange, borndateFilesRoot, codeRef },
  ref
) => {
  const t = useTranslate();
  const content = useRef<ICodeContent | null>(
    getInitialContent(initialContent)
  );
  const [files, setFiles] = useState<IFileItem[]>([]);
  const [libraries, setLibraries] = useState<ILibrary[]>([]);
  const [selectedFile, setSelectedFile] = useState(files[0]);
  const [errors, setErrors] = useState<IError[]>([]);

  const [newFileOpen, setNewFileOpen] = useState(false);
  const [newFileExtension, setNewFileExtension] = useState("");
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  const [board, setBoard] = useState("zumjunior");

  const setLibrariesWithFiles = async (libs: ILibrary[]) => {
    setLibraries(
      await Promise.all(
        libs.map(async lib => ({
          ...lib,
          files: await unzipLibrary(lib.zipURL)
        }))
      )
    );
  };

  useEffect(() => {
    setFiles(content.current!.files);
    setSelectedFile(content.current!.files[0]);
    setLibrariesWithFiles(content.current!.libraries || []);
  }, []);

  useImperativeHandle(ref, () => ({
    addLibrary: (library: ILibrary) => {
      content.current = update(content.current!, {
        libraries: {
          $push: [library]
        }
      });
      setLibrariesWithFiles(content.current.libraries);
      onContentChange(content.current);
    }
  }));

  const { upload, compile } = useCodeUpload({
    filesRoot: borndateFilesRoot
  });

  const onAddNew = (type: string) => {
    if (type === "folder") {
      setNewFolderOpen(true);
    } else {
      setNewFileOpen(true);
      setNewFileExtension(type);
    }
  };

  const addFileItem = (item: IFileItem) => {
    if (selectedFile && selectedFile.type === "folder") {
      const newFolder = update(selectedFile, {
        files: {
          $push: [item]
        }
      });
      content.current = update(content.current!, {
        files: { $set: updateFile(content.current!.files, newFolder) }
      });
    } else {
      content.current = update(content.current!, {
        files: {
          $push: [item]
        }
      });
    }
  };

  const onNewFile = (name: string) => {
    const newFile: IFile = {
      id: uuid(),
      type: "file",
      name: `${name}.${newFileExtension}`,
      content: ""
    };

    addFileItem(newFile);

    setFiles(content.current!.files);
    setNewFileOpen(false);
    setSelectedFile(newFile);
    onContentChange(content.current!);
  };

  const onNewFolder = (name: string) => {
    const newFolder: IFolder = {
      id: uuid(),
      type: "folder",
      files: [],
      name
    };

    addFileItem(newFolder);

    setFiles(content.current!.files);
    setNewFolderOpen(false);
    onContentChange(content.current!);
  };

  const onDeleteFile = (file: IFile) => {
    content.current = update(content.current!, {
      files: { $set: content.current!.files.filter(f => f.id !== file.id) }
    });
    setFiles(content.current.files);
    onContentChange(content.current);
  };

  const onSelectFile = (file: IFile) => {
    let contentFile = findFile(content.current!.files, file.id);

    let i = 0;
    while (!contentFile && i < libraries.length) {
      const libFiles = libraries[i].files;
      if (libFiles) {
        contentFile = findFile(libFiles, file.id);
      }
      i++;
    }

    if (contentFile) {
      setSelectedFile(contentFile);
    }
  };

  const onCodeChange = (code: string) => {
    const newFile = update(selectedFile, { content: { $set: code } });

    content.current = update(content.current!, {
      files: { $set: updateFile(content.current!.files, newFile) }
    });
    onContentChange(content.current);
  };

  const onUpload = async () => {
    try {
      await upload(content.current!.files, libraries, board);
      setErrors([]);
    } catch (e) {
      switch (e.type) {
        case UploadErrorType.COMPILE_ERROR:
          setErrors(parseErrors(e.data));
          break;

        default:
          console.log(e);
      }
    }
  };

  const onCompile = async () => {
    try {
      const hex = await compile(content.current!.files, libraries, board);
      console.log(hex);
      setErrors([]);
    } catch (e) {
      switch (e.type) {
        case UploadErrorType.COMPILE_ERROR:
          setErrors(parseErrors(e.data));
          break;

        default:
          console.log(e);
      }
    }
  };

  if (!content.current) {
    return null;
  }

  const boardOptions = Object.keys(knownBoards).map(id => ({
    label: t(`code.boards.${id}`),
    value: id
  }));

  return (
    <Container>
      <FileTree
        errors={errors}
        files={files}
        libraries={libraries}
        selected={selectedFile}
        onDelete={onDeleteFile}
        onSelect={onSelectFile}
        onNew={onAddNew}
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
              value={board}
              onChange={setBoard}
              options={boardOptions}
              selectConfig={{ isSearchable: false, blurInputOnSelect: false }}
            />
          </BoardSelectWrap>
          <UploadButton onClick={() => onCompile()}>
            <Icon name="programming" />
            {t("code.compile")}
          </UploadButton>
          <UploadButton onClick={() => onUpload()}>
            <Icon name="programming" />
            {t("code.upload")}
          </UploadButton>
        </Toolbar>
        {selectedFile && selectedFile.type === "file" ? (
          <Editor
            key={selectedFile.id}
            code={selectedFile.content}
            onChange={onCodeChange}
            errors={errors.filter(e => e.file === selectedFile.name)}
          />
        ) : (
          <EmptyEditor />
        )}
        <StatusBar></StatusBar>
      </Main>
      <NewFileModal
        isOpen={newFileOpen}
        fileExtension={newFileExtension}
        onNewFile={onNewFile}
        onCancel={() => setNewFileOpen(false)}
      />
      <NewFolderModal
        isOpen={newFolderOpen}
        onNewFolder={onNewFolder}
        onCancel={() => setNewFolderOpen(false)}
      />
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

const getInitialContent = (initialContent?: ICodeContent): ICodeContent => {
  if (initialContent && initialContent.files && initialContent.files.length) {
    return initialContent;
  } else {
    return {
      files: [
        {
          id: uuid(),
          type: "file",
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
  margin-right: 10px;
  p {
    margin-right: 10px;
    font-weight: 500;
  }
`;

const BoardSelect = styled(Select)`
  width: 200px;
`;

const UploadButton = styled(Button)`
  margin-left: 10px;
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

const EmptyEditor = styled.div`
  flex: 1;
`;
