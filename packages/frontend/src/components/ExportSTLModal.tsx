import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal, Option, useTranslate } from "@bitbloq/ui";

interface IExportSTLModalProps {
  onSave: (name: string, separate: boolean) => any;
  onCancel: () => any;
}

const ExportSTLModal: FC<IExportSTLModalProps> = ({ onSave, onCancel }) => {
  const [name, setName] = useState("");
  const [separate, setSeparate] = useState(false);

  const t = useTranslate();

  return (
    <Modal isOpen={true} title={t("menu-export-stl")} onClose={onCancel}>
      <Content>
        <FormGroup>
          <label>{t("code.file-name")}</label>
          <Input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder={t("code.file-name")}
          />
        </FormGroup>
        <OptionWrap onClick={() => setSeparate(false)}>
          <Option checked={separate === false} />
          <span>{t("3d.download-single-object")}</span>
        </OptionWrap>
        <OptionWrap onClick={() => setSeparate(true)}>
          <Option checked={separate === true} />
          <span>{t("3d.download-multi-object")}</span>
        </OptionWrap>
        <Buttons>
          <Button tertiary onClick={() => onCancel()}>
            {t("general-cancel-button")}
          </Button>
          <Button onClick={() => onSave(name, separate)}>
            {t("general-download-button")}
          </Button>
        </Buttons>
      </Content>
    </Modal>
  );
};

export default ExportSTLModal;

const Content = styled.div`
  width: 500px;
  padding: 40px 30px 30px 30px;
  box-sizing: border-box;
  font-size: 14px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  label {
    display: block;
    margin-bottom: 10px;
  }
`;

const OptionWrap = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  cursor: pointer;

  span {
    margin-left: 10px;
  }
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 40px;
`;
