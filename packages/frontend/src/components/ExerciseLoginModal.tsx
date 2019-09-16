import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, Modal, Input, DialogModal } from "@bitbloq/ui";
import { useMutation } from "@apollo/react-hooks";
import { LOGIN_SUBMISSION_MUTATION } from "../apollo/queries";

enum Steps {
  StartOrContinue,
  Start,
  Continue
}

interface ExerciseLoginModalProps {
  code: string;
  onSuccess: () => any;
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

  const [login] = useMutation(LOGIN_SUBMISSION_MUTATION, {
    context: {
      disableAuthRedirect: true
    }
  });

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
        const { data } = await login({
          variables: {
            studentNick: teamName,
            exerciseCode: code,
            password
          }
        });
        const { token } = data.loginSubmission;
        window.sessionStorage.setItem("authToken", token);
        onSuccess();
      } catch (e) {
        if (step === Steps.Start) {
          setTeamNameError("Ya existe un equipo con ese nombre");
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
        onCancel={() => window.close()}
      />
    );
  } else {
    return (
      <Modal isOpen={true} title={step === Steps.Start ? "Empezar una entrega" : "Continuar una entrega"}>
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
          {(teamNameError || passwordError) &&
            <Error>{teamNameError || passwordError}</Error>
          }
          <Buttons>
            <Button tertiary onClick={() => gotoStep(Steps.StartOrContinue)}>
              Atrás
            </Button>
            <Button onClick={() => onStartClick()}>Empezar</Button>
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
