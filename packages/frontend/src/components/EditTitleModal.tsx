import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";
import { isValidEmail, isValidName } from "../util";

interface IEditTitleModalProps {
  className?: string;
  title?: string;
  onSave: (title?: string) => any;
  onCancel: () => any;
  modalTitle: string;
  modalText: string;
  placeholder: string;
  saveButton: string;
  type?: string;
  validateInput?: boolean;
  isOpen?: boolean;
  label?: string;
}

const EditTitleModal: FC<IEditTitleModalProps> = props => {
  const {
    className,
    onSave,
    onCancel,
    modalTitle,
    modalText,
    placeholder,
    saveButton,
    type,
    validateInput = true,
    isOpen = true,
    label
  } = props;
  const [title, setTitle] = useState(props.title);
  const [error, setError] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  const isValidValue = type === "email" ? isValidEmail : isValidName;

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  });

  return (
    <Modal
      className={className}
      isOpen={isOpen}
      title={modalTitle}
      onClose={onCancel}
    >
      <Content>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(title);
          }}
        >
          <p>{modalText}</p>
          {label && <InputLabel>{label}</InputLabel>}
          <Input
            ref={titleInputRef}
            placeholder={title || placeholder}
            onChange={e => {
              const value: string = e.target.value;
              if (!validateInput || isValidValue(value)) {
                setTitle(value);
                setError(false);
              } else {
                setTitle(value);
                setError(true);
              }
            }}
            value={title}
            type={type || "text"}
            error={error}
          />
          <Buttons>
            <Button
              tertiary
              onClick={e => {
                e.preventDefault();
                onCancel();
              }}
            >
              Cancelar
            </Button>
            <Button disabled={error}>{saveButton}</Button>
          </Buttons>
        </form>
      </Content>
    </Modal>
  );
};

export default EditTitleModal;

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

const InputLabel = styled.label`
  color: #323843;
  display: inline-block;
  font-size: 14px;
  height: 16px;
  margin-bottom: 10px;
`;
