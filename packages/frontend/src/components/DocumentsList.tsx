import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors, DialogModal, DropDown } from "@bitbloq/ui";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import DocumentCard from "./DocumentCard";
import EditTitleModal from "./EditTitleModal";
import DocumentCardMenu from "./DocumentCardMenu";

import { css } from "@emotion/core";

import {
  UPDATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  UPDATE_FOLDER_MUTATION,
  DELETE_FOLDER_MUTATION,
  CREATE_DOCUMENT_MUTATION,
  DOCS_FOLDERS_PAGE_QUERY
} from "../apollo/queries";
import FolderSelectorMenu from "./FolderSelectorMenu";

interface Folder {
  name: string;
  id: string;
}
export interface DocumentListProps {
  docsAndFols?: any;
  parentsPath?: any;
  className?: string;
  currentLocation?: Folder;
  onFolderClick?: (e) => any;
  onDocumentClick?: (e) => any;
  refetchDocsFols: () => any;
  nFolders: number;
}

const DocumentListComp: FC<DocumentListProps> = ({
  docsAndFols,
  parentsPath,
  currentLocation,
  className,
  onFolderClick,
  onDocumentClick,
  refetchDocsFols,
  nFolders
}) => {
  const [deleteDoc, setDeleteDoc] = useState({
    id: null,
    hasChildren: null
  });
  const [deleteFol, setDeleteFol] = useState({
    id: null,
    hasChildren: null
  });
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
  const [folWithChildren, setFolWithChildren] = useState(false);
  const [selectedToMove, setSelectedToMove] = useState({
    id: null,
    parent: null
  });
  const [draggingItemId, setDraggingItemId] = useState("");

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION);

  const onDocumentMenuClick = (e, document) => {
    e.stopPropagation();
    if (menuOpenId === document.id) {
      setMenuOpenId("");
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setMenuOpenId(document.id);
      setSelectedToMove({
        id: null,
        parent: null
      });
    }
  };

  const onDocumentRenameClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setEditDocTitleModal({ id: document.id, title: document.title });
  };

  const onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setDeleteDoc({ id: document.id, hasChildren: document.hasChildren });
  };

  const confirmDeleteDoc = () => {
    if (deleteDoc.hasChildren) {
      setDocWithEx(true);
      return;
    } else {
      onDeleteDocument();
      return;
    }
  };

  const onDeleteDocument = async () => {
    await deleteDocument({
      variables: { id: deleteDoc.id }
    });
    refetchDocsFols();
    setDeleteDoc({ id: null, hasChildren: null });
    setDocWithEx(false);
  };

  const onFolderRenameClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setEditFolderNameModal({ id: folder.id, name: folder.name });
  };

  const onFolderDeleteClick = (e, folder) => {
    e.stopPropagation();
    setSelectedToMove({
      id: null,
      parent: null
    });
    setDeleteFol({ id: folder.id, hasChildren: folder.hasChildren });
  };

  const confirmDeleteFol = () => {
    if (deleteFol.hasChildren) {
      setFolWithChildren(true);
      return;
    } else {
      onDeleteFolder();
      return;
    }
  };

  const onDeleteFolder = async () => {
    await deleteFolder({
      variables: { id: deleteFol.id }
    });
    refetchDocsFols();
    setFolWithChildren(false);
    setDeleteFol({ id: null, hasChildren: null });
  };

  const onUpdateDocTitle = async docTitle => {
    await updateDocument({
      variables: {
        id: editDocTitleModal.id,
        title: docTitle ? docTitle : "Documento sin título"
      }
    });
    refetchDocsFols();
    setEditDocTitleModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onUpdateFolderName = async folderName => {
    await updateFolder({
      variables: {
        id: editFolderNameModal.id,
        input: { name: folderName ? folderName : "Carpeta sin título" }
      }
    });
    refetchDocsFols();
    setEditFolderNameModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onDuplicateDocument = async (e, document) => {
    e.stopPropagation();
    let newTitle: string = `${document.title} copia`;

    if (newTitle.length >= 64) {
      newTitle = newTitle.slice(0, 63);
    }

    await createDocument({
      variables: {
        ...document,
        image: {
          image: document.image,
          isSnapshot: document.image.indexOf("blob") > -1
        },
        title: newTitle,
        folder: currentLocation.id
      }
    });
    refetchDocsFols();
    setMenuOpenId("");
  };

  const onMoveDocumentClick = async (e, document) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setSelectedToMove({ id: document.id, parent: document.parent });
    }
  };
  const onMoveFolderClick = async (e, folder) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({
        id: null,
        parent: null
      });
    } else {
      setSelectedToMove({ id: folder.id, parent: folder.parent });
    }
  };

  const onMoveDocument = async (e, folder, documentId?) => {
    e && e.stopPropagation();
    await updateDocument({
      variables: { id: documentId || selectedToMove.id, folder: folder.id }
    });
    refetchDocsFols();
    setMenuOpenId(null);
    setSelectedToMove({
      id: null,
      parent: null
    });
  };
  const onMoveFolder = async (e, folderParent, folderMovedId?) => {
    e && e.stopPropagation();
    await updateFolder({
      variables: {
        id: folderMovedId || selectedToMove.id,
        input: { parent: folderParent.id }
      }
    });
    refetchDocsFols();
    setMenuOpenId(null);
    setSelectedToMove({
      id: null,
      parent: null
    });
  };

  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <DocumentList className={className}>
          {docsAndFols &&
            docsAndFols.map((document: any) => (
              <StyledDocumentCard
                beginFunction={() => setDraggingItemId(document.id)}
                endFunction={() => setDraggingItemId("")}
                draggable={
                  (document.type === "folder" && nFolders > 1) ||
                  (document.type !== "folder" && nFolders > 0)
                }
                dropDocumentCallback={() =>
                  onMoveDocument(undefined, document, draggingItemId)
                }
                dropFolderCallback={() =>
                  onMoveFolder(undefined, document, draggingItemId)
                }
                key={document.id}
                document={document}
                onClick={e =>
                  document.type === "folder"
                    ? onFolderClick && onFolderClick(document)
                    : onDocumentClick && onDocumentClick(document)
                }
              >
                <DropDown
                  constraints={[
                    {
                      attachment: "together",
                      to: "window"
                    }
                  ]}
                  closeOnClick={!(selectedToMove.id === document.id)}
                  targetOffset="-165px -14px"
                  targetPosition="top right"
                >
                  {(isOpen: boolean) => (
                    <DocumentMenuButton
                      isOpen={menuOpenId === document.id}
                      onClick={e => onDocumentMenuClick(e, document)}
                    >
                      <Icon name="ellipsis" />
                    </DocumentMenuButton>
                  )}
                  <DropDown
                    constraints={[
                      {
                        attachment: "together",
                        to: "window"
                      }
                    ]}
                    closeOnClick={!(selectedToMove.id === document.id)}
                    targetPosition="top right"
                    attachmentPosition="top left"
                    offset="60px 0"
                  >
                    {(isOpen: boolean) => (
                      <DocumentCardMenu
                        options={[
                          {
                            iconName: "pencil",
                            label: "Cambiar nombre",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDocumentRenameClick(e, document)
                                : onFolderRenameClick(e, document);
                            }
                          },
                          {
                            iconName: "duplicate",
                            label: "Crear una copia",
                            disabled: document.type === "folder",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDuplicateDocument(e, document)
                                : null;
                            }
                          },
                          {
                            selected: document.id === selectedToMove.id,
                            disabled:
                              ((document.type === "folder" && nFolders === 1) ||
                                (document.type !== "folder" &&
                                  nFolders === 0)) &&
                              parentsPath.length === 1,
                            iconName: "move-document",
                            label: "Mover a",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              document.type !== "folder"
                                ? onMoveDocumentClick(e, document)
                                : onMoveFolderClick(e, document);
                            }
                          },
                          {
                            iconName: "trash",
                            label:
                              document.type !== "folder"
                                ? "Eliminar documento"
                                : "Eliminar carpeta",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              setMenuOpenId("");
                              document.type !== "folder"
                                ? onDocumentDeleteClick(e, document)
                                : onFolderDeleteClick(e, document);
                            },
                            red: true
                          }
                        ]}
                      />
                    )}
                    {selectedToMove.id === document.id && (
                      <FolderSelectorMenu
                        selectedToMove={selectedToMove}
                        onMove={
                          document.type !== "folder"
                            ? onMoveDocument
                            : onMoveFolder
                        }
                        currentLocation={currentLocation}
                      />
                    )}
                  </DropDown>
                </DropDown>
              </StyledDocumentCard>
            ))}
        </DocumentList>
      </DndProvider>
      <DialogModal
        isOpen={!!deleteDoc.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteDoc}
        onCancel={() => setDeleteDoc({ id: null, hasChildren: null })}
      />
      <DialogModal
        isOpen={!!deleteFol.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar esta carpeta?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteFol}
        onCancel={() => setDeleteFol({ id: null, hasChildren: null })}
      />
      <DialogModal
        isOpen={!!docWithEx}
        title="Aviso"
        text="Has creado ejercicios a partir de este documento, si lo eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteDocument}
        onCancel={() => {
          setDeleteDoc({ id: null, hasChildren: null });
          setDocWithEx(false);
        }}
      />

      <DialogModal
        isOpen={!!folWithChildren}
        title="Aviso"
        text="Has creado ejercicios en los documentos que contiene esta carpeta, si los eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteFolder}
        onCancel={() => {
          setDeleteFol({ id: null, hasChildren: null });
          setFolWithChildren(false);
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
  margin-bottom: 40px;

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
