import * as React from "react";
import styled from "@emotion/styled";
import { Query, Mutation } from "react-apollo";
import { ThreeD } from "@bitbloq/3d";
import {
  colors,
  Button,
  Document,
  Icon,
  Modal,
  withTranslate
} from "@bitbloq/ui";
import gql from "graphql-tag";

const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      title
      content
      description
    }
  }
`;

const FINISH_SUBMISSION_MUTATITON = gql`
  mutation FinishSubmission($content: String!) {
    finishSubmission(content: $content) {
      id
    }
  }
`;

class State {
  readonly isSubmissionSuccessOpen: boolean = false;
}

class ThreeDExercise extends React.Component<any, State> {
  readonly state = new State();
  private content: any;

  onFinishSubmission = () => {
    this.setState({ isSubmissionSuccessOpen: true });
  };

  renderInfoTab() {
    const { t, exercise } = this.props;
    const { id, title, content, description } = exercise;

    return (
      <Document.Tab
        key="info"
        icon={<Icon name="info" />}
        label={t("tab-project-info")}
      >
        <InfoContainer>
          <InfoPanel>
            <InfoHeader>Información del ejercicio</InfoHeader>
            <InfoContent>
              <ExerciseImage />
              <ExerciseInfo>
                <h2>{title}</h2>
                <p>{description}</p>
              </ExerciseInfo>
            </InfoContent>
          </InfoPanel>
        </InfoContainer>
      </Document.Tab>
    );
  }

  render() {
    const { isSubmissionSuccessOpen } = this.state;
    const { exercise } = this.props;
    const { id, title } = exercise;
    let content = [];
    try {
      content = JSON.parse(exercise.content);
    } catch (e) {
      console.warn("Error parsing document content", e);
    }

    return (
      <>
        <Mutation
          mutation={FINISH_SUBMISSION_MUTATITON}
          onCompleted={this.onFinishSubmission}
        >
          {finishSubmission => (
            <ThreeD
              initialContent={content}
              initialTab={1}
              onContentChange={content => (this.content = content)}
              title={title}
              headerButtons={[{ id: "submit", icon: "airplane" }]}
              onHeaderButtonClick={buttonId => {
                switch (buttonId) {
                  case "submit":
                    finishSubmission({
                      variables: {
                        content: JSON.stringify(this.content || [])
                      }
                    });
                    return;
                }
              }}
            >
              {mainTab => [mainTab, this.renderInfoTab()]}
            </ThreeD>
          )}
        </Mutation>
        <Modal
          isOpen={isSubmissionSuccessOpen}
          title="Entregar ejercicio"
          onClose={() => this.setState({ isSubmissionSuccessOpen: false })}
        >
          <ModalContent>
            <p>Ejercicio entregado con exito</p>
            <ModalButtons>
              <ModalButton
                onClick={() =>
                  this.setState({ isSubmissionSuccessOpen: false })
                }
              >
                Aceptar
              </ModalButton>
            </ModalButtons>
          </ModalContent>
        </Modal>
      </>
    );
  }
}

const ThreeDExerciseWithData = props => (
  <Query query={EXERCISE_QUERY} variables={{ id: props.id }}>
    {({ loading, error, data }) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const { exercise } = data;
      return <ThreeDExercise {...props} exercise={exercise} />;
    }}
  </Query>
);

export default withTranslate(ThreeDExerciseWithData);

/* styled components */

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const InfoPanel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-width: 900px;
`;

const InfoHeader = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const InfoContent = styled.div`
  display: flex;
  padding: 30px;
`;

const ExerciseImage = styled.div`
  background-color: ${colors.gray2};
  margin-right: 30px;
  height: 250px;
  flex: 1;
`;

const ExerciseInfo = styled.div`
  flex: 1;

  h2 {
    font-size: 24px;
    margin-bottom: 20px;
  }

  p {
    font-size: 12px;
    line-height: 22px;
  }
`;

const ModalContent = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 30px;
  }
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: center;
`;

const ModalButton = styled(Button)`
  height: 50px;
  width: 170px;
  margin-right: 20px;
`;
