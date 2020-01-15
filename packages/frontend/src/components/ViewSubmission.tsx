import Router from "next/router";
import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import { IExercise, ISubmission } from "@bitbloq/api";
import {
  colors,
  Spinner,
  Document,
  useTranslate,
  Icon,
  IDocumentTab
} from "@bitbloq/ui";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { documentTypes } from "../config";
import {
  EXERCISE_QUERY,
  SUBMISSION_QUERY,
  SUBMISSION_SET_GRADE
} from "../apollo/queries";
import ExerciseInfo from "./ExerciseInfo";
import ExerciseRate from "./ExerciseRate";
import HeaderRightContent from "./HeaderRightContent";
import UserSession from "./UserSession";

interface IViewSubmissionProps {
  id: string;
  type: string;
}

const ViewSubmission: FC<IViewSubmissionProps> = ({ id, type }) => {
  const t = useTranslate();
  const [exercise, setExercise] = useState<IExercise>();
  const [submission, setSubmission] = useState<ISubmission>();
  const [tabIndex, setTabIndex] = useState(0);
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;
  const [getExercise, { data: exerciseData }] = useLazyQuery(EXERCISE_QUERY);
  const [gradeSubmission] = useMutation(SUBMISSION_SET_GRADE);
  const { data, loading, error } = useQuery(SUBMISSION_QUERY, {
    variables: { id }
  });

  useEffect(() => {
    if (exerciseData && exerciseData.exercise) {
      setExercise(exerciseData.exercise);
    }
  }, [exerciseData]);

  useEffect(() => {
    if (data && data.submission) {
      setSubmission(data.submission);
      getExercise({
        variables: {
          id: data.submission.exercise
        }
      });
    }
  }, [data]);

  if (loading) {
    return <Loading color={documentType.color} />;
  }
  if (error) {
    return <GraphQLErrorMessage apolloError={error!} />;
  }

  const menuOptions = [
    {
      id: "file",
      label: t("menu-file"),
      children: []
    }
  ];

  let baseTabs: IDocumentTab[] = [
    {
      icon: <Icon name="tick-circle" />,
      label: t("tab-submission-rate"),
      content: (
        <ExerciseRate
          gradeSubmission={(grade: number, teacherComment: string) => {
            setSubmission({
              ...submission!,
              grade,
              teacherComment
            });
            gradeSubmission({
              variables: {
                grade,
                submissionID: id,
                teacherComment
              }
            });
          }}
          submission={submission!}
        />
      )
    }
  ];

  if (exercise) {
    baseTabs = [
      {
        icon: <Icon name="info" />,
        label: t("tab-project-info"),
        content: (
          <ExerciseInfo
            grade={submission!.grade !== null ? submission!.grade : undefined}
            exercise={exercise}
            onGotoExercise={() => setTabIndex(0)}
            teacherComment={submission!.teacherComment || ""}
            isTeacher={true}
          />
        )
      },
      ...baseTabs
    ];
  }

  const headerRightContent = (
    <HeaderRightContent>
      <UserSession />
    </HeaderRightContent>
  );

  return (
    <EditorComponent
      document={submission}
      onDocumentChange={() => null}
      baseTabs={baseTabs}
      baseMenuOptions={menuOptions}
    >
      {documentProps => (
        <Document
          icon={<Icon name={documentType.icon} />}
          brandColor={documentType.color}
          tabIndex={tabIndex}
          onTabChange={setTabIndex}
          getTabs={(mainTabs: any[]) => mainTabs}
          headerRightContent={headerRightContent}
          title={`${submission!.name} (${submission!.studentNick})`}
          backCallback={() =>
            Router.push(`/app/document/${submission!.document}`)
          }
          {...documentProps}
        />
      )}
    </EditorComponent>
  );
};

export default ViewSubmission;

/* styled components */

const Loading = styled(Spinner)<{ color: string }>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
`;
