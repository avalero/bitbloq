import React, {
  FC,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState
} from "react";
import { useMutation, useQuery } from "@apollo/react-hooks";
import { Button, Modal, Icon, Spinner, useTranslate } from "@bitbloq/ui";
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
  const [tab, setTab] = useState<TabType>(TabType.import);
  const t = useTranslate();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("cloud.upload.title")}>
      <UploadResourceModalBody>
        <UploadResourceTabs setTab={(tab: TabType) => setTab(tab)} tab={tab} />
        <Buttons>
          <ResourceModalButton onClick={onClose} tertiary>
            {t("general-cancel-button")}
          </ResourceModalButton>
        </Buttons>
      </UploadResourceModalBody>
    </Modal>
  );
};

export default UploadResourceModal;

const Buttons = styled.div`
  margin-top: 20px;
`;

const ResourceModalButton = styled(Button)`
  color: #373b44;
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.43;
  padding: 10px 20px;
`;

const UploadResourceModalBody = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: 20px 30px 30px;
  width: 720px;
`;
