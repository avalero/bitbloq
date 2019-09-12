import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import debounce from "lodash.debounce";
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
  EXERCISE_QUERY,
  STUDENT_SUBMISSION_QUERY,
  UPDATE_SUBMISSION_MUTATION,
  FINISH_SUBMISSION_MUTATION
} from "../apollo/queries";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseLoginModal from "./ExerciseLoginModal";
import { documentTypes } from "../config";

const EditExercise = ({ type, id, t }) => {
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);

  const [loginVisible, setLoginVisible] = useState(true);

  const { data, loading, error } = useQuery(EXERCISE_QUERY, {
    variables: { id }
  });
  const [updateSubmission] = useMutation(UPDATE_SUBMISSION_MUTATION);
  const [finishSubmission] = useMutation(FINISH_SUBMISSION_MUTATION);

  const [submissionContent, setSubmissionContent] = useState([]);
  const [submissionId, setSubmissionId] = useState("");
  const currentContent = useRef([]);

  const client = useApolloClient();

  useEffect(() => {
    if (!loginVisible) {
      loadSubmission();
    }
  }, [loginVisible]);

  if (loading) return <Loading />;
  if (error) return <p>Error :)</p>;

  const loadSubmission = async () => {
    const { data } = await client.query({
      query: STUDENT_SUBMISSION_QUERY
    });
    try {
      const content = JSON.parse(data.submission.content);
      setSubmissionContent(content);
      setSubmissionId(data.submission.id);
      currentContent.current = content;
    } catch (e) {
      console.warn("Error parsing submission content", e);
    }
  };

  const { exercise } = data;
  const { title, teacherName } = exercise;

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        key={submissionId}
        content={submissionContent}
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        title={
          <Title>
            <TitleIcon>
              <Icon name="airplane-document" />
            </TitleIcon>
            <div>
              <TitleText>{title}</TitleText>
              <TeacherName>{teacherName}</TeacherName>
            </div>
          </Title>
        }
        onContentChange={debounce((content: any[]) => {
          updateSubmission({
            variables: { content: JSON.stringify(content || []) }
          });
          currentContent.current = content;
        }, 1000)}
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
          <p>Ejercicio entregado con éxito</p>
          <ModalButtons>
            <ModalButton onClick={() => setIsSubmissionSuccessOpen(false)}>
              Aceptar
            </ModalButton>
          </ModalButtons>
        </ModalContent>
      </Modal>
      {loginVisible && (
        <ExerciseLoginModal
          code={exercise.code}
          onSuccess={() => setLoginVisible(false)}
        />
      )}
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

const Title = styled.div`
  display: flex;
  align-items: center;
`;

const TitleIcon = styled.div`
  margin-right: 10px;
  svg {
    width: 28px;
  }
`;

const TitleText = styled.div`
  font-style: normal;
  margin-bottom: 6px;
`;

const TeacherName = styled.div`
  font-style: italic;
  font-size: 14px;
  font-weight: normal;
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
