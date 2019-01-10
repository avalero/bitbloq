import * as React from 'react';
import {Query, Mutation} from 'react-apollo';
import {colors, Button, HorizontalRule} from '@bitbloq/ui';
import styled from '@emotion/styled';
import {Link, navigate} from 'gatsby';
import gql from 'graphql-tag';
import AppHeader from './AppHeader';
import DocumentTypeTag from './DocumentTypeTag';

const DOCUMENT_QUERY = gql`
  query Document($id: String!) {
    document: documentByID(id: $id) {
      id
      type
      title
      description
    }
  }
`;

class Document extends React.Component {
  renderHeader(document) {
    return (
      <Header>
        <Link to="/app">Mis documentos &gt;</Link>
        {document.title}
      </Header>
    );
  }

  renderDocumentInfo(document) {
    return (
      <DocumentInfo>
        <DocumentImage />
        <div>
          <DocumentTypeTag document={document} />
          <DocumentTitle>{document.title}</DocumentTitle>
          <DocumentDescription>{document.description}</DocumentDescription>
          <Button
            onClick={() =>
              navigate(`/app/edit/${document.type}/${document.id}`)
            }>
            Editar documento
          </Button>
        </div>
      </DocumentInfo>
    );
  }

  renderExercises(document) {
    /* TODO */
    return <div />;
  }

  render() {
    const {id} = this.props;

    return (
      <Query query={DOCUMENT_QUERY} variables={{id}}>
        {({loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          return (
            <Container>
              <AppHeader />
              <Content>
                {this.renderHeader(data.document)}
                <Rule />
                {this.renderDocumentInfo(data.document)}
                {this.renderExercises(data.document)}
              </Content>
            </Container>
          );
        }}
      </Query>
    );
  }
}

export default Document;

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
  height: 65px;
  display: flex;
  align-items: center;
  font-size: 14px;

  a {
    font-weight: bold;
    color: inherit;
    text-decoration: none;
    margin-right: 6px;
  }
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -20px;
`;

const DocumentInfo = styled.div`
  margin-top: 40px;
  display: flex;
`;

const DocumentImage = styled.div`
  width: 300px;
  height: 240px;
  background-color: ${colors.gray2};
  border-radius: 4px;
  margin-right: 40px;
`;

const DocumentTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin: 24px 0px;
`;

const DocumentDescription = styled.div`
  font-size: 16px;
`;
