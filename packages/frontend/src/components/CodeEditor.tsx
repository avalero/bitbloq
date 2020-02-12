import React, { FC, useEffect, useMemo } from "react";
import { Code } from "@bitbloq/code";
import { IEditorProps } from "../types";
import useDocumentContent from "../lib/useDocumentContent";
import env from "../lib/env";
import { Icon, useTranslate, IDocumentTab } from "@bitbloq/ui";

const CodeEditor: FC<IEditorProps> = ({
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

  const mainTab: IDocumentTab = useMemo(
    () => ({
      icon: <Icon name="programming" />,
      label: t("code.code"),
      content: initialContent && (
        <Code
          initialContent={initialContent || {}}
          onContentChange={onContentChange}
          chromeAppID={env.CHROME_APP_ID}
          borndateFilesRoot={`${window.location.origin}/_next/static/borndate`}
        />
      )
    }),
    [initialContent]
  );

  return children({
    tabs: [mainTab, ...baseTabs],
    menuOptions: baseMenuOptions
  });
};

export default CodeEditor;
