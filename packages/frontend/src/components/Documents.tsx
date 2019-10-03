import React, { FC, useState, useEffect, useCallback } from "react";
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
import gql from "graphql-tag";
import { documentTypes } from "../config";
import AppHeader from "./AppHeader";
import DocumentCard from "./DocumentCard";
import NewDocumentDropDown from "./NewDocumentDropDown";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import {
  sortByCreatedAt,
  sortByTitleAZ,
  sortByTitleZA,
  sortByUpdatedAt
} from "../util";
import {
  DOCUMENTS_QUERY,
  CREATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_BY_CODE_QUERY,
  ME_QUERY
} from "../apollo/queries";

import NewExerciseButton from "./NewExerciseButton";

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
  const { data, loading: loadingMe } = useQuery(ME_QUERY);
  const client = useApolloClient();

  const [order, setOrder] = useState(OrderType.Creation);
  const [searchText, setSearchText] = useState("");
  const [deleteDocumentId, setDeleteDocumentId] = useState("");

  let openFile = React.createRef<HTMLInputElement>();

  const [deleteDocument] = useMutation(DELETE_DOCUMENT_MUTATION);
  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const { data: dataDocs, loading, error, refetch } = useQuery(DOCUMENTS_QUERY);

  const [exerciseCode, setExerciseCode] = useState("");
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);
  const { data: dataEx, loading: loadEx, error: errorEx } = useQuery(
    EXERCISE_BY_CODE_QUERY
  );

  const onDocumentClick = ({ id, type }) => {
    navigate(`/app/document/${id}`);
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

  const onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    setDeleteDocumentId(document.id);
  };

  const onDeleteDocument = async () => {
    await deleteDocument({ variables: { id: deleteDocumentId } });
    setDeleteDocumentId(null);
    refetch();
  };

  const onOpenExercise = async exerciseCode => {
    console.log(exerciseCode);
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
        setExerciseCode("");
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
        refetchQueries: [{ query: DOCUMENTS_QUERY }]
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

  const orderFunction = orderFunctions[order];

  if (error) return <GraphQLErrorMessage apolloError={error} />;
  if (loading)
    return (
      <Container>
        <Loading />
      </Container>
    );

  return (
    <Container>
      <AppHeader />
      <Content>
        <Header>
          <h1>Mis documentos</h1>
        </Header>
        <Rule />
        {dataDocs.documents.length > 0 && (
          <DocumentListHeader>
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
            <HeaderButtons>
              <NewFolderButton tertiary>
                {" "}
                <Icon name="airplane-document" /> Nueva carpeta{" "}
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
                />
              </DropDown>
            </HeaderButtons>
          </DocumentListHeader>
        )}

        {dataDocs.documents.length > 0 ? (
          searchText ? (
            filterDocuments(dataDocs.documents).length > 0 ? (
              <DocumentList>
                {filterDocuments(dataDocs.documents).map((document: any) => (
                  <StyledDocumentCard
                    key={document.id}
                    document={document}
                    onClick={() => onDocumentClick(document)}
                  >
                    <DeleteDocument
                      onClick={e => onDocumentDeleteClick(e, document)}
                    >
                      <Icon name="trash" />
                    </DeleteDocument>
                  </StyledDocumentCard>
                ))}
              </DocumentList>
            ) : (
              <NoDocuments>
                <h1>No hay resultados para tu búsqueda</h1>
              </NoDocuments>
            )
          ) : (
            <DocumentList>
              {filterDocuments(dataDocs.documents).map((document: any) => (
                <StyledDocumentCard
                  key={document.id}
                  document={document}
                  onClick={() => onDocumentClick(document)}
                >
                  <DeleteDocument
                    onClick={e => onDocumentDeleteClick(e, document)}
                  >
                    <Icon name="trash" />
                  </DeleteDocument>
                </StyledDocumentCard>
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
            refetch();
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
      <input
        ref={openFile}
        type="file"
        onChange={e => onFileSelected(e.target.files[0])}
        style={{ display: "none" }}
      />
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
  /* flex: 1; */
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

const DeleteDocument = styled.div`
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
`;

const StyledDocumentCard = styled(DocumentCard)`
  &:hover {
    ${DeleteDocument} {
      display: flex;
    }
  }
`;

interface NewDocumentButtonProps {
  isOpen: boolean;
}
const NewDocumentButton = styled(Button)<NewDocumentButtonProps>`
  /* border: 1px solid ${colors.gray3}; */
  border-radius: 4px;
  font-size: 14px;
  /* font-weight: 500; */
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  /* background-color: ${props => (props.isOpen ? colors.gray2 : "white")}; */

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
