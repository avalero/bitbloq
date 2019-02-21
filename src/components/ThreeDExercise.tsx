import * as React from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Query, Mutation } from "react-apollo";
import { ThreeD } from "@bitbloq/3d";
import {
  colors,
  Button,
  Document,
  Icon,
  Modal,
  Spinner,
  withTranslate
} from "@bitbloq/ui";
import gql from "graphql-tag";
import BrowserVersionWarning from "./BrowserVersionWarning";
import ExerciseInfo from "./ExerciseInfo";
import { getChromeVersion } from "../util";

const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exercise(id: $id) {
      id
      type
      title
      content
      description
      image
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
  readonly tabIndex: number = 1;
}

class ThreeDExercise extends React.Component<any, State> {
  readonly state = new State();
  private content: any;

  onFinishSubmission = () => {
    this.setState({ isSubmissionSuccessOpen: true });
  };

  render() {
    const { isSubmissionSuccessOpen, tabIndex } = this.state;
    const { t, exercise } = this.props;
    const { id, title } = exercise;
    let content = [];
    try {
      content = JSON.parse(exercise.content);
    } catch (e) {
      console.warn("Error parsing document content", e);
    }

    if (getChromeVersion() < 69) {
      return <BrowserVersionWarning version={69} color={colors.brandBlue} />;
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
              tabIndex={tabIndex}
              onTabChange={tabIndex => this.setState({ tabIndex })}
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
              {mainTab => [
                mainTab,
                <Document.Tab
                  key="info"
                  icon={<Icon name="info" />}
                  label={t("tab-project-info")}
                >
                  <ExerciseInfo
                    exercise={exercise}
                    onGotoExercise={() => this.setState({ tabIndex: 0 })}
                  />
                </Document.Tab>
              ]}
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
      if (loading) return <Loading />;
      if (error) return <p>Error :(</p>;

      const { exercise } = data;
      return <ThreeDExercise {...props} exercise={exercise} />;
    }}
  </Query>
);

export default withTranslate(ThreeDExerciseWithData);

/* styled components */

const Loading = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
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
