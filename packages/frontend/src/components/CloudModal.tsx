import React, { FC } from "react";
import { Modal, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { resources } from "../config";

import useUserData from "../lib/useUserData";
import useLogout from "../lib/useLogout";
import MenuButton from "./MenuButton";

interface IResource {
  label: string;
  icon: string;
}

const Resource: FC<IResource> = ({ label, icon }) => {
  return <RecourseItem></RecourseItem>;
};

export interface ICloudModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CloudModal: FC<ICloudModalProps> = ({ isOpen, onClose }) => {
  const t = useTranslate();

  let cloudResources: IResource[] = [];

  for (let r in resources) {
    cloudResources.push(resources[r]);
  }

  return (
    <Modal
      iconName="cloud-logo"
      isOpen={isOpen}
      onClose={onClose}
      title="Bitbloq Cloud"
    >
      <CloudModalBody>
        <LateralBar>
          {cloudResources.map((resource, index) => (
            <Resource key={index} label={resource.label} icon={resource.icon} />
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
  background-color: ${props => (props.active ? "#fff" : "#eee")};
  border-bottom: 1px solid #ddd;
  border-right: ${props =>
    props.active ? "1px solid #fff" : "1px solid #ddd"};
  height: 40px;
  width: 100%;

  &:first-of-type {
    border-top: 1px solid #ddd;
  }

  &:hover {
    background-color: #fff;
    border-right: 1px solid #fff;
  }
`;
