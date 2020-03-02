import React, { FC, useState, useEffect } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, colors, useTranslate } from "@bitbloq/ui";

interface INewFolderModal {
  isOpen: boolean;
  onNewFolder: (name: string) => any;
  onCancel: () => any;
}

const NewFolderModal: FC<INewFolderModal> = ({
  isOpen,
  onNewFolder,
  onCancel
}) => {
  const t = useTranslate();
  const [folderName, setFolderName] = useState("");

  useEffect(() => {
    setFolderName("");
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} title={t("code.create-folder")} onClose={onCancel}>
      <Form>
        <label>{t("code.folder-name")}</label>
        <Input
          autoFocus
          maxLength={250}
          value={folderName}
          onChange={e => setFolderName(e.target.value)}
          type="text"
        />

        <Buttons>
          <Button tertiary onClick={onCancel}>
            {t("general-cancel-button")}
          </Button>
          <Button onClick={() => onNewFolder(folderName)}>
            {t("code.create-folder")}
          </Button>
        </Buttons>
      </Form>
    </Modal>
  );
};

export default NewFolderModal;

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
