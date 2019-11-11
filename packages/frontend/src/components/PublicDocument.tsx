import React, { FC, useState, useEffect } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import { useQuery } from "@apollo/react-hooks";
import {
  DialogModal,
  Document,
  IDocumentTab,
  Icon,
  useTranslate
} from "@bitbloq/ui";
import Loading from "./Loading";
import DocumentInfo from "./DocumentInfo";
import SaveCopyModal from "./SaveCopyModal";
import GraphQLErrorMessage from "./GraphQLErrorMessage";
import { OPEN_PUBLIC_DOCUMENT_QUERY } from "../apollo/queries";
import { documentTypes } from "../config";
import { IDocument } from "../types";

interface PublicDocumentProps {
  id: string;
  type: string;
}

const PublicDocument: FC<PublicDocumentProps> = ({ id, type }) => {
  const documentType = documentTypes[type];
  const EditorComponent = documentType.editorComponent;

  const [tabIndex, setTabIndex] = useState(1);
  const [isSaveCopyVisible, setIsSaveCopyVisible] = useState(false);
  const [isRestartModalVisible, setIsRestartModalVisible] = useState(false);
  const [content, setContent] = useState([]);
  const [restartCount, setRestartCount] = useState(0);

  const t = useTranslate();

  const { data, loading, error } = useQuery(OPEN_PUBLIC_DOCUMENT_QUERY, {
    variables: { id }
  });

  const { openPublicDocument: document = {} } = data || {};

  const restart = () => {
    setRestartCount(restartCount + 1);
    setIsRestartModalVisible(false);
  };

  useEffect(() => {
    if (document && document.content) {
      setContent(document.content);
    }
  }, [document]);

  if (error) return <GraphQLErrorMessage apolloError={error} />;
  if (loading) return <Loading color={documentType.color} />;

  const onSaveCopyClick = () => {
    setIsSaveCopyVisible(true);
  };

  const onRestartClick = () => {
    setIsRestartModalVisible(true);
  };

  const onSaveDocument = () => {
    const documentJSON = {
      ...document,
      content
    };
    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });
    saveAs(blob, `${document.title}.bitbloq`);
  };

  const infoTab: IDocumentTab = {
    icon: <Icon name="info" />,
    label: t("tab-project-info"),
    content: (
      <DocumentInfo document={document} onGotoDocument={() => setTabIndex(0)} />
    )
  };

  const menuOptions = [
    {
      id: "file",
      label: t("menu-file"),
      children: [
        {
          id: "download-document",
          label: t("menu-download-document"),
          icon: <Icon name="download-document" />,
          type: "option",
          onClick: () => onSaveDocument()
        }
      ]
    }
  ];

  return (
    <>
      <EditorComponent
        document={document}
        onDocumentChange={(document: IDocument) => setContent(document.content)}
        baseTabs={[infoTab]}
        baseMenuOptions={menuOptions}
        key={restartCount}
      >
        {documentProps => (
          <Document
            brandColor={documentType.color}
            tabIndex={tabIndex}
            onTabChange={setTabIndex}
            icon={<Icon name={documentType.icon} />}
            title={
              <>
                <TitleIcon>
                  <Icon name="view-document" />
                </TitleIcon>
                <span>{document.title}</span>
              </>
            }
            headerButtons={[
              { id: "save-copy", icon: "add-document" },
              { id: "restart", icon: "reload" }
            ]}
            onHeaderButtonClick={(buttonId: string) => {
              switch (buttonId) {
                case "save-copy":
                  onSaveCopyClick();
                  break;
                case "restart":
                  onRestartClick();
                  break;
              }
            }}
            backCallback={() => Router.push("/")}
            {...documentProps}
          />
        )}
      </EditorComponent>
      {isSaveCopyVisible && (
        <SaveCopyModal
          onClose={() => setIsSaveCopyVisible(false)}
          document={document}
          content={content}
        />
      )}
      <DialogModal
        isOpen={isRestartModalVisible}
        title="Aviso"
        text="¿Seguro que quieres reiniciar el ejercicio? Si lo haces perderás todo lo que hayas hecho y el ejercicio volverá a su estado original."
        okText="Aceptar"
        cancelText="Cancelar"
        onOk={() => restart()}
        onCancel={() => setIsRestartModalVisible(false)}
      />
    </>
  );
};

export default PublicDocument;

const TitleIcon = styled.span`
  svg {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }
`;
