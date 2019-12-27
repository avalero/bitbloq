import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, colors } from "@bitbloq/ui";
import { isValidEmail, isValidName } from "../util";
import ErrorMessage from "./ErrorMessage";

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
  type?: string;
  transparentOverlay?: boolean;
  validateInput?: boolean;
  isOpen?: boolean;
  label: string;
}

const EditInputModal: FC<IEditInputModalProps> = props => {
  const {
    className,
    disabledSave = false,
    errorText,
    onSave,
    onChange,
    onCancel,
    title,
    text,
    placeholder,
    saveButton,
    type,
    validateInput = true,
    isOpen = true,
    label,
    transparentOverlay
  } = props;
  const [value, setValue] = useState(props.value);
  const [error, setError] = useState<boolean | string>(false);

  useEffect(() => {
    setError(!!errorText ? errorText : false);
  }, [errorText]);

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      title={title}
      onClose={onCancel}
      transparentOverlay={transparentOverlay}
    >
      <Form
        onSubmit={e => {
          e.preventDefault();
          if (type !== "email" || isValidEmail(value)) {
            onSave(value);
          } else {
            setError(true);
          }
        }}
      >
        {text && <p>{text}</p>}
        <InputLabel>{label}</InputLabel>
        <Input
          autoFocus
          placeholder={value || placeholder}
          onChange={e => {
            const newValue: string = e.target.value;
            if (onChange) {
              onChange(newValue);
            }
            if (!validateInput || type === "email" || isValidName(newValue)) {
              setValue(newValue);
              setError(false);
            } else {
              setValue(newValue);
              setError(true);
            }
          }}
          value={value}
          type={type || "text"}
          error={!!error}
        />
        {error && typeof error === "string" && (
          <InputErrorMessage>{error}</InputErrorMessage>
        )}
        <Buttons>
          <Button tertiary type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={disabledSave || !!error}>
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
`;

const InputErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;

const InputLabel = styled.label`
  color: ${colors.black};
  display: inline-block;
  font-size: 14px;
  height: 16px;
  margin: 10px 0;
`;
