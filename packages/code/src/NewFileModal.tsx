import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, colors, useTranslate } from "@bitbloq/ui";

interface INewFileModal {
  isOpen: boolean;
  fileExtension: string;
  onNewFile: (name: string) => any;
  onCancel: () => any;
}

const NewFileModal: FC<INewFileModal> = ({
  isOpen,
  fileExtension,
  onNewFile,
  onCancel
}) => {
  const t = useTranslate();

  const [fileName, setFileName] = useState("");

  useEffect(() => {
    setFileName("");
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title={`${t("code.create-file")} .${fileExtension}`}
      onClose={onCancel}
    >
      <Form>
        <label>{t("code.file-name")}</label>
        <Input
          autoFocus
          maxLength={250}
          value={fileName}
          onChange={e => setFileName(e.target.value)}
          type="text"
        />

        <Buttons>
          <Button tertiary onClick={onCancel}>
            {t("general-cancel-button")}
          </Button>
          <Button onClick={() => onNewFile(fileName)}>
            {t("code.create-file")}
          </Button>
        </Buttons>
      </Form>
    </Modal>
  );
};

export default NewFileModal;

/* styled components */

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;

const Form = styled.div`
  box-sizing: border-box;
  font-size: 14px;
  padding: 30px;
  width: 500px;

  label {
    color: ${colors.black};
    display: inline-block;
    font-size: 14px;
    height: 16px;
    margin: 10px 0;
  }
`;
