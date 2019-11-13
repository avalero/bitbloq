import React, { FC, useEffect, useState } from "react";
import Router from "next/router";
import { ApolloError } from "apollo-client";
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
  Checkbox,
  Option
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import withApollo from "../apollo/withApollo";
import logoBetaImage from "../images/logo-beta.svg";
import { isValidDate, isValidEmail } from "../util";

const SAVE_MUTATION = gql`
  mutation SaveUserData($input: UserIn!) {
    saveUserData(input: $input) {
      id
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation FinishSignUp($id: ObjectID!, $userPlan: String!) {
    finishSignUp(id: $id, userPlan: $userPlan)
  }
`;

enum UserPlanOptions {
  Member = "member",
  Teacher = "teacher"
}

interface IUserData {
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

interface IUserPlan {
  userPlan: UserPlanOptions;
}

interface IStepInput {
  defaultValues: {};
  error: ApolloError;
  goToPreviousStep?: () => void;
  loading: boolean;
  onSubmit: (userInputs: IUserData | IUserPlan) => void;
}

const SignupPage: FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [userData, setUserData] = useState({
    acceptTerms: false,
    imTeacherCheck: false,
    noNotifications: false,
  });
  const [userId, setUserId] = useState();
  const [userPlan, setUserPlan] = useState({ userPlan: UserPlanOptions.Member });

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
  const goToNextStep = () => setCurrentStep(currentStep < 3 ? currentStep + 1 : currentStep);

  const onSaveUser = (input: IUserData) => {
    setUserData(input);
    saveUser({
      variables: {
        input: {
          bornDate: input.date,
          email: input.email,
          imTeacherCheck: input.imTeacherCheck,
          name: input.name,
          notifications: !input.noNotifications,
          password: input.password,
          surnames: input.surnames
        }
      }
    }).then(result => {
      setUserId(result.data.saveUserData.id);
      goToNextStep();
    });
  };

  const onSignupUser = (input: IUserPlan) => {
    setUserPlan(input);
    signupUser({
      variables: {
        id: userId,
        userPlan: input.userPlan
      }
    }).then(() => goToNextStep());
  };

  return (
    <Wrap ref={wrapRef}>
      {currentStep === 3 ? (
        <DialogModal
          isOpen={true}
          title="Cuenta creada"
          text="Tu cuenta ha sido creada con éxito. Hemos enviado un email a tu dirección de correo electrónico para validar la cuenta. Si no ves el mensaje revisa tu carpeta de spam."
          okText="Volver a enviar email"
          onOk={() => onSignupUser(userPlan)}
          cancelText="Volver al inicio"
          onCancel={() => Router.push("/")}
          transparentOverlay={true}
          /* TODO: add counter */
        />
      ) : (
        <Container>
          <Logo src={logoBetaImage} alt="Bitbloq Beta" />
          <SignupPanel>
            <SignupHeader>Crear una cuenta</SignupHeader>
            <HorizontalRule small />
            <Content>
              <Counter>Paso {currentStep} de 2</Counter>
              {currentStep === 1 && (
                <Step1
                  defaultValues={userData}
                  error={savingError}
                  loading={saving}
                  onSubmit={onSaveUser}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  defaultValues={userPlan}
                  error={signupError}
                  goToPreviousStep={goToPreviousStep}
                  loading={signingup}
                  onSubmit={onSignupUser}
                />
              )}
            </Content>
          </SignupPanel>
        </Container>
      )}
    </Wrap>
  );
};

const Step1: FC<IStepInput> = ({ defaultValues, error, loading, onSubmit }) => {
  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue
  } = useForm({ defaultValues });

  register({ name: "date", type: "custom" }, { validate: isValidDate });
  register({ name: "imTeacherCheck", type: "custom" });
  register({ name: "noNotifications", type: "custom" });
  register(
    { name: "acceptTerms", type: "custom" },
    { validate: (value: boolean) => !!value }
  );

  useEffect(() => {
    // TODO: check error management - error 500
    if (error) setError("email", "existing");
  }, [error]);

  const onChangeDate = async () => {
    clearError("date");
    setValue(
      "date",
      [getValues().day, getValues().month, getValues().year].join("/")
    );
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
        {/* TODO: hide password */}
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
            error={!!errors.date}
          />
          <Input
            type="number"
            name="month"
            placeholder="MM"
            ref={register}
            error={!!errors.date}
          />
          <Input
            type="number"
            name="year"
            placeholder="AAAA"
            ref={register}
            error={!!errors.date}
          />
        </FormGroup>
        {errors.date && (
          <ErrorMessage>Debes introducir una fecha válida</ErrorMessage>
        )}
      </FormField>
      <CheckOption
        onClick={() => setValue("imTeacherCheck", !getValues().imTeacherCheck)}
      >
        <Checkbox checked={getValues().imTeacherCheck} />
        <span>Soy profesor</span>
      </CheckOption>
      <CheckOption
        onClick={() =>
          setValue("noNotifications", !getValues().noNotifications)
        }
      >
        <Checkbox checked={getValues().noNotifications} />
        <span>
          No quiero recibir noticias y novedades en mi correo electrónico.
        </span>
      </CheckOption>
      <CheckOption
        onClick={() => {
          clearError("acceptTerms");
          setValue("acceptTerms", !getValues().acceptTerms);
        }}
      >
        <Checkbox
          checked={getValues().acceptTerms}
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

const Step2: FC<IStepInput> = ({
  defaultValues,
  error,
  goToPreviousStep,
  loading,
  onSubmit
}) => {
  const { getValues, handleSubmit, register, setValue } = useForm({
    defaultValues
  });

  register({ name: "userPlan", type: "custom" }, { required: true });

  useEffect(() => {
    // TODO: check error management - error 500
    if (error) console.log("Ha habido algún error: " + error);
  }, [error]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>Configuración de la cuenta</Title>
      Elije el tipo de cuenta que deseas crear:
      <PlanOption>
        <Option
          className={"bullet"}
          checked={getValues().userPlan === UserPlanOptions.Member}
          onClick={() => setValue("userPlan", UserPlanOptions.Member)}
        />
        <PlanOptionInfo>
          <span>Miembro</span>
          <PlanOptionCost>Gratis</PlanOptionCost>
        </PlanOptionInfo>
      </PlanOption>
      <PlanOption>
        <Option
          className={"bullet"}
          checked={getValues().userPlan === UserPlanOptions.Teacher}
          onClick={() => setValue("userPlan", UserPlanOptions.Teacher)}
        />
        <PlanOptionInfo>
          <span>Profesor</span>
          <PlanOptionCost>
            <span>6€ al mes</span>
            <span>Gratis durante la beta</span>
          </PlanOptionCost>
        </PlanOptionInfo>
      </PlanOption>
      <Buttons>
        <Button tertiary onClick={goToPreviousStep}>
          Anterior
        </Button>
        <Button type="submit" disabled={loading}>
          ¡Unirme a Bitbloq ya!
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

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
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

  > :not(:first-of-type) {
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

const PlanOption = styled.div`
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  display: flex;
  height: 40px;
  margin-top: 10px;
  margin-bottom: 20px;

  .bullet {
    justify-content: center;
    width: 40px;
  }
`;

const PlanOptionInfo = styled.div`
  align-items: center;
  border-left: solid 1px #cfcfcf;
  display: flex;
  flex: 1;
  justify-content: space-between;
  padding: 0 20px;
`;

const PlanOptionCost = styled.div`
  font-weight: bold;

  > :first-of-type {
    color: #e0e0e0;
    text-decoration: line-through;
  }
`;
