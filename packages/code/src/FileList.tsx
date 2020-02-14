import React, { FC } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, useTranslate, DropDown, Icon } from "@bitbloq/ui";
import { IFile, ILibrary } from "./index";

interface IFileListProps {
  files: IFile[];
  libraries: ILibrary[];
  selected?: IFile;
  onSelect: (file: IFile) => void;
  onDelete: (file: IFile) => void;
  onNew: (type: string) => void;
}

const FileList: FC<IFileListProps> = ({
  files,
  libraries,
  selected,
  onDelete,
  onSelect,
  onNew
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
      {libraries.length && (
        <Libraries>
          <h3>{t("code.libraries")}</h3>
          {libraries.map(library => (
            <File key={library.name} isSelected={false}>
              <FileName isSelected={false}>{library.name}</FileName>
              <DeleteFile>
                <Icon name="trash" />
              </DeleteFile>
            </File>
          ))}
        </Libraries>
      )}
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

const Files = styled.div`
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
