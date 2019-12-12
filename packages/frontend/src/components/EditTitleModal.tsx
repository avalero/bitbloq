import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";
import { isValidName } from "../util";

interface IEditTitleModalProps {
  title?: string;
  onSave: (title?: string) => any;
  onCancel: () => any;
  modalTitle: string;
  modalText: string;
  placeholder: string;
  saveButton: string;
  type?: string;
  validateInput?: boolean;
}

const EditTitleModal: FC<IEditTitleModalProps> = props => {
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

  return (
    <Modal isOpen={true} title={modalTitle} onClose={onCancel}>
      <Content>
        <form
          onSubmit={() => {
            onSave(title);
          }}
        >
          <p>{modalText}</p>
          <Input
            autoFocus
            placeholder={title || placeholder}
            onChange={e => {
              const value: string = e.target.value;
              if (!validateInput || isValidName(value)) {
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
              type="button"
              onClick={() => {
                onCancel();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={error}>
              {saveButton}
            </Button>
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
