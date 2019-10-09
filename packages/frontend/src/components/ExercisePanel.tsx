import React, { FC, useState } from "react";
import dayjs from "dayjs";
import { Spring } from "react-spring/renderprops";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, Button, Icon, Switch, Translate } from "@bitbloq/ui";
import DocumentCardMenu from "./DocumentCardMenu";

export interface ExercisePanelProps {
  exercise: any;
  onCancelSubmission: (value: any) => void;
  onCheckSubmission: (value: any) => void;
  onAcceptedSubmissions: (value: boolean) => void;
  onChangeName: (value: string) => void;
  onRemove: () => void;
}

class ExercisePanelState {
  readonly isOpen: boolean = false;
  readonly menuOpen: boolean = false;
}

const ExercisePanel: FC<ExercisePanelProps> = (props: ExercisePanelProps) => {
  const {
    exercise,
    onCancelSubmission,
    onCheckSubmission,
    onAcceptedSubmissions,
    onChangeName,
    onRemove
  } = props;

  const [isOpen, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Translate>
      {t => (
        <Container>
          <Header onClick={() => setOpen(!isOpen)}>
            <HeaderLeft>
              <Toggle isOpen={isOpen}>
                <Icon name="angle" />
              </Toggle>
            </HeaderLeft>
            <HeaderCenter>
              <Title>{exercise.title}</Title>
              <Date>{dayjs(exercise.createdAt).format("DD/MM/YY HH:mm")}</Date>
            </HeaderCenter>
            <HeaderRight
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
            >
              <Icon name="ellipsis" />
            </HeaderRight>
          </Header>
          {menuOpen && (
            <ExerciseMenu
              options={[
                {
                  iconName: "pencil",
                  label: t("menu-change-name"),
                  onClick() {
                    setMenuOpen(false);
                    onChangeName(exercise.title);
                  }
                },
                {
                  iconName: "trash",
                  label: t("menu-delete-exercise"),
                  onClick() {
                    setMenuOpen(false);
                    onRemove();
                  },
                  red: true
                }
              ]}
            />
          )}
          <Spring to={{ height: isOpen ? "auto" : 0 }}>
            {({ height }) => (
              <ExerciseDetails style={{ height }}>
                <ExerciseInfo>
                  <div className="code">
                    <CodeBox>{exercise.code}</CodeBox>
                    {t("exercise-details-code")}
                  </div>
                  <div className="accept-submissions">
                    {t("exercise-details-submissions")}
                    <SubmissionsSwitch
                      value={exercise.acceptSubmissions}
                      onChange={onAcceptedSubmissions}
                    />
                  </div>
                </ExerciseInfo>
                <ExerciseSubmissions>
                  {exercise.submissions && exercise.submissions.length > 0 ? (
                    <Table key="table">
                      <thead>
                        <tr>
                          <th>Equipo</th>
                          <th>Fecha de entrega</th>
                          <th>Calificación</th>
                          <th />
                        </tr>
                      </thead>
                      <tbody>
                        {exercise.submissions.map(submission => (
                          <tr key={submission.id}>
                            <td>
                              <StudentCell>
                                <Online />
                                <StudentNick>
                                  {submission.studentNick}
                                </StudentNick>
                              </StudentCell>
                            </td>
                            <td>
                              {submission.finished ? (
                                dayjs(submission.finishedAt).format(
                                  "DD/MM/YY HH:mm"
                                )
                              ) : (
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    color: "#474749"
                                  }}
                                >
                                  sin entregar
                                </span>
                              )}
                            </td>
                            <td>
                              {submission.grade ||
                                (submission.finished ? "-" : "")}
                            </td>
                            <td></td>
                            {/*<td>
                              {submission.finished && (
                                <Button
                                  tertiary
                                  small
                                  onClick={() => onCheckSubmission(submission)}
                                >
                                  Comprobar
                                </Button>
                              )}
                            </td>*/}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <NoSubmissions>
                      {t("exercise-details-nosubmissions")}
                    </NoSubmissions>
                  )}
                </ExerciseSubmissions>
              </ExerciseDetails>
            )}
          </Spring>
        </Container>
      )}
    </Translate>
  );
};

export default ExercisePanel;

/* styled components */

const Container = styled.div`
  border: 1px solid #c0c3c9;
  border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
  width: 100%;
`;

const ExerciseDetails = styled.div`
  overflow: hidden;
`;

const ExerciseInfo = styled.div`
  align-items: center;
  border-top: 1px solid #c0c3c9;
  color: #777;
  display: flex;
  font-family: Roboto;
  font-size: 14px;
  text-align: right;
  height: 69px;
  justify-content: space-between;
  padding: 0 20px;

  div {
    align-items: center;
    display: flex;
  }
`;

const SubmissionsSwitch = styled(Switch)`
  margin-left: 10px;
`;

const ExerciseSubmissions = styled.div``;

const NoSubmissions = styled.div`
  align-items: center;
  border-top: 1px solid #c0c3c9;
  color: #323843;
  display: flex;
  font-size: 14px;
  font-style: italic;
  height: 21px;
  justify-content: center;
  line-height: 1.57;
  padding: 30px 20px;
  text-align: center;
`;

const ExerciseMenu = styled(DocumentCardMenu)`
  right: 0;
  top: 46px;
  z-index: 2;
`;

const Header = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
`;

const HeaderCenter = styled.div`
  align-items: center;
  display: flex;
  flex: 1 1 100%;
  justify-content: space-between;
  padding: 10px;
  width: calc(100% - 120px); /* 40px padding & 80px other headers*/
`;

const HeaderLeft = styled.div`
  align-items: center;
  border-right: 1px solid #c0c3c9;
  cursor: pointer;
  display: flex;
  flex: 1 0 39px;
  justify-content: center;
  max-width: 39px;
`;

interface ToggleProps {
  isOpen: boolean;
}
const Toggle = styled.div<ToggleProps>`
  svg {
    transform: rotate(-90deg);
    width: 16px;
  }

  ${(props: ToggleProps) =>
    props.isOpen &&
    css`
      svg {
        transform: rotate(180deg);
      }
    `}
`;

const HeaderRight = styled.div`
  align-items: center;
  border-left: 1px solid #c0c3c9;
  cursor: pointer;
  display: flex;
  flex: 1 0 39px;
  justify-content: center;
  max-width: 39px;

  svg {
    transform: rotate(90deg);
  }

  &:hover {
    background-color: #e8e8e8;
  }
`;

const Title = styled.div`
  color: #474749;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: calc(100% - 100px); /* 100px Date */
`;

const Date = styled.div`
  color: #777;
  font-size: 14px;
  font-size: 14px;
  min-width: 100px;
  text-align: right;
`;

const HeaderRow = styled.div`
  display: flex;
  font-size: 16px;
  align-items: center;
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0px;
  }

  span {
    margin-right: 10px;
    color: ${colors.gray4};
  }
`;

const CodeBox = styled.div`
  align-items: center;
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  color: #474749;
  display: flex;
  font-family: Roboto Mono;
  font-size: 14px;
  font-style: italic;
  font-weight: 500;
  height: 28px;
  justify-content: center;
  margin-right: 10px;
  padding: 0px 20px;
`;

const Content = styled.div`
  overflow: hidden;
`;

const Online = styled.div`
  background-color: #82ad3a;
  border-radius: 100%;
  height: 12px;
  margin-right: 6px;
  width: 12px;
`;

const Table = styled.table`
  width: 100%;

  thead {
    width: 100%;

    tr {
      border-top: 1px solid #c0c3c9;
      height: 40px;
      width: 100%;
    }

    th {
      color: #474749;
      font-family: Roboto;
      font-size: 12px;
      font-weight: bold;
      height: 26px;
      padding: 7px 20px;
      text-align: left;
      vertical-align: bottom;
    }
  }

  tbody {
    width: 100%;

    tr {
      border-top: 1px solid #c0c3c9;
      width: 100%;
    }

    td {
      color: #373b44;
      font-family: Roboto;
      font-size: 14px;
      height: 14px;
      padding: 12px 20px;
      vertical-align: center;
      &:first-of-type {
        max-width: 0;
        width: 60%;
      }
    }
  }
`;

const StudentCell = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`;

const StudentNick = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
`;
