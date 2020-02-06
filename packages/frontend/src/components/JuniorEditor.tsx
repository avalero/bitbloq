import React from "react";
import { Junior } from "@bitbloq/junior";
import { Icon, useTranslate } from "@bitbloq/ui";
import { bloqTypes, boards, components } from "../config";
import { IEditorProps } from "../types";
import env from "../lib/env";
import useDocumentContent from "../lib/useDocumentContent";

const JuniorEditor: React.FunctionComponent<IEditorProps> = ({
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
    <Junior
      bloqTypes={bloqTypes}
      initialContent={initialContent || {}}
      onContentChange={onContentChange}
      boards={boards}
      components={components}
      chromeAppID={env.CHROME_APP_ID}
    >
      {(hardware, software) =>
        children({
          tabs: [
            {
              icon: <Icon name="hardware" />,
              label: t("junior.hardware"),
              content: hardware
            },
            {
              icon: <Icon name="programming" />,
              label: t("junior.software"),
              content: software
            },
            ...baseTabs
          ],
          menuOptions: baseMenuOptions
        })
      }
    </Junior>
  );
};

export default JuniorEditor;
