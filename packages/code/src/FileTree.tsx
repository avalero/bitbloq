import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, useTranslate, DropDown, Icon } from "@bitbloq/ui";
import { IError, IFile, IFolder, IFileItem, ILibrary } from "./index";

interface IFileTreeProps {
  files: IFileItem[];
  errors: IError[];
  libraries: ILibrary[];
  selected?: IFileItem;
  onSelect: (file: IFileItem) => void;
  onDelete: (file: IFileItem) => void;
  onNew: (type: string) => void;
}

const FileTree: FC<IFileTreeProps> = ({
  files,
  errors,
  libraries,
  selected,
  onDelete,
  onSelect,
  onNew
}) => {
  const t = useTranslate();

  const [collapsedFolders, setCollapsedFolders] = useState<string[]>([]);

  const onCollapseFolder = (folder: IFolder) => {
    setCollapsedFolders(
      collapsedFolders.includes(folder.id)
        ? collapsedFolders.filter(id => id !== folder.id)
        : [...collapsedFolders, folder.id]
    );
  };

  return (
    <Container>
      <DropDown attachmentPosition="top left" targetPosition="bottom left">
        {(isOpen: boolean) => (
          <AddButton isOpen={isOpen}>
            <Icon name="new-document" /> {t("code.add-new")}
          </AddButton>
        )}
        <AddDropDown>
          <AddOption onClick={() => onNew("cpp")}>
            <Icon name="new-document" /> {t("code.add-new-cpp")}
          </AddOption>
          <AddOption onClick={() => onNew("h")}>
            <Icon name="new-document" /> {t("code.add-new-h")}
          </AddOption>
          <AddOption onClick={() => onNew("folder")}>
            <Icon name="new-folder" /> {t("code.add-new-folder")}
          </AddOption>
        </AddDropDown>
      </DropDown>
      <FilesContainer>
        <FileList
          errors={errors}
          files={files}
          onDelete={onDelete}
          onSelect={onSelect}
          selected={selected}
          depth={0}
          collapsedFolders={collapsedFolders}
          onCollapseFolder={onCollapseFolder}
        />
      </FilesContainer>
      {libraries.length > 0 && (
        <Libraries>
          <h3>{t("code.libraries")}</h3>
          {libraries.map(library => (
            <React.Fragment key={library.name}>
              <File>
                <FileName isSelected={false}>{library.name}</FileName>
                <DeleteFile>
                  <Icon name="trash" />
                </DeleteFile>
              </File>
              {library.files && (
                <FileList
                  errors={[]}
                  files={library.files}
                  onSelect={onSelect}
                  selected={selected}
                  depth={0}
                  collapsedFolders={collapsedFolders}
                  onCollapseFolder={onCollapseFolder}
                />
              )}
            </React.Fragment>
          ))}
        </Libraries>
      )}
    </Container>
  );
};

export default FileTree;

interface IFileListProps {
  files: IFileItem[];
  errors: IError[];
  selected?: IFileItem;
  onSelect?: (file: IFileItem) => void;
  onDelete?: (file: IFileItem) => void;
  depth: number;
  collapsedFolders: string[];
  onCollapseFolder: (folder: IFolder) => any;
}

const FileList: FC<IFileListProps> = ({
  files,
  errors,
  selected,
  onSelect,
  onDelete,
  depth,
  collapsedFolders,
  onCollapseFolder
}) => {
  const onDeleteClick = (e: React.MouseEvent, file: IFileItem) => {
    e.preventDefault();
    onDelete!(file);
  };

  const onCollapseClick = (e: React.MouseEvent, folder: IFolder) => {
    e.preventDefault();
    onCollapseFolder(folder);
  };

  return (
    <Files>
      {files.map(file => (
        <File key={file.id}>
          <FileName
            isSelected={selected && file.id === selected.id}
            onClick={() => onSelect && onSelect(file)}
          >
            {depth > 0 && (
              <AngleIcon depth={depth}>
                <Icon name="curve-angle" />
              </AngleIcon>
            )}
            {file.type === "folder" && (
              <CollapseButton
                collapsed={collapsedFolders.includes(file.id)}
                onClick={e => onCollapseClick(e, file as IFolder)}
              >
                <Icon name="angle" />
              </CollapseButton>
            )}
            <FileNameText>{file.name}</FileNameText>
            {errors.filter(e => e.file === file.name).length > 0 && (
              <ErrorTag>
                <Icon name="close" />
              </ErrorTag>
            )}
            {onDelete && file.name !== "main.ino" && (
              <DeleteFile onClick={e => onDeleteClick(e, file)}>
                <Icon name="trash" />
              </DeleteFile>
            )}
            <RightIcon>
              <Icon name={file.type === "folder" ? "folder" : "document"} />
            </RightIcon>
          </FileName>
          {file.type === "folder" && !collapsedFolders.includes(file.id) && (
            <FileList
              errors={errors}
              files={file.files}
              selected={selected}
              onSelect={onSelect}
              onDelete={onDelete}
              depth={depth + 1}
              collapsedFolders={collapsedFolders}
              onCollapseFolder={onCollapseFolder}
            />
          )}
        </File>
      ))}
    </Files>
  );
};

const Container = styled.div`
  width: 210px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cfcfcf;
`;

const AddButton = styled.div<{ isOpen: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  background-color: #ebebeb;
  font-size: 13px;
  font-weight: bold;
  cursor: pointer;
  position: relative;
  border-bottom: 1px solid #cfcfcf;
  z-index: 2;
  box-shadow: ${props =>
    props.isOpen ? "0 3px 7px 0 rgba(0, 0, 0, 0.5);" : "none"};

  svg {
    width: 20px;
    margin-right: 10px;
  }
`;

const FilesContainer = styled.div`
  padding: 20px 0px;
  overflow-y: auto;
`;

const Files = styled.div``;

const File = styled.div`
  width: 100%;
  box-sizing: border-box;
`;

const RightIcon = styled.div`
  margin-left: 6px;

  svg {
    width: 12px;
  }
`;

const DeleteFile = styled.div`
  display: none;
`;

const FileName = styled.div<{ isSelected?: boolean }>`
  padding: 0px 8px 0px 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-color: #eee;
  border-style: solid;
  border-width: 1px 0px 1px 0px;
  background-color: white;
  font-size: 13px;
  height: 30px;
  margin-bottom: -1px;

  span.object-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    ${DeleteFile} {
      display: block;
    }
    ${RightIcon} {
      display: none;
    }
  }

  ${props =>
    props.isSelected &&
    css`
      color: white;
      background-color: #4dc3ff;
      border-color: inherit;
    `};

  span {
    flex: 1;
  }

  img {
    width: 24px;
  }
`;

const AngleIcon = styled.div<{ depth: number }>`
  margin-left: ${props => props.depth * 16}px;
  svg {
    width: 10px;
    height: 10px;
    margin-right: 6px;
  }
`;

const FileNameText = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const AddDropDown = styled.div`
  background-color: white;
  width: 180px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
`;

const AddOption = styled.div`
  height: 40px;
  padding: 0px 12px;
  display: flex;
  align-items: center;
  font-size: 14px;
  border-bottom: 1px solid ${colors.gray2};
  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    margin-right: 6px;
  }

  &:hover {
    background-color: ${colors.gray2};
  }

  &:last-of-type {
    border-bottom: none;
  }
`;

const Libraries = styled.div`
  h3 {
    padding: 0px 8px;
    font-weight: 400;
    text-transform: uppercase;
    font-size: 11px;
    letter-spacing: 1px;
    margin: 6px 0px;
  }
`;

const CollapseButton = styled.div<{ collapsed: boolean }>`
  display: flex;

  svg {
    width: 10px;
    margin-right: 6px;
  }

  ${props =>
    props.collapsed &&
    css`
      svg {
        transform: rotate(-90deg);
      }
    `};
`;

const ErrorTag = styled.div`
  background-color: ${colors.red};
  width: 12px;
  height: 12px;
  border-radius: 6px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;

  svg {
    width: 6px;
    height: 6px;
  }
`;
