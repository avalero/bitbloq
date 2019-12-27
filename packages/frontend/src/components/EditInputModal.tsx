import React, { FC, useEffect, useState } from "react";
import useForm from "react-hook-form";
import styled from "@emotion/styled";
import { Button, Input, Modal, colors, useTranslate } from "@bitbloq/ui";
import ErrorMessage from "./ErrorMessage";
import { maxLengthName } from "../config";
import { isValidEmail, isValidName } from "../util";

interface IEditInputModalProps {
  className?: string;
  disabledSave?: boolean;
  errorText?: string;
  value?: string;
  onSave: (value?: string) => any;
  onChange?: (value?: string) => any;
  onCancel: () => any;
  title: string;
  text?: string;
  placeholder: string;
  saveButton: string;
  type?: "text" | "password" | "email";
  transparentOverlay?: boolean;
  isOpen?: boolean;
  label: string;
}

const EditInputModal: FC<IEditInputModalProps> = props => {
  const t = useTranslate();

  const {
    className,
    disabledSave,
    errorText,
    onSave,
    onChange,
    onCancel,
    title,
    text,
    placeholder,
    saveButton,
    type = "text",
    isOpen = true,
    label,
    transparentOverlay
  } = props;

  const { errors, getValues, handleSubmit, register } = useForm({
    defaultValues: { input: props.value },
    mode: type === "text" ? "onChange" : "onSubmit"
  });

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      transparentOverlay={transparentOverlay}
    >
      <Form
        onSubmit={handleSubmit((value: { input: string }) =>
          onSave(value.input)
        )}
      >
        {text && <p>{text}</p>}
        <label>{label}</label>
        <Input
          autoFocus
          error={!!errorText || !!errors.input}
          maxLength={maxLengthName}
          name="input"
          onChange={() => onChange && onChange(getValues().input)}
          placeholder={placeholder}
          ref={register({
            validate: {
              valid: (input: string) => {
                switch (type) {
                  case "email":
                    return isValidEmail(input);
                  case "text":
                    return isValidName(input);
                  case "password":
                    return;
                }
              }
            }
          })}
          type={(type !== "email" && type) || "text"}
        />
        {errorText && <InputErrorMessage>{errorText}</InputErrorMessage>}
        {errors.input && type === "email" && (
          <InputErrorMessage>{t("general-error-email")}</InputErrorMessage>
        )}
        <Buttons>
          <Button tertiary type="button" onClick={onCancel}>
            {t("general-cancel-button")}
          </Button>
          <Button
            type="submit"
            disabled={disabledSave || !!errorText || !!errors.input}
          >
            {saveButton}
          </Button>
        </Buttons>
      </Form>
    </Modal>
  );
};

export default EditInputModal;

/* styled components */

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Form = styled.form`
  box-sizing: border-box;
  font-size: 14px;
  padding: 30px;
  width: 500px;

  p {
    color: ${colors.blackHover};
    line-height: 1.57;
    margin: 10px 0 30px;
  }

  label {
    color: ${colors.black};
    display: inline-block;
    font-size: 14px;
    height: 16px;
    margin: 10px 0;
  }
`;

const InputErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;
