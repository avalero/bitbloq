import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { useApolloClient } from "@apollo/react-hooks";
import { Input, Button } from "@bitbloq/ui";
import { EXERCISE_BY_CODE_QUERY } from "../apollo/queries";

export interface IOpenExerciseForm {
  openText?: string;
}

const OpenExerciseForm: FC<IOpenExerciseForm> = ({
  openText = "Ir al ejercicio"
}) => {
  const client = useApolloClient();

  const [exerciseCode, setExerciseCode] = useState("");
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState(false);

  const onOpenExercise = async () => {
    if (exerciseCode) {
      try {
        setLoadingExercise(true);
        const {
          data: { exerciseByCode: exercise }
        } = await client.query({
          query: EXERCISE_BY_CODE_QUERY,
          variables: { code: exerciseCode }
        });
        setLoadingExercise(false);
        setExerciseError(false);
        setExerciseCode("");
        window.open(`/app/exercise/${exercise.type}/${exercise.id}`);
      } catch (e) {
        setLoadingExercise(false);
        setExerciseError(true);
      }
    }
  };

  return (
    <Form>
      <label>Código del ejercicio</label>
      <Input
        type="text"
        placeholder="Código del ejercicio"
        value={exerciseCode}
        error={exerciseError}
        onChange={e => setExerciseCode(e.target.value)}
      />
      {exerciseError && <Error>El código no es válido</Error>}
      <Button onClick={() => onOpenExercise()} disabled={loadingExercise}>
        {openText}
      </Button>
    </Form>
  );
};

export default OpenExerciseForm;

/* styled components */

const Form = styled.div`
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
