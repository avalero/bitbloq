import React, { FC, useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";

interface EditTitleModalProps {
  title: string;
  onSave: (title: string) => any;
  onCancel: () => any;
}

const EditTitleModal: FC<EditTitleModalProps> = (props) => {
  const { onSave, onCancel } = props;
  const [title, setTitle] = useState(props.title);
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (titleInputRef.current) {
      titleInputRef.current.focus();
    }
  });

  return (
    <Modal
      isOpen={true}
      title="Cambiar el nombre del proyecto"
      onClose={onCancel}
    >
      <Content>
        <form
          onSubmit={e => {
            e.preventDefault();
            onSave(title);
          }}
        >
          <p>Introduce un nuevo nombre para el proyecto</p>
          <Input
            value={title}
            ref={titleInputRef}
            onChange={e => setTitle(e.target.value)}
          />
          <Buttons>
            <Button onClick={() => onSave(title)} disabled={!title}>
              Guardar
            </Button>
            <Button
              tertiary
              onClick={e => {
                e.preventDefault();
                onCancel();
              }}
            >
              Cancelar
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

  ${Button} {
    height: 50px;
    width: 170px;
    margin-right: 20px;
  }
`;
