import * as React from "react";
import { Query, Mutation, Subscription } from "react-apollo";
import {
  colors,
  Button,
  HorizontalRule,
  Icon,
  Input,
  Spinner,
  Modal
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import { Link, navigate } from "gatsby";
import gql from "graphql-tag";
import AppHeader from "./AppHeader";
import DocumentTypeTag from "./DocumentTypeTag";
import ExercisePanel from "./ExercisePanel";
import { sortByCreatedAt } from "../util";

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      image
      exercises {
        id
        code
        title
        acceptSubmissions
        createdAt
        submissions {
          id
          studentNick
          finished
          finishedAt
          type
        }
      }
    }
  }
`;

const CREATE_EXERCISE_MUTATION = gql`
  mutation CreateExercise($documentId: ObjectID!, $title: String!) {
    createExercise(input: { document: $documentId, title: $title }) {
      id
    }
  }
`;

const DELETE_SUBMISSION_MUTATION = gql`
  mutation DeleteSubmission($id: ObjectID!) {
    deleteSubmission(submissionID: $id) {
      id
    }
  }
`;

const SUBMISSION_UPDATED_SUBSCRIPTION = gql`
  subscription OnSubmisisonUpdated($exercise: ObjectID!) {
    submissionUpdated(exercise: $exercise) {
      id
    }
  }
`;

class DocumentState {
  readonly isCreateExerciseOpen: boolean = false;
  readonly newExerciseTitle: string = "";
}

class Document extends React.Component<any, DocumentState> {
  readonly state = new DocumentState();
  newExerciseTitleInput = React.createRef<HTMLInputElement>();

  componentDidUpdate(prevProps, prevState) {
    const { isCreateExerciseOpen } = this.state;
    if (isCreateExerciseOpen && !prevState.isCreateExerciseOpen) {
      const input = this.newExerciseTitleInput.current;
      if (input) {
        input.focus();
      }
    }
  }

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
        <DocumentImage src={document.image} />
        <div>
          <DocumentTypeTag document={document} />
          <DocumentTitle>{document.title}</DocumentTitle>
          <DocumentDescription>{document.description}</DocumentDescription>
          <Buttons>
            <Button
              tertiary
              onClick={() =>
                window.open(`/app/document/${document.type}/${document.id}`)
              }
            >
              Editar documento
            </Button>
            <Button
              onClick={() =>
                this.setState({
                  isCreateExerciseOpen: true,
                  newExerciseTitle: ""
                })
              }
            >
              <Icon name="plus" />
              Crear ejercicio
            </Button>
          </Buttons>
        </div>
      </DocumentInfo>
    );
  }

  renderExercise = (exercise, refetch) => {
    const { id: documentId } = this.props;

    return (
      <React.Fragment key={exercise.id}>
        <Mutation mutation={DELETE_SUBMISSION_MUTATION}>
          {deleteSubmission => (
            <ExercisePanel
              exercise={exercise}
              onCancelSubmission={submission =>
                deleteSubmission({
                  variables: { id: submission.id },
                  refetchQueries: [
                    { query: DOCUMENT_QUERY, variables: { id: documentId } }
                  ]
                })
              }
              onCheckSubmission={({ type, id }) =>
                window.open(`/app/submission/${type}/${id}`)
              }
            />
          )}
        </Mutation>
        <Subscription
          subscription={SUBMISSION_UPDATED_SUBSCRIPTION}
          variables={{ exercise: exercise.id }}
          shouldResubscribe={true}
          onSubscriptionData={() => {
            refetch();
          }}
        />
      </React.Fragment>
    );
  }

  renderExercises(exercises, refetch) {
    return (
      <Exercises>
        {exercises && exercises.length > 0 && <h2>Ejercicios creados</h2>}
        {exercises
          .slice()
          .sort(sortByCreatedAt)
          .map(exercise => this.renderExercise(exercise, refetch))
        }
      </Exercises>
    );
  }

  renderCreateExerciseModal(document) {
    const { id: documentId } = this.props;
    const { isCreateExerciseOpen, newExerciseTitle } = this.state;

    return (
      <Modal
        isOpen={isCreateExerciseOpen}
        title="Crear ejercicio"
        onClose={() => this.setState({ isCreateExerciseOpen: false })}
      >
        <ModalContent>
          <p>Introduce un nombre para el nuevo ejercicio</p>
          <form>
            <Input
              value={newExerciseTitle}
              ref={this.newExerciseTitleInput}
              onChange={e =>
                this.setState({ newExerciseTitle: e.target.value })
              }
            />
            <ModalButtons>
              <Mutation mutation={CREATE_EXERCISE_MUTATION}>
                {createExercise => (
                  <ModalButton
                    onClick={() => {
                      createExercise({
                        variables: {
                          documentId,
                          title: newExerciseTitle
                        },
                        refetchQueries: [
                          {
                            query: DOCUMENT_QUERY,
                            variables: { id: documentId }
                          }
                        ]
                      });
                      this.setState({ isCreateExerciseOpen: false });
                    }}
                  >
                    Crear
                  </ModalButton>
                )}
              </Mutation>
              <ModalButton
                tertiary
                onClick={() => this.setState({ isCreateExerciseOpen: false })}
              >
                Cancel
              </ModalButton>
            </ModalButtons>
          </form>
        </ModalContent>
      </Modal>
    );
  }

  render() {
    const { id } = this.props;

    return (
      <Container>
        <AppHeader />
        <Query query={DOCUMENT_QUERY} variables={{ id }}>
          {({ loading, error, data, refetch }) => {
            if (loading) return <Loading />;
            if (error) return <p>Error :(</p>;

            const { document } = data;

            return (
              <Content>
                {this.renderHeader(document)}
                <Rule />
                {this.renderDocumentInfo(document)}
                {this.renderExercises(document.exercises, refetch)}
              </Content>
            );
          }}
        </Query>
        {this.renderCreateExerciseModal(document)}
      </Container>
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

const Loading = styled(Spinner)`
  flex: 1;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px -20px;
`;

const DocumentInfo = styled.div`
  margin-top: 40px;
  display: flex;
`;

interface DocumentImageProps {
  src: string;
}
const DocumentImage = styled.div<DocumentImageProps>`
  width: 300px;
  height: 240px;
  background-color: ${colors.gray2};
  border-radius: 4px;
  margin-right: 40px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const DocumentTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  margin: 24px 0px;
`;

const DocumentDescription = styled.div`
  font-size: 16px;
  margin-bottom: 25px;
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

const ModalContent = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  margin-top: 50px;
`;

const ModalButton = styled(Button)`
  height: 50px;
  width: 170px;
  margin-right: 20px;
`;
