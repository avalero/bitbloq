import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";

export enum ModalType {
  folderCreation = "folderCreation",
  folderEdit = "folderEdit",
  documentCreate = "documentCreate",
  documentEdit = "documentEdit",
  exerciseCreate = "exerciseCreate",
  exerciseEdit = "exerciseEdit"
}

const modalTypeText = [
  {
    title: "Crear carpeta",
    text: "Nombre de la carpeta",
    placeholder: "Carpeta sin título",
    saveButton: "Crear",
    value: ModalType.folderCreation
  },
  {
    title: "Cambiar nombre de la carpeta",
    text: "Nombre de la carpeta",
    placeholder: "Carpeta sin título",
    saveButton: "Cambiar",
    value: ModalType.folderEdit
  },
  {
    title: "Crear ejercicio",
    text: "Nombre del ejercicio",
    placeholder: "Ejercicio sin título",
    saveButton: "Crear",
    value: ModalType.exerciseCreate
  },
  {
    title: "Cambiar nombre del ejercicio",
    text: "Nombre de la ejercicio",
    placeholder: "Ejercicio sin título",
    saveButton: "cambiar",
    value: ModalType.exerciseEdit
  }
];

interface EditTitleModalProps {
  title: string;
  onSave: (title: string) => any;
  onCancel: () => any;
  modalType: string;
}

const EditTitleModal: FC<EditTitleModalProps> = props => {
  const { onSave, onCancel } = props;
  const [title, setTitle] = useState(props.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  });

  const modalTexts = modalTypeText.find(op => (op.value = props.modalType));

  return (
    <Modal isOpen={true} title={modalTexts.title} onClose={onCancel}>
      <Content>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(title);
          }}
        >
          <p>{modalTexts.text}</p>
          <Input
            ref={titleInputRef}
            placeholder={title || modalTexts.placeholder}
            onChange={e => setTitle(e.target.value)}
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
            <Button disabled={!title}>{modalTexts.saveButton}</Button>
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
    /* width: 75px; */
    border-radius: 4px;
  }
`;
