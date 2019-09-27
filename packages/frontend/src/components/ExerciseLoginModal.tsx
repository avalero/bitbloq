import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Modal, Input, DialogModal } from "@bitbloq/ui";
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

interface ExerciseLoginModalProps {
  code: string;
  onSuccess: (teamName: string) => any;
}

const ExerciseLoginModal: FC<ExerciseLoginModalProps> = ({
  code,
  onSuccess
}) => {
  const [step, setStep] = useState(Steps.StartOrContinue);
  const [teamName, setTeamName] = useState("");
  const [password, setPassword] = useState("");
  const [teamNameError, setTeamNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [start] = useMutation(START_SUBMISSION_MUTATION);
  const [login] = useMutation(LOGIN_SUBMISSION_MUTATION);

  useEffect(() => {
    setTeamNameError("");
    setPasswordError("");
  }, [step]);

  const gotoStep = (step: Steps) => {
    setTeamName("");
    setPassword("");
    setStep(step);
  };

  const onStartClick = async () => {
    if (!teamName) {
      setTeamNameError("Debes escribir un nombre de equipo");
    } else {
      try {
        const { data } = await start({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        });
        const { token } = data.startSubmission;
        setToken(token, "exercise-team");
        onSuccess(teamName);
      } catch (e) {
        setTeamNameError("Ya existe un equipo con ese nombre");
      }
    }
  };

  const onContinueClick = async () => {
    if (!teamName) {
      setTeamNameError("Debes escribir un nombre de equipo");
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

        if (submissionNotFound) {
          setTeamNameError("No existe un equipo con ese nombre");
        } else {
          setPasswordError("La contraseña no es correcta");
        }
      }
    }
  };

  if (step === Steps.StartOrContinue) {
    return (
      <DialogModal
        isOpen={true}
        title="Bienvenido al ejercicio"
        text="¿Qué quieres hacer?"
        content={
          <>
            <Button onClick={() => gotoStep(Steps.Start)}>
              Empezar una entrega
            </Button>
            <Button onClick={() => gotoStep(Steps.Continue)}>
              Continuar una entrega
            </Button>
          </>
        }
        cancelText="Salir del ejercicio"
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
          step === Steps.Start ? "Empezar una entrega" : "Continuar una entrega"
        }
      >
        <ModalContent>
          <LoginForm>
            <FormGroup>
              <label>Nombre del equipo</label>
              <Input
                value={teamName}
                error={teamNameError}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTeamName(e.target.value)
                }
                placeholder="Nombre del equipo"
              />
            </FormGroup>
            <FormGroup>
              <label>Contraseña {step === Steps.Start && "(opcional)"}</label>
              <Input
                value={password}
                error={passwordError}
                type="password"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setPassword(e.target.value)
                }
                placeholder="Contraseña"
              />
            </FormGroup>
          </LoginForm>
          {(teamNameError || passwordError) && (
            <Error>{teamNameError || passwordError}</Error>
          )}
          <Buttons>
            <Button tertiary onClick={() => gotoStep(Steps.StartOrContinue)}>
              Atrás
            </Button>
            <Button
              onClick={() =>
                step === Steps.Start ? onStartClick() : onContinueClick()
              }
            >
              Empezar
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
