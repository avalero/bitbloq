import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors, DialogModal } from "@bitbloq/ui";

import DocumentCard from "./DocumentCard";
import EditTitleModal from "./EditTitleModal";
import FolderCard from "./FolderCard";
import DocumentCardMenu from "./DocumentCardMenu";

import { css } from "@emotion/core";

import {
  UPDATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  FOLDER_QUERY,
  UPDATE_FOLDER_MUTATION,
  DELETE_FOLDER_MUTATION,
  CREATE_DOCUMENT_MUTATION
} from "../apollo/queries";
import FolderSelectorMenu from "./FolderSelectorMenu";

interface Folder {
  name: string;
  id: string;
}
export interface DocumentListProps {
  documents?: any;
  folders?: any;
  className?: string;
  currentLocation?: Folder;
  onFolderClick?: (e) => any;
  onDocumentClick?: (e) => any;
}

const DocumentListComp: FC<DocumentListProps> = ({
  documents,
  folders,
  currentLocation,
  className,
  onFolderClick,
  onDocumentClick
}) => {
  const [deleteDocumentId, setDeleteDocumentId] = useState({
    id: null,
    exercises: null
  });
  const [deleteFolderId, setDeleteFolderId] = useState("");
  const [editDocTitleModal, setEditDocTitleModal] = useState({
    id: null,
    title: null
  });
  const [editFolderNameModal, setEditFolderNameModal] = useState({
    id: null,
    name: null
  });
  const [menuOpenId, setMenuOpenId] = useState("");
  const [docWithEx, setDocWithEx] = useState(false);
  const [selectedToMoveId, setSelectedToMoveId] = useState("");

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION);

  const onDocumentMenuClick = (e, document) => {
    e.stopPropagation();
    if (menuOpenId === document.id) {
      setMenuOpenId("");
      setSelectedToMoveId("");
    } else {
      setMenuOpenId(document.id);
      setSelectedToMoveId("");
    }
  };

  const onDocumentRenameClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMoveId("");
    setEditDocTitleModal({ id: document.id, title: document.title });
  };

  const onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMoveId("");
    setDeleteDocumentId({ id: document.id, exercises: document.exercises });
  };

  const confirmDelete = () => {
    if (deleteDocumentId.exercises.length > 0) {
      setDocWithEx(true);
      return;
    } else {
      onDeleteDocument();
      return;
    }
  };

  const onDeleteDocument = async () => {
    await deleteDocument({
      variables: { id: deleteDocumentId.id },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setDeleteDocumentId({ id: null, exercises: null });
    setDocWithEx(false);
  };

  const onFolderRenameClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMoveId("");
    setEditFolderNameModal({ id: folder.id, name: folder.name });
  };

  const onFolderDeleteClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMoveId("");
    setDeleteFolderId(folder.id);
  };

  const onDeleteFolder = async (e, folder) => {
    await deleteFolder({
      variables: { id: deleteFolderId },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setDeleteFolderId(null);
  };

  const onUpdateDocTitle = async docTitle => {
    await updateDocument({
      variables: { id: editDocTitleModal.id, title: docTitle },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setEditDocTitleModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onUpdateFolderName = async folderName => {
    await updateFolder({
      variables: { id: editFolderNameModal.id, input: { name: folderName } },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setEditFolderNameModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onDuplicateFolder = async (e, folder) => {
    e.stopPropagation();
    setMenuOpenId(null);
    return null;
  };

  const onDuplicateDocument = async (e, document) => {
    e.stopPropagation();
    await createDocument({
      variables: {
        ...document,
        folder: currentLocation.id
      },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setMenuOpenId(null);
  };

  //TODO:
  const onMoveDocumentClick = async (e, document) => {
    e.stopPropagation();
    setSelectedToMoveId(document.id);
    //setMenuOpenId(null);
  };
  const onMoveFolderClick = async (e, folder) => {
    e.stopPropagation();
    setSelectedToMoveId(folder.id);
  };

  const onMoveDocument = async (e, folder) => {
    e.stopPropagation();
    await updateDocument({
      variables: { id: selectedToMoveId, folder: folder.id },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setMenuOpenId(null);
    setSelectedToMoveId(null);
  };
  const onMoveFolder = async (e, folder) => {
    e.stopPropagation();
    await updateFolder({
      variables: { id: selectedToMoveId, input: { parent: folder.id } },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation.id
          }
        }
      ]
    });
    setMenuOpenId(null);
    setSelectedToMoveId(null);
  };
  return (
    <>
      <DocumentList className={className}>
        {documents &&
          documents.map((document: any) => (
            <StyledDocumentCard
              key={document.id}
              document={document}
              onClick={() => onDocumentClick(document)}
            >
              <DocumentMenuButton
                isOpen={menuOpenId === document.id}
                onClick={e => onDocumentMenuClick(e, document)}
              >
                <Icon name="ellipsis" />
              </DocumentMenuButton>
              {menuOpenId === document.id && (
                <DocumentCardMenu
                  options={[
                    {
                      iconName: "pencil",
                      label: "Cambiar nombre",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onDocumentRenameClick(e, document);
                      }
                    },
                    {
                      iconName: "duplicate",
                      label: "Crear una copia",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onDuplicateDocument(e, document);
                      }
                    },
                    {
                      disabled:
                        folders.filter(op => op.id !== document.id).length ===
                        0,
                      iconName: "move-document",
                      label: "Mover a",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onMoveDocumentClick(e, document);
                      }
                    },
                    {
                      iconName: "trash",
                      label: "Eliminar documento",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onDocumentDeleteClick(e, document);
                      },
                      red: true
                    }
                  ]}
                />
              )}

              {selectedToMoveId === document.id && folders != [] && (
                <FolderSelectorMenu
                  folders={folders
                    .map(op => ({ name: op.name, id: op.id }))
                    .filter(op => op.id !== selectedToMoveId)}
                  onMove={onMoveDocument}
                  currentLocation={currentLocation}
                ></FolderSelectorMenu>
              )}
            </StyledDocumentCard>
          ))}
        {folders &&
          folders.map((folder: any) => (
            <StyledFolderCard
              key={folder.id}
              folder={folder}
              onClick={e => onFolderClick(e, folder)}
            >
              <DocumentMenuButton
                isOpen={menuOpenId === folder.id}
                onClick={e => onDocumentMenuClick(e, folder)}
              >
                <Icon name="ellipsis" />
              </DocumentMenuButton>
              {menuOpenId === folder.id && (
                <DocumentCardMenu
                  options={[
                    {
                      iconName: "pencil",
                      label: "Cambiar nombre",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onFolderRenameClick(e, folder);
                      }
                    },
                    {
                      disabled: true,
                      iconName: "duplicate",
                      label: "Crear una copia",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onDuplicateFolder(e, folder);
                      }
                    },
                    {
                      disabled:
                        folders.filter(op => op.id !== folder.id).length === 0,
                      iconName: "move-document",
                      label: "Mover a",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onMoveFolderClick(e, folder);
                      }
                    },
                    {
                      iconName: "trash",
                      label: "Eliminar carpeta",
                      onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                        onFolderDeleteClick(e, folder);
                      },
                      red: true
                    }
                  ]}
                />
              )}
              {selectedToMoveId === folder.id && folders != [] && (
                <FolderSelectorMenu
                  folders={folders
                    .map(op => ({ name: op.name, id: op.id }))
                    .filter(op => op.id !== selectedToMoveId)}
                  onMove={onMoveFolder}
                  currentLocation={currentLocation}
                ></FolderSelectorMenu>
              )}
            </StyledFolderCard>
          ))}
      </DocumentList>
      <DialogModal
        isOpen={!!deleteDocumentId.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDelete}
        onCancel={() => setDeleteDocumentId({ id: null, exercises: null })}
      />
      <DialogModal
        isOpen={!!deleteFolderId}
        title="Eliminar"
        text="¿Seguro que quieres eliminar esta carpeta?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteFolder}
        onCancel={() => setDeleteFolderId(null)}
      />
      <DialogModal
        isOpen={!!docWithEx}
        title="Aviso"
        text="Has creado ejercicios a partir de este documento, si lo eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteDocument}
        onCancel={() => {
          setDeleteDocumentId({ id: null, exercises: null });
          setDocWithEx(false);
        }}
      />

      {editDocTitleModal.id && (
        <EditTitleModal
          title={editDocTitleModal.title}
          onCancel={() => setEditDocTitleModal({ id: null, title: null })}
          onSave={onUpdateDocTitle}
          modalTitle="Cambiar nombre del documento"
          modalText="Nombre del documento"
          placeholder={editDocTitleModal.title}
          saveButton="Cambiar"
        />
      )}
      {editFolderNameModal.id && (
        <EditTitleModal
          title={editFolderNameModal.name}
          onCancel={() => setEditFolderNameModal({ id: null, name: null })}
          onSave={onUpdateFolderName}
          modalTitle="Cambiar nombre de la carpeta"
          modalText="Nombre de la carpeta"
          placeholder={editFolderNameModal.name}
          saveButton="Cambiar"
        />
      )}
    </>
  );
};

export default DocumentListComp;

const DocumentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-auto-rows: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 40px;
  margin-bottom: 60px;

  &::before {
    content: "";
    width: 0px;
    padding-bottom: 85.7%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  & > div:first-of-type {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
`;

const DocumentMenuButton = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 14px;
  top: 14px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  background-color: white;
  display: none;

  &:hover {
    background-color: ${colors.gray1};
    border-color: ${colors.gray4};
  }

  ${props =>
    props.isOpen &&
    css`
      display: flex;
      border: solid 1px #dddddd;
      background-color: "red";
    `} svg {
    transform: rotate(90deg);
  }
`;

const StyledDocumentCard = styled(DocumentCard)`
  &:hover {
    ${DocumentMenuButton} {
      display: flex;
    }
  }
`;

const StyledFolderCard = styled(FolderCard)`
  &:hover {
    ${DocumentMenuButton} {
      display: flex;
    }
  }
`;
