import React, { FC, useEffect, useState, ChangeEvent } from "react";
import { useMutation } from "@apollo/react-hooks";
import { Button, DialogModal, Modal, Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import CloudModal from "./CloudModal";
import UploadResourceTabs, { TabType } from "./UploadResourceTabs";
import { UPLOAD_CLOUD_RESOURCE } from "../apollo/queries";
import { ResourcesTypes } from "../types";
import { isValidName } from "../util";

const acceptedFiles = {
  image: [".png", ".gif", ".jpg", ".jpeg", "webp"],
  video: [".mp4", ".webm"],
  sound: [".mp3", ".ocg"],
  object3D: [".stl"]
};

export interface IUploadResourceModalProps {
  acceptedTypes?: ResourcesTypes[];
  isOpen: boolean;
  onClose?: () => void;
}

const UploadResourceModal: FC<IUploadResourceModalProps> = ({
  acceptedTypes = [],
  isOpen,
  onClose
}) => {
  const [uploadResource] = useMutation(UPLOAD_CLOUD_RESOURCE);
  const [accept, setAccept] = useState<string[]>([]);
  const [error, setError] = useState<0 | 1 | 2>(0); // 0 -> No error; 1 -> Extension error; 2 -> Size error
  const [file, setFile] = useState<File>(undefined);
  const [nameFile, setNameFile] = useState<string>("");
  const [openCloud, setOpenCloud] = useState<boolean>(true);
  const [tab, setTab] = useState<TabType>(TabType.import);
  const t = useTranslate();

  useEffect(() => {
    let acceptedExt: string[] = [];
    for (let type of acceptedTypes) {
      acceptedExt = [...acceptedExt, ...acceptedFiles[type]];
    }
    setAccept(acceptedExt);
  }, []);

  const onCloseModal = () => {
    setError(0);
    setFile(undefined);
    setOpenCloud(false);
    setTab(TabType.import);
    onClose();
  };

  const onSendResource = async () => {
    const resourceBlob = file.slice(0, file.size, file.type);
    const resourceFile = new File(
      [resourceBlob],
      file.name.replace(/.+(\.\w+$)/, `${nameFile}$1`),
      { type: file.type }
    );
    await uploadResource({
      variables: {
        file: resourceFile
      }
    });
    onCloseModal();
  };

  const onSetFile = (file: File) => {
    const extFile = file.name.split(".").pop();
    if (accept.indexOf(`.${extFile}`) < 0) {
      setError(1);
    } else if (file.size > 10000000) {
      setError(2);
    } else {
      setNameFile(file.name.replace(`.${extFile}`, "").substring(0, 64));
      setFile(file);
    }
  };

  return openCloud && file === undefined && error === 0 ? (
    <CloudModal
      acceptedExt={accept}
      importAllow
      importCallback={id => console.log(id)}
      isOpen={true}
      onClose={onCloseModal}
      setFile={onSetFile}
    />
  ) : error !== 0 ? (
    <DialogModal
      isOpen={true}
      onCancel={onCloseModal}
      onOk={onCloseModal}
      text={
        error === 1
          ? t("cloud.upload.warning-ext")
          : t("cloud.upload.warning-size")
      }
      okText={t("general-accept-button")}
      title={t("cloud.upload.warning-title")}
    />
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      title={t("cloud.upload.title")}
    >
      <UploadResourceModalBody input={file !== undefined}>
        {file === undefined ? (
          <UploadResourceTabs
            acceptedExt={accept}
            acceptedTypes={acceptedTypes}
            setFile={onSetFile}
            setTab={(tab: TabType) => setTab(tab)}
            tab={tab}
          />
        ) : (
          <FormGroup>
            <label>{t("cloud.upload.name")}</label>
            <Input
              error={!isValidName(nameFile)}
              onChange={(e: ChangeEvent) =>
                setNameFile((e.target as HTMLInputElement).value)
              }
              value={nameFile}
            />
          </FormGroup>
        )}
        <Buttons>
          <ResourceModalButton onClick={onCloseModal} tertiary>
            {t("general-cancel-button")}
          </ResourceModalButton>
          {tab === TabType.add && file === undefined && (
            <ResourceModalButton onClick={() => setOpenCloud(true)} tertiary>
              {t("cloud.buttons.see-more")}
            </ResourceModalButton>
          )}
          {file !== undefined && (
            <ResourceModalButton
              disabled={!isValidName(nameFile)}
              onClick={() => onSendResource()}
            >
              {t("general-add-button")}
            </ResourceModalButton>
          )}
        </Buttons>
      </UploadResourceModalBody>
    </Modal>
  );
};

export default UploadResourceModal;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  height: 61px;
  justify-content: space-between;
  margin: 20px 0;
  width: 100%;

  label {
    color: #323843;
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const ResourceModalButton = styled(Button)<{ tertiary?: boolean }>`
  color: ${props => (props.tertiary ? "#373b44" : "#fff")};
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.43;
  padding: 10px 20px;
`;

const UploadResourceModalBody = styled.div<{ input?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: 20px 30px 30px;
  width: ${props => (props.input ? 500 : 720)}px;
`;
