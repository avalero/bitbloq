import React, { FC, useState } from "react";
import { useMutation, useLazyQuery } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { DialogModal, DropDown } from "@bitbloq/ui";
import { useDrop } from "react-dnd";
import { css } from "@emotion/core";
import {
  IDocument,
  IFolder,
  IResult as IDocsAndFols,
  IDuplicateDocument
} from "../../../api/src/api-types";
import {
  UPDATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  UPDATE_FOLDER_MUTATION,
  DELETE_FOLDER_MUTATION,
  HAS_EXERCISES_QUERY,
  DUPLICATE_DOCUMENT_MUTATION
} from "../apollo/queries";
import DocumentCard from "./DocumentCard";
import DocumentCardMenu from "./DocumentCardMenu";
import EditInputModal from "./EditInputModal";
import FolderSelectorMenu from "./FolderSelectorMenu";
import MenuButton from "./MenuButton";
import Paginator from "./Paginator";

export interface IDocumentListProps {
  currentPage: number;
  docsAndFols?: IDocsAndFols[];
  pagesNumber: number;
  parentsPath?: IFolder[];
  className?: string;
  currentLocation: IFolder;
  order?: string;
  searchText?: string;
  onFolderClick?: (e) => void;
  onDocumentClick?: (e) => void;
  refetchDocsFols: () => any;
  selectPage: (page: number) => void;
  nFolders: number;
}

const DocumentList: FC<IDocumentListProps> = ({
  currentPage,
  docsAndFols = [],
  pagesNumber,
  parentsPath = [],
  currentLocation,
  order,
  searchText,
  className,
  onFolderClick,
  onDocumentClick,
  refetchDocsFols,
  selectPage,
  nFolders
}) => {
  interface IState {
    id: string;
    name?: string;
    parentFolder?: string;
    type?: string;
  }

  const [deleteDoc, setDeleteDoc] = useState<IState>({ id: "" });
  const [deleteFol, setDeleteFol] = useState<IState>({ id: "" });
  const [selectedToDel, setSelectedToDel] = useState<IState>({ id: "" });
  const [editDocNameModal, setEditDocNameModal] = useState<IState>({ id: "" });
  const [editFolderNameModal, setEditFolderNameModal] = useState<IState>({
    id: ""
  });
  const [menuOpenId, setMenuOpenId] = useState<string>("");
  const [docWithEx, setDocWithEx] = useState<boolean>(false);
  const [folWithChildren, setFolWithChildren] = useState(false);
  const [selectedToMove, setSelectedToMove] = useState<IState>({ id: "" });
  const [draggingItemId, setDraggingItemId] = useState<string>("");
  const [droppedItemId, setDroppedItemId] = useState<string>("");

  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [duplicateDocument] = useMutation(DUPLICATE_DOCUMENT_MUTATION);
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION);

  const [
    hasExercises,
    { data: hasExercisesRes, error: errorHasEx }
  ] = useLazyQuery(HAS_EXERCISES_QUERY, {
    variables: {
      id: selectedToDel.id,
      type: selectedToDel.type
    }
  });

  const [, drop] = useDrop({
    accept: ["document", "folder"],
    drop: () => {
      return undefined;
    }
  });

  const onDocumentMenuClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    document: IDocument
  ) => {
    e.stopPropagation();
    if (menuOpenId === document.id) {
      setMenuOpenId("");
      setSelectedToMove({ id: "" });
    } else {
      setMenuOpenId(document.id!);
      setSelectedToMove({ id: "" });
    }
  };

  const onDocumentRenameClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    document: IDocument
  ) => {
    e.stopPropagation();
    setSelectedToMove({ id: "" });
    setEditDocNameModal({ id: document.id!, name: document.name });
  };

  const onDocumentDeleteClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    document: IDocument
  ) => {
    e.stopPropagation();
    setSelectedToMove({ id: "" });
    setSelectedToDel({ id: document.id!, type: document.type! });
    setDeleteDoc({
      id: document.id!
    });
    hasExercises();
  };

  const confirmDeleteDoc = () => {
    if (!errorHasEx && hasExercisesRes !== undefined) {
      if (hasExercisesRes && hasExercisesRes.hasExercises) {
        setDocWithEx(true);
        return;
      } else {
        onDeleteDocument();
        return;
      }
    }
  };

  const onDeleteDocument = async () => {
    await deleteDocument({
      variables: { id: deleteDoc.id }
    });
    refetchDocsFols();
    setDeleteDoc({ id: "" });
    setDocWithEx(false);
  };

  const onFolderRenameClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    folder: IFolder
  ) => {
    e.stopPropagation();
    setSelectedToMove({ id: "" });
    setEditFolderNameModal({
      id: folder.id!,
      name: folder.name || undefined
    });
  };

  const onFolderDeleteClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    folder: IFolder
  ) => {
    e.stopPropagation();
    setSelectedToMove({ id: "" });
    setSelectedToDel({ id: folder.id!, type: "folder" });
    setDeleteFol({ id: folder.id! });
    hasExercises();
  };

  const confirmDeleteFol = async () => {
    if (!errorHasEx && hasExercisesRes !== undefined) {
      if (hasExercisesRes && hasExercisesRes.hasExercises) {
        setFolWithChildren(true);
        return;
      } else {
        onDeleteFolder();
        return;
      }
    }
  };

  const onDeleteFolder = async () => {
    await deleteFolder({
      variables: { id: deleteFol.id }
    });
    refetchDocsFols();
    setFolWithChildren(false);
    setDeleteFol({ id: "" });
  };

  const onUpdateDocName = async (docName?: string) => {
    await updateDocument({
      variables: {
        id: editDocNameModal.id,
        name: docName ? docName : "Documento sin título"
      }
    });
    refetchDocsFols();
    setEditDocNameModal({ id: "" });
    setMenuOpenId("");
  };

  const onUpdateFolderName = async (folderName?: string) => {
    await updateFolder({
      variables: {
        id: editFolderNameModal.id,
        input: { name: folderName ? folderName : "Carpeta sin título" }
      }
    });
    refetchDocsFols();
    setEditFolderNameModal({ id: "" });
    setMenuOpenId("");
  };

  const onDuplicateDocument = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    document: IDocument
  ) => {
    e.stopPropagation();
    let newName: string = `${document.name} copia`;

    if (newName.length >= 64) {
      newName = newName.slice(0, 63);
    }
    const result: IDuplicateDocument = await duplicateDocument({
      variables: {
        currentLocation: currentLocation.id,
        documentID: document.id,
        order,
        searchTitle: searchText,
        name: newName
      }
    }).catch(catchError => {
      return catchError;
    });
    const { page } = result;

    if (page) {
      selectPage(page);
    }
  };

  const onMoveDocumentClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    document: IDocsAndFols
  ) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({ id: "" });
    } else {
      setSelectedToMove({
        id: document.id!,
        parentFolder: document.parentFolder!
      });
    }
  };
  const onMoveFolderClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    folder: IFolder
  ) => {
    e.stopPropagation();
    if (selectedToMove.id) {
      setSelectedToMove({ id: "" });
    } else {
      setSelectedToMove({ id: folder.id!, parentFolder: folder.parentFolder! });
    }
  };

  const onMove = () => {
    refetchDocsFols();
    setMenuOpenId("");
    setSelectedToMove({ id: "" });
    if (
      pagesNumber > 1 &&
      pagesNumber === currentPage &&
      docsAndFols.length === 1
    ) {
      selectPage(currentPage - 1);
    }
  };

  const onMoveDocument = async (
    folder: IFolder,
    documentId?: string,
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e) {
      e.stopPropagation();
    }
    await updateDocument({
      variables: {
        id: documentId || selectedToMove.id,
        parentFolder: folder.id
      }
    });
    onMove();
  };
  const onMoveFolder = async (
    folderParent: IFolder,
    folderMovedId?: string,
    e?: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e) {
      e.stopPropagation();
    }
    await updateFolder({
      variables: {
        id: folderMovedId || selectedToMove.id,
        input: { parentFolder: folderParent.id }
      }
    });
    onMove();
  };

  return (
    <>
      <DocumentsAndPaginator ref={drop}>
        <Documents className={className}>
          {docsAndFols &&
            docsAndFols.map(document => (
              <StyledDocumentCard
                isOpen={true}
                beginFunction={() => setDraggingItemId(document.id!)}
                endFunction={() => setDraggingItemId("")}
                draggable={
                  (document.type === "folder" && nFolders > 1) ||
                  (document.type !== "folder" && nFolders > 0)
                }
                dropDocumentCallback={() => {
                  onMoveDocument(document as IFolder, draggingItemId);
                }}
                dropFolderCallback={() => {
                  setDroppedItemId(draggingItemId);
                  onMoveFolder(document as IFolder, draggingItemId);
                }}
                hidden={document.id === droppedItemId}
                key={document.id!}
                document={document}
                onClick={() =>
                  document.type === "folder"
                    ? onFolderClick && onFolderClick(document as IFolder)
                    : onDocumentClick && onDocumentClick(document as IDocument)
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
                  attachmentPosition="top right"
                  offset="182px 14px" // 182 = 240(card height) - 2(card border) - 14(button offset) - 36(button height) - 6(dropdow offset)
                >
                  {(isOpen: boolean) => (
                    <MenuButtonContainer
                      isOpen={isOpen}
                      onClick={e =>
                        onDocumentMenuClick(e, document as IDocument)
                      }
                    >
                      <MenuButton isOpen={isOpen} />
                    </MenuButtonContainer>
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
                    {() => (
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
                                ? onDocumentRenameClick(
                                    e,
                                    document as IDocument
                                  )
                                : onFolderRenameClick(e, document as IFolder);
                            }
                          },
                          document.type !== "folder"
                            ? {
                                iconName: "duplicate",
                                label: "Crear una copia",
                                disabled: document.type === "folder",
                                onClick(
                                  e: React.MouseEvent<
                                    HTMLDivElement,
                                    MouseEvent
                                  >
                                ) {
                                  if (document.type !== "folder") {
                                    onDuplicateDocument(
                                      e,
                                      document as IDocument
                                    );
                                  }
                                }
                              }
                            : undefined,
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
                                : onMoveFolderClick(e, document as IFolder);
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
                                ? onDocumentDeleteClick(
                                    e,
                                    document as IDocument
                                  )
                                : onFolderDeleteClick(e, document as IFolder);
                            },
                            red: true
                          }
                        ]}
                      />
                    )}
                    {selectedToMove.id === document.id ? (
                      <FolderSelectorMenu
                        selectedToMove={selectedToMove}
                        onMove={(
                          event: React.MouseEvent<HTMLDivElement, MouseEvent>,
                          selectedFolder: IFolder
                        ) =>
                          document.type !== "folder"
                            ? onMoveDocument(selectedFolder, undefined, event)
                            : onMoveFolder(selectedFolder, undefined, event)
                        }
                        currentLocation={currentLocation}
                      />
                    ) : (
                      <></>
                    )}
                  </DropDown>
                </DropDown>
              </StyledDocumentCard>
            ))}
        </Documents>
        <DocumentsPaginator
          currentPage={currentPage}
          pages={pagesNumber}
          selectPage={selectPage}
        />
      </DocumentsAndPaginator>
      <DialogModal
        isOpen={!!deleteDoc.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteDoc}
        onCancel={() => {
          setDeleteDoc({ id: "" });
          setSelectedToDel({ id: "" });
        }}
      />
      <DialogModal
        isOpen={!!deleteFol.id}
        title="Eliminar"
        text="¿Seguro que quieres eliminar esta carpeta?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={confirmDeleteFol}
        onCancel={() => {
          setDeleteFol({ id: "" });
          setSelectedToDel({ id: "" });
        }}
      />
      <DialogModal
        isOpen={!!docWithEx}
        title="Aviso"
        text="Has creado ejercicios a partir de este documento, si lo eliminas, eliminarás también estos ejercicios y sus entregas. ¿Seguro que quieres hacerlo?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteDocument}
        onCancel={() => {
          setSelectedToDel({ id: "" });
          setDeleteDoc({ id: "" });
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
          setSelectedToDel({ id: "" });
          setDeleteFol({ id: "" });
          setFolWithChildren(false);
        }}
      />
      {editDocNameModal.id && (
        <EditInputModal
          title={editDocNameModal.name || undefined}
          onCancel={() => setEditDocNameModal({ id: "" })}
          onSave={onUpdateDocName}
          modalTitle="Cambiar nombre del documento"
          modalText="Nombre del documento"
          placeholder="Documento sin título"
          saveButton="Cambiar"
        />
      )}
      {editFolderNameModal.id && (
        <EditInputModal
          title={editFolderNameModal.name || undefined}
          onCancel={() => setEditFolderNameModal({ id: "" })}
          onSave={onUpdateFolderName}
          modalTitle="Cambiar nombre de la carpeta"
          modalText="Nombre de la carpeta"
          placeholder="Carpeta sin título"
          saveButton="Cambiar"
        />
      )}
    </>
  );
};

export default DocumentList;

const Documents = styled.div`
  display: grid;
  grid-auto-rows: 240px;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  grid-column-gap: 20px;
  grid-row-gap: 40px;

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

const MenuButtonContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 14px;
  top: 14px;
  display: none;

  ${props =>
    props.isOpen &&
    css`
      display: initial;
    `}
`;

const DocumentsAndPaginator = styled.div`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  justify-content: space-between;
  width: 100%;
`;

const DocumentsPaginator = styled(Paginator)`
  margin-top: 40px;
`;

const StyledDocumentCard = styled(DocumentCard)`
  &:hover {
    ${MenuButtonContainer} {
      display: initial;
    }
  }
`;
