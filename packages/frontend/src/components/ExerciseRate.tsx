import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import {
  colors,
  FileSelectButton,
  Input,
  TextArea,
  useTranslate
} from "@bitbloq/ui";
import { ISubmission } from "../types";

export interface IExerciseRateProps {
  gradeSubmission: (grade: number, teacherComment: string) => void;
  submission: ISubmission;
}

const ExerciseRate: FC<IExerciseRateProps> = ({
  gradeSubmission,
  submission
}) => {
  const [error, setError] = useState<boolean>(false);
  const [grade, setGrade] = useState<number | string>(
    submission.grade !== null ? submission.grade : ""
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
                onBlur={() => gradeSubmission(+grade, teacherComment)}
                onChange={e => {
                  const value: string = e.target.value;
                  if (!value || (value.match(/\d/) && +value >= 0)) {
                    setError(false);
                    setGrade(value ? +value : "");
                  } else {
                    setError(true);
                  }
                }}
                placeholder="00"
                value={grade}
              />
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

const FormSubLabel = styled.div`
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
`;

const FormInput = styled.div`
  flex: 2;
  max-width: 66%;
`;

const Image = styled.div<{ src: string }>`
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  width: 250px;
  height: 160px;
  margin-bottom: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ImageButton = styled(FileSelectButton)`
  width: 250px;
`;
