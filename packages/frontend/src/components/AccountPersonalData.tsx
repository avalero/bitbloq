import dayjs from "dayjs";
import React, { FC, useEffect, useState } from "react";
import useForm from "react-hook-form";
import {
  Input,
  useTranslate,
  colors,
  FileSelectButton,
  DialogModal
} from "@bitbloq/ui";
import { css } from "@emotion/core";
import styled from "@emotion/styled";
import ErrorMessage from "./ErrorMessage";
import { resourceTypes } from "../config";
import useUserData from "../lib/useUserData";
import { IUser, ResourcesTypes } from "../types";
import { getAvatarColor, isValidAge, isValidDate } from "../util";
import { LIMIT_SIZE } from "../../../api/src/config";

interface IPersonalData extends IUser {
  avatarFile: File;
  day: number;
  month: number;
  year: number;
}

enum AvatarErrors {
  extError,
  noError,
  sizeError
}

interface IAccountPersonalDataProps {
  editable: boolean;
  formId: string;
  onSubmit: (input: IUser) => void;
}

const AccountPersonalData: FC<IAccountPersonalDataProps> = ({
  editable,
  formId,
  onSubmit
}) => {
  const t = useTranslate();
  const { userData } = useUserData();
  const ageLimit = userData.teacher ? 18 : 14;
  const [avatarError, setAvatarError] = useState<AvatarErrors>(
    AvatarErrors.noError
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    setAvatarPreview(null);
    if (editable) {
      resetForm(userData);
    }
  }, [editable]);

  const {
    clearError,
    errors,
    getValues,
    handleSubmit,
    register,
    reset,
    setValue
  } = useForm({ defaultValues: userData });

  register({ name: "avatarFile", type: "custom" });
  register(
    { name: "birthDate", type: "custom" },
    {
      required: true,
      validate: {
        validDate: isValidDate,
        validAge: () => isValidAge(getValues().birthDate, ageLimit)
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

  const onFileSelected = (file: File) => {
    if (
      resourceTypes[ResourcesTypes.image].formats.indexOf(
        `.${file.type.replace("image/", "")}`
      ) < 0
    ) {
      setAvatarError(AvatarErrors.extError);
    } else if (file.size > LIMIT_SIZE.MAX_AVATAR_BYTES) {
      setAvatarError(AvatarErrors.sizeError);
    } else {
      setValue("avatarFile", file);
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = (input: IUser) => {
    reset(input);
    setValue("day", input.birthDate && dayjs(input.birthDate).date());
    setValue("month", input.birthDate && dayjs(input.birthDate).month() + 1);
    setValue("year", input.birthDate && dayjs(input.birthDate).year());
    setValue(
      "birthDate",
      input.birthDate && new Date(input.birthDate).toLocaleDateString()
    );
  };

  const formNotEditable = () => (
    <>
      <FormFieldNotEditable>
        <LabelNotEditable>
          {t("account.user-data.personal-data.labels.name")}
        </LabelNotEditable>
        <InputNotEditable>{userData.name}</InputNotEditable>
      </FormFieldNotEditable>
      <FormFieldNotEditable>
        <LabelNotEditable>
          {t("account.user-data.personal-data.labels.surnames")}
        </LabelNotEditable>
        <InputNotEditable>{userData.surnames}</InputNotEditable>
      </FormFieldNotEditable>
      <FormFieldNotEditable>
        <LabelNotEditable>
          {t("account.user-data.personal-data.labels.birth-date")}
        </LabelNotEditable>
        <div>
          {userData.birthDate &&
            new Date(userData.birthDate).toLocaleDateString()}
        </div>
      </FormFieldNotEditable>
    </>
  );

  return (
    <Container>
      <Form
        id={formId}
        onSubmit={handleSubmit((input: IPersonalData) =>
          onSubmit({
            ...userData,
            avatar: input.avatarFile,
            name: input.name,
            surnames: input.surnames,
            birthDate: new Date(input.year, input.month - 1, input.day)
          })
        )}
      >
        {!editable ? (
          formNotEditable()
        ) : (
          <>
            <FormField>
              <label>{t("account.user-data.personal-data.labels.name")}</label>
              <Input
                type="text"
                name="name"
                maxLength={200}
                placeholder={t(
                  "account.user-data.personal-data.placeholders.name"
                )}
                ref={register({ required: true })}
                error={!!errors.name}
              />
            </FormField>
            <FormError>
              {errors.name && (
                <InputErrorMessage>
                  {t("account.user-data.personal-data.errors.name")}
                </InputErrorMessage>
              )}
            </FormError>
            <FormField>
              <label>
                {t("account.user-data.personal-data.labels.surnames")}
              </label>
              <Input
                type="text"
                name="surnames"
                maxLength={200}
                placeholder={t(
                  "account.user-data.personal-data.placeholders.surnames"
                )}
                ref={register({ required: true })}
                error={!!errors.surnames}
              />
            </FormField>
            <FormError>
              {errors.surnames && (
                <InputErrorMessage>
                  {t("account.user-data.personal-data.errors.surnames")}
                </InputErrorMessage>
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
                <InputErrorMessage>
                  {errors.birthDate.type === "validAge"
                    ? t(
                        `account.user-data.personal-data.errors.birth-date-${errors.birthDate.type}`,
                        [ageLimit.toString()]
                      )
                    : t(
                        `account.user-data.personal-data.errors.birth-date-${errors.birthDate.type}`
                      )}
                </InputErrorMessage>
              )}
            </FormError>
          </>
        )}
      </Form>
      <Avatar editable={editable}>
        <AvatarImage id={userData.id} src={avatarPreview || userData.avatar}>
          {!avatarPreview && !userData.avatar && (
            <span>
              {userData.name.charAt(0).toUpperCase()}
              {userData.surnames && userData.surnames.charAt(0).toUpperCase()}
            </span>
          )}
        </AvatarImage>
        {editable && (
          <AvatarButton
            accept="image/*"
            tertiary
            onFileSelected={onFileSelected}
          >
            {t("account.user-data.personal-data.button-avatar")}
          </AvatarButton>
        )}
      </Avatar>
      <DialogModal
        isOpen={avatarError !== AvatarErrors.noError}
        onCancel={() => setAvatarError(AvatarErrors.noError)}
        onOk={() => setAvatarError(AvatarErrors.noError)}
        text={
          avatarError === AvatarErrors.extError
            ? t("account.user-data.personal-data.warning-ext")
            : t("account.user-data.personal-data.warning-size")
        }
        okText={t("account.user-data.personal-data.warning-ok")}
        title={t("account.user-data.personal-data.warning-title")}
      />
    </Container>
  );
};

export default AccountPersonalData;

/* Styled components */

const Avatar = styled.div<{ editable: boolean }>`
  margin-left: 20px;
  position: relative;
  transition: width 100ms ease-out;
  width: ${props => (props.editable ? 145 : 112)}px;

  span {
    color: white;
    font-size: ${props => (props.editable ? 80 : 62)}px;
    font-weight: 300;
    left: 0;
    line-height: ${props => (props.editable ? 145 : 112)}px;
    position: absolute;
    right: 0;
    text-align: center;
    top: 0;
    transition: all 100ms ease-out;
  }
`;

const AvatarButton = styled(FileSelectButton)`
  margin-top: 10px;
  padding: 0;
  width: 100%;
`;

const AvatarImage = styled.div<{ id: string; src?: string }>`
  border-radius: 4px;
  left: 100%;
  padding-top: 100%;
  position: relative;
  transform: translate(-100%, 0);
  width: 100%;

  ${props =>
    props.src
      ? css`
          background-image: url(${props.src});
          background-size: cover;
          background-position: center;
        `
      : css`
          background-color: ${getAvatarColor(props.id)};
        `}
`;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Form = styled.form`
  flex: 1;
  overflow: hidden;
`;

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
  border: 0px solid ${colors.gray4};
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

const InputErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;

const InputNotEditable = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const LabelNotEditable = styled.div`
  min-width: 150px;
`;
