import React, { FC, useState } from "react";
import { Modal, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { resources } from "../config";

import useUserData from "../lib/useUserData";
import useLogout from "../lib/useLogout";
import MenuButton from "./MenuButton";

interface IResource {
  label: string;
  icon: string;
  id: number;
}

interface IResourceProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

const Resource: FC<IResourceProps> = ({ active, label, icon, onClick }) => {
  const t = useTranslate();

  return (
    <RecourseItem active={active} onClick={onClick}>
      <Icon name={icon} />
      <p>{t(label)}</p>
    </RecourseItem>
  );
};

export interface ICloudModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CloudModal: FC<ICloudModalProps> = ({ isOpen, onClose }) => {
  let cloudResources: IResource[] = [];

  for (let r in resources) {
    cloudResources.push(resources[r]);
  }

  const [resourceActiveId, setResourceActiveId] = useState<number | string>(
    cloudResources[0].id
  );

  return (
    <Modal
      iconName="cloud-logo"
      isOpen={isOpen}
      onClose={onClose}
      title="Bitbloq Cloud"
    >
      <CloudModalBody>
        <LateralBar>
          {cloudResources.map(resource => (
            <Resource
              active={resourceActiveId === resource.id}
              key={resource.id}
              label={resource.label}
              icon={resource.icon}
              onClick={() => setResourceActiveId(resource.id)}
            />
          ))}
        </LateralBar>
      </CloudModalBody>
    </Modal>
  );
};

export default CloudModal;

const CloudModalBody = styled.div`
  display: flex;
  flex: row nowrap;
  height: 447px;
  width: 1000px;
`;

const LateralBar = styled.div`
  border-right: 1px solid #ddd;
  height: calc(100% - 21px);
  padding-top: 21px;
  width: 259px;
`;

const RecourseItem = styled.div<{ active?: boolean }>`
  align-items: center;
  background-color: ${props => (props.active ? "#fff" : "#eee")};
  border-bottom: 1px solid #ddd;
  border-right: ${props =>
    props.active ? "1px solid #fff" : "1px solid #ddd"};
  cursor: pointer;
  display: flex;
  height: 40px;
  padding-left: 20px;
  width: calc(100% - 20px);

  &:first-of-type {
    border-top: 1px solid #ddd;
  }

  p {
    align-items: center;
    color: #373b44;
    display: flex;
    font-family: Roboto;
    font-size: 14px;
    font-weight: bold;
    height: 16px;
  }

  svg {
    margin-right: 6px;
  }
`;
