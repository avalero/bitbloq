import * as React from "react";
import { FC, useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Router from "next/router";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import gql from "graphql-tag";
import {
  colors,
  Input,
  Panel,
  Button,
  DialogModal,
  HorizontalRule,
  Checkbox
} from "@bitbloq/ui";
import withApollo from "../apollo/withApollo";
import logoBetaImage from "../images/logo-beta.svg";
import { isValidDate, isValidEmail } from "../util";

const SAVE_MUTATION = gql`
  mutation SignUpUser($input: UserIn!) {
    signUpUser(input: $input) {
      id
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SelectUserPlanAndFinishSignUp($id: string, $userPlan: string) {
    selectUserPlanAndFinishSignUp(id: $id, userPlan: $userPlan)
  }
`;

interface IUserInputs {
  acceptTerms: boolean;
  date: Date;
  day: number;
  email: string;
  imTeacherCheck: boolean;
  month: number;
  name: string;
  noNotifications: boolean;
  password: string;
  surnames: string;
  year: number;
}

interface IUserPlanInput {
  usePlan: string;
}

// TODO: use or remove
interface IUserIn {
  bornDate: Date;
  centerName: string;
  country: string;
  educationalStage: string;
  email: string;
  imTeacherCheck: boolean;
  name: string;
  notifications: boolean;
  password: string;
  postCode: number;
  province: string;
  surnames: string;
}

const SignupPage: FC = () => {
  const [accountCreated, setAccountCreated] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [userId, setUserId] = useState();
  const [userData, setUserData] = useState({});

  const [saveUser, { loading: saving, error: savingError }] = useMutation(
    SAVE_MUTATION
  );
  const [signupUser, { loading: signingup, error: signupError }] = useMutation(
    SIGNUP_MUTATION
  );

  const wrapRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    wrapRef.current.scrollIntoView();
  }, [currentStep]);

  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  const goToNextStep = () => setCurrentStep(currentStep + 1);

  const onSaveUser = async (userInputs: IUserInputs) => {
    const result = await saveUser({
      variables: {
        input: {
          bornDate: userInputs.date,
          email: userInputs.email,
          imTeacherCheck: userInputs.imTeacherCheck,
          name: userInputs.name,
          notifications: !userInputs.noNotifications,
          password: userInputs.password,
          surnames: userInputs.surnames
        }
      }
    });
    setUserData(userInputs);
    setUserId(result.data.signUpUser.id);
    goToNextStep();
  };

  const onSignupUser = async (userPlanInput: IUserPlanInput) => {
    await signupUser({
      variables: {
        id: userId,
        userPlan: userPlanInput.usePlan
      }
    });
    setAccountCreated(true);
  };

  return (
    <Wrap ref={wrapRef}>
      {accountCreated ? (
        <DialogModal
          isOpen={true}
          title="Cuenta creada"
          text="Tu cuenta ha sido creada con éxito. Hemos enviado un email a tu dirección de correo electrónico para validar la cuenta."
          cancelText="Volver a la web"
          onCancel={() => Router.push("/")}
        />
      ) : (
        <Container>
          <Logo src={logoBetaImage} alt="Bitbloq Beta" />
          <SignupPanel>
            <SignupHeader>Crear una cuenta</SignupHeader>
            <HorizontalRule small />
            <Content>
              <Counter>Paso {currentStep} de 2</Counter>
              <Step1
                currentStep={currentStep}
                error={savingError}
                loading={saving}
                onSubmit={onSaveUser}
                userData={userData}
              />
              <Step2
                currentStep={currentStep}
                error={signupError}
                goToPreviousStep={goToPreviousStep}
                loading={signingup}
                onSubmit={onSignupUser}
              />
            </Content>
          </SignupPanel>
        </Container>
      )}
    </Wrap>
  );
};

const Step1: FC<any> = ({
  currentStep,
  error,
  loading,
  onSubmit,
  userData
}) => {
  if (currentStep !== 1) {
    return null;
  }

  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue
  } = useForm({ defaultValues: userData });

  register({ name: "date" }, { validate: isValidDate });

  useEffect(() => {
    if (error) setError("email", "existing");
  }, [error]);

  const onChangeDate = () => {
    setValue(
      "date",
      [getValues()["day"], getValues()["month"], getValues()["year"]].join("/")
    );
  };

  const onClickCheckOption = (name: string) => {
    clearError(name);
    setValue(name, !getValues()[name]);
  };

  const onGotoMicrosoft = () => {
    // TODO
  };

  const onGotoGoogle = () => {
    // TODO
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>Datos de usuario</Title>
      <Login>
        <p>
          ¿Ya tienes cuenta con esta versión de Bitbloq?{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              Router.push("/login");
            }}
          >
            Entra usando tus credenciales
          </a>
          .
        </p>
        <LoginWith>
          <div>
            <p>Crear la cuenta con mi perfil de:</p>
            <LoginWithInfo>
              <p>
                Registrándote con una cuenta, estás aceptando las{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#">
                  condiciones generales
                </a>{" "}
                y la{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
                  política de privacidad
                </a>
                .
              </p>
            </LoginWithInfo>
          </div>
          <LoginWithExternalProfile>
            <Button tertiary onClick={onGotoMicrosoft}>
              Microsoft
            </Button>
            <Button tertiary onClick={onGotoGoogle}>
              Google
            </Button>
          </LoginWithExternalProfile>
        </LoginWith>
      </Login>
      <FormGroup>
        <FormField>
          <label>Nombre</label>
          <Input
            type="text"
            name="name"
            placeholder="Nombre"
            ref={register({ required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <ErrorMessage>
              El nombre que has introducido no es válido
            </ErrorMessage>
          )}
        </FormField>
        <FormField>
          <label>Apellidos</label>
          <Input
            type="text"
            name="surnames"
            placeholder="Apellidos"
            ref={register({ required: true })}
            error={!!errors.surnames}
          />
          {errors.surnames && (
            <ErrorMessage>
              Los apellidos que has introducido no son válidos
            </ErrorMessage>
          )}
        </FormField>
      </FormGroup>
      <FormField>
        <label>Correo electrónico</label>
        <Input
          type="text"
          name="email"
          placeholder="Correo electrónico"
          onChange={() => clearError("email")}
          ref={register({ validate: isValidEmail })}
          error={!!errors.email}
        />
        {errors.email && errors.email.type === "validate" && (
          <ErrorMessage>
            Debes introducir una dirección de correo electrónico válida
          </ErrorMessage>
        )}
        {errors.email && errors.email.type === "existing" && (
          <ErrorMessage>
            Ya hay un usuario registrado con este correo electrónico
          </ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>Contraseña</label>
        <Input
          type="text"
          name="password"
          placeholder="Contraseña"
          ref={register({ required: true })}
          error={!!errors.password}
        />
        {errors.password && (
          <ErrorMessage>Debes introducir una contraseña</ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>Fecha de nacimiento</label>
        <FormGroup onChange={onChangeDate}>
          <Input
            type="number"
            name="day"
            placeholder="DD"
            ref={register}
            error={!!errors.year || !!errors.date}
          />
          <Input
            type="number"
            name="month"
            placeholder="MM"
            ref={register}
            error={!!errors.year || !!errors.date}
          />
          <Input
            type="number"
            name="year"
            placeholder="AAAA"
            ref={register({ minLength: 4 })}
            error={!!errors.year || !!errors.date}
          />
        </FormGroup>
        {(errors.year || errors.date) && (
          <ErrorMessage>Debes introducir una fecha válida</ErrorMessage>
        )}
      </FormField>
      <CheckOption onClick={() => onClickCheckOption("imTeacherCheck")}>
        <input hidden type="checkbox" name="imTeacherCheck" ref={register} />
        <Checkbox checked={getValues()["imTeacherCheck"]} />
        <span>Soy profesor</span>
      </CheckOption>
      <input hidden type="checkbox" name="noNotifications" ref={register} />
      <CheckOption onClick={() => onClickCheckOption("noNotifications")}>
        <Checkbox checked={getValues()["noNotifications"]} />
        <span>
          No quiero recibir noticias y novedades en mi correo electrónico.
        </span>
      </CheckOption>
      <input
        hidden
        type="checkbox"
        name="acceptTerms"
        ref={register({ required: true })}
      />
      <CheckOption onClick={() => onClickCheckOption("acceptTerms")}>
        <Checkbox
          checked={getValues()["acceptTerms"]}
          error={!!errors.acceptTerms}
        />
        <span>
          He leido y acepto las{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#">
            condiciones generales
          </a>{" "}
          y la{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
            política de privacidad
          </a>
          .
        </span>
      </CheckOption>
      {errors.acceptTerms && (
        <ErrorMessage>
          Debes leer y aceptar las condiciones generales y la política de
          privacidad
        </ErrorMessage>
      )}
      <Buttons>
        <Button secondary onClick={() => Router.push("/")}>
          Cancelar
        </Button>
        <Button tertiary type="submit" disabled={loading}>
          Guardar
        </Button>
      </Buttons>
    </form>
  );
};

const Step2: FC<any> = ({
  currentStep,
  error,
  loading,
  onSubmit,
  goToPreviousStep
}) => {
  if (currentStep !== 2) {
    return null;
  }

  const { handleSubmit, register } = useForm();

  useEffect(() => {
    // TODO: check error management
    if (error) console.log("Ha habido algún error: " + error);
  }, [error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>Configuración de la cuenta</Title>
      <input name="usePlan" value="teacher" ref={register} />
      <Buttons>
        <Button tertiary onClick={goToPreviousStep}>
          Volver
        </Button>
        <Button type="submit" disabled={loading}>
          Crear cuenta
        </Button>
      </Buttons>
    </form>
  );
};

export default withApollo(SignupPage, { requiresSession: false });

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

const SignupHeader = styled.div`
  text-align: center;
  height: 105px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
`;

const Content = styled.div`
  font-size: 14px;
  line-height: 22px;
  padding: 40px;

  a {
    color: ${colors.brandBlue};
    font-style: italic;
    font-weight: bold;
    text-decoration: none;
  }
`;

const Counter = styled.div`
  color: ${colors.gray4};
  text-transform: uppercase;
  margin-bottom: 8px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 40px;
`;

const Login = styled.div`
  color: #474749;
`;

const LoginWith = styled.div`
  display: flex;
  padding: 20px 0;
  width: 50%;
`;

const LoginWithInfo = styled.div`
  font-size: 12px;
  padding-top: 10px;
`;

const LoginWithExternalProfile = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;

  button {
    background-color: white;
    border: solid 1px #dddddd;
    border-radius: 4px;
    cursor: pointer;
    height 40px;
    width: 145px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const FormGroup = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 10px;
  }
`;

const FormField = styled.div`
  flex: 1;
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
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;
