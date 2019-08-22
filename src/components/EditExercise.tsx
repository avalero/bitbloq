import React, { useState, useRef } from "react";
import { useQuery, useMutation } from "react-apollo-hooks";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import {
  colors,
  Button,
  Document,
  Spinner,
  Modal,
  Icon,
  withTranslate
} from "@bitbloq/ui";
import {
  STUDENT_SUBMISSION_QUERY,
  UPDATE_SUBMISSION_MUTATION,
  FINISH_SUBMISSION_MUTATION
} from "../apollo/queries";
import ExerciseInfo from "./ExerciseInfo";
import { documentTypes } from "../config";

const EditExercise = ({ type, id, t }) => {
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);

  const { data, loading, error } = useQuery(STUDENT_SUBMISSION_QUERY, {
    variables: { exerciseId: id }
  });
  const updateSubmission = useMutation(UPDATE_SUBMISSION_MUTATION);
  const finishSubmission = useMutation(FINISH_SUBMISSION_MUTATION);

  const currentContent = useRef([]);

  if (loading) return <Loading />;
  if (error) return <p>Error :)</p>;

  const { exercise, submission } = data;
  const { title } = exercise;

  let content = [];
  try {
    content = JSON.parse(submission.content);
  } catch (e) {
    console.warn("Error parsing document content", e);
  }

  currentContent.current = content;

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        content={content}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        title={title}
        onContentChange={content => {
          updateSubmission({
            variables: { content: JSON.stringify(content || []) }
          });
          currentContent.current = content;
        }}
        getTabs={mainTab => [
          mainTab,
          <Document.Tab
            key="info"
            icon={<Icon name="info" />}
            label={t("tab-project-info")}
          >
            <ExerciseInfo
              exercise={exercise}
              onGotoExercise={() => setTabIndex(0)}
            />
          </Document.Tab>
        ]}
        headerButtons={[{ id: "submit", icon: "airplane" }]}
        onHeaderButtonClick={async buttonId => {
          switch (buttonId) {
            case "submit":
              await finishSubmission({
                variables: {
                  content: JSON.stringify(currentContent.current || [])
                }
              });
              setIsSubmissionSuccessOpen(true);
              return;
          }
        }}
      />
      <Modal
        isOpen={isSubmissionSuccessOpen}
        title="Entregar ejercicio"
        onClose={() => setIsSubmissionSuccessOpen(false)}
      >
        <ModalContent>
          <p>Ejercicio entregado con exito</p>
          <ModalButtons>
            <ModalButton onClick={() => setIsSubmissionSuccessOpen(false)}>
              Aceptar
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
    </>
  );
};

export default withTranslate(EditExercise);

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
