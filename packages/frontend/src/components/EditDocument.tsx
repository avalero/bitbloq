import React, { FC, useState, useEffect, useCallback } from "react";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Document, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import { navigate } from "gatsby";
import useUserData from "../lib/useUserData";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import PublishBar from "./PublishBar";
import {
  DOCUMENT_QUERY,
  CREATE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION,
  PUBLISH_DOCUMENT_MUTATION,
  ME_QUERY
} from "../apollo/queries";
import { documentTypes } from "../config";

import debounce from "lodash/debounce";

interface EditDocumentProps {
  id: string;
  type: string;
}
const EditDocument: FC<EditDocumentProps> = ({ id, type }) => {
  const t = useTranslate();

  const user = useUserData();
  const isAdmin = user && user.admin;
  const isNew = id === "new";

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState({
    content: "[]",
    title: "",
    description: "",
    public: false,
    example: false,
    type
  });
  const [image, setImage] = useState("");

  const { loading: loadingDocument, error, data, refetch } = useQuery(
    DOCUMENT_QUERY,
    {
      variables: { id },
      skip: isNew
    }
  );

  useEffect(() => {
    if (isNew) {
      setLoading(false);
    } else if (!loadingDocument) {
      setDocument(data.document);
      setImage(data.document && data.document.image);
      setLoading(false);
    }
  }, [loadingDocument]);

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);

  const debouncedUpdate = useCallback(
    debounce(async (document: any) => {
      await updateDocument({ variables: { ...document, id } });
      refetch();
    }, 1000),
    [id]
  );

  useEffect(() => {
    setImage(data && data.document && data.document.image);
  }, [data]);

  const update = async (document: any) => {
    setDocument(document);
    if (isNew) {
      const {
        data: {
          createDocument: { id: newId }
        }
      } = await createDocument({ variables: document });
      navigate(`/app/document/${type}/${newId}`, { replace: true });
    } else {
      debouncedUpdate(document);
    }
  };

  const publish = async (isPublic: boolean, isExample: boolean) => {
    if (!isNew) {
      setDocument({ ...document, public: isPublic, example: isExample });
      await publishDocument({
        variables: { id, public: isPublic, example: isExample }
      });
      refetch();
    }
  };

  const documentType = documentTypes[type];

  if (loading) return <Loading color={documentType.color} />;

  const { title, description, public: isPublic, example: isExample, advancedMode } =
    document || {};

  window.sessionStorage.setItem('advancedMode', `${advancedMode}`);

  const location = window.location;
  const publicUrl = `${location.protocol}//${location.host}/app/public-document/${type}/${id}`;

  const EditorComponent = documentType.editorComponent;

  let content: any[] = [];
  try {
    content = JSON.parse(document.content);
  } catch (e) {
    console.warn("Error parsing document content", e);
  }

  const onEditTitle = () => {
    setIsEditTitleVisible(true);
  };

  const onSaveTitle = (title: string) => {
    update({ ...document, title, image: undefined });
    setIsEditTitleVisible(false);
  };

  const onContentChange = (content: any[]) => {
    update({
      ...document,
      content: JSON.stringify(content),
      image: undefined
    });
  };

  const onSetAdvancedMode = (advancedMode: boolean) => {
    update({
      ...document,
      advancedMode,
      image: undefined
    });
  };

  const onChangePublic = (isPublic: boolean, isExample: boolean) => {
    if (publish) {
      publish(isPublic, isExample);
    }
  };

  const onSaveDocument = () => {
    const documentJSON = {
      type,
      title: title || `document${type}`,
      description: description || `bitbloq ${type} document`,
      content: JSON.stringify(content),
      image
    };

    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });

    saveAs(blob, `${documentJSON.title}.bitbloq`);
  };

  const InfoTab = (
    <Document.Tab
      key="info"
      icon={<Icon name="info" />}
      label={t("tab-project-info")}
    >
      <DocumentInfoForm
        title={title}
        description={description}
        image={image}
        onChange={({ title, description, image }) => {
          const newDocument = { ...document, title, description, image };
          if (!image || typeof image === "string") {
            delete newDocument.image;
          }
          update(newDocument);
        }}
      />
    </Document.Tab>
  );

  return (
    <>
      <EditorComponent
        brandColor={documentType.color}
        canEditTitle={true}
        content={content}
        tabIndex={tabIndex}
        onTabChange={(tabIndex: number) => setTabIndex(tabIndex)}
        getTabs={(mainTabs: any[]) => [...mainTabs, InfoTab]}
        title={title || "Documento sin título"}
        onEditTitle={onEditTitle}
        onSaveDocument={onSaveDocument}
        onContentChange={(content: any[]) => onContentChange(content)}
        preMenuContent={
          isAdmin && (
            <PublishBar
              isPublic={isPublic}
              isExample={isExample}
              onChange={onChangePublic}
              url={isPublic ? publicUrl : ""}
            />
          )
        }
        changeAdvancedMode={onSetAdvancedMode}
        documentAdvancedMode={advancedMode}
      />
      {isEditTitleVisible && (
        <EditTitleModal
          title={title}
          onCancel={() => setIsEditTitleVisible(false)}
          onSave={onSaveTitle}
        />
      )}
    </>
  );
};

export default EditDocument;

/* styled components */

interface LoadingProps {
  color: string;
}
const Loading = styled(Spinner)<LoadingProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${props => props.color};
`;
