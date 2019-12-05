import { ApolloError } from "apollo-client";
import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import { useMutation } from "react-apollo";
import useForm from "react-hook-form";
import { Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { UPDATE_USER_DATA_MUTATION } from "../apollo/queries";
import useUserData from "../lib/useUserData";
import { isValidDate, getAge } from "../util";
import { IUpdateUserData, IUser } from "../../../api/src/api-types";

interface IUserData extends IUpdateUserData {
  day: number;
  month: number;
  year: number;
}

interface IAccountPersonalDataProps {
  id: string;
  editable: boolean;
  setEditable: (editable: boolean) => void;
  setError: (error: ApolloError) => void;
}

const AccountPersonalData: FC<IAccountPersonalDataProps> = ({
  id,
  editable,
  setEditable,
  setError
}) => {
  const t = useTranslate();
  const [userData, setUserData] = useState<IUser>(useUserData());

  const ageLimit = userData.teacher ? 18 : 14;

  const [updateUserData, { error, loading }] = useMutation(
    UPDATE_USER_DATA_MUTATION
  );

  useEffect(() => {
    if (error) {
      setError(error);
    }
  }, [error]);

  useEffect(() => {
    if (editable && userData.birthDate) {
      setValue("day", dayjs(userData.birthDate).date());
      setValue("month", dayjs(userData.birthDate).month() + 1);
      setValue("year", dayjs(userData.birthDate).year());
    }
  }, [editable]);

  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    setValue
  } = useForm({ defaultValues: userData });

  register(
    { name: "birthDate", type: "custom" },
    {
      required: true,
      validate: {
        validDate: isValidDate,
        validAge: () => getAge(getValues().birthDate) >= ageLimit
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

  const onUpdateUserData = async (input: IUserData) => {
    if (loading) {
      return;
    }
    await updateUserData({
      variables: {
        id: userData.id,
        input: {
          name: input.name,
          surnames: input.surnames,
          birthDate: new Date(input.year, input.month - 1, input.day)
        }
      }
    });
    setUserData({
      ...userData,
      name: input.name,
      surnames: input.surnames,
      birthDate: new Date(input.year, input.month - 1, input.day)
    });
    setEditable(false);
  };

  return (
    <>
      {!editable ? (
        <>
          <FormFieldNotEditable>
            <div>{t("account.user-data.personal-data.labels.name")}</div>
            <div>{userData.name}</div>
          </FormFieldNotEditable>
          <FormFieldNotEditable>
            <div>{t("account.user-data.personal-data.labels.surnames")}</div>
            <div>{userData.surnames}</div>
          </FormFieldNotEditable>
          <FormFieldNotEditable>
            <div>{t("account.user-data.personal-data.labels.birth-date")}</div>
            <div>
              {userData.birthDate &&
                new Date(userData.birthDate).toLocaleDateString()}
            </div>
          </FormFieldNotEditable>
        </>
      ) : (
        <form id={id} onSubmit={handleSubmit(onUpdateUserData)}>
          <FormField>
            <label>{t("account.user-data.personal-data.labels.name")}</label>
            <Input
              type="text"
              name="name"
              placeholder={t(
                "account.user-data.personal-data.placeholders.name"
              )}
              ref={register({ required: true })}
              error={!!errors.name}
            />
          </FormField>
          <FormError>
            {errors.name && (
              <ErrorMessage>
                {t("account.user-data.personal-data.errors.name")}
              </ErrorMessage>
            )}
          </FormError>
          <FormField>
            <label>
              {t("account.user-data.personal-data.labels.surnames")}
            </label>
            <Input
              type="text"
              name="surnames"
              placeholder={t(
                "account.user-data.personal-data.placeholders.surnames"
              )}
              ref={register({ required: true })}
              error={!!errors.surnames}
            />
          </FormField>
          <FormError>
            {errors.surnames && (
              <ErrorMessage>
                {t("account.user-data.personal-data.errors.surnames")}
              </ErrorMessage>
            )}
          </FormError>
          <FormField>
            <label>
              {t("account.user-data.personal-data.labels.birth-date")}
            </label>
            <FormGroup onChange={onChangeBirthDate}>
              <Input
                type="number"
                name="day"
                placeholder={t(
                  "account.user-data.personal-data.placeholders.birth-date-day"
                )}
                ref={register}
                error={!!errors.birthDate}
              />
              <Input
                type="number"
                name="month"
                placeholder={t(
                  "account.user-data.personal-data.placeholders.birth-date-month"
                )}
                ref={register}
                error={!!errors.birthDate}
              />
              <Input
                type="number"
                name="year"
                placeholder={t(
                  "account.user-data.personal-data.placeholders.birth-date-year"
                )}
                ref={register}
                error={!!errors.birthDate}
              />
            </FormGroup>
          </FormField>
          <FormError>
            {errors.birthDate && (
              <ErrorMessage>
                {errors.birthDate.type === "validAge"
                  ? t(
                      `account.user-data.personal-data.errors.birth-date-${errors.birthDate.type}`,
                      [ageLimit.toString()]
                    )
                  : t(
                      `account.user-data.personal-data.errors.birth-date-${errors.birthDate.type}`
                    )}
              </ErrorMessage>
            )}
          </FormError>
        </form>
      )}
    </>
  );
};

export default AccountPersonalData;

/* Styled components */

const FormError = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 24%;

  &:not(:last-of-type) {
    margin-bottom: 20px;
  }
`;

const FormField = styled.div`
  align-items: center;
  display: flex;

  label {
    width: 24%;
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

const FormGroup = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
  grid-column-gap: 10px;
`;

const ErrorMessage = styled.div`
  margin-top: 10px;
  font-size: 12px;
  font-style: italic;
  color: #d82b32;
`;
