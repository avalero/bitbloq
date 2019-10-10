import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors } from "@bitbloq/ui";

interface Folder {
  name: string;
  id: string;
}

export interface FolderSelectorMenuProps {
  className?: string;
  currentLocation?: Folder;
  folders?: Folder[];
  onMove(
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    selectedFolder: Folder
  ): void;
}

const FolderSelectorMenu: FC<FolderSelectorMenuProps> = ({
  className,
  currentLocation,
  folders,
  onMove
}) => {
  const [selectedFolder, setSelectedFolder] = useState(currentLocation);
  return (
    <FolderSelector className={className}>
      <ParentButton>
        {currentLocation ? (
          currentLocation.name === "root" ? (
            <p>Mis documentos</p>
          ) : (
            <>
              <ArrowIcon>
                <Icon name="arrow" />
              </ArrowIcon>
              <MenuIcon name="folder-icon" />
              {currentLocation.name}
            </>
          )
        ) : null}
      </ParentButton>
      {folders &&
        folders.map((folder: Folder, i: number) => (
          <FolderSelectorOption
            key={folder.id}
            selectedFolder={selectedFolder.id === folder.id}
            onClick={e => {
              e.stopPropagation();
              setSelectedFolder(folder);
            }}
          >
            <MenuIcon name="folder-icon" />
            <p>{folder.name}</p>
          </FolderSelectorOption>
        ))}
      <MoveButton onClick={e => onMove(e, selectedFolder)}>
        <p>Mover aquí</p>
      </MoveButton>
    </FolderSelector>
  );
};

export default FolderSelectorMenu;

/**styled components */

const FolderSelector = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  right: -264px;
  z-index: 200;
  top: 0px;
  width: 278px;
  height: 300px;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  /* justify-content: flex-start;
  align-items: flex-end; */
  &:hover {
    cursor: pointer;
  }
`;

interface FolderSelectorOptionProps {
  selectedFolder: boolean;
}
const FolderSelectorOption = styled.div<FolderSelectorOptionProps>`
  width: 100%;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  cursor: pointer;
  background-color: ${props => (props.selectedFolder ? "#ebebeb" : "white")};

  p {
    max-width: 226px;
    color: black;
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background-color: #ebebeb;
  }
`;

const ParentButton = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ebebeb;
  border-bottom: 1px solid #ebebeb;

  p {
    flex: 1;
    margin-left: 10px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #373b44;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ArrowIcon = styled.div`
  height: 40px;
  width: 40px;
  border-right: 1px solid #ebebeb;
  display: flex;

  align-items: center;
  justify-content: center;
`;

const MoveButton = styled.div`
  height: 40px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid #ebebeb;
  position: absolute;
  bottom: 0;

  p {
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    font-style: normal;
    font-stretch: normal;
    letter-spacing: normal;
    color: #373b44;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const MenuIcon = styled(Icon)<{ title?: boolean }>`
  margin-right: ${props => (props.title ? 6 : 14)}px;
  margin-left: 13px;
  height: ${props => (props.title ? 20 : 13)}px;
  width: ${props => (props.title ? 20 : 13)}px;
`;
