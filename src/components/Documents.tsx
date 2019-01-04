import * as React from 'react';
import styled from '@emotion/styled';
import {colors, Button, Select, Input, HorizontalRule} from '@bitbloq/ui';
import {navigate} from 'gatsby';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';
import AppHeader from './AppHeader';

const DOCUMENTS_QUERY = gql`
  query {
    documents {
      id
      type
      tittle
    }
  }
`;

const orderOptions = [
  {
    label: 'Orden: Más recientes',
    value: 'creation'
  },
  { 
    label: 'Orden: Nombre',
    value: 'name'
  }
];

class Documents extends React.Component {
  onDocumentClick = ({id, type}) => {
    navigate(`/app/${type}/${id}`);
  };

  renderHeader() {
    return (
      <Header>
        <h1>Mis Documentos</h1>
        <div>
          <Button>Nuevo documento</Button>
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
                    <OrderSelect options={orderOptions} />
                  </ViewOptions>
                  <SearchInput placeholder="Buscar..." />
                </DocumentListHeader>
                <DocumentList>
                  {data.documents.map(document => (
                    <DocumentCard
                      key={document.id}
                      onClick={() => this.onDocumentClick(document)}>
                      {document.tittle}
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
`

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

  & > *:first-child {
    grid-row: 1 / 1;
    grid-column: 1 / 1;
  }
`;

const DocumentCard = styled.div`
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  cursor: pointer;
  background-color: white;
`;
