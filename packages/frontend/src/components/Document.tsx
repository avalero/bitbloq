import * as React from "react";
import { Query, Mutation, Subscription } from "react-apollo";
import {
  colors,
  Button,
  HorizontalRule,
  Icon,
  Input,
  Spinner,
  Modal,
  Translate
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import { Link, navigate } from "gatsby";
import gql from "graphql-tag";
import AppHeader from "./AppHeader";
import DocumentTypeTag from "./DocumentTypeTag";
import ExercisePanel from "./ExercisePanel";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { sortByCreatedAt } from "../util";
import { UserDataContext } from "../lib/useUserData";
import { DOCUMENT_UPDATED_SUBSCRIPTION } from "../apollo/queries";
import Breadcrumbs from "./Breadcrumbs";

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      image
      folder
      parentsPath {
        id
        name
      }
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

const CHANGE_SUBMISSIONS_STATE_MUTATION = gql`
  mutation ChangeSubmissionsState($id: ObjectID!, $subState: Boolean!) {
    changeSubmissionsState(id: $id, subState: $subState) {
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
    let breadParents = [];
    for (let item of document.parentsPath) {
      breadParents = [
        ...breadParents,
        ...[
          { route: `/app/folder/${item.id}`, text: item.name, type: "folder" }
        ]
      ];
    }
    return (
      <Header>
        <Breadcrumbs
          links={[
            ...breadParents,
            { route: "", text: document.title, type: "document" }
          ]}
        />
      </Header>
    );
  }

  renderDocumentInfo(document) {
    return (
      <Translate>
        {t => (
          <DocumentInfo>
            <DocumentHeader>
              <DocumentHeaderText>
                <Icon name="document" />
                {t("document-header-info")}
              </DocumentHeaderText>
              <DocumentHeaderButton
                onClick={() =>
                  window.open(
                    `/app/document/${document.folder}/${document.type}/${document.id}`
                  )
                }
              >
                {t("document-header-button")}
              </DocumentHeaderButton>
            </DocumentHeader>
            <DocumentBody>
              <DocumentImage src={document.image} />
              <DocumentBodyInfo>
                <DocumentTypeTag document={document} />
                <DocumentTitle>
                  {document.title || t("document-body-title")}
                </DocumentTitle>
                <DocumentDescription>
                  {document.description || t("document-body-description")}
                </DocumentDescription>
              </DocumentBodyInfo>
            </DocumentBody>
          </DocumentInfo>
        )}
      </Translate>
    );
  }

  renderDocumentTeacherInfo(document) {
    return (
      <Translate>
        {t => (
          <DocumentInfo className="teacher">
            <DocumentHeader>
              <DocumentHeaderText>
                <Icon name="document" />
                {t("document-header-info")}
              </DocumentHeaderText>
              <DocumentHeaderButton
                onClick={() =>
                  window.open(
                    `/app/document/${document.folder}/${document.type}/${document.id}`
                  )
                }
              >
                {t("document-header-button")}
              </DocumentHeaderButton>
            </DocumentHeader>
            <DocumentBody className="teacher">
              <DocumentImage src={document.image} className="teacher" />
              <DocumentBodyInfo className="teacher">
                <DocumentTypeTag document={document} />
                <DocumentTitle>
                  {document.title || t("document-body-title")}
                </DocumentTitle>
                <DocumentDescription>
                  {document.description || t("document-body-description")}
                </DocumentDescription>
              </DocumentBodyInfo>
            </DocumentBody>
          </DocumentInfo>
        )}
      </Translate>
    );
  }

  renderExercise = (exercise, refetch) => {
    const { id: documentId } = this.props;

    return (
      <React.Fragment key={exercise.id}>
        <Mutation mutation={DELETE_SUBMISSION_MUTATION}>
          {deleteSubmission => (
            <Mutation mutation={CHANGE_SUBMISSIONS_STATE_MUTATION}>
              {changeSubmissionsState => (
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
                  onAcceptedSubmissions={(value: boolean) => {
                    changeSubmissionsState({
                      variables: { id: exercise.id, subState: value },
                      refetchQueries: [
                        { query: DOCUMENT_QUERY, variables: { id: documentId } }
                      ]
                    });
                  }}
                />
              )}
            </Mutation>
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
  };

  renderExercises(exercises, refetch) {
    return (
      <Translate>
        {t => (
          <Exercises>
            <DocumentHeader>
              <DocumentHeaderText>
                <Icon name="airplane-document" className="exercise" />
                {t("exercises-header-info")}
              </DocumentHeaderText>
              <DocumentHeaderButton
                onClick={() =>
                  this.setState({
                    isCreateExerciseOpen: true,
                    newExerciseTitle: ""
                  })
                }
              >
                <Icon name="plus" />
                {t("exercises-header-button")}
              </DocumentHeaderButton>
            </DocumentHeader>
            {exercises && exercises.length > 0 ? (
              <ExercisesPanel>
                {exercises
                  .slice()
                  .sort(sortByCreatedAt)
                  .map(exercise => this.renderExercise(exercise, refetch))}
              </ExercisesPanel>
            ) : (
              <EmptyExercises>
                <h2>{t("exercises-empty-title")}</h2>
                <p>{t("exercises-empty-description")}</p>
                <MyButton
                  onClick={() =>
                    this.setState({
                      isCreateExerciseOpen: true,
                      newExerciseTitle: ""
                    })
                  }
                >
                  <Icon name="plus" />
                  {t("exercises-header-button")}
                </MyButton>
              </EmptyExercises>
            )}
          </Exercises>
        )}
      </Translate>
    );
  }

  renderCreateExerciseModal(document) {
    const { id: documentId } = this.props;
    const { isCreateExerciseOpen, newExerciseTitle } = this.state;

    return (
      <Translate>
        {t => (
          <Modal
            isOpen={isCreateExerciseOpen}
            title={t("exercises-modal-title")}
            onClose={() => this.setState({ isCreateExerciseOpen: false })}
          >
            <ModalContent>
              <p>{t("exercises-modal-text")}</p>
              <form>
                <Input
                  value={newExerciseTitle}
                  ref={this.newExerciseTitleInput}
                  onChange={e =>
                    this.setState({ newExerciseTitle: e.target.value })
                  }
                  placeholder={t("exercises-modal-placeholder")}
                />
                <ModalButtons>
                  <ModalButton
                    tertiary
                    onClick={() =>
                      this.setState({ isCreateExerciseOpen: false })
                    }
                  >
                    {t("general-cancel-button")}
                  </ModalButton>
                  <Mutation mutation={CREATE_EXERCISE_MUTATION}>
                    {createExercise => (
                      <ModalButton
                        onClick={() => {
                          createExercise({
                            variables: {
                              documentId,
                              title: newExerciseTitle || "Ejercicio sin título"
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
                        {t("general-create-button")}
                      </ModalButton>
                    )}
                  </Mutation>
                </ModalButtons>
              </form>
            </ModalContent>
          </Modal>
        )}
      </Translate>
    );
  }

  render() {
    const { id } = this.props;

    return (
      <UserDataContext.Consumer>
        {user => (
          <Container>
            <AppHeader />
            <Query query={DOCUMENT_QUERY} variables={{ id }}>
              {({ loading, error, data, refetch }) => {
                if (error) return <GraphQLErrorMessage apolloError={error} />;
                if (loading) return <Loading />;

                const { document } = data;

                return (
                  <>
                    <Content>
                      {this.renderHeader(document)}
                      <Rule />
                      <DocumentData>
                        {user.teacher
                          ? this.renderDocumentTeacherInfo(document)
                          : this.renderDocumentInfo(document)}
                        {user.teacher
                          ? this.renderExercises(document.exercises, refetch)
                          : ""}
                      </DocumentData>
                    </Content>
                    <Subscription
                      subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
                      shouldResubscribe={true}
                      onSubscriptionData={({ subscriptionData }) => {
                        const { data } = subscriptionData;
                        if (
                          data &&
                          data.documentUpdated &&
                          data.documentUpdated.id === id
                        ) {
                          refetch();
                        }
                      }}
                    />
                  </>
                );
              }}
            </Query>
            {this.renderCreateExerciseModal(document)}
          </Container>
        )}
      </UserDataContext.Consumer>
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
  padding: 0px 50px;
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
  margin: 0px -10px;
`;

const EmptyExercises = styled.div`
  align-items: center;
  color: #474749;
  display: flex;
  flex-flow: column nowrap;
  font-family: Roboto;
  height: calc(100% - 60px); /* 60px like header height*/
  justify-content: center;
  padding: 0 60px;
  text-align: center;

  h2 {
    font-size: 16px;
    font-weight: bold;
    line-height: 1.38;
    margin-bottom: 10px;
  }

  p {
    font-size: 14px;
    line-height: 1.57;
    margin-bottom: 20px;
  }
`;

const DocumentBody = styled.div`
  display: flex;
  padding: 40px 20px;
  width: calc(100% - 40px);

  &.teacher {
    flex-flow: column nowrap;
    padding: 20px;
  }
`;

const ExercisesPanel = styled.div`
  padding: 23px 20px;
`;

const DocumentBodyInfo = styled.div`
  color: #474749;
  flex-grow: 0;
  width: calc(100% - 375px);

  &.teacher {
    margin-top: 20px;
    width: 100%;
  }
`;

const DocumentHeader = styled.div`
  border-bottom: solid 1px #c0c3c9;
  display: flex;
  flex-flow: column wrap;
  height: 39px;
  justify-content: center;
  padding: 10px 20px;
  width: calc(100% - 40px);

  svg {
    margin-right: 10px;
  }
`;

const MyButton = styled(Button)`
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  padding: 12px 20px;

  svg {
    margin-right: 6px;
  }
`;

const DocumentHeaderButton = styled(MyButton)`
  align-self: flex-end;
`;

const DocumentHeaderText = styled.div`
  align-items: center;
  display: flex;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;

  svg.exercise {
    height: 24px;
    width: 24px;
  }
`;

const DocumentData = styled.div`
  background-color: #fff;
  border: solid 1px #c0c3c9;
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  margin-top: 23px;
  width: 100%;
`;

const DocumentInfo = styled.div`
  display: flex;
  flex-flow: column nowrap;
  width: 100%;

  &.teacher {
    border-right: solid 1px #c0c3c9;
    width: 34%;
  }
`;

interface DocumentImageProps {
  src: string;
}
const DocumentImage = styled.div<DocumentImageProps>`
  width: 360px;
  height: 215px;
  background-color: ${colors.gray2};
  border-radius: 4px;
  margin-right: 20px;
  background-image: url(${(props: DocumentImageProps) => props.src});
  background-size: cover;
  background-position: center;
  flex-shrink: 0;

  &.teacher {
    margin: 0;
    width: 100%;
  }
`;

const DocumentTitle = styled.div`
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;
  margin: 20px 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
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
  width: 66%;
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
  justify-content: space-between;
  margin-top: 50px;
`;

const ModalButton = styled(Button)`
  height: 40px;
  padding: 0 20px;
`;
