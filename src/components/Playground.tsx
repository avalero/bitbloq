import React, { useState } from "react";
import { documentTypes } from "../config";

interface PlaygroundProps {
  type: string;
}

const Playground: React.FunctionComponent<PlaygroundProps> = ({ type }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  return (
    <EditorComponent
      brandColor={documentType.color}
      title="Playground"
      tabIndex={tabIndex}
      onTabChange={setTabIndex}
    />
  );
};

export default Playground;
