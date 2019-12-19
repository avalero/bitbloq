import React, { FC, useMemo } from "react";
import { Code } from "@bitbloq/code";
import { IEditorProps, IDocumentImage } from "../types";
import {
  Icon,
  useTranslate,
  IDocumentProps,
  IDocumentTab,
  Switch,
  IMainMenuOption
} from "@bitbloq/ui";

const CodeEditor: FC<IEditorProps> = ({
  document,
  onDocumentChange,
  baseTabs,
  baseMenuOptions,
  children
}) => {
  const t = useTranslate();

  const mainTab: IDocumentTab = useMemo(
    () => ({
      icon: <Icon name="programming" />,
      label: t("code"),
      content: <Code />
    }),
    []
  );

  return children({
    tabs: [mainTab, ...baseTabs],
    menuOptions: baseMenuOptions
  });
};

export default CodeEditor;
