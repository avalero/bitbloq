import React, { useState, useRef, useEffect } from "react";
import { saveAs } from "file-saver";
import Loading from "./Loading";
import { documentTypes } from "../config";
import { Button, Modal, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { SessionEvent, setToken, useSessionEvent } from "../lib/session";
import { Response, useQuery, useMutation } from "@apollo/react-hooks";
import { ME_QUERY, LOGIN_MUTATION } from "../apollo/queries";
import LoginPanel from "./LoginPanel";
import HeaderRightContent from "./HeaderRightContent";
import UserInfo from "./UserInfo";

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
  const [loginModal, setLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [logingError, setLogingError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [login] = useMutation(LOGIN_MUTATION);
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
    refetch().then((result: Response) => setUserName(result.data.me.name));
  });

  if (loading) {
    return <Loading />;
  }

  const onLoginClick = async () => {
    try {
      setLoggingIn(true);
      setLogingError(false);
      const result = await login({ variables: { email, password } });
      setLoggingIn(false);
      onLoginSuccess(result.data.login);
    } catch (e) {
      setLoggingIn(false);
      setLogingError(true);
    }
  };

  const onLoginSuccess = (token: string) => {
    setEmail("");
    setPassword("");
    setToken(token);
    setLoginModal(false);
  };

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

  const onCloseModal = () => {
    setEmail("");
    setLogingError(false);
    setLoginModal(false);
    setPassword("");
  };

  const headerRightContent: Element = userLogged ? (
    <HeaderRightContent>
      <UserInfo name={userName} />
    </HeaderRightContent>
  ) : (
    <HeaderRightContent>
      <EnterButton onClick={() => setLoginModal(true)}>
        {t("playground-enter-button")}
      </EnterButton>
    </HeaderRightContent>
  );

  return (
    <>
      <MyModal
        isOpen={loginModal}
        title={t("general-enter-button")}
        onClose={onCloseModal}
      >
        <MyLoginPanel
          email={email}
          logingError={logingError}
          logingIn={loggingIn}
          password={password}
          onLoginClick={onLoginClick}
          secondaryButtonCallback={onCloseModal}
          secondaryButtonText={t("general-cancel-button")}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      </MyModal>
      <EditorComponent
        content={contentRef.current}
        onContentChange={onContentChange}
        brandColor={documentType.color}
        title="Playground"
        tabIndex={tabIndex}
        onTabChange={setTabIndex}
        onSaveDocument={onSaveDocument}
        changeAdvancedMode={(value: boolean) =>
          (advancedModeRef.current = value)
        }
        documentAdvancedMode={advancedModeRef.current}
        headerRightContent={headerRightContent}
        isPlayground
      />
    </>
  );
};

export default Playground;

const EnterButton = styled(Button)`
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.57;
  padding: 0 20px;
`;

const MyLoginPanel = styled(LoginPanel)`
  .btn {
    font-family: Roboto;
  }

  .cancel-btn {
    background-color: #ebebeb;
    color: #373b44;
  }

  .cancel-btn: hover {
    background-color: #cfcdcd;
  }

  .forgot-password-link {
    display: none;
  }
`;

const MyModal = styled(Modal)`
  font-size: 14px;

  [class*="Close"] {
    display: none;
  }

  [class*="Header"] {
    height: 101px;
    text-align: center;
  }

  [class*="Panel"] {
    padding: 40px;
    width: 300px;
  }

  [class*="Title"] {
    align-items: center;
    display: flex;
    justify-content: center;
  }
`;
