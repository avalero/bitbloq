import * as React from "react";
import styled from "@emotion/styled";
import {
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
import { Query, Mutation, Subscription } from "react-apollo";
import gql from "graphql-tag";
import { documentTypes } from "../config";
import AppHeader from "./AppHeader";
import DocumentCard from "./DocumentCard";
import NewDocumentDropDown from "./NewDocumentDropDown";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { sortByCreatedAt, sortByTitle } from "../util";
import {
  DOCUMENTS_QUERY,
  CREATE_DOCUMENT_MUTATION,
  DELETE_DOCUMENT_MUTATION,
  DOCUMENT_UPDATED_SUBSCRIPTION
} from "../apollo/queries";

enum OrderType {
  Creation = "creation",
  Name = "name"
}

const orderOptions = [
  {
    label: "Orden: Más recientes",
    value: OrderType.Creation
  },
  {
    label: "Orden: Nombre",
    value: OrderType.Name
  }
];

const orderFunctions = {
  [OrderType.Creation]: sortByCreatedAt,
  [OrderType.Name]: sortByTitle
};

class DocumentsState {
  readonly order: string = OrderType.Creation;
  readonly searchText: string = "";
  readonly deleteDocumentId: string | null = "";
}

class Documents extends React.Component<any, DocumentsState> {
  readonly state = new DocumentsState();

  private openFile = React.createRef<HTMLInputElement>();

  onDocumentClick = ({ id, type }) => {
    navigate(`/app/document/${id}`);
  };

  onNewDocument(type) {
    window.open(`/app/document/${type}/new`);
  }

  onDocumentCreated = ({ createDocument: { id, type } }) => {
    navigate(`/app/document/${type}/${id}`);
  };

  onOrderChange = order => {
    this.setState({ order });
  };

  onOpenDocumentClick = () => {
    this.openFile.current.click();
  };

  onDocumentDeleteClick = (e, document) => {
    e.stopPropagation();
    this.setState({ deleteDocumentId: document.id });
  };

  onDeleteDocument = () => {
    const { deleteDocumentId } = this.state;
    const { deleteDocument } = this.props;
    deleteDocument(deleteDocumentId);
    this.setState({ deleteDocumentId: null });
  };

  onFileSelected = (file, createDocument) => {
    const reader = new FileReader();
    reader.onload = e => {
      const document = JSON.parse(reader.result as string);
      createDocument({
        variables: { ...document },
        refetchQueries: [{ query: DOCUMENTS_QUERY }]
      });
    };

    reader.readAsText(file);
  };

  renderHeader() {
    return (
      <Header>
        <h1>Mis documentos</h1>
        <div>
          <DropDown
            attachmentPosition={"top center"}
            targetPosition={"bottom center"}
          >
            {(isOpen: boolean) => (
              <NewDocumentButton isOpen={isOpen}>
                <Icon name="new-document" />
                Nuevo documento
              </NewDocumentButton>
            )}
            <NewDocumentDropDown
              onNewDocument={this.onNewDocument}
              onOpenDocument={this.onOpenDocumentClick}
            />
          </DropDown>
        </div>
      </Header>
    );
  }

  render() {
    const { order, searchText, deleteDocumentId } = this.state;
    const orderFunction = orderFunctions[order];

    return (
      <Container>
        <AppHeader />
        <Query query={DOCUMENTS_QUERY}>
          {({ loading, error, data, refetch }) => {
            if (error) return <GraphQLErrorMessage apolloError={error} />;
            if (loading) return <Loading />;

            return (
              <Content>
                {this.renderHeader()}
                <Rule />
                <DocumentListHeader>
                  <ViewOptions>
                    <OrderSelect
                      options={orderOptions}
                      onChange={this.onOrderChange}
                      selectConfig={{ isSearchable: false }}
                    />
                  </ViewOptions>
                  <SearchInput
                    value={searchText}
                    onChange={e =>
                      this.setState({ searchText: e.target.value })
                    }
                    placeholder="Buscar..."
                  />
                </DocumentListHeader>
                <DocumentList>
                  {data.documents
                    .slice()
                    .sort(orderFunction)
                    .filter(
                      d =>
                        documentTypes[d.type] && documentTypes[d.type].supported
                    )
                    .filter(
                      d =>
                        !searchText ||
                        (d.title &&
                          d.title
                            .toLowerCase()
                            .indexOf(searchText.toLowerCase()) >= 0)
                    )
                    .map((document: any) => (
                      <StyledDocumentCard
                        key={document.id}
                        document={document}
                        onClick={() => this.onDocumentClick(document)}
                      >
                        <DeleteDocument
                          onClick={e => this.onDocumentDeleteClick(e, document)}
                        >
                          <Icon name="trash" />
                        </DeleteDocument>
                      </StyledDocumentCard>
                    ))}
                </DocumentList>
                <Subscription
                  subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
                  shouldResubscribe={true}
                  onSubscriptionData={() => {
                    refetch();
                  }}
                />
              </Content>
            );
          }}
        </Query>
        <DialogModal
          isOpen={!!deleteDocumentId}
          title="Eliminar"
          text="¿Seguro que quieres eliminar este documento?"
          okText="Aceptar"
          cancelText="Cancelar"
          onOk={this.onDeleteDocument}
          onCancel={() => this.setState({ deleteDocumentId: null })}
        />
        <Mutation
          mutation={CREATE_DOCUMENT_MUTATION}
          onCompleted={this.onDocumentCreated}
        >
          {createDocument => (
            <input
              ref={this.openFile}
              type="file"
              onChange={e =>
                this.onFileSelected(e.target.files[0], createDocument)
              }
              style={{ display: "none" }}
            />
          )}
        </Mutation>
      </Container>
    );
  }
}

const DocumentsWithDelete = props => (
  <Mutation mutation={DELETE_DOCUMENT_MUTATION}>
    {mutate => (
      <Documents
        {...props}
        deleteDocument={id =>
          mutate({
            variables: { id },
            refetchQueries: [{ query: DOCUMENTS_QUERY }]
          })
        }
      />
    )}
  </Mutation>
);

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

const ViewOptions = styled.div`
  flex: 1;
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
const NewDocumentButton = styled.div<NewDocumentButtonProps>`
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  padding: 0px 20px;
  display: flex;
  align-items: center;
  height: 40px;
  cursor: pointer;
  background-color: ${props => (props.isOpen ? colors.gray2 : "white")};

  &:hover {
    background-color: ${colors.gray2};
  }

  svg {
    height: 20px;
    margin-right: 8px;
  }
`;
