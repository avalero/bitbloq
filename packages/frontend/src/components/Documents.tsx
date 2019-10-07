import React, { FC, useState } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import {
  Button,
  colors,
  Icon,
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
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  CREATE_FOLDER_MUTATION,
  FOLDER_QUERY
} from "../apollo/queries";
import NewExerciseButton from "./NewExerciseButton";
import EditTitleModal from "./EditTitleModal";
import DocumentListComp from "./DocumentsList";

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
  const [folderTitleModal, setFolderTitleModal] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(
    userData ? userData.rootFolder : ""
  );

  let openFile = React.createRef<HTMLInputElement>();

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [createFolder] = useMutation(CREATE_FOLDER_MUTATION);
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

  const onFolderClick = async (e, folder) => {
    setCurrentLocation(folder.id);
  };

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
            <h1>
              <a onClick={() => setCurrentLocation(userData.rootFolder)}>
                Mis documentos
              </a>{" "}
              > <Icon name="folder-icon" />
              {dataPage.folder.name}
            </h1>
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
                <Icon name="new-folder" />
                Nueva carpeta
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
              <DocumentListComp
                documents={filterDocuments(documents)}
                folders={filterFolders(folders)}
                currentLocation={currentLocation}
                onFolderClick={onFolderClick}
              />
            ) : (
              <NoDocuments>
                <h1>No hay resultados para tu búsqueda</h1>
              </NoDocuments>
            )
          ) : (
            <DocumentListComp
              documents={filterDocuments(documents)}
              folders={filterFolders(folders)}
              currentLocation={currentLocation}
              onFolderClick={onFolderClick}
            />
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
    &:hover {
      cursor: pointer;
    }
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
