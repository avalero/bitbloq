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
          <Header>
            <HeaderLeft onClick={() => setOpen(!isOpen)}>
              <Toggle isOpen={isOpen}>
                <Icon name="angle" />
              </Toggle>
            </HeaderLeft>
            <HeaderCenter>
              <Title>{exercise.title}</Title>
              <Date>{dayjs(exercise.createdAt).format("DD/MM/YY HH:mm")}</Date>
            </HeaderCenter>
            <HeaderRight
              onClick={() => {
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
          <ExerciseDetails>
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
            <ExerciseSubmissions></ExerciseSubmissions>
          </ExerciseDetails>
          {/*<Header>
            <HeaderLeft onClick={() => this.setState({ isOpen: !isOpen })}>
              <Toggle isOpen={isOpen}>
                <Icon name="angle" />
              </Toggle>
              <div>
                <Title>{exercise.title}</Title>
                <Date>{dayjs(exercise.createdAt).format("DD/MM/YY hh:mm")}</Date>
              </div>
            </HeaderLeft>
            <HeaderRight>
              <HeaderRow>
                <span>Código para compartir:</span>
                <CodeBox>{exercise.code}</CodeBox>
              </HeaderRow>
              <HeaderRow>
                <span>Admite más entregas:</span>
                <Switch
                  value={exercise.acceptSubmissions}
                  onChange={onAcceptedSubmissions}
                />
              </HeaderRow>
            </HeaderRight>
          </Header>
          <Spring to={{ height: isOpen ? "auto" : 0 }}>
            {({ height }) => (
              <Content style={{ height }}>
                {exercise.submissions && exercise.submissions.length > 0 && (
                  <Table key="table" style={{ height }}>
                    <thead>
                      <tr>
                        <th>Alumnos</th>
                        <th>Fecha de entrega</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.submissions.map(submission => (
                        <tr key={submission.id}>
                          <td>
                            <StudentCell>
                              <StudentNick>{submission.studentNick}</StudentNick>
                              <Button
                                tertiary
                                small
                                onClick={() => onCancelSubmission(submission)}
                              >
                                Expulsar
                              </Button>
                            </StudentCell>
                          </td>
                          <td>
                            {submission.finished &&
                              dayjs(submission.finishedAt).format(
                                "DD/MM/YY hh:mm"
                              )}
                          </td>
                          <td>
                            {submission.finished && (
                              <Button
                                tertiary
                                small
                                onClick={() => onCheckSubmission(submission)}
                              >
                                Comprobar
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                )}
              </Content>
            )}
          </Spring>*/}
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

const ExerciseDetails = styled.div``;

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

const Table = styled.table`
  width: 100%;

  thead {
    background-color: ${colors.gray2};

    tr {
      border-style: solid;
      border-width: 1px 0px;
    }

    th {
      text-align: left;
      height: 30px;
      padding: 0px 20px;
      vertical-align: middle;
      font-size: 12px;
      font-weight: bold;
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${colors.gray3};
      &:last-child {
        border-bottom: none;
      }
    }

    td {
      padding: 0px 20px;
      &:first-of-type {
        width: 60%;
        border-right: 1px solid ${colors.gray3};
      }
      &:nth-of-type(2) {
        width: 40%;
      }
    }
  }
`;

const StudentCell = styled.div`
  display: flex;
  align-items: center;
  height: 48px;
`;

const StudentNick = styled.div`
  flex: 1;
`;
