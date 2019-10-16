import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";

interface EditTitleModalProps {
  title: string;
  onSave: (title: string) => any;
  onCancel: () => any;
  modalTitle: string;
  modalText: string;
  placeholder: string;
  saveButton: string;
  type?: string;
  validateInput?: boolean;
}

const EditTitleModal: FC<EditTitleModalProps> = props => {
  const {
    onSave,
    onCancel,
    modalTitle,
    modalText,
    placeholder,
    saveButton,
    type,
    validateInput = true
  } = props;
  const [title, setTitle] = useState(props.title);
  const [error, setError] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  });

  const validate = (value: string): boolean => {
    if (
      !value ||
      (value.length <= 64 &&
        value.match(/^[\w\sÁÉÍÓÚÑáéíóúñ]+$/) &&
        !value.match(/^\s+$/))
    ) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Modal isOpen={true} title={modalTitle} onClose={onCancel}>
      <Content>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(title);
          }}
        >
          <p>{modalText}</p>
          <Input
            ref={titleInputRef}
            placeholder={title || placeholder}
            onChange={e => {
              const value: string = e.target.value;
              if (!validateInput || validate(value)) {
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
