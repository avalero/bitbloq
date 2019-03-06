import React, { useState } from "react";
import styled from "@emotion/styled";
import { Document, Icon, useTranslate } from "@bitbloq/ui";
import { HorizontalBloqEditor } from "@bitbloq/bloqs";

export interface JuniorProps {
  brandColor: string;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
}

const Junior: React.FunctionComponent<JuniorProps> = ({
  children,
  brandColor,
  title,
  onEditTitle,
  tabIndex,
  onTabChange
}) => {
  const t = useTranslate();

  const mainTabs = [
    <Document.Tab
      key="hardware"
      icon={<Icon name="threed" />}
      label={t("hardware")}
    >
      <h1>Hardware</h1>
    </Document.Tab>,
    <Document.Tab
      key="software"
      icon={<Icon name="threed" />}
      label={t("software")}
    >
      <HorizontalBloqEditor />
    </Document.Tab>
  ];

  return (
    <Document
      brandColor={brandColor}
      title={title || t("untitled-project")}
      onEditTitle={onEditTitle}
      tabIndex={tabIndex}
      onTabChange={onTabChange}
    >
      {typeof children === 'function' ? children(mainTabs) : mainTabs}
    </Document>
  );
};

export default Junior;
