import React, { FC, useState } from "react";
import styled from "@emotion/styled";

import { Button, Input, Icon, DropDown } from "@bitbloq/ui";

export interface INewExerciseDropDownProps {
  onOpenExercise: (exerciseCode: string) => any;
  exerciseError: boolean;
  loadingExercise: boolean;
}

const NewExerciseButton: FC<INewExerciseDropDownProps> = ({
  onOpenExercise,
  exerciseError,
  loadingExercise
}) => {
  const [exerciseCode, setExerciseCode] = useState("");

  return (
    <DropDown
      attachmentPosition={"top center"}
      targetPosition={"bottom center"}
      closeOnClick={false}
    >
      {() => (
        <HeaderButton tertiary>
          <Icon name="airplane-document" />
          Ir al ejercicio
        </HeaderButton>
      )}
      <ExerciseDropDown>
        <ExerciseForm
          onSubmit={e => {
            e.preventDefault();
            onOpenExercise(exerciseCode);
          }}
        >
          <label>Código del ejercicio</label>
          <Input
            type="text"
            placeholder="Código del ejercicio"
            value={exerciseCode}
            error={exerciseError}
            onChange={e => setExerciseCode(e.target.value)}
          />
          {exerciseError && <Error>El código no es válido</Error>}
          <Button type="submit" disabled={loadingExercise}>
            Ir al ejercicio
          </Button>
        </ExerciseForm>
      </ExerciseDropDown>
    </DropDown>
  );
};

export default NewExerciseButton;

/** styled components */

const HeaderButton = styled(Button)`
  padding: 0px 20px;
  margin: 0px 10px;
  svg {
    width: 20px;
    height: 20px;
    margin-right: 6px;
  }
`;

const ExerciseDropDown = styled.div`
  width: 280px;
  margin-top: 12px;
  background-color: white;
  border-radius: 4px;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  padding: 20px;

  &::before {
    content: "";
    background-color: white;
    width: 20px;
    height: 20px;
    display: block;
    position: absolute;
    transform: translate(-50%, 0) rotate(45deg);
    top: -10px;
    left: 50%;
  }
`;

const ExerciseForm = styled.form`
  label {
    font-size: 14px;
    margin-bottom: 10px;
    display: block;
  }

  input {
    font-family: Roboto Mono;
  }

  button {
    margin-top: 30px;
    width: 100%;
  }
`;

const Error = styled.div`
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
  margin-top: 10px;
`;
