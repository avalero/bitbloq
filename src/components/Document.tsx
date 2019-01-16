import * as React from 'react';
import {Query, Mutation} from 'react-apollo';
import {colors, Button, HorizontalRule, Icon} from '@bitbloq/ui';
import styled from '@emotion/styled';
import {Link, navigate} from 'gatsby';
import gql from 'graphql-tag';
import AppHeader from './AppHeader';
import DocumentTypeTag from './DocumentTypeTag';

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document: documentByID(id: $id) {
      id
      type
      title
      description
    }
    exercises: exercisesByDocument(document: $id) {
      id,
      code,
      title,
      acceptSubmissions,
      createdAt
    }
  }
`;

const CREATE_EXERCISE_MUTATION = gql`
  mutation CreateExercise($documentId: ObjectID!) {
    createExercise(input: {document: $documentId}) {
      id
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
          <Buttons>
            <Button
              tertiary
              onClick={() =>
                navigate(`/app/document/${document.type}/${document.id}`)
              }>
              Editar documento
            </Button>
            <Mutation mutation={CREATE_EXERCISE_MUTATION}>
              {createExercise => (
                <Button
                  onClick={() =>
                    createExercise({
                      variables: {documentId: document.id},
                      refetchQueries: [
                        {
                          query: DOCUMENT_QUERY,
                          variables: {id: document.id}
                        }
                      ]
                    })
                  }>
                  <Icon name="plus" />
                  Crear ejercicio
                </Button>
              )}
            </Mutation>
          </Buttons>
        </div>
      </DocumentInfo>
    );
  }

  renderExercises(exercises) {
    return (
      <Exercises>
        <h2>Ejercicios creados</h2>
        {exercises.map(exercise => (
          <Exercise key={exercise.id}>
            <ExerciseHeader>
              <ExerciseHeaderLeft>
                <ExerciseTitle>{exercise.title}</ExerciseTitle>
              </ExerciseHeaderLeft>
              <ExerciseHeaderRight>
                {exercise.code}
              </ExerciseHeaderRight>
            </ExerciseHeader>
          </Exercise>
        ))}
      </Exercises>
    );
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
                {this.renderExercises(data.exercises)}
              </Content>
            </Container>
          );
        }}
      </Query>
    );
  }
}

const withCreateExercise = Component => props => (
  <Mutation mutation={CREATE_EXERCISE_MUTATION}>
    {mutate => <Component createExercise={mutate} {...props} />}
  </Mutation>
);

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

const Buttons = styled.div`
  display: flex;
  & > * {
    margin-right: 10px;
    svg {
      width: 11px;
      height: 11px;
      margin-right: 6px;
    }
  }
`;

const DocumentButton = styled.div`
  margin-right: 10px;
  color: white;
`;

const Exercises = styled.div`
  margin-top: 50px;
  h2 {
    font-size: 16px;
    font-weight: normal;
    margin-bottom: 16px;
  }
`;

const Exercise = styled.div`
  border: 1px solid;
  border-radius: 4px;
`;

const ExerciseHeader = styled.div`
  display: flex;
  padding: 16px 20px;
`;

const ExerciseHeaderLeft = styled.div`
  flex: 1;
`;

const ExerciseHeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const ExerciseTitle = styled.div`
  font-size: 20px;
`;
