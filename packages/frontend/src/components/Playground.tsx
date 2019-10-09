import React, { useState, useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import Loading from "./Loading";
import { documentTypes } from "../config";

interface PlaygroundProps {
  type?: string;
  openDocument?: boolean;
}

const Playground: React.FunctionComponent<PlaygroundProps> = ({
  type,
  openDocument
}) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [currentType, setCurrentType] = useState(type);
  const [loading, setLoading] = useState(openDocument);
  const contentRef = useRef([]);
  const advancedModeRef = useRef();

  useEffect(() => {
    const channel = new BroadcastChannel("bitbloq-landing");
    channel.postMessage({ command: "open-document-ready" });
    channel.onmessage = e => {
      const { document, command } = e.data;
      if (command === "open-document") {
        contentRef.current = JSON.parse(document.content);
        advancedModeRef.current = JSON.parse(document.advancedMode);
        setCurrentType(document.type);
        setLoading(false);
        channel.close();
      }
    };
  }, []);

  if (loading) {
    return <Loading />;
  }

  const documentType = documentTypes[currentType || "3d"];
  const EditorComponent = documentType.editorComponent;

  const onSaveDocument = () => {
    const title = "playground";
    const documentJSON = {
      currentType,
      title,
      content: JSON.stringify(contentRef.current),
      advancedMode: advancedModeRef.current
    };
    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });
    saveAs(blob, `${title}.bitbloq`);
  };

  const onContentChange = (content: any) => {
    contentRef.current = content;
  };

  return (
    <EditorComponent
      content={contentRef.current}
      onContentChange={onContentChange}
      brandColor={documentType.color}
      title="Playground"
      tabIndex={tabIndex}
      onTabChange={setTabIndex}
      onSaveDocument={onSaveDocument}
      changeAdvancedMode={(value: boolean) => (advancedModeRef.current = value)}
      documentAdvancedMode={advancedModeRef.current}
      isPlayground
    />
  );
};

export default Playground;
