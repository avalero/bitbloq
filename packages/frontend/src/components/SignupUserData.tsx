import { ApolloError } from "apollo-client";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import useForm from "react-hook-form";
import {
  Button,
  Checkbox,
  Icon,
  Input,
  Select,
  useTranslate
} from "@bitbloq/ui";
import styled from "@emotion/styled";
import LoginWithGoogleButton from "./LoginWithGoogleButton";
import LoginWithMicrosoftButton from "./LoginWithMicrosoftButton";
import { isValidDate, isValidEmail, getAge } from "../util";
import { educationalStages } from "../config";

interface IUserData {
  acceptTerms: boolean;
  birthDate: string;
  centerName: string;
  city: string;
  country: string;
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

interface ISignupUserDataProps {
  defaultValues: {};
  error?: ApolloError;
  loading: boolean;
  onSubmit: (userInputs: IUserData) => void;
}

const SignupUserData: FC<ISignupUserDataProps> = ({
  defaultValues,
  error,
  loading,
  onSubmit
}) => {
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
        validAge: () => getAge(getValues().birthDate) >= 14
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

  const teacherSubForm = (isShown: boolean) => {
    register({ name: "country", type: "custom" }, { required: isShown });
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
            <label>{t("signup.user-data.labels.center-name")}</label>
            <Input
              type="text"
              name="centerName"
              placeholder={t("signup.user-data.placeholders.center-name")}
              ref={register({ required: true })}
              error={!!errors.centerName}
            />
            {errors.centerName && (
              <ErrorMessage>
                {t("signup.user-data.errors.center-name")}
              </ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.user-data.labels.educational-stage")}</label>
            <Select
              name="educationalStage"
              onChange={(value: string) =>
                onChangeValue("educationalStage", value)
              }
              options={educationalStages.map((educationalStage: string) => {
                return {
                  value: educationalStage,
                  label: t(
                    `signup.user-data.educational-stages.${educationalStage}`
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
            <label>{t("signup.user-data.labels.city")}</label>
            <Input
              type="text"
              name="city"
              placeholder={t("signup.user-data.placeholders.city")}
              ref={register({ required: true })}
              error={!!errors.city}
            />
            {errors.city && (
              <ErrorMessage>{t("signup.user-data.errors.city")}</ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.user-data.labels.post-code")}</label>
            <Input
              type="number"
              name="postCode"
              placeholder={t("signup.user-data.placeholders.post-code")}
              ref={register({ required: true })}
              error={!!errors.postCode}
            />
            {errors.postCode && (
              <ErrorMessage>
                {t("signup.user-data.errors.post-code")}
              </ErrorMessage>
            )}
          </FormField>
          <FormField>
            <label>{t("signup.user-data.labels.country")}</label>
            <Select
              name="country"
              onChange={(value: string) => onChangeValue("country", value)}
              options={Object.keys(t("countries")).map((key: string) => ({
                value: key,
                label: t("countries")[key]
              }))}
              selectConfig={{
                isSearchable: true
              }}
              value={getValues().country}
            />
            {/* TODO: translate NO OPTIONS message */}
          </FormField>
        </FormGroup>
      </>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Login>
        <p>
          {t("signup.user-data.login.account-text")}{" "}
          <a
            href="#"
            onClick={e => {
              e.preventDefault();
              router.push("/login");
            }}
          >
            {t("signup.user-data.login.account-link")}
          </a>
          .
        </p>
        <LoginWith>
          <div>
            <p>{t("signup.user-data.login.with-text")}</p>
            <LoginWithInfo>
              <p>
                {t("signup.user-data.login.with-sub-text-1")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#">
                  {t("signup.user-data.link-general-conditions")}
                </a>{" "}
                {t("signup.user-data.login.with-sub-text-2")}{" "}
                <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
                  {t("signup.user-data.link-privacy-policy")}
                </a>
                .
              </p>
            </LoginWithInfo>
          </div>
          <LoginWithExternalProfile>
            <LoginWithMicrosoftButton />
            <LoginWithGoogleButton />
          </LoginWithExternalProfile>
        </LoginWith>
      </Login>
      <FormGroup>
        <FormField>
          <label>{t("signup.user-data.labels.name")}</label>
          <Input
            type="text"
            name="name"
            placeholder={t("signup.user-data.placeholders.name")}
            ref={register({ required: true })}
            error={!!errors.name}
          />
          {errors.name && (
            <ErrorMessage>{t("signup.user-data.errors.name")}</ErrorMessage>
          )}
        </FormField>
        <FormField>
          <label>{t("signup.user-data.labels.surnames")}</label>
          <Input
            type="text"
            name="surnames"
            placeholder={t("signup.user-data.placeholders.surnames")}
            ref={register({ required: true })}
            error={!!errors.surnames}
          />
          {errors.surnames && (
            <ErrorMessage>{t("signup.user-data.errors.surnames")}</ErrorMessage>
          )}
        </FormField>
      </FormGroup>
      <FormField>
        <label>{t("signup.user-data.labels.email")}</label>
        <Input
          type="text"
          name="email"
          placeholder={t("signup.user-data.placeholders.email")}
          onChange={() => clearError("email")}
          ref={register({ validate: isValidEmail })}
          error={!!errors.email}
        />
        {errors.email && (
          <ErrorMessage>
            {t(`signup.user-data.errors.email-${errors.email.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.user-data.labels.password")}</label>
        <InputPassword>
          <Input
            type={passwordIsMasked ? "password" : "text"}
            name="password"
            placeholder={t("signup.user-data.placeholders.password")}
            ref={register({ required: true })}
            error={!!errors.password}
          />
          <TooglePassword onClick={togglePasswordMask}>
            <Icon name={passwordIsMasked ? "eye" : "eye-close"} />
          </TooglePassword>
        </InputPassword>
        {/* TODO: remove eye-close background */}
        {errors.password && (
          <ErrorMessage>{t("signup.user-data.errors.password")}</ErrorMessage>
        )}
      </FormField>
      <FormField>
        <label>{t("signup.user-data.labels.birth-date")}</label>
        <FormGroup onChange={onChangeBirthDate}>
          <Input
            type="number"
            name="day"
            placeholder={t("signup.user-data.placeholders.birth-date-day")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="month"
            placeholder={t("signup.user-data.placeholders.birth-date-month")}
            ref={register}
            error={!!errors.birthDate}
          />
          <Input
            type="number"
            name="year"
            placeholder={t("signup.user-data.placeholders.birth-date-year")}
            ref={register}
            error={!!errors.birthDate}
          />
        </FormGroup>
        {errors.birthDate && (
          <ErrorMessage>
            {t(`signup.user-data.errors.birth-date-${errors.birthDate.type}`)}
          </ErrorMessage>
        )}
      </FormField>
      <CheckOption
        onClick={() => setValue("imTeacherCheck", !getValues().imTeacherCheck)}
      >
        <Checkbox checked={getValues().imTeacherCheck} />
        <span>{t("signup.user-data.labels.im-teacher")}</span>
      </CheckOption>
      {teacherSubForm(getValues().imTeacherCheck)}
      <CheckOption
        onClick={() =>
          setValue("noNotifications", !getValues().noNotifications)
        }
      >
        <Checkbox checked={getValues().noNotifications} />
        <span>{t("signup.user-data.labels.no-notifications")}</span>
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
          {t("signup.user-data.labels.accept-terms-1")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#">
            {t("signup.user-data.link-general-conditions")}
          </a>{" "}
          {t("signup.user-data.labels.accept-terms-2")}{" "}
          <a target="_blank" href="https://bitbloq.bq.com/#/cookies">
            {t("signup.user-data.link-privacy-policy")}
          </a>
          .
        </span>
      </CheckOption>
      {errors.acceptTerms && (
        <ErrorMessage>{t("signup.user-data.errors.accept-terms")}</ErrorMessage>
      )}
      <Buttons>
        <Button
          secondary
          onClick={e => {
            e.preventDefault();
            router.push("/");
          }}
        >
          {t("signup.user-data.cancel")}
        </Button>
        <Button tertiary type="submit" disabled={loading}>
          {t("signup.user-data.ok")}
        </Button>
      </Buttons>
    </form>
  );
};

export default SignupUserData;

/* Styled components */

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
  height: 100%;
  position: absolute;
  right: 0;
  padding: 0 10px;
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
