import React, { useState, useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import Loading from "./Loading";
import { documentTypes } from "../config";
import { Button, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { SessionEvent, useSessionEvent } from "../lib/session";
import { useQuery } from "@apollo/react-hooks";
import { ME_QUERY } from "../apollo/queries";

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
  const [userLogged, setUserLogged] = useState(false);
  const contentRef = useRef([]);
  const advancedModeRef = useRef();

  const { data, loading: loadingQuery } = useQuery(ME_QUERY);

  const t = useTranslate();

  useEffect(() => {
    setUserLogged(data && data.me);
  }, [loadingQuery]);

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

  useSessionEvent("new-token", (event: SessionEvent) => {
    const token: string = event.data;
    setUserLogged(!!token);
  });

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

  const headerRightContent: Element = userLogged ? (
    <></>
  ) : (
    <HeaderRightContent>
      <EnterButton>{t("playground-enter-button")}</EnterButton>
    </HeaderRightContent>
  );

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
      headerRightContent={headerRightContent}
      isPlayground
    />
  );
};

export default Playground;

const EnterButton = styled(Button)`
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.57;
  padding: 0 20px;
`;

const HeaderRightContent = styled.div`
  position: absolute;
  right: 20px;
  top: 15px;
`;
