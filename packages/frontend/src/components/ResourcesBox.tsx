import { Button, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { resourceTypes } from "../config";
import { IResource } from "../types";

const ResourceItem: FC<IResource> = ({ title, type }) => {
  const extTitle = title.split(".").pop();
  const titleName = title
    .replace(new RegExp(`\.${extTitle}$`), "")
    .substring(0, 64);

  const [firstTitle, setFirsTitle] = useState<string>(
    titleName.substring(0, titleName.length - 3)
  );
  const [secondTitle, setSecondTitle] = useState<string>(
    `${titleName.substring(titleName.length - 3)}.${extTitle}`
  );

  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (titleRef.current!.clientHeight > 16) {
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
      <TrashIcon>
        <Icon name="trash" />
      </TrashIcon>
    </ResourceBox>
  );
};

interface IResourcesBoxProps {
  resources: IResource[];
}

const ResourcesBox: FC<IResourcesBoxProps> = ({ resources }) => {
  const t = useTranslate();
  return (
    <Box>
      {resources.length > 0 ? (
        resources.map(resource => (
          <ResourceItem key={resource.id} {...resource} />
        ))
      ) : (
        <EmptyResources>
          {t("document-info.placeholders.resources")}
        </EmptyResources>
      )}
      <AddButton tertiary>
        <Icon name="plus" />
        {resources.length > 0
          ? t("document-info.buttons.add-more-resources")
          : t("document-info.buttons.add-new-resource")}
      </AddButton>
    </Box>
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
