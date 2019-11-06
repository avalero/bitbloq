import React, { FC, useState } from "react";
import { Modal, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import ResourcesList from "./ResourcesList";
import { resourceTypes } from "../config";
import { IResource, ResourcesTypes } from "../types";

interface IResourceType {
  label: string;
  icon: string;
  id: string;
}

interface IResourceTypeProps {
  active: boolean;
  label: string;
  icon: string;
  onClick: () => void;
}

const ResourceType: FC<IResourceTypeProps> = ({
  active,
  label,
  icon,
  onClick
}) => {
  const t = useTranslate();

  return (
    <RecourseTypeItem active={active} onClick={onClick}>
      <Icon name={icon} />
      <p>{t(label)}</p>
    </RecourseTypeItem>
  );
};

export interface ICloudModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

const CloudModal: FC<ICloudModalProps> = ({ isOpen, onClose }) => {
  let cloudResources: IResourceType[] = [];

  for (let r in resourceTypes) {
    cloudResources.push(resourceTypes[r]);
  }

  const [resourceActiveId, setResourceActiveId] = useState<string>(
    cloudResources[0].id
  );
  const [resources, setResources] = useState<IResource[]>([
    {
      image:
        "https://www.movilzona.es/app/uploads/2018/01/Personalizacion-Android-1.jpg",
      title:
        "long long long long long long long long long long long long long long long title image.jpg",
      type: ResourcesTypes.images
    },
    {
      title: "long long long long long long long long long title video.mp4",
      type: ResourcesTypes.videos
    },
    {
      image:
        "https://previews.123rf.com/images/sasaperic/sasaperic1506/sasaperic150600188/40774509-geom%C3%A9trico-objeto-3d-en-construcci%C3%B3n-matem%C3%A1tica-blanco.jpg",
      title: "title objects 3D.stl",
      type: ResourcesTypes.objects
    },
    {
      title: "long long long title sounds.mp3",
      type: ResourcesTypes.sounds
    },
    {
      title: "WWWWWWWWWWWWWWWW.mp3",
      type: ResourcesTypes.sounds
    }
  ]);
  const t = useTranslate();

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
            <ResourceType
              active={resourceActiveId === resource.id}
              key={resource.id}
              label={resource.label}
              icon={resource.icon}
              onClick={() => setResourceActiveId(resource.id)}
            />
          ))}
        </LateralBar>
        <MainContent>
          {resources.length === 0 ? (
            <EmptyResources>
              {resourceActiveId === "resource-deleted"
                ? t("cloud.text.trash")
                : t("cloud.text.empty")}
            </EmptyResources>
          ) : (
            <ResourcesList resources={resources} setResources={setResources} />
          )}
        </MainContent>
      </CloudModalBody>
    </Modal>
  );
};

export default CloudModal;

const CloudModalBody = styled.div`
  display: flex;
  flex-flow: row nowrap;
  height: 447px;
  width: 1000px;
`;

const EmptyResources = styled.div`
  align-items: center;
  color: #373b44;
  display: flex;
  font-family: Roboto;
  font-size: 24px;
  font-weight: 300;
  height: 100%;
  justify-content: center;
  width: 100%;
`;

const LateralBar = styled.div`
  border-right: 1px solid #ddd;
  height: calc(100% - 21px);
  padding-top: 21px;
  width: 258px;
`;

const MainContent = styled.div`
  flex: 1 1 auto;
  height: calc(100% - 49px);
  padding: 19px 20px 30px;
`;

const RecourseTypeItem = styled.div<{ active?: boolean }>`
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
