import React, { FC, useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Icon, colors, DialogModal, DropDown } from "@bitbloq/ui";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import DocumentCard from "./DocumentCard";
import EditTitleModal from "./EditTitleModal";
import FolderCard from "./FolderCard";
import DocumentCardMenu from "./DocumentCardMenu";
import Paginator from "./Paginator";

import { css } from "@emotion/core";

import {
  UPDATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  FOLDER_QUERY,
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
  documents?: any;
  folders?: any;
  docsAndFols?: any;
  parentsPath?: any;
  className?: string;
  order?: string;
  searchTitle?: string;
  currentLocation?: Folder;
  onFolderClick?: (e) => any;
  onDocumentClick?: (e) => any;
  refetchDocsFols?: (e) => any;
}

const DocumentListComp: FC<DocumentListProps> = ({
  documents,
  folders,
  docsAndFols,
  parentsPath,
  currentLocation,
  className,
  onFolderClick,
  onDocumentClick,
  refetchDocsFols,
  order,
  searchTitle
}) => {
  const nFolders = docsAndFols.filter(doc => doc.type === "folder").length;

  const [deleteItem, setDeleteItem] = useState({
    id: null,
    hasChildren: null
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
    setDeleteItem({ id: document.id, hasChildren: document.hasChildren });
  };

  const confirmDelete = () => {
    if (deleteItem.hasChildren) {
      setDocWithEx(true);
      return;
    } else {
      onDeleteDocument();
      return;
    }
  };

  const onDeleteDocument = async () => {
    await deleteDocument({
      variables: { id: deleteItem.id }
    });
    refetchDocsFols();
    setDeleteItem({ id: null, hasChildren: null });
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
    setDeleteFolderId(folder.id);
  };

  const onDeleteFolder = async (e, folder) => {
    await deleteFolder({
      variables: { id: deleteFolderId }
    });
    refetchDocsFols();
    setDeleteFolderId(null);
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
                  notHidden={
                    selectedToMove.id === document.id && docsAndFols != []
                  }
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
                    notHidden={
                      selectedToMove.id === document.id && docsAndFols != []
                    }
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
                              document.image
                                ? onDocumentRenameClick(e, document)
                                : onFolderRenameClick(e, document);
                            }
                          },
                          {
                            iconName: "duplicate",
                            label: "Crear una copia",
                            disabled: document.image === null,
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              document.image
                                ? onDuplicateDocument(e, document)
                                : null;
                            }
                          },
                          {
                            selected: document.id === selectedToMove.id,
                            disabled:
                              nFolders === 0 && parentsPath.length === 1,
                            iconName: "move-document",
                            label: "Mover a",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              document.image
                                ? onMoveDocumentClick(e, document)
                                : onMoveFolderClick(e, document);
                            }
                          },
                          {
                            iconName: "trash",
                            label: document.image
                              ? "Eliminar documento"
                              : "Eliminar carpeta",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              document.image
                                ? onDocumentDeleteClick(e, document)
                                : onFolderDeleteClick(e, document);
                            },
                            red: true
                          }
                        ]}
                      />
                    )}
                    {selectedToMove.id === document.id && nFolders !== 0 && (
                      <FolderSelectorMenu
                        selectedToMove={selectedToMove}
                        onMove={document.image ? onMoveDocument : onMoveFolder}
                        currentLocation={currentLocation}
                      />
                    )}
                  </DropDown>
                </DropDown>
              </StyledDocumentCard>
            ))}
          {/*folders &&
            folders.map((folder: any) => (
              <StyledFolderCard
                dropDocumentCallback={() =>
                  onMoveDocument(undefined, folder, draggingItemId)
                }
                dropFolderCallback={() =>
                  onMoveFolder(undefined, folder, draggingItemId)
                }
                beginFunction={() => setDraggingItemId(folder.id)}
                endFunction={() => setDraggingItemId("")}
                draggable={folders.length > 1}
                key={folder.id}
                folder={folder}
                onClick={e => onFolderClick(e, folder)}
              >
                <DropDown
                  constraints={[
                    {
                      attachment: "together",
                      to: "window"
                    }
                  ]}
                  notHidden={selectedToMove.id === folder.id && folders != []}
                  targetOffset="-165px -14px"
                  targetPosition="top right"
                >
                  {(isOpen: boolean) => (
                    <DocumentMenuButton
                      isOpen={menuOpenId === folder.id}
                      onClick={e => onDocumentMenuClick(e, folder)}
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
                    notHidden={selectedToMove.id === folder.id && folders != []}
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
                              onFolderRenameClick(e, folder);
                            }
                          },
                          {
                            selected: folder.id === selectedToMove.id,
                            disabled:
                              folders.length === 1 && parentsPath.length === 1,
                            iconName: "move-document",
                            label: "Mover a",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              onMoveFolderClick(e, folder);
                            }
                          },
                          {
                            iconName: "trash",
                            label: "Eliminar carpeta",
                            onClick(
                              e: React.MouseEvent<HTMLDivElement, MouseEvent>
                            ) {
                              onFolderDeleteClick(e, folder);
                            },
                            red: true
                          }
                        ]}
                      />
                    )}
                    {selectedToMove.id === folder.id && folders != [] && (
                      <FolderSelectorMenu
                        selectedToMove={selectedToMove}
                        onMove={onMoveFolder}
                        currentLocation={currentLocation}
                      ></FolderSelectorMenu>
                    )}
                  </DropDown>
                </DropDown>
              </StyledFolderCard>
            ))*/}
        </DocumentList>
      </DndProvider>
      <DialogModal
        isOpen={!!deleteItem.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDelete}
        onCancel={() => setDeleteItem({ id: null, hasChildren: null })}
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
          setDeleteItem({ id: null, hasChildren: null });
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

const StyledFolderCard = styled(FolderCard)`
  &:hover {
    ${DocumentMenuButton} {
      display: flex;
    }
  }
`;
