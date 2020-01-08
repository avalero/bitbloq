import React, { useState } from "react";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { Button, colors, useTranslate } from "@bitbloq/ui";
import { IExercise } from "../../../api/src/api-types";

enum TabType {
  Description,
  Score
}

interface IExerciseInfoProps {
  grade?: number;
  exercise: IExercise;
  isTeacher?: boolean;
  onGotoExercise: () => any;
  teacherComment?: string;
}

const ExerciseInfo: React.FunctionComponent<IExerciseInfoProps> = ({
  grade,
  exercise: { title, description, image },
  isTeacher = false,
  onGotoExercise,
  teacherComment
}) => {
  const [currentTab, setCurrentTab] = useState(TabType.Description);
  const t = useTranslate();

  return (
    <Container>
      <Left>
        <LeftContent>
          <h2>{title}</h2>
          <Image src={image!} />
        </LeftContent>
      </Left>
      <Right>
        <Tabs>
          <Tab
            selected={currentTab === TabType.Description}
            onClick={() => setCurrentTab(TabType.Description)}
          >
            Descripción
          </Tab>
          <Tab
            selected={currentTab === TabType.Score}
            onClick={() => setCurrentTab(TabType.Score)}
          >
            Calificación
          </Tab>
        </Tabs>
        {currentTab === TabType.Description && (
          <TabContent>
            <p>{description}</p>
          </TabContent>
        )}
        {currentTab === TabType.Score && (
          <TabContent>
            <h2>{t("exercises.rate.rate.title")}</h2>
            <RateSquare>{grade}</RateSquare>
            <h2>{t("exercises.rate.observations.title")}</h2>
            <p>{teacherComment}</p>
          </TabContent>
        )}
        {!isTeacher && (
          <GotoExercise>
            <Button onClick={onGotoExercise}>Ir al ejercicio</Button>
          </GotoExercise>
        )}
      </Right>
    </Container>
  );
};

export default ExerciseInfo;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Left = styled.div`
  flex: 1;
  padding: 30px;
  display: flex;
  justify-content: center;
`;

const LeftContent = styled.div`
  max-width: 730px;
  flex: 1;
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }
`;

const Image = styled.div<{ src: string }>`
  background-color: ${colors.gray2};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
  margin-right: 30px;
  width: 100%;
  flex: 1;
  border-radius: 4px;

  &::after {
    content: "";
    display: block;
    padding-bottom: 60%;
  }
`;

const RateSquare = styled.div`
  align-items: center;
  border: solid 1px #cccccc;
  border-radius: 4px;
  display: flex;
  font-size: 20px;
  font-weight: bold;
  height: 60px;
  justify-content: center;
  line-height: 1.1;
  margin-bottom: 30px;
`;

const Right = styled.div`
  width: 400px;
  border-left: 1px solid ${colors.gray3};
  display: flex;
  flex-direction: column;
`;

const Tabs = styled.div`
  display: flex;
`;

const Tab = styled.div<{ selected?: boolean }>`
  height: 60px;
  border-right: 1px solid ${colors.gray3};
  border-bottom: 1px solid ${colors.gray3};
  background-color: ${colors.gray2};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  flex: 1;
  cursor: pointer;

  ${props =>
    props.selected &&
    css`
      background-color: white;
      border-bottom: none;
    `}

  &:last-of-type {
    border-right: none;
  }
`;

const TabContent = styled.div`
  padding: 30px;
  flex: 1;

  p {
    font-size: 14px;
    line-height: 1.57;
  }

  h2 {
    color: #474749;
    margin-bottom: 10px;
  }
`;

const GotoExercise = styled.div`
  padding: 40px 30px;
  border-top: 1px solid ${colors.gray3};
  ${Button} {
    width: 100%;
  }
`;
