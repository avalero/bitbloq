import { Button, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useEffect, useLayoutEffect, useRef, useState } from "react";
import UploadResourceModal from "./UploadResourceModal";
import { resourceTypes } from "../config";
import { ResourcesTypes } from "../types";
import { IResource } from "../../../api/src/api-types";

interface IResourceItemProps extends IResource {
  onDelete: (id: string) => void;
}

const ResourceItem: FC<IResourceItemProps> = ({
  id,
  onDelete,
  title,
  type
}) => {
  const [firstTitle, setFirsTitle] = useState<string>("");
  const [secondTitle, setSecondTitle] = useState<string>("");

  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const titleExt = title!.split(".").pop();
    const titleName = title!
      .replace(new RegExp(`\.${titleExt}$`), "")
      .substring(0, 64);
    setFirsTitle(titleName.substring(0, titleName.length - 3));
    setSecondTitle(`${titleName.substring(titleName.length - 3)}.${titleExt}`);
  }, []);

  useLayoutEffect(() => {
    if (titleRef.current && titleRef.current.clientHeight > 16) {
      setFirsTitle(firstTitle.substring(0, firstTitle.length - 1));
      if (!secondTitle.match(/^\.{3}/)) {
        setSecondTitle(`...${secondTitle}`);
      }
    }
  });

  return (
    <ResourceBox>
      <TypeIcon name={resourceTypes[type].icon} />
      <ResourceTitle ref={titleRef}>
        {firstTitle}
        {secondTitle}
      </ResourceTitle>
      <TrashIcon onClick={() => onDelete(id!)}>
        <Icon name="trash" />
      </TrashIcon>
    </ResourceBox>
  );
};

interface IResourcesBoxProps {
  documentId: string;
  resourceAdded: (id: string) => void;
  resourceDeleted: (id: string) => void;
  resources: IResource[];
  resourcesTypesAccepted: ResourcesTypes[];
}

const ResourcesBox: FC<IResourcesBoxProps> = ({
  documentId,
  resourceAdded,
  resourceDeleted,
  resources,
  resourcesTypesAccepted
}) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const t = useTranslate();

  return (
    <>
      <Box>
        {resources.length > 0 ? (
          resources.map(resource => (
            <ResourceItem
              key={resource.id!}
              {...resource}
              onDelete={resourceDeleted}
            />
          ))
        ) : (
          <EmptyResources>
            {t("document-info.placeholders.resources")}
          </EmptyResources>
        )}
        <AddButton onClick={() => setModalOpen(true)} tertiary>
          <Icon name="plus" />
          {resources.length > 0
            ? t("document-info.buttons.add-more-resources")
            : t("document-info.buttons.add-new-resource")}
        </AddButton>
      </Box>
      <UploadResourceModal
        acceptedTypes={resourcesTypesAccepted}
        addedCallback={resourceAdded}
        documentId={documentId}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
};

export default ResourcesBox;

const AddButton = styled(Button)`
  width: 100%;

  svg {
    margin-right: 6px;
  }
`;

const Box = styled.div`
  background-color: #fff;
  border: solid 1px #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  padding: 10px;
  width: 100%;
`;

const EmptyResources = styled.div`
  align-items: center;
  color: #373b44;
  display: flex;
  font-size: 20px;
  font-weight: 300;
  height: 60px;
  margin-bottom: 10px;
  justify-content: center;
  text-align: center;
`;

const ResourceBox = styled(Box)`
  align-items: center;
  flex-flow: row nowrap;
  height: 60px;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const ResourceTitle = styled.div`
  align-items: center;
  color: #474749;
  display: flex;
  flex-grow: 1;
  font-size: 14px;
  margin: 0 10px;
  max-width: calc(100% - 96px); /* 40 Icon, 36 Trash, 20 margin left and right*/
  word-break: break-all;
`;

const TrashIcon = styled.div`
  align-items: center;
  background-color: #ebebeb;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  height: 36px;
  justify-content: center;
  width: 36px;

  &:hover {
    background-color: #dbdee3;
  }
`;

const TypeIcon = styled(Icon)`
  color: #c0c3c9;
  flex-shrink: 0;
  height: 40px;
  width: 40px;
`;
