import gql from "graphql-tag";
import React, { FC, useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors } from "@bitbloq/ui";

interface Folder {
  name: string;
  id: string;
}

const FOLDER_QUERY = gql`
  query folder($id: ObjectID!) {
    folder(id: $id) {
      id
      name
      parent
      parentsPath {
        id
        name
      }
      folders {
        id
        name
      }
    }
  }
`;

export interface FolderSelectorMenuProps {
  className?: string;
  currentLocation?: Folder;
  selectedToMove?: { id: string; parent: string };
  onMove: (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    selectedFolder: Folder
  ) => any;
}

const FolderSelectorMenu: FC<FolderSelectorMenuProps> = ({
  className,
  currentLocation,
  selectedToMove,
  onMove
}) => {
  const [selectedFolder, setSelectedFolder] = useState(currentLocation);
  const { data, loading, error } = useQuery(FOLDER_QUERY, {
    variables: {
      id: selectedFolder.id
    }
  });
  if (loading) {
    return <FolderSelector>loading...</FolderSelector>;
  }
  if (error) {
    console.log(error);
  }
  const { folders: foldersData, name: folderName, parent, id } = data.folder;
  return (
    <FolderSelector className={className}>
      <ParentButton
        onClick={e => {
          e.stopPropagation();
          setSelectedFolder({ id: parent, name: "" });
        }}
      >
        {folderName ? (
          folderName === "root" ? (
            <p>Mis documentos</p>
          ) : (
            <>
              <ArrowIcon>
                <Icon name="arrow" />
              </ArrowIcon>
              <MenuIcon title={true} name="folder-icon" />
              <p>{folderName}</p>
            </>
          )
        ) : null}
      </ParentButton>
      <FolderSelectorOptions showMove={selectedToMove.parent !== id}>
        {foldersData &&
          foldersData
            .filter(op => op.id !== selectedToMove.id)
            .map((folder: Folder, i: number) => (
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
      </FolderSelectorOptions>
      {selectedToMove.parent !== id && (
        <MoveButton onClick={e => onMove(e, selectedFolder)}>
          <p>Mover aquí</p>
        </MoveButton>
      )}
    </FolderSelector>
  );
};

export default FolderSelectorMenu;

/**styled components */

const FolderSelector = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 200;
  top: 0px;
  width: 278px;
  height: 316px;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  &:hover {
    cursor: pointer;
  }
`;

const FolderSelectorOptions = styled.div<{ showMove?: boolean }>`
  overflow: scroll;
  height: ${props => (props.showMove ? 235 : 270)}px;
  ::-webkit-scrollbar {
    display: none;
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
  margin-right: ${props => (props.title ? 0 : 14)}px;
  margin-left: 13px;
  height: ${props => (props.title ? 20 : 13)}px;
  width: ${props => (props.title ? 20 : 13)}px;
`;
