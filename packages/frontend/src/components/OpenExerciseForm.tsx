import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { useApolloClient } from "@apollo/react-hooks";
import { Input, Button, useTranslate } from "@bitbloq/ui";
import { EXERCISE_BY_CODE_QUERY } from "../apollo/queries";

export interface IOpenExerciseForm {
  openText?: string;
}

const OpenExerciseForm: FC<IOpenExerciseForm> = ({
  openText = "Ir al ejercicio"
}) => {
  const t = useTranslate();
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
    <Form
      onSubmit={e => {
        e.preventDefault();
        onOpenExercise();
      }}
    >
      <label>{t("home.exercise-code")}</label>
      <Input
        type="text"
        placeholder={t("home.exercise-code")}
        value={exerciseCode}
        error={exerciseError}
        onChange={e => setExerciseCode(e.target.value)}
      />
      {exerciseError && <Error>{t("home.invalid-code")}</Error>}
      <Button type="submit" disabled={loadingExercise}>
        {openText}
      </Button>
    </Form>
  );
};

export default OpenExerciseForm;

/* styled components */

const Form = styled.form`
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
