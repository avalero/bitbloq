import React, { useState, useEffect } from "react";
import update from "immutability-helper";
import styled from "@emotion/styled";
import { Document, Icon, useTranslate } from "@bitbloq/ui";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  IBloq,
  IBloqType,
  IBloqTypeGroup,
  IBoard,
  IComponent
} from "@bitbloq/bloqs";

export interface JuniorProps {
  brandColor: string;
  title: string;
  onEditTitle: () => any;
  tabIndex: number;
  onTabChange: (tabIndex: number) => any;
  bloqTypes: IBloqType[];
  eventBloqGroups: IBloqTypeGroup[];
  actionBloqGroups: IBloqTypeGroup[];
  waitBloqGroups: IBloqTypeGroup[];
  initialContent?: any;
  onContentChange: (content: any) => any;
  boards: IBoard[];
  components: IComponent[];
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
  onContentChange,
  boards,
  components
}) => {
  const t = useTranslate();

  const [content, setContent] = useState(initialContent);
  const program = content.program || [];
  const hardware = content.hardware || { board: "zumjunior", components: [] };

  useEffect(() => {
    console.log(
      "Calling bloqs2code with:",
      "Board:",
      boards,
      "Components:",
      components,
      "BloqTypes:",
      bloqTypes,
      "Hardware:",
      hardware,
      "Program:",
      program
    );
    const code = bloqs2code(boards, components, bloqTypes, hardware, program);
    console.log("CODE:", code);
  }, [program, hardware]);

  const mainTabs = [
    <Document.Tab
      key="hardware"
      icon={<Icon name="hardware" />}
      label={t("hardware")}
    >
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={newHardware =>
          setContent(update(content, { hardware: { $set: newHardware } }))
        }
      />
    </Document.Tab>,
    <Document.Tab
      key="software"
      icon={<Icon name="programming" />}
      label={t("software")}
    >
      <HorizontalBloqEditor
        bloqs={program}
        bloqTypes={bloqTypes}
        eventBloqGroups={eventBloqGroups}
        waitBloqGroups={waitBloqGroups}
        actionBloqGroups={actionBloqGroups}
        onBloqsChange={(newProgram: IBloq[][]) =>
          setContent(update(content, { program: { $set: newProgram } }))
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
      {typeof children === "function" ? children(mainTabs) : mainTabs}
    </Document>
  );
};

export default Junior;
