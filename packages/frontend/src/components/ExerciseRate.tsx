import React, { FC, useState } from "react";
import { ISubmission } from "@bitbloq/api";
import styled from "@emotion/styled";
import { colors, Input, TextArea, useTranslate } from "@bitbloq/ui";
import ErrorMessage from "./ErrorMessage";

export interface IExerciseRateProps {
  gradeSubmission: (grade: number | undefined, teacherComment: string) => void;
  submission: ISubmission;
}

const ExerciseRate: FC<IExerciseRateProps> = ({
  gradeSubmission,
  submission
}) => {
  const [error, setError] = useState<boolean>(false);
  const [grade, setGrade] = useState<string>(
    submission.grade !== null && submission.grade !== undefined
      ? `${submission.grade}`
      : ""
  );
  const [originalGrade] = useState<string>(
    submission.grade !== null && submission.grade !== undefined
      ? `${submission.grade}`
      : ""
  );
  const [teacherComment, setTeacherComment] = useState<string>(
    submission.teacherComment || ""
  );
  const t = useTranslate();

  return (
    <Container>
      <Panel>
        <Header>{t("exercises.rate.title")}</Header>
        <Form>
          <FormRow>
            <FormLabel>
              <label>{t("exercises.rate.rate.title")}</label>
            </FormLabel>
            <FormInput>
              <Input
                error={error}
                onBlur={() => {
                  if (grade) {
                    if (
                      grade.match(/^\d{1,2}$|^\d\.\d$/) &&
                      +grade >= 0 &&
                      +grade <= 10
                    ) {
                      setError(false);
                      gradeSubmission(+grade, teacherComment);
                    } else {
                      setError(true);
                    }
                  } else {
                    gradeSubmission(
                      originalGrade ? +originalGrade : undefined,
                      teacherComment
                    );
                    setError(false);
                    setGrade(originalGrade);
                  }
                }}
                onChange={e => {
                  const value: string = e.target.value.replace(",", ".");
                  if (
                    !value ||
                    (value.match(/^\d{1,2}$|^\d\.\d?$/) &&
                      +value >= 0 &&
                      +value <= 10)
                  ) {
                    setError(false);
                  } else {
                    setError(true);
                  }
                  setGrade(value);
                }}
                placeholder="00"
                value={grade}
              />
              <ErrorMessage hide={!error}>
                {t("exercises.rate.rate.error")}
              </ErrorMessage>
            </FormInput>
          </FormRow>
          <FormRow>
            <FormLabel>
              <label>{t("exercises.rate.observations.title")}</label>
            </FormLabel>
            <FormInput>
              <TextArea
                onBlur={() => gradeSubmission(+grade, teacherComment)}
                onChange={e => {
                  const value: string = e.target.value;
                  setTeacherComment(value);
                }}
                placeholder={t("exercises.rate.observations.placeholder")}
                rows={3}
                value={teacherComment}
              />
            </FormInput>
          </FormRow>
        </Form>
      </Panel>
    </Container>
  );
};

export default ExerciseRate;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const Panel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-height: 100%;
  max-width: 900px;
  overflow: scroll;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  position: sticky;
  height: 50px;
  top: 0;
  display: flex;
  align-items: center;
`;

const Form = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  padding: 20px 30px;

  &:last-of-type {
    border-bottom: none;
  }
`;

const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.div`
  flex: 1;
  font-size: 14px;
  margin-right: 30px;

  label {
    min-height: 35px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
`;

const FormInput = styled.div`
  flex: 2;
  max-width: 66%;
`;
