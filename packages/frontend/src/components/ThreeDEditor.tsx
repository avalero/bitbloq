import React, {
  FC,
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback
} from "react";
import styled from "@emotion/styled";
import { ThreeD, IThreeDRef } from "@bitbloq/3d";
import { STLLoader } from "@bitbloq/lib3d";
import { useMutation } from "@apollo/react-hooks";
import {
  Icon,
  useTranslate,
  IDocumentProps,
  IDocumentTab,
  DialogModal,
  Switch,
  IMainMenuOption
} from "@bitbloq/ui";
import { addShapeGroups as bitbloqShapeGroups } from "../config";
import ExportSTLModal from "./ExportSTLModal";
import { IEditorProps, IDocument } from "../types";
import useDocumentContent from "../lib/useDocumentContent";
import { maxSTLFileSize } from "../config";
import { UPLOAD_STL_MUTATION } from "../apollo/queries";

const ThreeDEditor: FC<IEditorProps> = ({
  document,
  onDocumentChange,
  baseTabs,
  baseMenuOptions,
  children
}) => {
  const t = useTranslate();
  const threedRef = useRef<IThreeDRef>(null);
  const openSTLInput = useRef<HTMLInputElement>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showSTLError, setShowSTLError] = useState("");
  const [advancedMode, setAdvancedMode] = useState(document.advancedMode);

  const [initialContent, onContentChange] = useDocumentContent(document, onDocumentChange);

  useEffect(() => {
    if (advancedMode !== document.advancedMode) {
      onDocumentChange({ ...document, advancedMode });
    }
  }, [advancedMode]);

  const addShapeGroups = useCallback(
    baseShapeGroups => [...baseShapeGroups, ...bitbloqShapeGroups],
    [bitbloqShapeGroups]
  );

  const mainTab: IDocumentTab = useMemo(
    () => ({
      icon: <Icon name="threed" />,
      label: t("tab-3d"),
      content: initialContent && (
        <ThreeD
          key="3D"
          threeDRef={threedRef}
          initialContent={initialContent}
          addShapeGroups={addShapeGroups}
          onContentChange={onContentChange}
          advancedMode={advancedMode}
        />
      )
    }),
    [threedRef, initialContent, addShapeGroups, onContentChange, advancedMode]
  );

  const menuOptions = useMemo(() => {
    const baseFileMenu = baseMenuOptions.find(o => o.id === "file");
    const downloadDocumentIndex = baseFileMenu.children.findIndex(
      o => o.type !== "divider" && o.id === "download-document"
    );

    const fileMenu = { ...baseFileMenu, children: [...baseFileMenu.children] };
    fileMenu.children.splice(Math.max(downloadDocumentIndex, 0), 0, {
      id: "download-stl",
      label: t("menu-export-stl"),
      icon: <Icon name="export-stl" />,
      onClick: () => setShowExportModal(true),
      type: "option"
    });

    const viewMenu: IMainMenuOption = {
      id: "view",
      label: t("menu-view"),
      children: [
        {
          id: "mode",
          label: t("menu-mode"),
          icon: <Icon name="difficulty" />,
          type: "submenu",
          children: [
            {
              id: "basic-mode",
              label: t("menu-basic"),
              checked: !advancedMode,
              onClick: () => setAdvancedMode(false),
              type: "option"
            },
            {
              id: "advanced-mode",
              label: t("menu-advanced"),
              checked: advancedMode,
              onClick: () => setAdvancedMode(true),
              type: "option"
            }
          ]
        }
      ]
    };

    return [fileMenu, viewMenu];
  }, [advancedMode, baseMenuOptions]);

  const documentProps: Partial<IDocumentProps> = {
    menuOptions,
    tabs: [mainTab, ...baseTabs],
    menuRightContent: (
      <AdvancedModeWrap>
        <span>{t("menu-basic-mode")}</span>
        <Switch
          value={advancedMode}
          onChange={value => setAdvancedMode(value)}
          leftRight={true}
        />
        <span>{t("menu-advanced-mode")}</span>
      </AdvancedModeWrap>
    )
  };

  return (
    <>
      {children(documentProps)}
      {showExportModal && (
        <ExportSTLModal
          onCancel={() => setShowExportModal(false)}
          onSave={(name, separate) => {
            setShowExportModal(false);
            threedRef.current.exportToSTL(name, separate);
          }}
        />
      )}
    </>
  );
};

export default ThreeDEditor;

const AdvancedModeWrap = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  span {
    font-size: 14px;
    margin: 0px 10px;
  }
`;
