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
  const [userName, setUserName] = useState("");
  const contentRef = useRef([]);
  const advancedModeRef = useRef();

  const { data, loading: loadingQuery, refetch } = useQuery(ME_QUERY);

  const t = useTranslate();

  useEffect(() => {
    setUserLogged(data && data.me);
    setUserName(data && data.me && data.me.name);
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
    refetch();
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
    <HeaderRightContent>
      <UserInfo>
        <UserName>{userName}</UserName>
        <UserImg />
      </UserInfo>
    </HeaderRightContent>
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
  align-items: center;
  display: flex;
  height: 70px;
  position: absolute;
  right: 20px;
  top: 0;
`;

interface UserImgProps {
  img?: string;
}

const UserImg = styled.div<UserImgProps>`
  background: url(${(props: UserImgProps) => props.img}) center/40px 40px,
    #3b3e45;
  border-radius: 100%;
  height: 40px;
  width: 40px;
`;

const UserInfo = styled.div`
  align-items: center;
  display: flex;
  border-left: solid 1px #cfcfcf;
  height: 100%;
  padding-left: 19px;
`;

const UserName = styled.p`
  align-items: center;
  color: #3b3e45;
  display: flex;
  font-family: Roboto;
  font-size: 14px;
  height: 16px;
  margin-right: 10px;
  max-width: 210px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
