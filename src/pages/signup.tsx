import * as React from "react";
import styled from "@emotion/styled";
import { navigate } from "gatsby";
import { Global } from "@emotion/core";
import SEO from "../components/SEO";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import {
  baseStyles,
  colors,
  Input,
  Panel,
  Button,
  HorizontalRule,
  Checkbox
} from "@bitbloq/ui";
import Survey, { Question, QuestionType } from "../components/Survey";
import logoBetaImage from "../images/logo-beta.svg";

const SIGNUP_MUTATION = gql`
  mutation Signup($user: UserIn!) {
    signUpUser(input: $user)
  }
`;

const questions: Question[] = [
  {
    id: "isTeacher",
    type: QuestionType.SingleOption,
    title: "¿Eres profesor?",
    options: [{ label: "Sí", value: true }, { label: "No", value: false }]
  },
  {
    id: "courses",
    type: QuestionType.MultipleOption,
    title: "¿A qué cursos das clases?",
    options: [
      { label: "Primaria", value: "primary" },
      { label: "Secundaria", value: "secondary" },
      { label: "Universidad", value: "university" }
    ],
    allowOther: true,
    otherLabel: "Otros (Especificar)",
    otherPlaceholder: "Respuesta"
  },
  {
    id: "useReason",
    type: QuestionType.SingleOption,
    title: "¿Para qué quieres usar Bitbloq Beta?",
    options: [
      { label: "Probarlo", value: "test" },
      { label: "Usarlo en clase", value: "useInClass" },
      { label: "Ambas", value: "both" }
    ]
  },
  {
    id: "howDidYouKnow",
    type: QuestionType.SingleOption,
    title: "¿Cómo has conocido la existencia de esta beta?",
    options: [
      { label: "Alguien te lo ha contado", value: "someoneTold" },
      { label: "Lo has visto en las redes sociales", value: "socialNetworks" },
      { label: "Te hemos avisado por correo electrónico", value: "email" }
    ]
  },
  {
    id: "usedBefore",
    type: QuestionType.Text,
    title: "¿Habías usado antes Bitbloq? ¿Durante cuanto tiempo?",
    placeholder: "Respuesta"
  },
  {
    id: "worked3DBefore",
    type: QuestionType.Text,
    title:
      "¿Has trabajado el diseño 3D alguna vez? ¿Qué plataformas de 3D has utilizado?",
    placeholder: "Respuesta"
  }
];

interface UserField {
  label: string;
  field: string;
  placeholder?: string;
  type: string;
}

const userFields: UserField[] = [
  {
    label: "Nombre",
    field: "name",
    placeholder: "Pepe Pérez",
    type: "text"
  },
  {
    label: "Correo electrónico",
    field: "email",
    placeholder: "pepe@perez.com",
    type: "email"
  },
  {
    label: "Contraseña",
    field: "password",
    type: "password"
  },
  {
    label: "Repetir contraseña",
    field: "repeatPassword",
    type: "password"
  }
];

enum SignupStep {
  Survey,
  UserData
}

interface UserData {
  name: string;
  email: string;
  password: string;
  repeatPassword: string;
}

class SignupPageState {
  readonly currentStep: SignupStep = SignupStep.Survey;
  readonly surveyValues: object = {};
  readonly userData: UserData = {
    name: "",
    email: "",
    password: "",
    repeatPassword: ""
  };
  readonly receiveNews: boolean = false;
  readonly legalAge: boolean = false;
  readonly acceptTerms: boolean = false;
}

class SignupPage extends React.Component<any, SignupPageState> {
  readonly state = new SignupPageState();

  wrapRef = React.createRef();

  componentDidUpdate(prevProps, prevState: SignupPageState) {
    const { currentStep } = this.state;
    if (currentStep !== prevState.currentStep && this.wrapRef.current) {
      this.wrapRef.current.scrollIntoView();
    }
  }

  onCreateAccount = () => {
    const { userData, surveyValues } = this.state;
  };

  canCreateAccount() {
    const { userData, receiveNews, legalAge, acceptTerms } = this.state;
    const { name, email, password, repeatPassword } = userData;

    if (!name || !email || !password || !legalAge || !acceptTerms) {
      return false;
    }

    if (password !== repeatPassword) {
      return false;
    }

    return true;
  }

  renderSurveyStep() {
    const { surveyValues } = this.state;

    return (
      <StepContent>
        <StepCount>Paso 1 de 2</StepCount>
        <StepTitle>Encuesta previa</StepTitle>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed aliquet
          massa id quam lobortis lobortis. Nullam aliquam lorem vitae dignissim
          maximus. Donec accumsan gravida lacinia.
        </p>
        <Survey
          questions={questions}
          values={surveyValues}
          onChange={values => this.setState({ surveyValues: values })}
        />
        <Buttons>
          <Button secondary onClick={() => navigate("/")}>
            Cancelar
          </Button>
          <Button
            tertiary
            onClick={() => this.setState({ currentStep: SignupStep.UserData })}
          >
            Siguiente
          </Button>
        </Buttons>
      </StepContent>
    );
  }

  renderUserDataStep() {
    const {
      userData,
      receiveNews,
      legalAge,
      acceptTerms,
      surveyValues
    } = this.state;

    return (
      <StepContent>
        <StepCount>Paso 2 de 2</StepCount>
        <StepTitle>Datos de usuario</StepTitle>
        {userFields.map(field => (
          <FormGroup key={field.field}>
            <label>{field.label}</label>
            <Input
              type={field.type}
              placeholder={field.placeholder}
              value={userData[field.field]}
              onChange={e =>
                this.setState({
                  userData: { ...userData, [field.field]: e.target.value }
                })
              }
            />
          </FormGroup>
        ))}
        <CheckOption
          onClick={() => this.setState({ receiveNews: !receiveNews })}
        >
          <Checkbox checked={receiveNews} />
          <span>
            Acepto recibir noticias y novedades en mi correo electrónico.
          </span>
        </CheckOption>
        <CheckOption onClick={() => this.setState({ legalAge: !legalAge })}>
          <Checkbox checked={legalAge} />
          <span>Soy mayor de edad.</span>
        </CheckOption>
        <CheckOption
          onClick={() => this.setState({ acceptTerms: !acceptTerms })}
        >
          <Checkbox checked={acceptTerms} />
          <span>
            He leido y acepto la <a href="#">política de privacidad.</a>
          </span>
        </CheckOption>
        <Buttons>
          <Button
            tertiary
            onClick={() => this.setState({ currentStep: SignupStep.Survey })}
          >
            Volver
          </Button>
          <Mutation
            mutation={SIGNUP_MUTATION}
            onCompleted={() => navigate("/")}
          >
            {(signUp, { loading }) => (
              <Button
                onClick={() =>
                  signUp({
                    variables: {
                      user: {
                        email: userData.email,
                        password: userData.password,
                        notifications: receiveNews,
                        signUpSurvey: surveyValues
                      }
                    }
                  })
                }
                disabled={!this.canCreateAccount() || loading}
              >
                Crear cuenta
              </Button>
            )}
          </Mutation>
        </Buttons>
      </StepContent>
    );
  }

  render() {
    const { currentStep } = this.state;

    return (
      <>
        <SEO title="Signup" keywords={[`bitbloq`]} />
        <Global styles={baseStyles} />
        <Wrap ref={this.wrapRef}>
          <Container>
            <Logo src={logoBetaImage} alt="Bitbloq Beta" />
            <SignupPanel>
              <PanelHeader>Crear cuenta de profesor</PanelHeader>
              <HorizontalRule small />
              {currentStep === SignupStep.Survey && this.renderSurveyStep()}
              {currentStep === SignupStep.UserData && this.renderUserDataStep()}
            </SignupPanel>
          </Container>
        </Wrap>
      </>
    );
  }
}

export default SignupPage;

/* Styled components */

const Wrap = styled.div`
  display: flex;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  min-height: 100%;
  justify-content: center;
  background-color: ${colors.gray1};
`;

const Container = styled.div`
  max-width: 800px;
  margin: 60px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.img`
  width: 180px;
  margin-bottom: 40px;
`;

const SignupPanel = styled(Panel)`
  width: 100%;
`;

const PanelHeader = styled.div`
  text-align: center;
  height: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`;

const StepContent = styled.div`
  padding: 40px;
  font-size: 14px;

  p {
    line-height: 1.57;
    margin: 0px 0px 20px 0px;
  }
`;

const StepCount = styled.div`
  color: ${colors.gray4};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const StepTitle = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 40px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const CheckOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
  a {
    color: ${colors.brandBlue};
    font-style: italic;
    font-weight: bold;
    text-decoration: none;
  }
`;
