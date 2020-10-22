import React from "react";
import { Junior } from "@bitbloq/junior";
import { Icon, useTranslate } from "@bitbloq/ui";
import { IEditorProps } from "../types";
import useDocumentContent from "../lib/useDocumentContent";
import { flags } from "../config";

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
    onDocumentChange,
    {
      version: 1
    }
  );

  if (!initialContent) {
    return null;
  }

  return (
    <Junior
      initialContent={initialContent || {}}
      onContentChange={onContentChange}
      uploadOptions={{
        filesRoot: `${window.location.origin}/_next/static/borndate`
      }}
      debugSpeed={flags.JUNIOR_DEBUG_SPEED}
    >
      {({ hardware, software }) =>
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
