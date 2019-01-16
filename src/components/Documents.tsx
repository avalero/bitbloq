import * as React from 'react';
import styled from '@emotion/styled';
import {colors, Button, Select, Input, HorizontalRule} from '@bitbloq/ui';
import {navigate} from 'gatsby';
import {Query, Mutation} from 'react-apollo';
import gql from 'graphql-tag';
import {supportedDocumentTypes} from '../config';
import AppHeader from './AppHeader';
import DocumentTypeTag from './DocumentTypeTag';

const DOCUMENTS_QUERY = gql`
  query {
    documents {
      id
      type
      title
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!,
    $title: String!
  ) {
    createDocument(input: {type: $type, title: $title}) {
      id
      type
    }
  }
`;

const orderOptions = [
  {
    label: 'Orden: Más recientes',
    value: 'creation',
  },
  {
    label: 'Orden: Nombre',
    value: 'name',
  },
];

class Documents extends React.Component {
  onDocumentClick = ({id, type}) => {
    navigate(`/app/document/${id}`);
  };

  onNewDocument(createDocument, type, title) {
    createDocument({
      variables: {type, title},
      refetchQueries: [
        { query: DOCUMENTS_QUERY }
      ]
    });
  }

  onDocumentCreated = ({createDocument: {id, type}}) => {
    navigate(`/app/document/${type}/${id}`);
  };

  renderHeader() {
    return (
      <Header>
        <h1>Mis Documentos</h1>
        <div>
          <Mutation
            mutation={CREATE_DOCUMENT_MUTATION}
            onCompleted={this.onDocumentCreated}>
            {createDocument => (
              <Button
                onClick={() =>
                  this.onNewDocument(createDocument, '3d', 'Nuevo documento')
                }>
                Nuevo documento
              </Button>
            )}
          </Mutation>
        </div>
      </Header>
    );
  }

  render() {
    return (
      <Query query={DOCUMENTS_QUERY}>
        {({loading, error, data}) => {
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
                      selectConfig={{isSearchable: false}}
                    />
                  </ViewOptions>
                  <SearchInput placeholder="Buscar..." />
                </DocumentListHeader>
                <DocumentList>
                  {data.documents
                    .filter(d => supportedDocumentTypes.includes(d.type))
                    .map(document => (
                      <DocumentCard
                        key={document.id}
                        onClick={() => this.onDocumentClick(document)}>
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
    content: '';
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
