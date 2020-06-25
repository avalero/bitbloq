import React, { FC, useState, useEffect, useLayoutEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Modal, Input, DialogModal, useTranslate } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import {
  START_SUBMISSION_MUTATION,
  LOGIN_SUBMISSION_MUTATION
} from "../apollo/queries";
import { setToken } from "../lib/session";

enum Steps {
  StartOrContinue,
  Start,
  Continue
}

interface IExerciseLoginModalProps {
  code: string;
  onSuccess: (teamName: string) => any;
}

const ExerciseLoginModal: FC<IExerciseLoginModalProps> = ({
  code,
  onSuccess
}) => {
  const submitRef = useRef<HTMLButtonElement>(null);
  const [step, setStep] = useState(Steps.StartOrContinue);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [start] = useMutation(START_SUBMISSION_MUTATION);
  const [login] = useMutation(LOGIN_SUBMISSION_MUTATION);

  const t = useTranslate();

  useEffect(() => {
    setTeamNameError("");
    setPasswordError("");
  }, [step]);

  useLayoutEffect(() => {
    const onSubmitForm = (e: KeyboardEvent) => {
      if (e.keyCode === 13 && submitRef.current) {
        e.preventDefault();
        submitRef.current.click();
      }
    };
    window.addEventListener("keypress", onSubmitForm);
    return () => window.removeEventListener("keypress", onSubmitForm);
  }, []);

  const gotoStep = (nextStep: Steps) => {
    setTeamName("");
    setPassword("");
    setStep(nextStep);
  };

  const onStartClick = async () => {
    if (!teamName) {
      setTeamNameError(t("submission-error-not-name"));
    } else {
      try {
        const result = await start({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        }).catch(e => {
          if (e.graphQLErrors[0].extensions.code === "SUBMISSION_EXISTS") {
            setTeamNameError(t("submission-error-submission-exists"));
          } else if (
            e.graphQLErrors[0].extensions.code === "NOT_ACCEPT_SUBMISSIONS"
          ) {
            setTeamNameError(t("submission-error-not-accepted-submission"));
          } else {
            setTeamNameError(e.message);
          }
        });
        if (result && result.data) {
          const { token } = result.data.startSubmission;
          setToken(token, "exercise-team");
          onSuccess(teamName);
        }
      } catch (e) {
        return undefined;
      }
    }
    return;
  };

  const onContinueClick = async () => {
    if (!teamName) {
      setTeamNameError(t("submission-error-not-name"));
    } else {
      try {
        const { data } = await login({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        });
        const { token } = data.loginSubmission;
        setToken(token, "exercise-team");
        onSuccess(teamName);
      } catch (e) {
        const submissionNotFound = (e.graphQLErrors || []).some(
          ({ path, extensions }) =>
            extensions && extensions.code === "SUBMISSION_NOT_FOUND"
        );

        const notAcceptSubmissions = (e.graphQLErrors || []).some(
          ({ path, extensions }) =>
            extensions && extensions.code === "NOT_ACCEPT_SUBMISSIONS"
        );

        if (submissionNotFound) {
          setTeamNameError(t("submission-error-submission-not-found"));
        } else if (notAcceptSubmissions) {
          setTeamNameError(t("submission-error-not-accepted-submission"));
        } else {
          setPasswordError(t("submission-error-wrong-password"));
        }
      }
    }
  };

  if (step === Steps.StartOrContinue) {
    return (
      <DialogModal
        isOpen={true}
        title={t("exercises.welcome-to-exercise")}
        text={t("exercises.what-do-you-want-to-do")}
        content={
          <>
            <Button onClick={() => gotoStep(Steps.Start)}>
              {t("exercises.start-submission")}
            </Button>
            <Button onClick={() => gotoStep(Steps.Continue)}>
              {t("exercises.resume-submission")}
            </Button>
          </>
        }
        cancelText={t("exercises.leave-exercise")}
        onCancel={() => {
          window.close();
          window.location.assign("/");
        }}
      />
    );
  } else {
    return (
      <Modal
        isOpen={true}
        title={
          step === Steps.Start
            ? t("exercises.start-submission")
            : t("exercises.resume-submission")
        }
      >
        <ModalContent>
          <LoginForm>
            <FormGroup>
              <label>{t("exercises.team-name")}</label>
              <Input
                value={teamName}
                error={!!teamNameError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTeamName(e.target.value)
                }
                placeholder={t("exercises.team-name")}
              />
            </FormGroup>
            <FormGroup>
              <label>
                {t("login.placeholders.password")}{" "}
                {step === Steps.Start && t("exercises.optional")}
              </label>
              <Input
                value={password}
                error={!!passwordError}
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder={t("login.placeholders.password")}
              />
            </FormGroup>
          </LoginForm>
          {(teamNameError || passwordError) && (
            <Error>{teamNameError || passwordError}</Error>
          )}
          <Buttons>
            <Button tertiary onClick={() => gotoStep(Steps.StartOrContinue)}>
              {t("exercises.go-back")}
            </Button>
            <Button
              onClick={() =>
                step === Steps.Start ? onStartClick() : onContinueClick()
              }
              ref={submitRef}
            >
              {t("exercises.start")}
            </Button>
          </Buttons>
        </ModalContent>
      </Modal>
    );
  }
};

export default ExerciseLoginModal;

const ModalContent = styled.div`
  font-size: 14px;
  padding: 30px;
`;

const LoginForm = styled.div`
  display: flex;
  margin: 0px -10px;
`;

const FormGroup = styled.div`
  margin: 0px 10px;
  flex: 1;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;
