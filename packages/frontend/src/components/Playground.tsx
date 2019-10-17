import React, { useState, useRef, useEffect } from "react";
import { navigate } from "gatsby";
import { saveAs } from "file-saver";
import Loading from "./Loading";
import { documentTypes } from "../config";
import { Button, DialogModal, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import { SessionEvent, setToken, useSessionEvent } from "../lib/session";
import { Response, useQuery, useMutation } from "@apollo/react-hooks";
import {
  CREATE_DOCUMENT_MUTATION,
  ME_QUERY,
  LOGIN_MUTATION
} from "../apollo/queries";
import { LoginForm } from "./LoginPanel";
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
  const advancedModeRef = useRef(false);

  const { data, loading: loadingQuery, refetch } = useQuery(ME_QUERY);
  const [createDocumentMutation] = useMutation(CREATE_DOCUMENT_MUTATION);

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
        const advancedModeCookie = window.sessionStorage.getItem(
          "advancedMode"
        );
        advancedModeRef.current =
          advancedModeCookie && advancedModeCookie !== "undefined"
            ? JSON.parse(advancedModeCookie)
            : false;
        setCurrentType(document.type);
        setLoading(false);
        channel.close();
      }
    };
  }, []);

  useSessionEvent("new-token", (event: SessionEvent) => {
    const token: string = event.data;
    setUserLogged(!!token);
    refetch().then(
      (result: Response) => (setUserName(result.data.me.name), createDocument())
    );
  });

  if (loading) {
    return <Loading />;
  }

  const createDocument = async () => {
    const title: string = "playground";
    const document = {
      type: currentType,
      title,
      content: JSON.stringify(contentRef.current),
      advancedMode: advancedModeRef.current
    };
    const {
      data: {
        createDocument: { id: newId }
      }
    } = await createDocumentMutation({ variables: document });
    navigate(`/app/document/${undefined}/${type}/${newId}`, { replace: true });
  };

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

  const headerRightContent: JSX.Element = userLogged ? (
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
      <DialogModal
        isOpen={loginModal}
        title={t("general-enter-button")}
        okText={t("general-enter-button")}
        cancelText={t("general-cancel-button")}
        onOk={onLoginClick}
        onCancel={onCloseModal}
        horizontalRule={true}
        content={
          <ModalLoginForm
            email={email}
            logingError={logingError}
            password={password}
            setEmail={setEmail}
            setPassword={setPassword}
          />
        }
      />
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
        backCallback={() => navigate("/")}
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

const ModalLoginForm = styled(LoginForm)`
  label {
    font-size: 14px;
    text-align: left;
  }

  & > div:last-of-type {
    margin-bottom: 30px;
  }
`;
