import React, { useState, useRef } from "react";
import saveAs from "file-saver";
import { documentTypes } from "../config";

interface PlaygroundProps {
  type: string;
}

const Playground: React.FunctionComponent<PlaygroundProps> = ({ type }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const contentRef = useRef([]);
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const onSaveDocument = () => {
    const title = "escena";
    const documentJSON = {
      type,
      title,
      content: JSON.stringify(contentRef.current)
    };
    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });
    saveAs(blob, `${title}.${type}.bitbloq`);
  };

  const onContentChange = content => {
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
    />
  );
};

export default Playground;
