import React, { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Router from "next/router";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { Formik, Form, Field } from "formik";
import {
  colors,
  Input,
  Panel,
  Button,
  DialogModal,
  HorizontalRule,
  Checkbox
} from "@bitbloq/ui";
import { ApolloError } from "apollo-client";
import withApollo from "../apollo/withApollo";
import Survey, { Question, QuestionType } from "../components/Survey";
import logoBetaImage from "../images/logo-beta.svg";
import { isValidEmail } from "../util";

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

// TODO: update and use
interface UserField {
  label: string;
  field: string;
  placeholder?: string;
  type: string;
}

// TODO: update to 1 and 2
enum SignupStep {
  Survey,
  UserData
}

interface ISignupPageProps {
  signUp: any;
  isSigningUp: boolean;
  signUpError?: ApolloError;
}

const SignupPage: FC<ISignupPageProps> = ({
  signUp,
  isSigningUp,
  signUpError
}) => {
  const [currentStep, setCurrentStep] = useState(SignupStep.Survey);
  const [prevSignUpError, setPrevSignUpError] = useState(signUpError);
  const [surveyValues, setSurveyValues] = useState({});

  const wrapRef = React.createRef<HTMLDivElement>();
  const formRef = React.createRef<Formik>();
  const prevStep = usePrevious(currentStep);

  useEffect(() => {
    if (wrapRef.current && currentStep !== prevStep) {
      wrapRef.current.scrollIntoView();
    }
  }, [currentStep]);

  useEffect(() => {
    if (formRef.current && signUpError && signUpError !== prevSignUpError) {
      formRef.current.setErrors({
        email: "Ya hay un usuario registrado con este correo electrónico"
      });
      console.log("Signup ERROR");
    }
    setPrevSignUpError(signUpError);
  }, [signUpError]);

  function usePrevious(value: any) {
    const ref = useRef();

    useEffect(() => {
      ref.current = value;
    }, [value]);

    return ref.current;
  }

  const renderSurveyStep = () => {
    return (
      <StepContent>
        <StepCount>Paso 1 de 2</StepCount>
        <StepTitle>Encuesta previa</StepTitle>
        <p>
          Bienvenido a la beta del nuevo Bitbloq. Para poder crear una cuenta de
          usuario necesitamos que rellenes la siguiente información que nos
          ayudará a conocer mejor tus necesidades. Por motivos técnicos la
          cuenta de usuario que crees y su contenido se eliminará tras finalizar
          la beta.
        </p>
        <Survey
          questions={questions}
          values={surveyValues}
          onChange={setSurveyValues}
        />
        <Buttons>
          <Button secondary onClick={() => Router.push("/")}>
            Cancelar
          </Button>
          <Button tertiary onClick={() => setCurrentStep(SignupStep.UserData)}>
            Siguiente
          </Button>
        </Buttons>
      </StepContent>
    );
  };

  const renderUserDataStep = () => {
    return (
      <StepContent>
        <StepCount>Paso 2 de 2</StepCount>
        <StepTitle>Datos de usuario</StepTitle>
        <Formik
          ref={formRef}
          initialValues={{
            name: "",
            email: "",
            password: "",
            repeatPassword: "",
            receiveNews: false,
            legalAge: false,
            acceptTerms: false
          }}
          validate={values => {
            const errors: any = {};
            if (!values.name) {
              errors.name = "Debes introducir un nombre";
            }
            if (!values.email) {
              errors.email = "Debes introducir un correo electronico";
            } else if (!isValidEmail(values.email)) {
              errors.email = "La dirección de correo electrónico no es válida";
            }
            if (!values.password) {
              errors.password = "Debes introducir una contraseña";
            }
            if (values.password !== values.repeatPassword) {
              errors.repeatPassword = "Las dos contraseñas no coinciden";
            }
            if (!values.legalAge) {
              errors.legalAge = "Debes ser mayor de edad para crear una cuenta";
            }
            if (!values.acceptTerms) {
              errors.acceptTerms =
                "Debes leer y aceptar las condiciones generales para crear una cuenta.";
            }
            return errors;
          }}
          onSubmit={values => {
            signUp({
              variables: {
                user: {
                  email: values.email,
                  name: values.name,
                  password: values.password,
                  notifications: values.receiveNews,
                  signUpSurvey: surveyValues
                }
              }
            });
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <FormGroup>
                <label>Nombre</label>
                <Field
                  name="name"
                  component={FormInput}
                  type="text"
                  placeholder="Pepe Pérez"
                />
              </FormGroup>
              <FormGroup>
                <label>Correo electrónico</label>
                <Field
                  name="email"
                  component={FormInput}
                  type="email"
                  placeholder="pepe@perez.com"
                />
              </FormGroup>
              <FormGroup>
                <label>Contraseña</label>
                <Field name="password" component={FormInput} type="password" />
              </FormGroup>
              <FormGroup>
                <label>Repetir contraseña</label>
                <Field
                  name="repeatPassword"
                  component={FormInput}
                  type="password"
                />
              </FormGroup>
              <Field
                name="receiveNews"
                component={FormCheckbox}
                label="Acepto recibir noticias y novedades en mi correo electrónico."
              />
              <Field
                name="legalAge"
                component={FormCheckbox}
                label="Soy mayor de edad."
              />
              <Field
                name="acceptTerms"
                component={FormCheckbox}
                label={
                  <>
                    He leido y acepto la{" "}
                    <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
                      política de privacidad.
                    </a>
                  </>
                }
              />
              <Buttons>
                <Button
                  tertiary
                  onClick={() => setCurrentStep(SignupStep.Survey)}
                >
                  Volver
                </Button>
                <Button type="submit" disabled={isSigningUp}>
                  Crear cuenta
                </Button>
              </Buttons>
            </Form>
          )}
        </Formik>
      </StepContent>
    );
  };

  return (
    <Wrap ref={wrapRef}>
      <Container>
        <Logo src={logoBetaImage} alt="Bitbloq Beta" />
        <SignupPanel>
          <PanelHeader>Crear cuenta</PanelHeader>
          <HorizontalRule small />
          {currentStep === SignupStep.Survey && renderSurveyStep()}
          {currentStep === SignupStep.UserData && renderUserDataStep()}
        </SignupPanel>
      </Container>
    </Wrap>
  );
};

const SignupPageWithMutation = () => {
  const [accountCreated, setAccountCreated] = useState(false);

  if (accountCreated) {
    return (
      <Wrap>
        <DialogModal
          isOpen={true}
          title="Cuenta creada"
          text="Tu cuenta ha sido creada con éxito. Hemos enviado un email a tu dirección de correo electrónico para validar la cuenta."
          cancelText="Volver a la web"
          onCancel={() => Router.push("/")}
        />
      </Wrap>
    );
  }

  return (
    <Mutation
      mutation={SIGNUP_MUTATION}
      onCompleted={() => setAccountCreated(true)}
    >
      {(
        signUp,
        { loading, error }: { loading: boolean; error?: ApolloError }
      ) => (
        <SignupPage signUp={signUp} isSigningUp={loading} signUpError={error} />
      )}
    </Mutation>
  );
};

export default withApollo(SignupPageWithMutation, { requiresSession: false });

const FormInput = ({ field, form: { touched, errors }, ...props }) => {
  const showError = touched[field.name] && errors[field.name];
  return (
    <div>
      <Input {...field} {...props} error={showError} />
      {showError && <ErrorMessage>{errors[field.name]}</ErrorMessage>}
    </div>
  );
};

const FormCheckbox = ({
  field,
  form: { touched, errors, setFieldValue },
  label,
  ...props
}) => {
  const showError = touched[field.name] && errors[field.name];
  return (
    <div>
      <CheckOption onClick={() => setFieldValue(field.name, !field.value)}>
        <Checkbox
          {...field}
          {...props}
          checked={field.value}
          error={showError}
        />
        <span>{label}</span>
      </CheckOption>
      {showError && <ErrorMessage>{errors[field.name]}</ErrorMessage>}
    </div>
  );
};

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

const ErrorMessage = styled.div`
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;
