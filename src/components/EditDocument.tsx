import React, { FC, useState } from "react";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Document, Icon, Spinner, useTranslate } from "@bitbloq/ui";
import { navigate } from "gatsby";
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

import debounce from "lodash.debounce";

interface EditDocumentProps {
  type: string;
  document: any;
  update: (document: any) => any;
  publish?: (isPublic: boolean) => any;
}
const EditDocument: FC<EditDocumentProps> = ({
  type,
  document,
  update,
  publish
}) => {
  const t = useTranslate();

  const { data: { me = { admin: false } } = {} } = useQuery(ME_QUERY);

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const { title, description, image, public: isPublic } = document;

  const location = window.location;
  const publicUrl = `${location.protocol}//${
    location.host
  }/app/public-document/${type}/${document.id}`;

  const documentType = documentTypes[type];
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

  const onTogglePublic = () => {
    if (publish) {
      publish(!document.public);
    }
  };

  const onSaveDocument = () => {
    const documentJSON = {
      type,
      title,
      description,
      content,
      image
    };
    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });
    saveAs(blob, `${title}.${type}.bitbloq`);
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
        onChange={async ({ title, description, image }) => {
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
        title={title}
        onEditTitle={onEditTitle}
        onSaveDocument={onSaveDocument}
        onContentChange={debounce(
          (content: any[]) => onContentChange(content),
          1000
        )}
        preMenuContent={me.admin &&
          <PublishBar
            isPublic={isPublic}
            onToggle={onTogglePublic}
            url={isPublic ? publicUrl : ""}
          />
        }
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

interface EditExistingDocumentProps {
  id: string;
  type: string;
}
const EditExistingDocument: FC<EditExistingDocumentProps> = ({ id, type }) => {
  const { loading, error, data, refetch } = useQuery(DOCUMENT_QUERY, {
    variables: { id }
  });
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);

  const update = async (document: any) => {
    await updateDocument({ variables: document });
    refetch();
  };

  const publish = async (isPublic: boolean) => {
    await publishDocument({ variables: { id, public: isPublic } });
    refetch();
  };

  const documentType = documentTypes[type];

  if (loading) return <Loading color={documentType.color} />;
  if (error) return <p>Error :(</p>;

  const { document = {} } = data;

  return (
    <EditDocument
      type={type}
      document={document}
      update={update}
      publish={publish}
    />
  );
};

interface EditNewDocumentProps {
  type: string;
}
const EditNewDocument: FC<EditNewDocumentProps> = ({ type }) => {
  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);

  const document = {
    content: "[]",
    title: "",
    description: "",
    public: false,
    image: "",
    type
  };

  const update = async (document: any) => {
    const {
      data: {
        createDocument: { id: newId }
      }
    } = await createDocument({ variables: document });
    navigate(`/app/document/${type}/${newId}`);
  };

  return <EditDocument type={type} document={document} update={update} />;
};

interface EditDocumentPageProps {
  id: string;
  type: string;
}
const EditDocumentPage: FC<EditDocumentPageProps> = ({ id, type }) => {
  if (id === "new") {
    return <EditNewDocument type={type} />;
  } else {
    return <EditExistingDocument id={id} type={type} />;
  }
};

export default EditDocumentPage;

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
