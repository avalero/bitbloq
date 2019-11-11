import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  ChangeEvent
} from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Modal, Icon, Input, Spinner, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import debounce from "lodash/debounce";
import ResourceDetails from "./ResourceDetails";
import ResourcesList from "./ResourcesList";
import UploadResourceTabs, { TabType } from "./UploadResourceTabs";
import {
  GET_CLOUD_RESOURCES,
  MOVE_RESOURCE_TO_TRASH,
  RESTORE_RESOURCE_FROM_TRASH
} from "../apollo/queries";
import { resourceTypes } from "../config";
import { IResource, OrderType } from "../types";

export interface IUploadResourceModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const UploadResourceModal: FC<IUploadResourceModalProps> = ({
  isOpen,
  onClose
}) => {
  const [file, setFile] = useState<File>(new File([], "sdfds"));
  const [nameFile, setNameFile] = useState<string>("");
  const [tab, setTab] = useState<TabType>(TabType.import);
  const t = useTranslate();

  const onCloseModal = () => {
    setFile(undefined);
    onClose();
  };

  const onSetFile = (file: File) => {
    const extFile = file.name.split(".").pop();
    setNameFile(file.name.replace(`.${extFile}`, ""));
    setFile(file);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      title={t("cloud.upload.title")}
    >
      <UploadResourceModalBody input={file !== undefined}>
        {file === undefined ? (
          <UploadResourceTabs
            setFile={onSetFile}
            setTab={(tab: TabType) => setTab(tab)}
            tab={tab}
          />
        ) : (
          <FormGroup>
            <label>{t("cloud.upload.name")}</label>
            <Input
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
          {file !== undefined && (
            <ResourceModalButton onClick={onCloseModal}>
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
