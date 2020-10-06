import React, { FC, useEffect, useMemo, useState, useRef } from "react";
import { Code, ICodeRef } from "@bitbloq/code";
import { IEditorProps, ResourcesTypes } from "../types";
import UploadResourceModal from "./UploadResourceModal";
import useDocumentContent from "../lib/useDocumentContent";
import env from "../lib/env";
import {
  Icon,
  useTranslate,
  IDocumentTab,
  IDocumentProps,
  IMainMenuOption
} from "@bitbloq/ui";

const CodeEditor: FC<IEditorProps> = ({
  document,
  onDocumentChange,
  baseTabs,
  baseMenuOptions,
  children,
  user
}) => {
  const t = useTranslate();
  const [showResourceModal, setShowResourceModal] = useState(false);
  const codeRef = useRef<ICodeRef>(null);

  const [initialContent, onContentChange] = useDocumentContent(
    document,
    onDocumentChange,
    {}
  );

  const mainTab: IDocumentTab = useMemo(
    () => ({
      icon: <Icon name="programming" />,
      label: t("code.code"),
      content: initialContent && (
        <Code
          ref={codeRef}
          initialContent={initialContent || {}}
          onContentChange={onContentChange}
          borndateFilesRoot={`${window.location.origin}/_next/static/borndate`}
        />
      )
    }),
    [initialContent]
  );

  const menuOptions = useMemo(() => {
    const baseFileMenu = baseMenuOptions.find(o => o.id === "file");
    const downloadDocumentIndex = baseFileMenu!.children.findIndex(
      o => o.type !== "divider" && o.id === "download-document"
    );

    const fileMenu = { ...baseFileMenu, children: [...baseFileMenu!.children] };

    if (user) {
      fileMenu.children.push({
        id: "import-resource",
        label: t("cloud.upload.import"),
        icon: <Icon name="import-stl" />,
        onClick: () => {
          if (!document.id) {
            onDocumentChange(document);
          }
          setShowResourceModal(true);
        },
        type: "option"
      });
    }

    return [fileMenu];
  }, [baseMenuOptions]);

  const documentProps: Partial<IDocumentProps> = {
    tabs: [mainTab, ...baseTabs],
    menuOptions: menuOptions as IMainMenuOption[]
  };

  return (
    <>
      {children(documentProps)}
      <UploadResourceModal
        addedCallback={(_, filename, publicUrl) => {
          if (codeRef.current && filename && publicUrl) {
            codeRef.current!.addLibrary({
              name: filename,
              zipURL: publicUrl
            });
          }
        }}
        acceptedTypes={[ResourcesTypes.arduinoLibrary]}
        documentId={document.id!}
        isOpen={showResourceModal}
        onClose={() => setShowResourceModal(false)}
      />
    </>
  );
};

export default CodeEditor;
