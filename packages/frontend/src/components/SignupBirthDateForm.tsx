import React, { FC } from "react";
import useForm from "react-hook-form";
import { Button, Input, useTranslate, colors } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ErrorMessage from "./ErrorMessage";
import { IUserBirthDate } from "../types";
import { isValidDate, getAge } from "../util";

interface ISignupBirthDateProps {
  defaultValues: IUserBirthDate;
  loading: boolean;
  onCancel: () => void;
  onSubmit: (birthDate: IUserBirthDate) => void;
}

const SignupBirthDate: FC<ISignupBirthDateProps> = ({
  defaultValues,
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
    setValue
  } = useForm({ defaultValues });

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

  const onChangeBirthDate = () => {
    clearError("birthDate");
    setValue(
      "birthDate",
      [getValues().day, getValues().month, getValues().year].join("/")
    );
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <p>{t("signup.birth-date.subtitle")}</p>
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
      <Buttons>
        <Button secondary type="button" onClick={onCancel}>
          {t("signup.birth-date.cancel")}
        </Button>
        <Button tertiary type="submit" disabled={loading}>
          {t("signup.birth-date.ok")}
        </Button>
      </Buttons>
    </Form>
  );
};

export default SignupBirthDate;

/* Styled components */

const Form = styled.form`
  p {
    color: ${colors.blackHover};
    line-height: 1.57;
    margin-bottom: 40px;
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

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;
