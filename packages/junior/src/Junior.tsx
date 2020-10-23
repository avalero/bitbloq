import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  useCodeUpload,
  ICodeUploadOptions
} from "@bitbloq/code/src/useCodeUpload";
import NoBoardWizard from "@bitbloq/code/src/NoBoardWizard";
import { bloqTypes as partialBloqTypes } from "./bloqTypes";
import { boards as partialBoards } from "./boards";
import { components as partialComponents } from "./components";
import {
  HorizontalBloqEditor,
  HardwareDesigner,
  bloqs2code,
  getBoardDefinition,
  IBloq,
  IBloqLine,
  IBloqType,
  IBoard,
  IComponent,
  IHardware,
  IExtraData,
  isBloqSelectComponentParameter
} from "@bitbloq/bloqs";
import { useTranslate } from "@bitbloq/ui";
import migrateContent from "./migrate-content";
import UploadSpinner from "./UploadSpinner";
import useDebug from "./useDebug";

export interface IJuniorCallbackProps {
  hardware: JSX.Element;
  software: (isActive: boolean) => JSX.Element | null;
  upload: (onPortOpen?: () => void) => void;
  cancel: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export interface IJuniorProps {
  initialContent?: any;
  onContentChange: (content: any) => any;
  children: (props: IJuniorCallbackProps) => JSX.Element;
  uploadOptions: ICodeUploadOptions;
  externalUpload?: boolean;
  readOnly?: boolean;
  debugSpeed?: number;
}

const bloqTypes = partialBloqTypes as IBloqType[];
const boards = partialBoards as IBoard[];
const components = partialComponents as IComponent[];

const Junior: React.FunctionComponent<IJuniorProps> = ({
  children,
  initialContent,
  onContentChange,
  uploadOptions,
  externalUpload,
  readOnly,
  debugSpeed = 1000
}) => {
  const t = useTranslate();

  const [uploading, setUploading] = useState(false);
  const [uploadingVisible, setUploadingVisible] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadText, setUploadText] = useState("");
  const [showNoBoardWizard, setShowNoBoardWizard] = useState(false);
  const hideTimeout = useRef(0);
  useEffect(() => {
    if (uploading) {
      setUploadingVisible(true);
    }

    if (!uploading) {
      hideTimeout.current = window.setTimeout(() => {
        setUploadingVisible(false);
      }, 5000);
    }
  }, [uploading]);

  useEffect(() => {
    if (!uploadingVisible && hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = 0;
    }
  }, [uploadingVisible]);

  const { upload, cancel } = useCodeUpload(uploadOptions);

  const migratedContent = useMemo(() => migrateContent(initialContent), [
    initialContent
  ]);
  const [content, setContent] = useState(migratedContent);
  const program: IBloqLine[] = content.program || [];
  const hardware: IHardware = content.hardware || {
    board: "zumjunior",
    components: []
  };
  const extraData: IExtraData = content.extraData || {};
  const {
    activeBloqs,
    isDebugging,
    startDebugging,
    stopDebugging,
    uploadFirmware
  } = useDebug(program, extraData, debugSpeed);

  const [undoPast, setUndoPast] = useState<any[]>([]);
  const [undoFuture, setUndoFuture] = useState<any[]>([]);

  const updateContent = (newContent: any) => {
    setUndoPast([content, ...undoPast]);
    setUndoFuture([]);
    setContent(newContent);
  };

  const undo = () => {
    setUndoPast(undoPast.slice(1));
    setUndoFuture([content, ...undoFuture]);
    setContent(undoPast[0]);
  };

  const redo = () => {
    setUndoPast([content, ...undoPast]);
    setUndoFuture(undoFuture.slice(1));
    setContent(undoFuture[0]);
  };

  const reset = () => {
    if (content !== migratedContent) {
      updateContent(migratedContent);
    }
  };

  useEffect(() => {
    if (content !== migratedContent) {
      onContentChange(content);
    }
  }, [content]);

  useEffect(() => {
    if (content !== migratedContent) {
      onContentChange(migratedContent);
      updateContent(migratedContent);
    }
  }, [migratedContent]);

  const board: IBoard = getBoardDefinition(boards, hardware);
  if (hardware.components.length === 0) {
    // Add board integrated components to hardware list
    if (board && board.integrated) {
      board.integrated.forEach(integratedComponent =>
        hardware.components.push({ ...integratedComponent, integrated: true })
      );
    }
  }

  if (!board.integrated) {
    board.integrated = [];
  }

  const componentMapRef = useRef<{ [key: string]: IComponent }>(
    [...components, ...board.integrated].reduce((map, c) => {
      map[c.name] = c;
      return map;
    }, {})
  );
  const componentMap = componentMapRef.current;

  const getComponents = (types: string[]) =>
    hardware.components.filter(c =>
      types.some(name =>
        isInstanceOf(componentMap[c.component], name, componentMap)
      )
    );

  const getBloqPort = (bloq: IBloq): string | undefined => {
    if (!bloq) {
      return;
    }

    const bloqType = bloqTypes.find(type => type.name === bloq.type);

    if (bloqType) {
      const componentParameter =
        bloqType.parameters &&
        bloqType.parameters.find(isBloqSelectComponentParameter);
      const componentName =
        componentParameter && bloq.parameters[componentParameter.name];

      if (!componentName) {
        return;
      }

      const component = hardware.components.find(c => c.name === componentName);

      if (component && component.integrated) {
        return;
      }

      return component && component.ports ? component.ports.main : "?";
    }

    return;
  };

  const availableBloqs = bloqTypes.filter(
    bloq =>
      !bloq.components ||
      bloq.components.some(bloqComponent =>
        hardware.components.some(c =>
          isInstanceOf(componentMap[c.component], bloqComponent, componentMap)
        )
      )
  );

  const onStartDebugging = async () => {
    setUploadText(t("code.uploading-to-board"));
    setUploading(true);
    try {
      await uploadFirmware(hardware);
      setUploading(false);
      setUploadingVisible(false);
    } catch (e) {
      setUploadSuccess(false);
      setUploading(false);
      if (e.type === "board-not-found") {
        setUploadingVisible(false);
        setShowNoBoardWizard(true);
        return;
      }
    }
    startDebugging(hardware);
  };

  const onUpload = async (onPortOpen?: () => void) => {
    setUploading(true);
    setUploadSuccess(false);
    setUploadText(t("code.uploading-to-board"));

    if (isDebugging) {
      await stopDebugging();
    }
    const programBloqs = program
      .filter(line => !line.disabled)
      .map(line => line.bloqs);

    const code = bloqs2code(
      boards,
      components,
      bloqTypes,
      hardware,
      programBloqs,
      extraData
    );

    const libraries = [
      ...(board.libraries || []),
      ...hardware.components.flatMap(
        c => componentMap[c.component]?.libraries || []
      )
    ].filter((l, i, libs) => libs.findIndex(m => m.zipURL === l.zipURL) === i);

    try {
      await upload(
        [{ name: "main.ino", content: code }],
        libraries,
        "zumjunior",
        onPortOpen
      );
      setUploadSuccess(true);
      setUploadText(t("code.uploading-success"));
    } catch (e) {
      setUploadSuccess(false);
      if (e.type === "board-not-found") {
        setUploadingVisible(false);
        setShowNoBoardWizard(true);
      } else if (e.type === "compile-error") {
        setUploadText(t("code.uploading-error"));
        console.log(e.data);
      }
    }
    setUploading(false);
  };

  const uploadContent = (
    <UploadSpinner
      visible={uploadingVisible}
      uploading={uploading}
      success={uploadSuccess}
      text={uploadText}
      onClick={() => {
        !uploading && setUploadingVisible(false);
      }}
    />
  );

  return children({
    hardware: (
      <HardwareDesigner
        boards={boards}
        components={components}
        hardware={hardware}
        onHardwareChange={newHardware =>
          updateContent({ hardware: newHardware, program, extraData })
        }
        readOnly={readOnly}
      />
    ),
    software: function JuniorSoftware(isActive: boolean) {
      return isActive ? (
        <>
          <HorizontalBloqEditor
            lines={program}
            components={components}
            getComponents={getComponents}
            getBloqPort={getBloqPort}
            bloqTypes={bloqTypes}
            availableBloqs={availableBloqs}
            onLinesChange={(newProgram: IBloqLine[]) =>
              updateContent({ program: newProgram, hardware, extraData })
            }
            isDebugging={isDebugging}
            onStartDebugging={() => onStartDebugging()}
            onStopDebugging={stopDebugging}
            onUpload={() => onUpload()}
            board={board}
            externalUpload={externalUpload}
            readOnly={readOnly}
            extraData={extraData}
            onExtraDataChange={(newExtraData: IExtraData) =>
              updateContent({ extraData: newExtraData, hardware, program })
            }
            activeBloqs={activeBloqs}
          />
          {!externalUpload && uploadContent}
          <NoBoardWizard
            driversUrl="https://storage.googleapis.com/bitbloq-qa/zumjunior_windows_drivers.zip"
            isOpen={showNoBoardWizard}
            onClose={() => setShowNoBoardWizard(false)}
          />
        </>
      ) : null;
    },
    upload: onUpload,
    cancel,
    undo,
    redo,
    reset,
    canUndo: undoPast.length > 0,
    canRedo: undoFuture.length > 0
  });
};

export const isInstanceOf = (
  component: IComponent,
  name: string,
  componentsMap: { [key: string]: IComponent }
): boolean => {
  if (component.name === name) {
    return true;
  }

  if (component.extends) {
    const parentComponent = componentsMap[component.extends];
    if (parentComponent) {
      return isInstanceOf(parentComponent, name, componentsMap);
    }
  }

  return false;
};

export default Junior;
