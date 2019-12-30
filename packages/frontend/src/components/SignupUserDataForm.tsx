import { ApolloError } from "apollo-client";
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
import ErrorMessage from "./ErrorMessage";
import { educationalStages, privacyPolicyUrl } from "../config";
import { isValidDate, isValidEmail, getAge } from "../util";
import { IUserIn } from "../../../api/src/api-types";

interface ISignupUserDataProps {
  defaultValues: {};
  error?: ApolloError;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (input: IUserIn) => void;
}

const SignupUserData: FC<ISignupUserDataProps> = ({
  defaultValues,
  error,
  loading,
  onCancel,
  onSubmit
}) => {
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
  register({ name: "notifications", type: "custom" });

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
              <SignupErrorMessage>
                {t("signup.user-data.errors.center-name")}
              </SignupErrorMessage>
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
              <SignupErrorMessage>
                {t("signup.user-data.errors.city")}
              </SignupErrorMessage>
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
              <SignupErrorMessage>
                {t("signup.user-data.errors.post-code")}
              </SignupErrorMessage>
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
            <SignupErrorMessage>
              {t("signup.user-data.errors.name")}
            </SignupErrorMessage>
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
            <SignupErrorMessage>
              {t("signup.user-data.errors.surnames")}
            </SignupErrorMessage>
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
          <SignupErrorMessage>
            {t(`signup.user-data.errors.email-${errors.email.type}`)}
          </SignupErrorMessage>
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
        {errors.password && (
          <SignupErrorMessage>
            {t("signup.user-data.errors.password")}
          </SignupErrorMessage>
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
          <SignupErrorMessage>
            {t(`signup.user-data.errors.birth-date-${errors.birthDate.type}`)}
          </SignupErrorMessage>
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
          setValue(
            "notifications",
            getValues().notifications !== undefined
              ? !getValues().notifications
              : false
          )
        }
      >
        <Checkbox
          checked={
            getValues().notifications !== undefined
              ? !getValues().notifications
              : false
          }
        />
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
          <a
            target="_blank"
            href="/legal/general-conditions"
            onClick={e => e.stopPropagation()}
          >
            {t("legal.general-conditions").toLowerCase()}
          </a>{" "}
          {t("signup.user-data.labels.accept-terms-2")}{" "}
          <a
            target="_blank"
            href={privacyPolicyUrl}
            onClick={e => e.stopPropagation()}
          >
            {t("legal.privacy-policy").toLowerCase()}
          </a>
          .
        </span>
      </CheckOption>
      {errors.acceptTerms && (
        <SignupErrorMessage>
          {t("signup.user-data.errors.accept-terms")}
        </SignupErrorMessage>
      )}
      <Buttons>
        <Button secondary type="button" onClick={onCancel}>
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

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const CheckOption = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;
  width: fit-content;

  span {
    margin-left: 10px;
  }
`;

const SignupErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;
