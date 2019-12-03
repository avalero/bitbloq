import { ApolloError } from "apollo-client";
import React, { FC, useEffect } from "react";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import { Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { isValidDate, getAge } from "../util";
import { SAVE_USER_DATA_MUTATION } from "../apollo/queries";
import { IUserIn } from "../../../api/src/api-types";

interface IUserData {
  birthDate: string;
  name: string;
  surnames: string;
}

interface IAccountPersonalDataProps {
  defaultValues: IUserIn;
  formId: string;
  isEditable: boolean;
  setError: (error: ApolloError) => void;
}

const AccountPersonalData: FC<IAccountPersonalDataProps> = ({
  defaultValues,
  formId,
  isEditable,
  setError
}) => {
  const t = useTranslate();

  const [saveUserData, { error, loading }] = useMutation(
    SAVE_USER_DATA_MUTATION
  );

  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    setValue
  } = useForm({ defaultValues });

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error]);

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

  const onSaveUser = (input: IUserData) => {
    if (loading) {
      return;
    }
    saveUserData({
      variables: {
        input: {
          birthDate: input.birthDate,
          name: input.name,
          surnames: input.surnames
        }
      }
    });
  };

  const notEditableForm = () => (
    <>
      <FormFieldNotEditable>
        <div>{t("signup.user-data.labels.name")}</div>
        <div>{getValues().name}</div>
      </FormFieldNotEditable>
      <FormFieldNotEditable>
        <div>{t("signup.user-data.labels.surnames")}</div>
        <div>{getValues().surnames}</div>
      </FormFieldNotEditable>
      <FormFieldNotEditable>
        <div>{t("signup.user-data.labels.birth-date")}</div>
        <div>{getValues().birthDate}</div>
      </FormFieldNotEditable>
    </>
  );

  return (
    <>
      {!isEditable ? (
        notEditableForm()
      ) : (
        <form id={formId} onSubmit={handleSubmit(onSaveUser)}>
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
              <ErrorMessage>
                {t("signup.user-data.errors.surnames")}
              </ErrorMessage>
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
                placeholder={t(
                  "signup.user-data.placeholders.birth-date-month"
                )}
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
                {t(
                  `signup.user-data.errors.birth-date-${errors.birthDate.type}`
                )}
              </ErrorMessage>
            )}
          </FormField>
        </form>
      )}
    </>
  );
};

export default AccountPersonalData;

/* Styled components */

const FormGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-column-gap: 10px;
`;

const FormField = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 20px;

  label {
  }

  input[type="number"]::-webkit-outer-spin-button,
  input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
`;

const FormFieldNotEditable = styled.div`
  align-items: center;
  height: 36px;
  display: flex;
  justify-content: space-between;
  border: 0px solid #8c919b;
  border-top-width: 1px;

  &:last-of-type {
    border-bottom-width: 1px;
  }
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;
