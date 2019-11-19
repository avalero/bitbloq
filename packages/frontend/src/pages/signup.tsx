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
  Tooltip,
  useTranslate
} from "@bitbloq/ui";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import withApollo from "../apollo/withApollo";
import CounterButton from "../components/CounterButton";
import GraphQLErrorMessage from "../components/GraphQLErrorMessage";
import ModalLayout from "../components/ModalLayout";
import logoBetaImage from "../images/logo-beta.svg";
import { plans } from "../config";
import { IPlan } from "../types";
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

enum EducationalStages {
  Preschool = "preschool",
  Primary = "primary",
  HighSchool = "high-school",
  Bachelor = "bachelor",
  College = "college"
}

interface IUserData {
  acceptTerms: boolean;
  birthDate: string;
  centerName: string;
  city: string;
  countryKey: string;
  day: number;
  educationalStage: EducationalStages;
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
  userPlan: IPlan;
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
    educationalStage: EducationalStages.Primary,
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
                {t("signup.step", [currentStep.toLocaleString()])}
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
            <label>{t("signup.form.labels.center-name")}</label>
            <Input
              type="text"
              name="centerName"
              placeholder={t("signup.form.placeholders.center-name")}
              ref={register({ required: true })}
              error={!!errors.centerName}
            />
            {errors.centerName && (
              <ErrorMessage>{t("signup.form.errors.center-name")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.form.labels.educational-stage")}</label>
            <Select
              name="educationalStage"
              onChange={(value: string) =>
                onChangeValue("educationalStage", value)
              }
              options={Object.keys(EducationalStages).map(key => {
                return {
                  value: EducationalStages[key],
                  label: t(
                    `signup.form.educational-stages.${EducationalStages[key]}`
                  )
                };
              })}
              selectConfig={{
                isSearchable: false
              }}
              value={getValues().educationalStage}
            />
          </FormField>
          <FormField>
            <label>{t("signup.form.labels.city")}</label>
            <Input
              type="text"
              name="city"
              placeholder={t("signup.form.placeholders.city")}
              ref={register({ required: true })}
              error={!!errors.city}
            />
            {errors.city && (
              <ErrorMessage>{t("signup.form.errors.city")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.form.labels.post-code")}</label>
            <Input
              type="number"
              name="postCode"
              placeholder={t("signup.form.placeholders.post-code")}
              ref={register({ required: true })}
              error={!!errors.postCode}
            />
            {errors.postCode && (
              <ErrorMessage>{t("signup.form.errors.post-code")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.form.labels.country")}</label>
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
      <Title>{t("signup.form.title")}</Title>
      <Login>
        <p>
          {t("signup.form.login.account-text")}{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            {t("signup.form.login.account-link")}
          </a>
          .
        </p>
        <LoginWith>
          <div>
            <p>{t("signup.form.login.with-text")}</p>
            <LoginWithInfo>
              <p>
                {t("signup.form.login.with-sub-text-1")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#">
                  {t("signup.form.link-general-conditions")}
                </a>{" "}
                {t("signup.form.login.with-sub-text-2")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
                  {t("signup.form.link-privacy-policy")}
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
          <label>{t("signup.form.labels.name")}</label>
          <Input
            type="text"
            name="name"
            placeholder={t("signup.form.placeholders.name")}
            ref={register({ required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <ErrorMessage>{t("signup.form.errors.name")}</ErrorMessage>
          )}
        </FormField>
        <FormField>
          <label>{t("signup.form.labels.surnames")}</label>
          <Input
            type="text"
            name="surnames"
            placeholder={t("signup.form.placeholders.surnames")}
            ref={register({ required: true })}
            error={!!errors.surnames}
          />
          {errors.surnames && (
            <ErrorMessage>{t("signup.form.errors.surnames")}</ErrorMessage>
          )}
        </FormField>
      </FormGroup>
      <FormField>
        <label>{t("signup.form.labels.email")}</label>
        <Input
          type="text"
          name="email"
          placeholder={t("signup.form.placeholders.email")}
          onChange={() => clearError("email")}
          ref={register({ validate: isValidEmail })}
          error={!!errors.email}
        />
        {errors.email && (
          <ErrorMessage>
            {t(`signup.form.errors.email-${errors.email.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.form.labels.password")}</label>
        <InputPassword>
          <Input
            type={passwordIsMasked ? "password" : "text"}
            name="password"
            placeholder={t("signup.form.placeholders.password")}
            ref={register({ required: true })}
            error={!!errors.password}
          />
          <TooglePassword onClick={togglePasswordMask}>
            <Icon name={passwordIsMasked ? "eye" : "eye-close"} />
          </TooglePassword>
        </InputPassword>
        {/* TODO: remove eye-close background */}
        {errors.password && (
          <ErrorMessage>{t("signup.form.errors.password")}</ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.form.labels.birth-date")}</label>
        <FormGroup onChange={onChangeBirthDate}>
          <Input
            type="number"
            name="day"
            placeholder={t("signup.form.placeholders.birth-date-day")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="month"
            placeholder={t("signup.form.placeholders.birth-date-month")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="year"
            placeholder={t("signup.form.placeholders.birth-date-year")}
            ref={register}
            error={!!errors.birthDate}
          />
        </FormGroup>
        {errors.birthDate && (
          <ErrorMessage>
            {t(`signup.form.errors.birth-date-${errors.birthDate.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <CheckOption
        onClick={() => setValue("imTeacherCheck", !getValues().imTeacherCheck)}
      >
        <Checkbox checked={getValues().imTeacherCheck} />
        <span>{t("signup.form.labels.im-teacher")}</span>
      </CheckOption>
      {teacherSubForm(getValues().imTeacherCheck)}
      <CheckOption
        onClick={() =>
          setValue("noNotifications", !getValues().noNotifications)
        }
      >
        <Checkbox checked={getValues().noNotifications} />
        <span>{t("signup.form.labels.no-notifications")}</span>
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
          {t("signup.form.labels.accept-terms-1")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#">
            {t("signup.form.link-general-conditions")}
          </a>{" "}
          {t("signup.form.labels.accept-terms-2")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
            {t("signup.form.link-privacy-policy")}
          </a>
          .
        </span>
      </CheckOption>
      {errors.acceptTerms && (
        <ErrorMessage>{t("signup.form.errors.accept-terms")}</ErrorMessage>
      )}
      <Buttons>
        <Button secondary onClick={() => router.push("/")}>
          {t("signup.form.cancel")}
        </Button>
        <Button tertiary type="submit" disabled={loading}>
          {t("signup.form.ok")}
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
      <Title>{t("signup.plans.title")}</Title>
      {t("signup.plans.sub-title")}
      {memberPlan && (
        <Plan
          checked={getValues().userPlan === memberPlan}
          onClick={() => setValue("userPlan", memberPlan)}
          plan={memberPlan}
        />
      )}
      {teacherPlan && (
        <Plan
          checked={getValues().userPlan === teacherPlan}
          onClick={() => setValue("userPlan", teacherPlan)}
          plan={teacherPlan}
          showFeatures={true}
        />
      )}
      <Buttons>
        <Button tertiary onClick={goToPreviousStep}>
          {t("signup.plans.cancel")}
        </Button>
        <Button type="submit" disabled={loading}>
          {t("signup.plans.ok")}
        </Button>
      </Buttons>
    </form>
  );
};

interface IPlanProps {
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
  plan: IPlan;
  showFeatures?: boolean;
}

const Plan: FC<IPlanProps> = ({
  checked,
  disabled,
  onClick,
  plan,
  showFeatures
}) => {
  const t = useTranslate();

  return (
    <PlanOption disabled={disabled}>
      <PlanOptionHeader>
        <Option
          className={"bullet"}
          checked={checked}
          disabled={disabled}
          onClick={onClick}
        />
        <PlanOptionTitle>
          <span>{t(`plans.${plan.name}`)}</span>
          {plan.isFree ? (
            <PlanOptionCost>{t(`signup.plans.free`)}</PlanOptionCost>
          ) : plan.isBetaFree && plan.originalPrice ? (
            <PlanOptionCost>
              <span>
                {t("signup.plans.monthly-price", [
                  plan.originalPrice.toLocaleString()
                ])}
              </span>
              <span> {t(`signup.plans.free-beta`)}</span>
            </PlanOptionCost>
          ) : (
            plan.originalPrice && (
              <PlanOptionCost>
                {t("signup.plans.monthly-price", [
                  plan.originalPrice.toLocaleString()
                ])}
              </PlanOptionCost>
            )
          )}
        </PlanOptionTitle>
      </PlanOptionHeader>
      {showFeatures && (
        <PlanFeatures>
          <p>{t(`signup.plans.advantages`, [t(`plans.${plan.name}`)])}</p>
          {(plan.highlightedFeatures || []).map(feature => (
            <Feature key={feature}>
              <Tick name="tick" />
              {t(`plans.features.${feature}`)}
            </Feature>
          ))}
          {plan.bitbloqCloud && (
            <BitbloqCloud>
              <BitbloqCloudLogo name="cloud-logo" />
              {t("plans.includes-bitbloq-cloud")}
              <Tooltip
                position="bottom"
                content={t("plans.bitbloq-cloud-info")}
              >
                {tooltipProps => (
                  <div {...tooltipProps}>
                    <QuestionIcon name="interrogation" />
                  </div>
                )}
              </Tooltip>
            </BitbloqCloud>
          )}
        </PlanFeatures>
      )}
    </PlanOption>
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

const PlanFeatures = styled.div`
  background-color: white;
  border: solid 1px #cfcfcf;
  border-radius: 4px;
  margin: 20px;
  padding: 20px;

  > p {
    font-weight: bold;
  }
`;

const Feature = styled.li`
  margin: 10px 0;
  display: flex;
  align-items: center;
`;

const BitbloqCloud = styled.div`
  display: flex;
  align-items: center;
`;

const BitbloqCloudLogo = styled(Icon)`
  width: 24px;
  height: 24px;
  margin-right: 6px;
`;

const Tick = styled(Icon)`
  color: ${colors.green};
  margin-right: 5px;
  svg {
    width: 14px;
  }
`;

const QuestionIcon = styled(Icon)`
  width: 16px;
  height: 16px;
  margin-left: 6px;
  cursor: pointer;
`;
