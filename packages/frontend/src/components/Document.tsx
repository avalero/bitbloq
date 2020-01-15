import * as React from "react";
import { Query, Mutation, Subscription } from "react-apollo";
import { colors, Button, DialogModal, Icon, Translate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { ApolloError } from "apollo-client";
import {
  CHANGE_SUBMISSION_STATE_MUTATION,
  CREATE_EXERCISE_MUTATION,
  DELETE_SUBMISSION_MUTATION,
  DOCUMENT_QUERY,
  DOCUMENT_UPDATED_SUBSCRIPTION,
  EXERCISE_UPDATE_MUTATION,
  EXERCISE_DELETE_MUTATION,
  SUBMISSION_UPDATED_SUBSCRIPTION,
  REMOVE_SUBMISSION_MUTATION
} from "../apollo/queries";
import { UserDataContext } from "../lib/useUserData";
import { sortByCreatedAt } from "../util";
import AppLayout from "./AppLayout";
import Breadcrumbs from "./Breadcrumbs";
import DocumentTypeTag from "./DocumentTypeTag";
import EditInputModal from "./EditInputModal";
import ExercisePanel from "./ExercisePanel";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

class DocumentState {
  public readonly isCreateExerciseOpen: boolean = false;
  public readonly isUpdateExerciseOpen: boolean = false;
  public readonly isRemoveExerciseOpen: 0 | 1 | 2 = 0; // 0 -> cerrada; 1 -> sin entregas; 2 -> con entregas
  public readonly errorName: boolean = false;
  public readonly newExerciseTitle: string = "";
  public readonly exerciseId: string = "";
  public readonly stateError: ApolloError | null = null;
}

class Document extends React.Component<any, DocumentState> {
  public readonly state = new DocumentState();
  private newExerciseTitleInput = React.createRef<HTMLInputElement>();

  public componentDidUpdate(prevProps: any, prevState: DocumentState) {
    const { isCreateExerciseOpen, isUpdateExerciseOpen } = this.state;
    if (isCreateExerciseOpen && !prevState.isCreateExerciseOpen) {
      const input = this.newExerciseTitleInput.current;
      if (input) {
        input.focus();
      }
    }
    if (isUpdateExerciseOpen && !prevState.isUpdateExerciseOpen) {
      const input = this.newExerciseTitleInput.current;
      if (input) {
        input.focus();
      }
    }
  }

  public renderHeader(document) {
    const breadParents = document.parentsPath.map(item => ({
      route: `/app/folder/${item.id}`,
      text: item.name,
      type: "folder"
    }));

    breadParents.push({ route: "", text: document.name, type: "document" });

    return <Breadcrumbs links={breadParents} title={document.name} />;
  }

  public renderDocumentInfo(document, t) {
    return (
      <DocumentInfo>
        <DocumentHeader>
          <DocumentHeaderText>
            <Icon name="document" />
            {t("document-header-info")}
          </DocumentHeaderText>
          <DocumentHeaderButton
            onClick={() =>
              window.open(
                `/app/edit-document/${document.parentFolder}/${document.type}/${document.id}`
              )
            }
          >
            {t("document-header-button")}
          </DocumentHeaderButton>
        </DocumentHeader>
        <DocumentBody>
          <DocumentImage src={document.image.image} />
          <DocumentBodyInfo>
            <DocumentTypeTag document={document} />
            <DocumentTitle>
              {document.name || t("document-body-title")}
            </DocumentTitle>
            <DocumentDescription>
              {document.description || t("document-body-description")}
            </DocumentDescription>
          </DocumentBodyInfo>
        </DocumentBody>
      </DocumentInfo>
    );
  }

  public renderDocumentTeacherInfo(document, t) {
    return (
      <DocumentInfo teacher>
        <DocumentHeader>
          <DocumentHeaderText>
            <Icon name="document" />
            {t("document-header-info")}
          </DocumentHeaderText>
          <DocumentHeaderButton
            onClick={() =>
              window.open(
                `/app/edit-document/${document.parentFolder}/${document.type}/${document.id}`
              )
            }
          >
            {t("document-header-button")}
          </DocumentHeaderButton>
        </DocumentHeader>
        <DocumentBody teacher>
          <DocumentImage src={document.image.image} teacher />
          <DocumentBodyInfo teacher>
            <DocumentTypeTag document={document} />
            <DocumentTitle>
              {document.name || t("document-body-title")}
            </DocumentTitle>
            <DocumentDescription>
              {document.description || t("document-body-description")}
            </DocumentDescription>
          </DocumentBodyInfo>
        </DocumentBody>
      </DocumentInfo>
    );
  }

  public renderExercise = (exercise, refetch) => {
    const { id: documentId } = this.props;

    return (
      <React.Fragment key={exercise.id}>
        <Mutation mutation={DELETE_SUBMISSION_MUTATION}>
          {deleteSubmission => (
            <Mutation mutation={CHANGE_SUBMISSION_STATE_MUTATION}>
              {changeSubmissionsState => (
                <Mutation mutation={REMOVE_SUBMISSION_MUTATION}>
                  {removeSubmission => (
                    <ExercisePanel
                      exercise={exercise}
                      onCancelSubmission={submission =>
                        deleteSubmission({
                          variables: { id: submission.id },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }))
                      }
                      onCheckSubmission={({ type, id }) =>
                        window.open(`/app/submission/${type}/${id}`)
                      }
                      onAcceptedSubmissions={(value: boolean) => {
                        changeSubmissionsState({
                          variables: { id: exercise.id, subState: value },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }));
                      }}
                      onChangeName={(currentName: string) => {
                        this.setState({
                          isUpdateExerciseOpen: true,
                          newExerciseTitle: currentName,
                          exerciseId: exercise.id
                        });
                      }}
                      onRemove={() => {
                        this.setState({
                          isRemoveExerciseOpen:
                            exercise.submissions.length > 0 ? 2 : 1,
                          exerciseId: exercise.id
                        });
                      }}
                      onRemoveSubmission={(submissionID: string) => {
                        removeSubmission({
                          variables: {
                            submissionID
                          },
                          refetchQueries: [
                            {
                              query: DOCUMENT_QUERY,
                              variables: { id: documentId }
                            }
                          ]
                        }).catch(e => this.setState({ stateError: e }));
                      }}
                    />
                  )}
                </Mutation>
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

  public renderExercises(exercises, refetch, t) {
    return (
      <Exercises>
        <DocumentHeader>
          <DocumentHeaderText exercise>
            <Icon name="airplane-document" />
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
    );
  }

  public renderCreateExerciseModal(document, t) {
    const { id: documentId } = this.props;
    const { errorName, isCreateExerciseOpen, newExerciseTitle } = this.state;

    return (
      <Mutation mutation={CREATE_EXERCISE_MUTATION}>
        {createExercise => (
          <EditInputModal
            value={newExerciseTitle}
            onCancel={() =>
              this.setState({ isCreateExerciseOpen: false, errorName: false })
            }
            onSave={(value: string) => {
              createExercise({
                variables: {
                  documentId,
                  name: value || "Ejercicio sin título"
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isCreateExerciseOpen: false,
                errorName: false
              });
            }}
            title={t("exercises-modal-title")}
            label={t("exercises-modal-text")}
            placeholder={t("exercises-modal-placeholder")}
            saveButton={t("general-create-button")}
          />
        )}
      </Mutation>
    );
  }

  public renderUpdateExerciseModal(t) {
    const { id: documentId } = this.props;
    const {
      errorName,
      isUpdateExerciseOpen,
      newExerciseTitle,
      exerciseId
    } = this.state;

    return (
      <Mutation mutation={EXERCISE_UPDATE_MUTATION}>
        {updateExercise => (
          <EditInputModal
            value={newExerciseTitle}
            onCancel={() =>
              this.setState({ isUpdateExerciseOpen: false, errorName: false })
            }
            onSave={(value: string) => {
              updateExercise({
                variables: {
                  id: exerciseId,
                  input: {
                    name: value || "Ejercicio sin título"
                  }
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isUpdateExerciseOpen: false,
                errorName: false
              });
            }}
            title={t("exercises-modal-update")}
            label={t("exercises-modal-text")}
            placeholder={t("exercises-modal-placeholder")}
            saveButton={t("general-change-button")}
          />
        )}
      </Mutation>
    );
  }

  public renderRemoveExerciseModal(t) {
    const { id: documentId } = this.props;
    const { isRemoveExerciseOpen, exerciseId } = this.state;

    return (
      <Mutation mutation={EXERCISE_DELETE_MUTATION}>
        {deleteExercise => (
          <DialogModal
            isOpen={isRemoveExerciseOpen !== 0}
            title={t("exercises-modal-remove")}
            text={
              isRemoveExerciseOpen === 1
                ? t("exercises-remove-nosubmission")
                : t("exercises-remove-submission")
            }
            okText={t("general-accept-button")}
            cancelText={t("general-cancel-button")}
            onOk={() => {
              deleteExercise({
                variables: {
                  id: exerciseId
                },
                refetchQueries: [
                  {
                    query: DOCUMENT_QUERY,
                    variables: { id: documentId }
                  }
                ]
              }).catch(e => this.setState({ stateError: e }));
              this.setState({
                isRemoveExerciseOpen: 0
              });
            }}
            onCancel={() => this.setState({ isRemoveExerciseOpen: 0 })}
          />
        )}
      </Mutation>
    );
  }

  public render() {
    const { id } = this.props;
    const {
      isCreateExerciseOpen,
      isUpdateExerciseOpen,
      stateError
    } = this.state;

    return (
      <UserDataContext.Consumer>
        {({ userData }) => (
          <Translate>
            {t => (
              <>
                <Query query={DOCUMENT_QUERY} variables={{ id }}>
                  {({ loading, error, data, refetch }) => {
                    if (error) {
                      return <GraphQLErrorMessage apolloError={error} />;
                    }
                    if (loading) {
                      return <AppLayout loading />;
                    }

                    if (stateError) {
                      return <GraphQLErrorMessage apolloError={stateError} />;
                    }

                    const { document } = data;

                    if (!document) {
                      return null;
                    }

                    return (
                      <AppLayout header={this.renderHeader(document)}>
                        <DocumentData>
                          {userData && userData.teacher
                            ? this.renderDocumentTeacherInfo(document, t)
                            : this.renderDocumentInfo(document, t)}
                          {userData && userData.teacher
                            ? this.renderExercises(
                                document.exercises,
                                refetch,
                                t
                              )
                            : ""}
                        </DocumentData>
                        <Subscription
                          subscription={DOCUMENT_UPDATED_SUBSCRIPTION}
                          shouldResubscribe={true}
                          onSubscriptionData={({ subscriptionData }) => {
                            const { documentUpdated } =
                              subscriptionData.data || {};
                            if (documentUpdated && documentUpdated.id === id) {
                              refetch();
                            }
                          }}
                        />
                      </AppLayout>
                    );
                  }}
                </Query>
                {isCreateExerciseOpen
                  ? this.renderCreateExerciseModal(document, t)
                  : ""}
                {isUpdateExerciseOpen ? this.renderUpdateExerciseModal(t) : ""}
                {this.renderRemoveExerciseModal(t)}
              </>
            )}
          </Translate>
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

const DocumentBody = styled.div<{ teacher?: boolean }>`
  display: flex;
  flex-flow: ${props => (props.teacher ? "column nowrap" : "row nowrap")};
  padding: ${props => (props.teacher ? "20px" : "40px 20px")};
  width: calc(100% - 40px);
`;

const ExercisesPanel = styled.div`
  padding: 23px 20px;
`;

const DocumentBodyInfo = styled.div<{ teacher?: boolean }>`
  color: #474749;
  flex-grow: 0;
  margin-top: ${props => (props.teacher ? 20 : 0)}px;
  width: ${props => (props.teacher ? "100%" : "calc(100% - 375px)")};
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

const DocumentHeaderText = styled.div<{ exercise?: boolean }>`
  align-items: center;
  display: flex;
  font-family: Roboto;
  font-size: 20px;
  font-weight: 500;

  svg {
    height: ${props => (props.exercise ? "24px" : "auto")};
    width: ${props => (props.exercise ? "24px" : "auto")};
  }
`;

const DocumentData = styled.div`
  background-color: #fff;
  border: solid 1px #c0c3c9;
  border-radius: 4px;
  display: flex;
  flex-flow: row nowrap;
  width: 100%;
`;

const DocumentInfo = styled.div<{ teacher?: boolean }>`
  border-right: ${props => (props.teacher ? "solid 1px #c0c3c9" : "none")};
  display: flex;
  flex-flow: column nowrap;
  width: ${props => (props.teacher ? 34 : 100)}%;
`;

const DocumentImage = styled.div<{ src: string; teacher?: boolean }>`
  background-color: ${colors.gray2};
  background-image: url(${props => props.src});
  background-position: center;
  background-size: cover;
  border-radius: 4px;
  flex-shrink: 0;
  height: 215px;
  margin: ${props => (props.teacher ? 0 : "0 20px 0 0")};
  width: ${props => (props.teacher ? "100%" : "360px")};
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
  height: 22px;
`;

const DocumentDescription = styled.div`
  font-size: 16px;
  overflow-wrap: break-word;
  word-wrap: break-word;
`;

const Exercises = styled.div`
  width: 66%;
`;
