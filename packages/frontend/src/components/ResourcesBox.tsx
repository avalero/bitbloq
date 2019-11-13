import { Button, DropDown, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useLayoutEffect, useRef, useState } from "react";
import DocumentCardMenu from "./DocumentCardMenu";
import MenuButton from "./MenuButton";
import { IResource } from "../types";

interface IResourcesBoxProps {
  resources: IResource[];
}

const ResourcesBox: FC<IResourcesBoxProps> = ({ resources }) => {
  const t = useTranslate();
  return (
    <Box>
      {resources.length > 0 ? (
        <></>
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
  display: column nowrap;
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
