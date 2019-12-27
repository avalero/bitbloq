import React, { FC, useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import styled from "@emotion/styled";
import { Button, Icon } from "@bitbloq/ui";
import Router from "next/router";
import { Subscription } from "react-apollo";
import debounce from "lodash/debounce";
import { ApolloError } from "apollo-client";
import { IFolder, IResult as IDocsAndFols } from "../../../api/src/api-types";
import {
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  CREATE_FOLDER_MUTATION,
  DOCS_FOLDERS_PAGE_QUERY
} from "../apollo/queries";
import useUserData from "../lib/useUserData";
import { OrderType } from "../types";
import AppLayout from "./AppLayout";
import Breadcrumbs, { IBreadcrumbLink } from "./Breadcrumbs";
import DocumentList from "./DocumentList";
import EditInputModal from "./EditInputModal";
import FilterOptions from "./FilterOptions";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import NewDocumentButton from "./NewDocumentButton";
import NewExerciseButton from "./NewExerciseButton";

const Documents: FC<{ id?: string }> = ({ id }) => {
  const { userData } = useUserData();
  const client = useApolloClient();

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
  const [breadcrumbsLinks, setBreadcrumbsLinks] = useState<IBreadcrumbLink[]>(
    []
  );
  const [docsAndFols, setDocsAndFols] = useState<IDocsAndFols[]>([]);
  const [parentsPath, setParentsPath] = useState<IFolder[]>([]);
  const [nFolders, setNFolders] = useState<number>(0);

  const openFile = React.createRef<HTMLInputElement>();

  const [createFolder] = useMutation(CREATE_FOLDER_MUTATION);
  const [error, setError] = useState<ApolloError>();

  const {
    data: resultData,
    loading,
    error: errorQuery,
    refetch: refetchDocsFols
  } = useQuery(DOCS_FOLDERS_PAGE_QUERY, {
    variables: {
      currentLocation: currentLocation.id,
      currentPage,
      order,
      searchTitle: searchQuery,
      itemsPerPage: 8
    },
    fetchPolicy: "cache-and-network"
  });

  useEffect(() => {
    if (!loading && !errorQuery) {
      const {
        nFolders: foldersNumber,
        pagesNumber: numberOfPages,
        parentsPath: pathOfParent,
        result: docsAndFolsItems
      } = resultData.documentsAndFolders;
      setBreadcrumbsLinks(
        pathOfParent.map(item => ({
          route: `/app/folder/${item.id}`,
          text: item.name,
          type: "folder"
        }))
      );
      setDocsAndFols(docsAndFolsItems || []);
      setNFolders(foldersNumber);
      setPagesNumber(numberOfPages);
      setParentsPath(pathOfParent);
      setError(undefined);
    }
    if (errorQuery) {
      setError(errorQuery);
    }
  }, [loading, errorQuery]);

  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);

  const onFolderClick = async ({ id: folderId }) => {
    Router.push(`/app/folder/${folderId}`);
  };

  useEffect(() => {
    if (currentPage > pagesNumber && pagesNumber > 0) {
      setCurrentPage(pagesNumber);
    }
  }, [pagesNumber]);

  const onDocumentClick = ({ id: documentId }) => {
    Router.push(`/app/document/${documentId}`);
  };

  const onCreateFolder = async (folderName: string) => {
    await createFolder({
      variables: {
        input: { name: folderName, parentFolder: currentLocation.id }
      }
    }).catch(e => {
      setError(e);
    });
    refetchDocsFols();
    setFolderTitleModal(false);
  };

  const onOrderChange = (newOrder: OrderType) => {
    setOrder(newOrder);
    refetchDocsFols();
  };

  const onOpenExercise = async (exerciseCode: string) => {
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

  const onFileSelected = (file: File) => {
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
  }

  return (
    <>
      {loading && <AppLayoutLoading loading />}
      <AppLayout
        header={
          currentLocation.id === (userData && userData.rootFolder) ? (
            "Mis documentos"
          ) : (
            <Breadcrumbs links={breadcrumbsLinks} />
          )
        }
      >
        <DocumentListHeader>
          {(docsAndFols.length > 0 || searchQuery) && (
            <FilterOptions
              onOrderChange={onOrderChange}
              searchText={searchText}
              selectValue={order}
              onChange={(value: string) => {
                setSearchText(value);
                onSearchInput(value);
              }}
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
            <NewDocumentButton arrowOffset={10} />
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
              order={order}
              searchText={searchText}
              onFolderClick={onFolderClick}
              onDocumentClick={onDocumentClick}
              selectPage={(page: number) => {
                setCurrentPage(page);
                refetchDocsFols();
              }}
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
        <input
          ref={openFile}
          type="file"
          onChange={e => onFileSelected(e.target.files![0])}
          style={{ display: "none" }}
        />
        {folderTitleModal && (
          <EditInputModal
            title={"Carpeta sin título"}
            onCancel={() => setFolderTitleModal(false)}
            onSave={onCreateFolder}
            modalTitle="Crear carpeta"
            modalText="Nombre de la carpeta"
            placeholder="Carpeta sin título"
            saveButton="Crear"
          />
        )}
      </AppLayout>
    </>
  );
};

const DocumentsWithDelete = props => <Documents {...props} />;

export default DocumentsWithDelete;

/* styled components */

const AppLayoutLoading = styled(AppLayout)`
  position: absolute;
  width: 100%;
  z-index: 100;
`;

const DocumentListHeader = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 40px;
`;

const HeaderButtons = styled.div`
  display: flex;
  flex: 1;
  justify-content: flex-end;
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
