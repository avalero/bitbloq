import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { useTranslate, DropDown, Icon } from "@bitbloq/ui";
import { IFile } from "./index";

interface IFileListProps {
  files: IFile[];
  selected?: IFile;
  onSelect: (file: IFile) => void;
  onDelete: (file: IFile) => void;
}

const FileList: FC<IFileListProps> = ({
  files,
  selected,
  onDelete,
  onSelect
}) => {
  const t = useTranslate();

  const onDeleteClick = (e: React.MouseEvent, file: IFile) => {
    e.preventDefault();
    onDelete(file);
  };

  return (
    <Container>
      <DropDown attachmentPosition="top left" targetPosition="bottom left">
        {(isOpen: boolean) => (
          <AddFileButton isOpen={isOpen}>
            <Icon name="new-document" /> {t("code.add-new")}
          </AddFileButton>
        )}
        <div>Add files</div>
      </DropDown>
      <Files>
        {files.map(file => (
          <File key={file.name} isSelected={file === selected}>
            <FileName isSelected={file === selected}>{file.name}</FileName>
            <DeleteFile onClick={e => onDeleteClick(e, file)}>
              <Icon name="trash" />
            </DeleteFile>
          </File>
        ))}
      </Files>
    </Container>
  );
};

export default FileList;

const Container = styled.div`
  width: 180px;
  display: flex;
  flex-direction: column;
  border-right: 1px solid #cfcfcf;
`;

const AddFileButton = styled.div<{ isOpen: boolean }>`
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

const Files = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px 0px;
`;

const File = styled.div<{ isSelected: boolean }>`
  width: 100%;
  box-sizing: border-box;
  ${props =>
    props.isSelected &&
    css`
      border-width: 0px 2px 3px 2px;
      border-style: solid;
      border-color: #4dc3ff;
    `}
`;

const DeleteFile = styled.div`
  display: none;
`;
const FileName = styled.div<{ isSelected: boolean }>`
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
