import React, { useCallback, useState, useRef, useEffect } from "react";
import Router from "next/router";
import { Subscription } from "react-apollo";
import debounce from "lodash/debounce";
import { useQuery, useMutation, useApolloClient } from "@apollo/react-hooks";
import { IDocument, IResource, ISubmission } from "@bitbloq/api";
import {
  colors,
  Button,
  DialogModal,
  Document,
  IDocumentTab,
  Spinner,
  Modal,
  Icon,
  useTranslate
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import {
  EXERCISE_QUERY,
  STUDENT_SUBMISSION_QUERY,
  UPDATE_SUBMISSION_MUTATION,
  FINISH_SUBMISSION_MUTATION,
  SUBMISSION_ACTIVE_SUBSCRIPTION,
  SUBMISSION_SESSION_EXPIRES_SUBSCRIPTION
} from "../apollo/queries";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseLoginModal from "./ExerciseLoginModal";
import SaveCopyModal from "./SaveCopyModal";
import { documentTypes } from "../config";
import { getToken, setToken } from "../lib/session";
import useServiceWorker from "../lib/useServiceWorker";
import SessionWarningModal from "./SessionWarningModal";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

const EditExercise = ({ type, id }) => {
  const serviceWorker = useServiceWorker();
  const t = useTranslate();
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const [isSubmissionSuccessOpen, setIsSubmissionSuccessOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(1);

  const [loginVisible, setLoginVisible] = useState(true);
  const [teamName, setTeamName] = useState("");

  const [isSaveCopyVisible, setIsSaveCopyVisible] = useState(false);
  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);
  const [restartCount, setRestartCount] = useState(0);
  const [initialContent, setInitialContent] = useState([]);

  const { data, loading, error } = useQuery(EXERCISE_QUERY, {
    variables: { id }
  });
  const [updateSubmission] = useMutation(UPDATE_SUBMISSION_MUTATION, {
    errorPolicy: "ignore"
  });
  const [finishSubmission] = useMutation(FINISH_SUBMISSION_MUTATION);

  const [submission, setSubmission] = useState<ISubmission | undefined>(
    undefined
  );
  const currentContent = useRef([]);

  const client = useApolloClient();

  const exercise = data && data.exercise;

  useEffect(() => {
    setToken("", "exercise-team");
  }, []);

  const setActiveToFalse = useCallback(() => {
    if (exercise && teamName && serviceWorker && submission) {
      const token = getToken("exercise-team");
      serviceWorker.postMessage({
        exerciseID: exercise.id,
        token,
        type: "leave-exercise",
        submissionID: submission.id
      });
    }
  }, [exercise, submission, teamName]);

  useEffect(() => {
    if (exercise && teamName) {
      window.removeEventListener("beforeunload", setActiveToFalse);
      window.addEventListener("beforeunload", setActiveToFalse);

      return () => {
        window.removeEventListener("beforeunload", setActiveToFalse);
      };
    }
    return;
  }, [exercise, submission, teamName]);

  useEffect(() => {
    if (exercise && exercise.content) {
      setInitialContent(data.exercise.content);
    }
  }, [exercise]);

  if (loading) {
    return <Loading />;
  }
  if (error) {
    return <GraphQLErrorMessage apolloError={error} />;
  }

  const loadSubmission = async () => {
    const { data: submissionData } = await client.query({
      query: STUDENT_SUBMISSION_QUERY,
      errorPolicy: "ignore"
    });
    setSubmission(submissionData.submission);
    setRestartCount(restartCount + 1);
    currentContent.current = submissionData.submission.content;
  };

  const restart = () => {
    setRestartCount(restartCount + 1);
    setSubmission({ ...submission!, content: initialContent as any });
    updateSubmission({
      variables: {
        content: initialContent
      }
    });
    currentContent.current = initialContent;
    setIsRestartModalVisible(false);
  };

  const onSaveCopyClick = () => {
    setIsSaveCopyVisible(true);
  };

  const onRestartClick = () => {
    setIsRestartModalVisible(true);
  };

  const onSubmitClick = async () => {
    await finishSubmission({
      variables: {
        content: currentContent.current
      }
    });
    setIsSubmissionSuccessOpen(true);
  };
  const { name, teacherName, resources } = exercise;
  const infoTab: IDocumentTab = {
    icon: <Icon name="info" />,
    label: t("tab-project-info"),
    content: (
      <ExerciseInfo
        grade={
          submission && submission.grade !== null ? submission.grade : undefined
        }
        exercise={exercise}
        onGotoExercise={() => setTabIndex(0)}
        teacherComment={(submission && submission.teacherComment) || ""}
      />
    )
  };

  const menuOptions = [
    {
      id: "file",
      label: t("menu-file"),
      children: []
    }
  ];

  return (
    <>
      <EditorComponent
        resources={resources as IResource[]}
        document={submission || exercise}
        onDocumentChange={debounce((document: IDocument) => {
          if (teamName) {
            updateSubmission({
              variables: { content: document.content }
            });
          }
          currentContent.current = document.content as any;
        }, 1000)}
        baseTabs={[infoTab]}
        baseMenuOptions={menuOptions}
        key={restartCount}
      >
        {documentProps => (
          <Document
            brandColor={documentType.color}
            title={
              <Title>
                <TitleIcon>
                  <Icon name="airplane-document" />
                </TitleIcon>
                <div>
                  <TitleText>{name}</TitleText>
                  <TeacherName>Profesor: {teacherName}</TeacherName>
                </div>
              </Title>
            }
            icon={<Icon name={documentType.icon} />}
            tabIndex={tabIndex}
            onTabChange={setTabIndex}
            headerButtons={[
              { id: "save-copy", icon: "add-document" },
              { id: "restart", icon: "reload" },
              { id: "submit", icon: "airplane" }
            ]}
            onHeaderButtonClick={(buttonId: string) => {
              switch (buttonId) {
                case "save-copy":
                  onSaveCopyClick();
                  return;
                case "restart":
                  onRestartClick();
                  return;
                case "submit":
                  onSubmitClick();
                  return;
              }
            }}
            headerRightContent={teamName && <TeamName>{teamName}</TeamName>}
            backCallback={() => {
              setActiveToFalse();
              Router.push("/");
            }}
            {...documentProps}
          />
        )}
      </EditorComponent>
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
      {loginVisible && !loading && (
        <ExerciseLoginModal
          code={exercise.code}
          onSuccess={async newTeamName => {
            setTeamName(newTeamName);
            setLoginVisible(false);
            loadSubmission();
          }}
        />
      )}
      {isSaveCopyVisible && (
        <SaveCopyModal
          onClose={() => setIsSaveCopyVisible(false)}
          document={exercise}
          content={currentContent.current}
          type="exercise"
        />
      )}
      <DialogModal
        isOpen={isRestartModalVisible}
        title="Aviso"
        text="¿Seguro que quieres reiniciar el ejercicio? Si lo haces perderás todo lo que hayas hecho y el ejercicio volverá a su estado original."
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={() => restart()}
        onCancel={() => setIsRestartModalVisible(false)}
      />
      {teamName && (
        <SessionWarningModal
          subscription={SUBMISSION_SESSION_EXPIRES_SUBSCRIPTION}
          setActivteToFalse={setActiveToFalse}
        />
      )}
      {teamName && submission && (
        <Subscription
          subscription={SUBMISSION_ACTIVE_SUBSCRIPTION}
          shouldResubscribe={true}
          onSubscriptionData={({ subscriptionData }) => {
            const { submissionActive } = subscriptionData.data || {};
            if (submissionActive && !submissionActive.active) {
              setToken("", "exercise-team");
              Router.replace("/");
            }
          }}
        />
      )}
    </>
  );
};

export default EditExercise;

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

const TeamName = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 20px;
  border-left: solid 1px #cfcfcf;
  background-color: #ebebeb;
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
