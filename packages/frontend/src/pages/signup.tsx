import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ApolloError } from "apollo-client";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import gql from "graphql-tag";
import {
  Button,
  Checkbox,
  colors,
  HorizontalRule,
  Icon,
  Input,
  Panel,
  Option,
  Select,
  useTranslate
} from "@bitbloq/ui";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import withApollo from "../apollo/withApollo";
import CounterButton from "../components/CounterButton";
import GraphQLErrorMessage from "../components/GraphQLErrorMessage";
import ModalLayout from "../components/ModalLayout";
import logoBetaImage from "../images/logo-beta.svg";
import { plans, featureTable } from "../config";
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

// TODO: translate
const EducationalStageOptions = [
  "Preescolar",
  "Primaria",
  "Secundaria",
  "Bachiller",
  "Universidad"
];

interface IUserData {
  acceptTerms: boolean;
  birthDate: string;
  centerName: string;
  city: string;
  countryKey: string;
  day: number;
  educationalStage: string;
  email: string;
  imTeacherCheck: boolean;
  month: number;
  name: string;
  noNotifications: boolean;
  password: string;
  postCode: number;
  surnames: string;
  year: number;
}

interface IUserPlan {
  userPlan: {
    name: string;
  };
}

interface IStepInput {
  defaultValues: {};
  error?: ApolloError;
  isAMinor?: boolean;
  goToPreviousStep?: () => void;
  loading: boolean;
  onSubmit: (userInputs: IUserData | IUserPlan) => void;
}

const isYoungerThan = (birthDate: string, years: number) =>
  dayjs().diff(
    dayjs(
      new Date(
        parseInt(birthDate.split("/")[2], 10),
        parseInt(birthDate.split("/")[1], 10) - 1,
        parseInt(birthDate.split("/")[0], 10)
      )
    ),
    "year"
  ) < years;

const SignupPage: FC = () => {
  const router = useRouter();
  const t = useTranslate();

  const { plan: defaultPlan } = router.query;
  const memberPlan = plans.find(p => p.name === "member");
  const teacherPlan = plans.find(p => p.name === "teacher");

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<ApolloError>();
  const [userError, setUserError] = useState<ApolloError>();
  const [userData, setUserData] = useState({
    acceptTerms: false,
    birthDate: "",
    countryKey: "ES",
    educationalStage: EducationalStageOptions[0],
    imTeacherCheck: teacherPlan && defaultPlan === teacherPlan.name,
    noNotifications: false
  });
  const [userId, setUserId] = useState();
  const [userPlan, setUserPlan] = useState();

  const [saveUser, { loading: saving }] = useMutation(SAVE_MUTATION);
  const [signupUser, { loading: signingup }] = useMutation(SIGNUP_MUTATION);

  const wrapRef = React.createRef<HTMLDivElement>();

  useEffect(() => {
    wrapRef.current!.scrollIntoView();
  }, [currentStep]);

  const goToPreviousStep = () => setCurrentStep(currentStep - 1);
  const goToNextStep = () =>
    setCurrentStep(currentStep < 3 ? currentStep + 1 : currentStep);

  const onSaveUser = (input: IUserData) => {
    setUserData(input);
    setUserPlan({
      userPlan:
        (input.imTeacherCheck ||
          (teacherPlan && defaultPlan === teacherPlan.name)) &&
        !isYoungerThan(input.birthDate, 18)
          ? teacherPlan
          : memberPlan
    });
    saveUser({
      variables: {
        input: {
          birthDate: input.birthDate,
          centerName: input.imTeacherCheck ? input.centerName : undefined,
          city: input.imTeacherCheck ? input.city : undefined,
          country: input.imTeacherCheck
            ? Object.keys(t("countries")).find(
                (key: string) => input.countryKey === key
              )
            : undefined,
          educationalStage: input.imTeacherCheck
            ? input.educationalStage
            : undefined,
          email: input.email,
          imTeacherCheck: input.imTeacherCheck,
          name: input.name,
          notifications: !input.noNotifications,
          password: input.password,
          postCode: input.imTeacherCheck ? input.postCode : undefined,
          surnames: input.surnames
        }
      }
    })
      .then(result => {
        setUserError(undefined);
        setUserId(result.data.saveUserData.id);
        goToNextStep();
      })
      .catch(e =>
        e.graphQLErrors[0].extensions.code === "USER_EMAIL_EXISTS"
          ? setUserError(e)
          : setError(e)
      );
  };

  const onSignupUser = (input: IUserPlan) => {
    setUserPlan(input);
    signupUser({
      variables: {
        id: userId,
        userPlan: input.userPlan.name
      }
    })
      .then(() => goToNextStep())
      .catch(e => setError(e));
  };

  return (
    <Wrap ref={wrapRef}>
      {error ? (
        <GraphQLErrorMessage apolloError={error} />
      ) : currentStep === 3 ? (
        <ModalLayout
          title={t("signup.modal-account.title")}
          modalTitle={t("signup.modal-account.title")}
          text={t("signup.modal-account.content")}
          okButton={
            <CounterButton onClick={() => onSignupUser(userPlan)}>
              {t("signup.modal-account.ok")}
            </CounterButton>
          }
          cancelText={t("signup.modal-account.cancel")}
          onCancel={() => router.push("/")}
          isOpen={true}
        />
      ) : (
        <Container>
          <Logo src={logoBetaImage} alt="Bitbloq Beta" />
          <SignupPanel>
            <SignupHeader>{t("signup.title")}</SignupHeader>
            <HorizontalRule small />
            <Content>
              <Counter>
                {t("signup.step-text-1")} {currentStep}{" "}
                {t("signup.step-text-2")}
              </Counter>
              {currentStep === 1 && (
                <Step1
                  defaultValues={userData}
                  error={userError}
                  loading={saving}
                  onSubmit={onSaveUser}
                />
              )}
              {currentStep === 2 && (
                <Step2
                  defaultValues={userPlan}
                  isAMinor={isYoungerThan(userData.birthDate, 18)}
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
  const router = useRouter();
  const t = useTranslate();

  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    setError,
    setValue
  } = useForm({ defaultValues });

  const [passwordIsMasked, setPasswordIsMasked] = useState(true);

  register(
    { name: "acceptTerms", type: "custom" },
    { validate: (value: boolean) => !!value }
  );
  register(
    { name: "birthDate", type: "custom" },
    {
      required: true,
      validate: {
        validDate: isValidDate,
        validAge: () => !isYoungerThan(getValues().birthDate, 14)
      }
    }
  );
  register({ name: "imTeacherCheck", type: "custom" });
  register({ name: "noNotifications", type: "custom" });

  useEffect(() => {
    if (error) {
      setError("email", "existing");
    }
  }, [error]);

  const onChangeBirthDate = () => {
    clearError("birthDate");
    setValue(
      "birthDate",
      [getValues().day, getValues().month, getValues().year].join("/")
    );
  };

  const togglePasswordMask = () => {
    setPasswordIsMasked(!passwordIsMasked);
  };

  const onGotoMicrosoft = () => {
    // TODO
  };

  const onGotoGoogle = () => {
    // TODO
  };

  const teacherSubForm = (isShown: boolean) => {
    register({ name: "countryKey", type: "custom" }, { required: isShown });
    register(
      { name: "educationalStage", type: "custom" },
      { required: isShown }
    );

    if (!isShown) {
      return;
    }

    // validation is not triggered automatically
    const onChangeValue = (name: string, value: string) => {
      setValue(name, value);
      if (errors[name]) {
        clearError(name);
      }
    };

    return (
      <>
        <FormGroup style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
          <FormField style={{ gridColumnStart: 1, gridColumnEnd: 3 }}>
            <label>{t("signup.step1.labels.center-name")}</label>
            <Input
              type="text"
              name="centerName"
              placeholder={t("signup.step1.placeholders.center-name")}
              ref={register({ required: true })}
              error={!!errors.centerName}
            />
            {errors.centerName && (
              <ErrorMessage>
                {t("signup.step1.errors.center-name")}
              </ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.step1.labels.educational-stage")}</label>
            <Select
              name="educationalStage"
              onChange={(value: string) =>
                onChangeValue("educationalStage", value)
              }
              options={EducationalStageOptions.map(o => ({
                value: o,
                label: o
              }))}
              selectConfig={{
                isSearchable: false
              }}
              value={getValues().educationalStage}
            />
          </FormField>
          <FormField>
            <label>{t("signup.step1.labels.city")}</label>
            <Input
              type="text"
              name="city"
              placeholder={t("signup.step1.placeholders.city")}
              ref={register({ required: true })}
              error={!!errors.city}
            />
            {errors.city && (
              <ErrorMessage>{t("signup.step1.errors.city")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.step1.labels.post-code")}</label>
            <Input
              type="number"
              name="postCode"
              placeholder={t("signup.step1.placeholders.post-code")}
              ref={register({ required: true })}
              error={!!errors.postCode}
            />
            {errors.postCode && (
              <ErrorMessage>{t("signup.step1.errors.post-code")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.step1.labels.country")}</label>
            <Select
              name="countryKey"
              onChange={(value: string) => onChangeValue("countryKey", value)}
              options={Object.keys(t("countries")).map((key: string) => ({
                value: key,
                label: t("countries")[key]
              }))}
              selectConfig={{
                isSearchable: true
              }}
              value={getValues().countryKey}
            />
            {/* TODO: translate NO OPTIONS message */}
          </FormField>
        </FormGroup>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>{t("signup.step1.title")}</Title>
      <Login>
        <p>
          {t("signup.step1.login.account-text")}{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            {t("signup.step1.login.account-link")}
          </a>
          .
        </p>
        <LoginWith>
          <div>
            <p>{t("signup.step1.login.with-text")}</p>
            <LoginWithInfo>
              <p>
                {t("signup.step1.login.with-sub-text-1")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#">
                  {t("signup.step1.link-general-conditions")}
                </a>{" "}
                {t("signup.step1.login.with-sub-text-2")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
                  {t("signup.step1.link-privacy-policy")}
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
          <label>{t("signup.step1.labels.name")}</label>
          <Input
            type="text"
            name="name"
            placeholder={t("signup.step1.placeholders.name")}
            ref={register({ required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <ErrorMessage>{t("signup.step1.errors.name")}</ErrorMessage>
          )}
        </FormField>
        <FormField>
          <label>{t("signup.step1.labels.surnames")}</label>
          <Input
            type="text"
            name="surnames"
            placeholder={t("signup.step1.placeholders.surnames")}
            ref={register({ required: true })}
            error={!!errors.surnames}
          />
          {errors.surnames && (
            <ErrorMessage>{t("signup.step1.errors.surnames")}</ErrorMessage>
          )}
        </FormField>
      </FormGroup>
      <FormField>
        <label>{t("signup.step1.labels.email")}</label>
        <Input
          type="text"
          name="email"
          placeholder={t("signup.step1.placeholders.email")}
          onChange={() => clearError("email")}
          ref={register({ validate: isValidEmail })}
          error={!!errors.email}
        />
        {errors.email && (
          <ErrorMessage>
            {t(`signup.step1.errors.email-${errors.email.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.step1.labels.password")}</label>
        <InputPassword>
          <Input
            type={passwordIsMasked ? "password" : "text"}
            name="password"
            placeholder={t("signup.step1.placeholders.password")}
            ref={register({ required: true })}
            error={!!errors.password}
          />
          <TooglePassword onClick={togglePasswordMask}>
            <Icon name={passwordIsMasked ? "eye" : "eye-close"} />
          </TooglePassword>
        </InputPassword>
        {/* TODO: remove eye-close background */}
        {errors.password && (
          <ErrorMessage>{t("signup.step1.errors.password")}</ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.step1.labels.birth-date")}</label>
        <FormGroup onChange={onChangeBirthDate}>
          <Input
            type="number"
            name="day"
            placeholder={t("signup.step1.placeholders.birth-date-day")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="month"
            placeholder={t("signup.step1.placeholders.birth-date-month")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="year"
            placeholder={t("signup.step1.placeholders.birth-date-year")}
            ref={register}
            error={!!errors.birthDate}
          />
        </FormGroup>
        {errors.birthDate && (
          <ErrorMessage>
            {t(`signup.step1.errors.birth-date-${errors.birthDate.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <CheckOption
        onClick={() => setValue("imTeacherCheck", !getValues().imTeacherCheck)}
      >
        <Checkbox checked={getValues().imTeacherCheck} />
        <span>{t("signup.step1.labels.im-teacher")}</span>
      </CheckOption>
      {teacherSubForm(getValues().imTeacherCheck)}
      <CheckOption
        onClick={() =>
          setValue("noNotifications", !getValues().noNotifications)
        }
      >
        <Checkbox checked={getValues().noNotifications} />
        <span>{t("signup.step1.labels.no-notifications")}</span>
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
          {t("signup.step1.labels.accept-terms-1")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#">
            {t("signup.step1.link-general-conditions")}
          </a>{" "}
          {t("signup.step1.labels.accept-terms-2")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
            {t("signup.step1.link-privacy-policy")}
          </a>
          .
        </span>
      </CheckOption>
      {errors.acceptTerms && (
        <ErrorMessage>{t("signup.step1.errors.accept-terms")}</ErrorMessage>
      )}
      <Buttons>
        <Button secondary onClick={() => router.push("/")}>
          {t("signup.step1.cancel")}
        </Button>
        <Button tertiary type="submit" disabled={loading}>
          {t("signup.step1.ok")}
        </Button>
      </Buttons>
    </form>
  );
};

const Step2: FC<IStepInput> = ({
  defaultValues,
  isAMinor,
  goToPreviousStep,
  loading,
  onSubmit
}) => {
  const t = useTranslate();
  const memberPlan = plans.find(p => p.name === "member");
  const teacherPlan = plans.find(p => p.name === "teacher");

  const { getValues, handleSubmit, register, setValue } = useForm({
    defaultValues
  });

  register({ name: "userPlan", type: "custom" }, { required: true });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Title>{t("signup.step2.title")}</Title>
      {t("signup.step2.sub-title")}
      <PlanOption>
        <PlanOptionHeader>
          <Option
            className={"bullet"}
            checked={getValues().userPlan === memberPlan}
            onClick={() => setValue("userPlan", memberPlan)}
          />
          <PlanOptionTitle>
            <span>{t("signup.step2.member.title")}</span>
            <PlanOptionCost>{t("signup.step2.member.cost")}</PlanOptionCost>
          </PlanOptionTitle>
        </PlanOptionHeader>
      </PlanOption>
      <PlanOption disabled={isAMinor}>
        <PlanOptionHeader>
          <Option
            className={"bullet"}
            checked={getValues().userPlan === teacherPlan}
            disabled={isAMinor}
            onClick={() => setValue("userPlan", teacherPlan)}
          />
          <PlanOptionTitle>
            <span>{t("signup.step2.teacher.title")}</span>
            <PlanOptionCost>
              <span>{t("signup.step2.teacher.cost-strikethrough")}</span>{" "}
              <span>{t("signup.step2.teacher.cost")}</span>
            </PlanOptionCost>
          </PlanOptionTitle>
        </PlanOptionHeader>
        <PlanOptionInfo>
          <p>{t("signup.step2.teacher.advantages")}</p>
          {/* <FeatureList>
            {(plan.highlightedFeatures || []).map(feature => (
              <Feature key={feature}>
                <Tick name="tick" />
                {t(`plans.features.${feature}`)}
              </Feature>
            ))}
          </FeatureList>
          {plan.bitbloqCloud && (
            <BitbloqCloud>
              <BitbloqCloudLogo name="cloud-logo" />
              {t("plans.includes-bitbloq-cloud")}
              <Tooltip position="bottom" content={t("plans.bitbloq-cloud-info")}>
                {tooltipProps => (
                  <div {...tooltipProps}>
                    <QuestionIcon name="interrogation" />
                  </div>
                )}
              </Tooltip>
            </BitbloqCloud>
          )} */}
          <ul>
            <li>Crear ejercicios</li>
            <li>Corregir ejercicios</li>
            <li>Acceso de alumnos sin registrar</li>
          </ul>
          Incluye Bitbloq Cloud
        </PlanOptionInfo>
      </PlanOption>
      <Buttons>
        <Button tertiary onClick={goToPreviousStep}>
          {t("signup.step2.cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {t("signup.step2.ok")}
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
  margin-left: 15px;

  button {
    background-color: white;
    border: solid 1px #dddddd;
    border-radius: 4px;
    cursor: pointer;
    height 40px;
    width: 145px;
  }
`;

const InputPassword = styled.div`
  position: relative;
  width: 100%;
`;

const TooglePassword = styled.div`
  align-items: center;
  bottom: 0;
  cursor: pointer;
  display: flex;
  height: 35px;
  position: absolute;
  right: 0;
  padding: 0 10px;

  svg {
    width: 13px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-column-gap: 10px;
`;

const FormField = styled.div`
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

interface IPlanOptionProps {
  disabled?: boolean;
}

const PlanOption = styled.div<IPlanOptionProps>`
  background-color: #fbfbfb;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  margin-top: 10px;
  margin-bottom: 20px;
  overflow: hidden;

  ${props =>
    props.disabled &&
    css`
      * {
        color: ${colors.disabledColor} !important;
      }
    `};
`;

const PlanOptionHeader = styled.div`
  background-color: white;
  display: flex;
  height: 40px;

  .bullet {
    justify-content: center;
    width: 40px;
  }

  &:not(:last-child) {
    border-bottom: solid 1px #cfcfcf;
  }
`;

const PlanOptionTitle = styled.div`
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

const PlanOptionInfo = styled.div`
  background-color: white;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  margin: 20px;
  padding: 20px;

  > p {
    font-weight: bold;
  }
`;
