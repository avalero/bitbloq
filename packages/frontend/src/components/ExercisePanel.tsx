import * as React from "react";
import dayjs from "dayjs";
import { Spring } from "react-spring";
import styled from "@emotion/styled";
import { css } from "@emotion/core";
import { colors, Button, Icon, Switch } from "@bitbloq/ui";

export interface ExercisePanelProps {
  exercise: any;
  onCancelSubmission: (any) => void;
  onCheckSubmission: (any) => void;
}

class ExercisePanelState {
  readonly isOpen: boolean = false;
}

class ExercisePanel extends React.Component<
  ExercisePanelProps,
  ExercisePanelState
> {
  readonly state = new ExercisePanelState();

  render() {
    const { exercise, onCancelSubmission, onCheckSubmission } = this.props;
    const { isOpen } = this.state;

    return (
      <Container>
        <Header>
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
              <Switch value={true} onChange={() => {}} />
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
        </Spring>
      </Container>
    );
  }
}

export default ExercisePanel;

/* styled components */

const Container = styled.div`
  border: 1px solid;
  border-radius: 4px;
  margin-bottom: 40px;
`;

const Header = styled.div`
  display: flex;
  padding: 16px 20px;
`;

const HeaderLeft = styled.div`
  flex: 1;
  display: flex;
  cursor: pointer;
`;

interface ToggleProps {
  isOpen: boolean;
}
const Toggle = styled.div<ToggleProps>`
  svg {
    transform: rotate(-90deg);
    width: 16px;
    margin-right: 12px;
  }

  ${props =>
    props.isOpen &&
    css`
      svg {
        transform: none;
      }
    `}
`;

const HeaderRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Title = styled.div`
  font-size: 20px;
  margin-bottom: 10px;
`;

const Date = styled.div`
  font-size: 14px;
  color: ${colors.gray4};
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
  padding: 0px 20px;
  height: 30px;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 500;
  font-family: Roboto Mono;
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
