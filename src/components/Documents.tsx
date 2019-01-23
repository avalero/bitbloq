import * as React from "react";
import styled from "@emotion/styled";
import { colors, Button, Select, Input, HorizontalRule } from "@bitbloq/ui";
import { navigate } from "gatsby";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { supportedDocumentTypes } from "../config";
import AppHeader from "./AppHeader";
import DocumentTypeTag from "./DocumentTypeTag";
import { sortByCreatedAt, sortByTitle } from "../util";

const DOCUMENTS_QUERY = gql`
  query {
    documents {
      id
      type
      title
      createdAt
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument($type: String!, $title: String!) {
    createDocument(input: { type: $type, title: $title }) {
      id
      type
    }
  }
`;

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
}

class Documents extends React.Component<any, DocumentsState> {
  readonly state = new DocumentsState();

  onDocumentClick = ({ id, type }) => {
    navigate(`/app/document/${id}`);
  };

  onNewDocument(createDocument, type, title) {
    createDocument({
      variables: { type, title },
      refetchQueries: [{ query: DOCUMENTS_QUERY }]
    });
  }

  onDocumentCreated = ({ createDocument: { id, type } }) => {
    navigate(`/app/document/${type}/${id}`);
  };

  onOrderChange = order => {
    this.setState({ order });
  };

  renderHeader() {
    return (
      <Header>
        <h1>Mis Documentos</h1>
        <div>
          <Mutation
            mutation={CREATE_DOCUMENT_MUTATION}
            onCompleted={this.onDocumentCreated}
          >
            {createDocument => (
              <Button
                onClick={() =>
                  this.onNewDocument(createDocument, "3d", "Nuevo documento")
                }
              >
                Nuevo documento
              </Button>
            )}
          </Mutation>
        </div>
      </Header>
    );
  }

  render() {
    const { order, searchText } = this.state;
    const orderFunction = orderFunctions[order];

    return (
      <Query query={DOCUMENTS_QUERY}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <Container>
              <AppHeader />
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
                    .filter(d => supportedDocumentTypes.includes(d.type))
                    .filter(
                      d =>
                        !searchText ||
                        (d.title &&
                          d.title.toLowerCase().indexOf(searchText) >= 0)
                    )
                    .map(document => (
                      <DocumentCard
                        key={document.id}
                        onClick={() => this.onDocumentClick(document)}
                      >
                        <DocumentImage />
                        <DocumentInfo>
                          <DocumentTypeTag small document={document} />
                          <DocumentTitle>{document.title}</DocumentTitle>
                        </DocumentInfo>
                      </DocumentCard>
                    ))}
                </DocumentList>
              </Content>
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default Documents;

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
  padding: 0px 60px;
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

const Rule = styled(HorizontalRule)`
  margin: 0px -20px;
`;

const DocumentListHeader = styled.div`
  display: flex;
  height: 115px;
  align-items: center;
`;

const ViewOptions = styled.div`
  flex: 1;
`;

const OrderSelect = styled(Select)`
  width: 200px;
`;

const SearchInput = styled(Input)`
  width: 210px;
  flex: inherit;
`;

const DocumentList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 1fr;
  grid-column-gap: 40px;
  grid-row-gap: 40px;

  &::before {
    content: "";
    width: 0px;
    padding-bottom: 100%;
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }

  & > div:first-of-type {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
`;

const DocumentCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  cursor: pointer;
  background-color: white;
  overflow: hidden;
`;

const DocumentImage = styled.div`
  flex: 1;
  background-color: ${colors.gray2};
`;

const DocumentInfo = styled.div`
  height: 80px;
  padding: 14px;
  font-weight: 500;
  box-sizing: border-box;
`;

interface DocumentTypeProps {
  color: string;
}
const DocumentType = styled.div<DocumentTypeProps>`
  border-width: 2px;
  border-style: solid;
  border-color: ${props => props.color};
  color: ${props => props.color};
  height: 24px;
  display: inline-flex;
  align-items: center;
  padding: 0px 10px;
  font-size: 12px;
  box-sizing: border-box;
`;

const DocumentTitle = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;
