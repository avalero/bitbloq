import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";
import { isValidEmail, isValidName } from "../util";
import ErrorMessage from "./ErrorMessage";

interface IEditInputModalProps {
  className?: string;
  disabledSave?: boolean;
  errorText?: string;
  title?: string;
  onSave: (title?: string) => any;
  onChange?: (title?: string) => any;
  onCancel: () => any;
  modalTitle: string;
  modalText: string;
  placeholder: string;
  saveButton: string;
  type?: string;
  transparentOverlay?: boolean;
  validateInput?: boolean;
  isOpen?: boolean;
  label?: string;
}

const EditInputModal: FC<IEditInputModalProps> = props => {
  const {
    className,
    disabledSave = false,
    errorText,
    onSave,
    onChange,
    onCancel,
    modalTitle,
    modalText,
    placeholder,
    saveButton,
    type,
    validateInput = true,
    isOpen = true,
    label,
    transparentOverlay
  } = props;
  const [title, setTitle] = useState(props.title);
  const [error, setError] = useState<boolean | string>(false);

  useEffect(() => {
    setError(!!errorText ? errorText : false);
  }, [errorText]);

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      title={modalTitle}
      onClose={onCancel}
      transparentOverlay={transparentOverlay}
    >
      <Content>
        <form
          onSubmit={e => {
            e.preventDefault();
            if (type !== "email" || isValidEmail(title)) {
              onSave(title);
            } else {
              setError(true);
            }
          }}
        >
          <p>{modalText}</p>
          {label && <InputLabel>{label}</InputLabel>}
          <Input
            autoFocus
            placeholder={title || placeholder}
            onChange={e => {
              const value: string = e.target.value;
              if (onChange) {
                onChange(value);
              }
              if (!validateInput || type === "email" || isValidName(value)) {
                setTitle(value);
                setError(false);
              } else {
                setTitle(value);
                setError(true);
              }
            }}
            value={title}
            type={type || "text"}
            error={!!error}
          />
          {error && typeof error === "string" && (
            <InputErrorMessage>{error}</InputErrorMessage>
          )}
          <Buttons>
            <Button
              tertiary
              type="button"
              onClick={() => {
                onCancel();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={disabledSave || !!error}>
              {saveButton}
            </Button>
          </Buttons>
        </form>
      </Content>
    </Modal>
  );
};

export default EditInputModal;

/* styled components */

const Content = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 50px;
  justify-content: space-between;
  ${Button} {
    height: 40px;
    border-radius: 4px;
  }
`;

const InputErrorMessage = styled(ErrorMessage)`
  margin-top: 10px;
`;

const InputLabel = styled.label`
  color: #323843;
  display: inline-block;
  font-size: 14px;
  height: 16px;
  margin-bottom: 10px;
`;
