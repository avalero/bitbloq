import React, { FC, useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";

import styled from "@emotion/styled";
import {
  Button,
  colors,
  Icon,
  DialogModal,
  DropDown,
  Select,
  Spinner,
  Input,
  HorizontalRule
} from "@bitbloq/ui";
import { navigate } from "gatsby";
import { Subscription } from "react-apollo";
import { documentTypes } from "../config";
import AppHeader from "./AppHeader";
import DocumentCard from "./DocumentCard";
import NewDocumentDropDown from "./NewDocumentDropDown";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import useUserData from "../lib/useUserData";
import {
  sortByCreatedAt,
  sortByTitleAZ,
  sortByTitleZA,
  sortByUpdatedAt
} from "../util";
import {
  CREATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION,
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  ME_QUERY,
  CREATE_FOLDER_MUTATION,
  FOLDER_QUERY,
  DELETE_FOLDER_MUTATION,
  UPDATE_FOLDER_MUTATION
} from "../apollo/queries";

import NewExerciseButton from "./NewExerciseButton";
import EditTitleModal from "./EditTitleModal";
import FolderCard from "./FolderCard";
import DocumentCardMenu from "./DocumentCardMenu";

enum OrderType {
  Creation = "creation",
  Modification = "modification",
  NameAZ = "nameAZ",
  NameZA = "nameZA"
}

const orderOptions = [
  {
    label: "Orden: Creación",
    value: OrderType.Creation
  },
  {
    label: "Orden: Modificación",
    value: OrderType.Modification
  },
  {
    label: "Orden: Nombre A-Z",
    value: OrderType.NameAZ
  },
  {
    label: "Orden: Nombre Z-A",
    value: OrderType.NameZA
  }
];

const orderFunctions = {
  [OrderType.Creation]: sortByCreatedAt,
  [OrderType.Modification]: sortByUpdatedAt,
  [OrderType.NameAZ]: sortByTitleAZ,
  [OrderType.NameZA]: sortByTitleZA
};

const Documents: FC = () => {
  const userData = useUserData();
  const client = useApolloClient();

  const [order, setOrder] = useState(OrderType.Creation);
  const [searchText, setSearchText] = useState("");
  const [deleteDocumentId, setDeleteDocumentId] = useState("");
  const [deleteFolderId, setDeleteFolderId] = useState("");
  const [folderTitleModal, setFolderTitleModal] = useState(false);
  const [editDocTitleModal, setEditDocTitleModal] = useState({
    id: null,
    title: null
  });
  const [editFolderNameModal, setEditFolderNameModal] = useState({
    id: null,
    name: null
  });
  const [menuOpenId, setMenuOpenId] = useState("");
  const [currentLocation, setCurrentLocation] = useState(
    userData ? userData.rootFolder : ""
  );

  let openFile = React.createRef<HTMLInputElement>();

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);

  const [createFolder] = useMutation(CREATE_FOLDER_MUTATION);
  const [deleteFolder] = useMutation(DELETE_FOLDER_MUTATION);
  const [updateFolder] = useMutation(UPDATE_FOLDER_MUTATION);

  const {
    data: dataPage,
    loading: loadingPage,
    error: errorPage,
    refetch: refetchPage
  } = useQuery(FOLDER_QUERY, {
    variables: {
      id: currentLocation
    }
  });

  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);
  const { data: dataEx, loading: loadEx, error: errorEx } = useQuery(
    EXERCISE_BY_CODE_QUERY
  );

  const onCreateFolder = async folderName => {
    await createFolder({
      variables: {
        input: { name: folderName, parent: currentLocation }
      },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation
          }
        }
      ]
    });
    setFolderTitleModal(false);
  };

  const onUpdateDocTitle = async docTitle => {
    await updateDocument({
      variables: { id: editDocTitleModal.id, title: docTitle },
      refetchQueries: [
        {
          query: FOLDER_QUERY,
          variables: {
            id: currentLocation
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
            id: currentLocation
          }
        }
      ]
    });
    setEditFolderNameModal({ id: null, title: null });
    setMenuOpenId(null);
  };

  const onDocumentClick = ({ id, type }) => {
    window.open(`/app/document/${id}`);
  };

  const onFolderClick = ({ id, type }) => {
    setCurrentLocation(id);
  };

  const onNewDocument = type => {
    window.open(`/app/document/${type}/new`);
  };

  const onDocumentCreated = ({ createDocument: { id, type } }) => {
    navigate(`/app/document/${type}/${id}`);
  };

  const onOrderChange = order => {
    setOrder(order);
  };

  const onOpenDocumentClick = () => {
    openFile.current.click();
  };

  const onDocumentMenuClick = (e, document) => {
    e.stopPropagation();
    if (menuOpenId === document.id) {
      setMenuOpenId("");
    } else {
      setMenuOpenId(document.id);
    }
  };

  const onDocumentRenameClick = (e, document) => {
    e.stopPropagation();
    setEditDocTitleModal({ id: document.id, title: document.title });
  };

  const onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    setDeleteDocumentId(document.id);
  };

  const onDeleteDocument = async () => {
    await deleteDocument({ variables: { id: deleteDocumentId } });
    setDeleteDocumentId(null);
    refetchPage();
  };

  const onFolderRenameClick = (e, folder) => {
    e.stopPropagation();
    setEditFolderNameModal({ id: folder.id, name: folder.name });
  };

  const onFolderDeleteClick = (e, folder) => {
    e.stopPropagation();
    setDeleteFolderId(folder.id);
  };

  const onDeleteFolder = async () => {
    await deleteFolder({ variables: { id: deleteFolderId } });
    setDeleteFolderId(null);
    refetchPage();
  };

  const onOpenExercise = async exerciseCode => {
    if (exerciseCode) {
      try {
        setLoadingExercise(true);
        const {
          data: { exerciseByCode: exercise }
        } = await client.query({
          query: EXERCISE_BY_CODE_QUERY,
          variables: { code: exerciseCode }
        });
        setLoadingExercise(false);
        setExerciseError(false);
        window.open(`/app/exercise/${exercise.type}/${exercise.id}`);
      } catch (e) {
        setLoadingExercise(false);
        setExerciseError(true);
      }
    }
  };

  const onFileSelected = file => {
    const reader = new FileReader();
    reader.onload = async e => {
      const document = JSON.parse(reader.result as string);
      const { data } = await createDocument({
        variables: { ...document },
        refetchQueries: [
          {
            query: FOLDER_QUERY,
            variables: {
              id: currentLocation
            }
          }
        ]
      });
      onDocumentCreated(data);
    };

    reader.readAsText(file);
  };

  const filterDocuments = documents => {
    return documents
      .slice()
      .sort(orderFunction)
      .filter(d => documentTypes[d.type] && documentTypes[d.type].supported)
      .filter(
        d =>
          !searchText ||
          (d.title &&
            d.title.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
      );
  };

  const filterFolders = folders => {
    return folders
      .slice()
      .sort(orderFunction)
      .filter(
        d =>
          !searchText ||
          (d.name &&
            d.name.toLowerCase().indexOf(searchText.toLowerCase()) >= 0)
      );
  };

  const orderFunction = orderFunctions[order];

  if (errorPage) return <GraphQLErrorMessage apolloError={errorPage} />;
  if (loadingPage)
    return (
      <Container>
        <Loading />
      </Container>
    );

  const { documents, folders } = dataPage.folder;

  return (
    <Container>
      <AppHeader />
      <Content>
        <Header>
          {currentLocation === userData.rootFolder ? (
            <h1>Mis documentos</h1>
          ) : (
            <h1>Mis documentos > {dataPage.folder.name}</h1>
          )}
        </Header>
        <Rule />
        {(documents || folders) && (
          <DocumentListHeader>
            {(documents.length > 0 || folders.length > 0) && (
              <>
                <ViewOptions>
                  <OrderSelect
                    options={orderOptions}
                    onChange={onOrderChange}
                    selectConfig={{ isSearchable: false }}
                  />
                </ViewOptions>
                <SearchInput
                  value={searchText}
                  onChange={e => setSearchText(e.target.value)}
                  placeholder="Buscar..."
                />
              </>
            )}
            <HeaderButtons>
              <NewFolderButton
                tertiary
                onClick={() => {
                  setFolderTitleModal(true);
                }}
              >
                <Icon name="new-folder" /> Nueva carpeta
              </NewFolderButton>
              <NewExerciseButton
                onOpenExercise={onOpenExercise}
                exerciseError={exerciseError}
                loadingExercise={loadingExercise}
              />
              <DropDown
                attachmentPosition={"top center"}
                targetPosition={"bottom center"}
              >
                {(isOpen: boolean) => (
                  <NewDocumentButton tertiary isOpen={isOpen}>
                    <Icon name="new-document" />
                    Nuevo documento
                  </NewDocumentButton>
                )}
                <NewDocumentDropDown
                  onNewDocument={onNewDocument}
                  onOpenDocument={onOpenDocumentClick}
                  arrowOffset={10}
                />
              </DropDown>
            </HeaderButtons>
          </DocumentListHeader>
        )}

        {(documents || folders) &&
        (documents.length > 0 || folders.length > 0) ? (
          searchText ? (
            filterDocuments(documents).length > 0 ||
            filterFolders(folders).length > 0 ? (
              <DocumentList>
                {filterDocuments(documents).map((document: any) => (
                  <StyledDocumentCard
                    key={document.id}
                    document={document}
                    onClick={() => onDocumentClick(document)}
                  >
                    <DocumentMenuButton
                      onClick={e => {
                        onDocumentMenuClick(e, document);
                      }}
                    >
                      <Icon name="ellipsis" />
                    </DocumentMenuButton>
                    {menuOpenId === document.id && (
                      <DocumentCardMenu
                        document
                        onDelete={e => onDocumentDeleteClick(e, document)}
                        onRename={e => onDocumentRenameClick(e, document)}
                      />
                    )}
                  </StyledDocumentCard>
                ))}
                {filterFolders(folders).map((folder: any) => (
                  <StyledFolderCard
                    key={folder.id}
                    folder={folder}
                    onClick={() => onFolderClick(folder)}
                  >
                    <DocumentMenuButton
                      onClick={e => {
                        onDocumentMenuClick(e, folder);
                      }}
                    >
                      <Icon name="ellipsis" />
                    </DocumentMenuButton>
                    {menuOpenId === folder.id && (
                      <DocumentCardMenu
                        folder
                        onDelete={e => onFolderDeleteClick(e, folder)}
                        onRename={e => {
                          onFolderRenameClick(e, folder);
                        }}
                      />
                    )}
                  </StyledFolderCard>
                ))}
              </DocumentList>
            ) : (
              <NoDocuments>
                <h1>No hay resultados para tu búsqueda</h1>
              </NoDocuments>
            )
          ) : (
            <DocumentList>
              {filterDocuments(documents).map((document: any) => (
                <StyledDocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                >
                  <DocumentMenuButton
                    onClick={e => {
                      onDocumentMenuClick(e, document);
                      //onDocumentDeleteClick(e, document)
                    }}
                  >
                    <Icon name="ellipsis" />
                  </DocumentMenuButton>
                  {menuOpenId === document.id && (
                    <DocumentCardMenu
                      document
                      onDelete={e => onDocumentDeleteClick(e, document)}
                      onRename={e => onDocumentRenameClick(e, document)}
                    />
                  )}
                </StyledDocumentCard>
              ))}
              {filterFolders(folders).map((folder: any) => (
                <StyledFolderCard
                  key={folder.id}
                  folder={folder}
                  onClick={() => onFolderClick(folder)}
                >
                  <DocumentMenuButton
                    onClick={e => {
                      onDocumentMenuClick(e, folder);
                      //onFolderDeleteClick(e, folder)
                    }}
                  >
                    <Icon name="ellipsis" />
                  </DocumentMenuButton>
                  {menuOpenId === folder.id && (
                    <DocumentCardMenu
                      folder
                      onDelete={e => onFolderDeleteClick(e, folder)}
                      onRename={e => {
                        onFolderRenameClick(e, folder);
                      }}
                    />
                  )}
                </StyledFolderCard>
              ))}
            </DocumentList>
          )
        ) : (
          <NoDocuments>
            <h1>No tienes ningún documento</h1>
            <p>
              Puedes crear un documento nuevo o subir uno desde tu ordenador.
            </p>
          </NoDocuments>
        )}
        <Subscription
          subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
          shouldResubscribe={true}
          onSubscriptionData={() => {
            refetchPage();
          }}
        />
      </Content>
      <DialogModal
        isOpen={!!deleteDocumentId}
        title="Eliminar"
        text="¿Seguro que quieres eliminar este documento?"
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={onDeleteDocument}
        onCancel={() => setDeleteDocumentId(null)}
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
      <input
        ref={openFile}
        type="file"
        onChange={e => onFileSelected(e.target.files[0])}
        style={{ display: "none" }}
      />
      {folderTitleModal && (
        <EditTitleModal
          title={"Carpeta sin título"}
          onCancel={() => setFolderTitleModal(false)}
          onSave={onCreateFolder}
          modalTitle="Crear carpeta"
          modalText="Nombre de la carpeta"
          placeholder="Carpeta sin título"
          saveButton="Crear"
        />
      )}
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
    </Container>
  );
};

const DocumentsWithDelete = props => <Documents {...props} />;

export default DocumentsWithDelete;

/* styled components */

const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${colors.gray1};
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  padding: 0px 50px;
`;

const Header = styled.div`
  height: 85px;
  display: flex;
  align-items: center;

  h1 {
    flex: 1;
    font-weight: bold;
    font-size: 24px;
  }
`;

const Loading = styled(Spinner)`
  flex: 1;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
`;

const DocumentListHeader = styled.div`
  display: flex;
  height: 115px;
  align-items: center;
`;

const HeaderButtons = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

const HeaderButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;

const ViewOptions = styled.div`
  margin-right: 10px;
`;

const OrderSelect: Select = styled(Select)`
  width: 200px;
`;

const SearchInput: Input = styled(Input)`
  width: 210px;
  flex: inherit;
`;

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
      border: solid 1px #dddddd;
      background-color: #e8e8e8;
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

interface NewDocumentButtonProps {
  isOpen: boolean;
}
const NewDocumentButton = styled(Button)<NewDocumentButtonProps>`
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;

  &:hover {
    background-color: ${colors.gray2};
  }

  svg {
    height: 20px;
    margin-right: 8px;
  }
`;

const NoDocuments = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 60px;
  margin-top: 100px;
  justify-content: center;
  align-items: center;

  h1 {
    width: 1179px;
    height: 28px;
    font-family: Roboto;
    font-size: 24px;
    font-weight: 300;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    text-align: center;
    color: #373b44;
    margin-bottom: 20px;
  }

  p {
    width: 1179px;
    height: 22px;
    font-family: Roboto;
    font-size: 14px;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: 1.57;
    letter-spacing: normal;
    text-align: center;
    color: #474749;
  }
`;

const NewFolderButton = styled(Button)`
  padding: 0px 20px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;
