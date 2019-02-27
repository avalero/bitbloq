import * as React from "react";
import styled from "@emotion/styled";
import { navigate, Link } from "gatsby";
import { Global, css } from "@emotion/core";
import {
  baseStyles,
  colors,
  Input,
  Panel,
  Button,
  HorizontalRule
} from "@bitbloq/ui";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import SEO from "../components/SEO";
import logoBetaImage from "../images/logo-beta.svg";
import studentStep1Image from "../images/student-step-1.svg";
import studentStep2Image from "../images/student-step-2.svg";
import teacherStep1Image from "../images/teacher-step-1.svg";
import teacherStep2Image from "../images/teacher-step-2.svg";

enum TabType {
  Teacher,
  Student
}

interface IndexPageProps {}

class IndexPageState {
  readonly currentTab: TabType = TabType.Teacher;
  readonly email: string = "";
  readonly password: string = "";
  readonly studentNick: string = "";
  readonly exerciseCode: string = "";
  readonly studentPassword: string = "";
}

const ME_QUERY = gql`
  query Me {
    me {
      name
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation Login($email: EmailAddress!, $password: String!) {
    login(email: $email, password: $password)
  }
`;

const LOGIN_SUBMISSION_MUTATION = gql`
  mutation LoginSubmission(
    $studentNick: String!
    $exerciseCode: String!
    $password: String!
  ) {
    loginSubmission(
      studentNick: $studentNick
      exerciseCode: $exerciseCode
      password: $password
    ) {
      token
      exerciseID
      type
    }
  }
`;

const getErrorText = ({ graphQLErrors: errors }) => {
  const error = errors && errors[0];
  if (error) {
    const code = error.extensions && error.extensions.code;
    switch (code) {
      case "INVALID_EXERCISE_CODE":
        return "El ejercicio no existe o ya no admite más alumnos";
      case "PASSWORD_ERROR":
        return "La contraseña es incorrecta";
      default:
        return "Error";
    }
  }
};

class IndexPage extends React.Component<IndexPageProps, IndexPageState> {
  readonly state = new IndexPageState();

  onTeacherLogin = ({ login: token }) => {
    window.sessionStorage.setItem("authToken", "");
    window.localStorage.setItem("authToken", token);
    navigate("/app");
  };

  onStudentLogin = ({ loginSubmission: { token, exerciseID, type } }) => {
    window.sessionStorage.setItem("authToken", token);
    navigate(`/app/exercise/${type}/${exerciseID}/`);
  };

  renderTeacherTab() {
    const { email, password } = this.state;

    return (
      <TabContent key={TabType.Teacher}>
        <TabInfo>
          <Step>
            <img src={teacherStep1Image} />
            <p>
              1. Para poder crear una cuenta de profesor, haz clic en este
              enlace:
              <br />
              <Link to="/signup">Crear cuenta de profesor.</Link>
            </p>
          </Step>
          <Step>
            <img src={teacherStep2Image} />
            <p>
              2. A partir de entonces siempre podrás acceder a tu cuenta usando
              el login de la derecha.
            </p>
          </Step>
        </TabInfo>
        <DashedLine />
        <Mutation mutation={LOGIN_MUTATION} onCompleted={this.onTeacherLogin}>
          {(login, { loading, error }) => (
            <LoginForm>
              <div>
                <Input
                  error={!loading && error}
                  value={email}
                  onChange={e => this.setState({ email: e.target.value })}
                  placeholder="Correo electrónico"
                  type="email"
                />
                <Input
                  error={!loading && error}
                  value={password}
                  onChange={e => this.setState({ password: e.target.value })}
                  placeholder="Contraseña"
                  type="password"
                />
                {!loading && error && (
                  <ErrorMessage>Email o contraseña incorrectos</ErrorMessage>
                )}
                <LoginButton
                  disabled={loading}
                  onClick={() => login({ variables: { email, password } })}
                >
                  Entrar
                </LoginButton>
              </div>
            </LoginForm>
          )}
        </Mutation>
      </TabContent>
    );
  }

  renderStudentTab() {
    const { studentNick, exerciseCode, studentPassword } = this.state;

    return (
      <TabContent key={TabType.Student}>
        <TabInfo>
          <Step>
            <img src={studentStep1Image} />
            <p>
              1. Para poder trabajar con el nuevo Bitbloq, debes pedirle a tu
              profesor o profesora un código de ejercicio. Podrás entrar en el
              ejercicio mientras tu profesor lo mantenga abierto.
            </p>
          </Step>
          <Step>
            <img src={studentStep2Image} />
            <p>
              2. Inserta el código de ejercicio en el formulario de la derecha y escribe el
              nombre de acceso que quieras usar y una contraseña (opcional).
              Recuérdalos para continuar el ejercicio otro día.
            </p>
          </Step>
        </TabInfo>
        <DashedLine />
        <Mutation
          mutation={LOGIN_SUBMISSION_MUTATION}
          onCompleted={this.onStudentLogin}
        >
          {(loginSubmission, { loading, error }) => (
            <LoginForm>
              <div>
                <CodeInput
                  error={!loading && error}
                  value={exerciseCode}
                  onChange={e =>
                    this.setState({ exerciseCode: e.target.value })
                  }
                  placeholder="Código de ejercicio"
                />
                <Input
                  error={!loading && error}
                  value={studentNick}
                  onChange={e => this.setState({ studentNick: e.target.value })}
                  placeholder="Nombre de acceso"
                />
                <Input
                  error={!loading && error}
                  value={studentPassword}
                  onChange={e =>
                    this.setState({ studentPassword: e.target.value })
                  }
                  placeholder="Contraseña (opcional)"
                  type="password"
                />
                {!loading && error && (
                  <ErrorMessage>{getErrorText(error)}</ErrorMessage>
                )}
                <LoginButton
                  disabled={loading}
                  onClick={() =>
                    loginSubmission({
                      variables: {
                        studentNick,
                        exerciseCode,
                        password: studentPassword
                      }
                    })
                  }
                >
                  Entrar
                </LoginButton>
              </div>
            </LoginForm>
          )}
        </Mutation>
      </TabContent>
    );
  }

  render() {
    const { currentTab } = this.state;

    return (
      <>
        <SEO title="Home" keywords={[`bitbloq`]} />
        <Global styles={baseStyles} />
        <Wrap>
          <Container>
            <Logo src={logoBetaImage} alt="Bitbloq Beta" />
            <DiscoverRow>
              <DiscoverTitle>Descubre el nuevo Bitbloq</DiscoverTitle>
              <DiscoverText>
                Prueba ya la beta del nuevo Bitbloq, el ecosistema de
                herramientas que ayudarán a los centros a cubrir todas las
                necesidades de aprendizaje tecnológico de las aulas del siglo
                XXI.
              </DiscoverText>
            </DiscoverRow>
            <Rule />
            <LoginPanel>
              <Tabs>
                <LoginAs>Acceder como:</LoginAs>
                <Tab
                  active={currentTab === TabType.Teacher}
                  onClick={() => this.setState({ currentTab: TabType.Teacher })}
                >
                  Profesor
                </Tab>
                <Tab
                  active={currentTab === TabType.Student}
                  onClick={() => this.setState({ currentTab: TabType.Student })}
                >
                  Alumno
                </Tab>
              </Tabs>
              {currentTab === TabType.Teacher && this.renderTeacherTab()}
              {currentTab === TabType.Student && this.renderStudentTab()}
            </LoginPanel>
          </Container>
        </Wrap>
        <Query query={ME_QUERY} fetchPolicy="network-only">
          {({ loading, error, data }) => {
            if (!loading && !error && data) {
              navigate("/app");
            }
            return null;
          }}
        </Query>
      </>
    );
  }
}

export default IndexPage;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  align-items: center;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 1085px;
  margin: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 300px;
  margin-bottom: 40px;
`;

const DiscoverRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
`;

const DiscoverTitle = styled.div`
  font-size: 30px;
  font-weight: 300;
  padding: 40px;
  flex: 1;
  text-align: center;
`;

const DiscoverText = styled.div`
  font-size: 14px;
  line-height: 1.57;
  padding: 40px;
  flex: 1;
`;

const Rule = styled(HorizontalRule)`
  margin: 0px 140px 50px 140px;
  align-self: stretch;
`;

const LoginPanel = styled(Panel)`
  display: flex;
  align-self: stretch;
  min-height: 285px;
`;

const Tabs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: 180px;
  padding-top: 74px;
  border-right: 1px solid ${colors.gray3};
  position: relative;
`;

const LoginAs = styled.div`
  position: absolute;
  font-size: 14px;
  top: 30px;
  left: 40px;
`;

interface TabProps {
  active: boolean;
}
const Tab = styled.div<TabProps>`
  background-color: ${colors.gray2};
  border-width: 1px 1px 1px 1px;
  border-style: solid;
  border-color: ${colors.gray2} white ${colors.gray2} ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  color: ${colors.gray4};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 58px;
  border-radius: 4px 0 0 4px;
  margin-right: -1px;
  cursor: pointer;
  box-sizing: border-box;

  ${props =>
    props.active &&
    css`
      background-color: white;
      border-color: ${colors.gray3} white ${colors.gray3} ${colors.gray3};
      color: ${colors.black};
      margin-rigth: 0px;
    `}
`;

const TabContent = styled.div`
  display: flex;
  flex: 1;
`;

const TabInfo = styled.div`
  flex: 1;
  display: flex;
  padding: 30px;
  justify-content: space-around;
  align-items: center;
`;

const Step = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 10px;
  max-width: 210px;

  img {
    height: 80px;
    width: 80px;
  }

  p {
    margin-top: 24px;
    font-size: 12px;
    line-height: 22px;
  }

  a {
    color: ${colors.brandBlue};
    font-weight: bold;
    font-style: italic;
    text-decoration: none;
  }
`;

const DashedLine = styled.div`
  width: 1px;
  background-image: linear-gradient(${colors.gray3} 55%, white 45%);
  background-size: 100% 20px;
`;

const CodeInput = styled(Input)`
  font-family: "Roboto Mono";
`;

const LoginForm = styled.form`
  box-sizing: border-box;
  width: 360px;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  ${Input}, ${CodeInput} {
    margin-bottom: 20px;
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
`;

const ErrorMessage = styled.div`
  margin-top: -10px;
  margin-bottom: 20px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;
