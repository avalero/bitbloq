import React from "react";
import { Robotics } from "@bitbloq/robotics";
import { Icon, useTranslate } from "@bitbloq/ui";
import { IEditorProps } from "../types";
import useDocumentContent from "../lib/useDocumentContent";

const RoboticsEditor: React.FunctionComponent<IEditorProps> = ({
  document,
  onDocumentChange,
  baseTabs,
  baseMenuOptions,
  children
}) => {
  const t = useTranslate();

  const [initialContent, onContentChange] = useDocumentContent(
    document,
    onDocumentChange
  );

  if (!initialContent) {
    return null;
  }

  return (
    <Robotics
      initialContent={initialContent || {}}
      onContentChange={onContentChange}
    >
      {({ hardware, bloqs, diagram }) =>
        children({
          tabs: [
            {
              icon: <Icon name="hardware" />,
              label: t("robotics.hardware"),
              content: hardware
            },
            {
              icon: <Icon name="programming-bloqs" />,
              label: t("robotics.bloqs"),
              content: bloqs
            },
            {
              icon: <Icon name="programming-diagram" />,
              label: t("robotics.diagram"),
              content: diagram
            },
            ...baseTabs
          ],
          menuOptions: baseMenuOptions
        })
      }
    </Robotics>
  );
};

export default RoboticsEditor;
