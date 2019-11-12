import React, { FC, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import {
  Button,
  colors,
  Icon,
  DropDown,
  Spinner,
  HorizontalRule
} from "@bitbloq/ui";
import Router from "next/router";
import { Subscription } from "react-apollo";
import debounce from "lodash/debounce";
import { ApolloError } from "apollo-client";
import {
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  CREATE_FOLDER_MUTATION,
  DOCS_FOLDERS_PAGE_QUERY
} from "../apollo/queries";
import useUserData from "../lib/useUserData";
import { OrderType } from "../types";
import AppFooter from "./Footer";
import AppHeader from "./AppHeader";
import Breadcrumbs from "./Breadcrumbs";
import CloudModal from "./CloudModal";
import DocumentList from "./DocumentsList";
import EditTitleModal from "./EditTitleModal";
import FilterOptions from "./FilterOptions";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import Layout from "./Layout";
import NewDocumentDropDown from "./NewDocumentDropDown";
import NewExerciseButton from "./NewExerciseButton";
import UserSession from "./UserSession";

const Documents: FC<{ id?: string }> = ({ id }) => {
  const userData = useUserData();
  const client = useApolloClient();

  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [order, setOrder] = useState<OrderType>(OrderType.Creation);
  const [searchText, setSearchText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [folderTitleModal, setFolderTitleModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagesNumber, setPagesNumber] = useState(1);
  const [currentLocation] = useState({
    id: id ? id : userData ? userData.rootFolder : null,
    name: "root"
  });
  const [breadcrumbLinks, setBreadcrumbsLinks] = useState([
    {
      route: userData ? "/" : "",
      text: userData ? "Mis documentos" : "",
      type: ""
    }
  ]);

  let openFile = React.createRef<HTMLInputElement>();

  const [createFolder] = useMutation(CREATE_FOLDER_MUTATION);
  const [documentsData, setDocumentsData] = useState<any>({});
  const [error, setError] = useState<ApolloError>();

  const {
    data: resultData,
    loading,
    error: errorQuery,
    refetch: refetchDocsFols
  } = useQuery(DOCS_FOLDERS_PAGE_QUERY, {
    variables: {
      currentLocation: currentLocation.id,
      currentPage: currentPage,
      order: order,
      searchTitle: searchQuery,
      itemsPerPage: 8
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (!loading && !errorQuery) {
      setError(null);
      setDocumentsData(resultData);
      setPagesNumber(resultData.documentsAndFolders.pagesNumber);
    }
    if (errorQuery) {
      setError(errorQuery);
    }
  }, [loading, errorQuery]);

  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);

  const onFolderClick = async ({ id, title }) => {
    Router.push(`/app/folder/${id}`);
  };

  useEffect(() => {
    if (currentPage > pagesNumber) {
      setCurrentPage(pagesNumber);
    }
  }, [pagesNumber]);

  const onDocumentClick = ({ id, type, title }) => {
    setBreadcrumbsLinks([
      ...breadcrumbLinks,
      { route: id, text: title, type: "document" }
    ]);
    Router.push(`/app/document/${id}`);
  };

  const onCreateFolder = async folderName => {
    await createFolder({
      variables: {
        input: { name: folderName, parent: currentLocation.id }
      }
    }).catch(e => {
      setError(e);
    });
    refetchDocsFols();
    setFolderTitleModal(false);
  };

  const onNewDocument = type => {
    window.open(`/app/edit-document/${currentLocation.id}/${type}/new`);
  };

  const onOrderChange = (order: OrderType) => {
    setOrder(order);
    refetchDocsFols();
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

  const onSearchInput = debounce((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  }, 500);

  const onFileSelected = file => {
    if (file) {
      window.open(`/app/edit-document/${currentLocation.id}/open/new`);
      const reader = new FileReader();
      reader.onload = async e => {
        const document = JSON.parse(reader.result as string);
        const channel = new BroadcastChannel("bitbloq-documents");
        channel.onmessage = event => {
          if (event.data.command === "open-document-ready") {
            channel.postMessage({ document, command: "open-document" });
            channel.close();
          }
        };
      };
      reader.readAsText(file);
      if (openFile.current) {
        openFile.current.value = "";
      }
    }
  };

  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
  } else if (loading || !documentsData.documentsAndFolders) {
    return (
      <Container>
        <AppHeader>
          <UserSession />
        </AppHeader>
        <Content>
          <Loading />
        </Content>
        <AppFooter />
      </Container>
    );
  }

  const {
    result: docsAndFols,
    parentsPath,
    nFolders
  } = documentsData.documentsAndFolders;

  const breadParents = parentsPath.map(item => ({
    route: `/app/folder/${item.id}`,
    text: item.name,
    type: "folder"
  }));

  return (
    <Container>
      <AppHeader>
        <UserSession cloudClick={() => setCloudModalOpen(true)} />
      </AppHeader>
      <Content>
        <Header>
          {currentLocation.id === (userData && userData.rootFolder) ? (
            <h1>Mis documentos</h1>
          ) : (
            <Breadcrumbs links={breadParents} />
          )}
        </Header>
        <Rule />
        <DocumentListHeader>
          {(docsAndFols.length > 0 || searchQuery) && (
            <FilterOptions
              onOrderChange={onOrderChange}
              searchText={searchText}
              onChange={(value: string) => (
                setSearchText(value), onSearchInput(value)
              )}
            />
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
        {docsAndFols.length > 0 ? (
          <DndProvider backend={HTML5Backend}>
            <DocumentList
              currentPage={currentPage}
              parentsPath={parentsPath}
              pagesNumber={pagesNumber}
              refetchDocsFols={refetchDocsFols}
              docsAndFols={docsAndFols}
              currentLocation={currentLocation}
              onFolderClick={onFolderClick}
              onDocumentClick={onDocumentClick}
              selectPage={(page: number) => setCurrentPage(page)}
              nFolders={nFolders}
            />
          </DndProvider>
        ) : searchQuery ? (
          <NoDocuments>
            <h1>No hay resultados para tu búsqueda</h1>
          </NoDocuments>
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
            refetchDocsFols();
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
      <AppFooter />
      <CloudModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
      />
    </Container>
  );
};

const DocumentsWithDelete = props => <Documents {...props} />;

export default DocumentsWithDelete;

/* styled components */

const Container = styled.div`
  background-color: ${colors.gray1};
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Content = styled(Layout)`
  display: flex;
  flex: 1;
  flex-flow: column nowrap;
  width: 100%;
`;

const Header = styled.div`
  height: 80px;
  display: flex;
  align-items: center;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    flex: 1;
    font-weight: bold;
    font-size: 24px;
  }
`;

const Loading = styled(Spinner)`
  height: 100%;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -10px;
`;

const DocumentListHeader = styled.div`
  align-items: center;
  display: flex;
  margin: 20px 0 40px;
`;

const HeaderButtons = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
`;

interface INewDocumentButtonProps {
  isOpen: boolean;
}
const NewDocumentButton = styled(Button)<INewDocumentButtonProps>`
  border-radius: 4px;
  font-size: 14px;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;

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
    text-align: center;
    color: #373b44;
    margin-bottom: 20px;
  }

  p {
    width: 1179px;
    height: 22px;
    font-family: Roboto;
    font-size: 14px;
    line-height: 1.57;
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
