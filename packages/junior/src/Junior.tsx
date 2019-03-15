import React, { useState } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { Document, Icon, useTranslate } from "@bitbloq/ui";
import {
  HorizontalBloqEditor,
  Bloq,
  BloqType,
  BloqTypeGroup
} from "@bitbloq/bloqs";

export interface JuniorProps {
  brandColor: string;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  bloqTypes: BloqType[];
  eventBloqGroups: BloqTypeGroup[];
  actionBloqGroups: BloqTypeGroup[];
  waitBloqGroups: BloqTypeGroup[];
  initialContent?: any;
  onContentChange: (content: any) => any;
}

const Junior: React.FunctionComponent<JuniorProps> = ({
  children,
  brandColor,
  title,
  onEditTitle,
  tabIndex,
  onTabChange,
  bloqTypes,
  eventBloqGroups,
  actionBloqGroups,
  waitBloqGroups,
  initialContent,
  onContentChange
}) => {
  const t = useTranslate();

  const [content, setContent] = useState(initialContent);
  const bloqs = content.bloqs || [];

  const mainTabs = [
    <Document.Tab
      key="hardware"
      icon={<Icon name="hardware" />}
      label={t("hardware")}
    >
      <h1>Hardware</h1>
    </Document.Tab>,
    <Document.Tab
      key="software"
      icon={<Icon name="programming" />}
      label={t("software")}
    >
    <HorizontalBloqEditor
      bloqs={bloqs}
      bloqTypes={bloqTypes}
      eventBloqGroups={eventBloqGroups}
      waitBloqGroups={waitBloqGroups}
      actionBloqGroups={actionBloqGroups}
      onBloqsChange={(newBloqs: Bloq[][]) =>
        setContent(update(content, {bloqs: {$set: newBloqs}}))
      }
    />
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
