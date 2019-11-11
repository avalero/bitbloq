import React, {
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo
} from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Document,
  IDocumentTab,
  Icon,
  Spinner,
  Button,
  useTranslate
} from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import PublishBar from "./PublishBar";
import HeaderRightContent from "./HeaderRightContent";
import UserInfo from "./UserInfo";
import Loading from "./Loading";
import DocumentLoginModal from "./DocumentLoginModal";
import {
  DOCUMENT_QUERY,
  CREATE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION,
  PUBLISH_DOCUMENT_MUTATION,
  SET_DOCUMENT_IMAGE_MUTATION
} from "../apollo/queries";
import { documentTypes } from "../config";
import { dataURItoBlob } from "../util";
import { IDocument, IDocumentImage } from "../types";
import { ISessionEvent, useSessionEvent } from "../lib/session";

import debounce from "lodash/debounce";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

interface IEditDocumentProps {
  folder?: string;
  id: string;
  type: string;
}

let html2canvas;
if (typeof window !== undefined) {
  import("html2canvas").then(module => (html2canvas = module.default));
}

const EditDocument: FC<IEditDocumentProps> = ({ folder, id, type: initialType }) => {
  const t = useTranslate();

  const user = useUserData();
  const isLoggedIn = !!user;
  const prevIsLoggedIn = useRef(isLoggedIn);

  const [type, setType] = useState(initialType);

  const isPublisher = user && user.publisher;

  const isNew = id === "new";

  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(type === "open");
  const [firstLoad, setFirstLoad] = useState(true);
  const [error, setError] = useState(null);
  const [document, setDocument] = useState({
    id: "",
    content: "[]",
    title: t("untitled-project"),
    description: "",
    public: false,
    example: false,
    type,
    advancedMode: false
  });
  const [image, setImage] = useState<IDocumentImage>();
  const imageToUpload = useRef<Blob | null>(null);

  const {
    loading: loadingDocument,
    error: errorDocument,
    data,
    refetch
  } = useQuery(DOCUMENT_QUERY, {
    variables: { id },
    skip: isNew
  });

  const {
    content,
    advancedMode,
    title,
    description,
    public: isPublic,
    example: isExample
  } = document || {};

  useEffect(() => {
    if (isLoggedIn && !prevIsLoggedIn.current) {
      update({ content, title, description, type, advancedMode });
    }
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    if (firstLoad) {
      saveImage();
      if (
        document &&
        document.id &&
        image &&
        image.isSnapshot &&
        imageToUpload.current &&
        imageToUpload.current.size > 0
      ) {
        updateImage(document.id);
        setFirstLoad(false);
        setInterval(updateImage, 10 * 60 * 1000, document.id);
      }
    }
  }, [imageToUpload.current]);

  useEffect(() => {
    if (type === "open") {
      setLoading(opening);
      setError(null);
    } else if (isNew) {
      setLoading(false);
      setError(null);
    } else if (!loadingDocument && !errorDocument) {
      setDocument(data.document);
      setImage(data.document && data.document.image);
      setLoading(false);
      setError(null);
    } else if (errorDocument) {
      setError(errorDocument);
      setLoading(false);
    }
  }, [loadingDocument, opening]);

  useEffect(() => {
    const channel = new BroadcastChannel("bitbloq-documents");
    channel.postMessage({ command: "open-document-ready" });
    channel.onmessage = e => {
      const { document, command } = e.data;
      if (command === "open-document") {
        setType(document.type);
        update(document);
        setOpening(false);
        channel.close();
      }
    };
  }, []);

  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);
  const [setDocumentImage] = useMutation(SET_DOCUMENT_IMAGE_MUTATION);

  const saveImage = async () => {
    if (!image || image.isSnapshot) {
      const picture: HTMLElement | null = window.document.querySelector(
        ".image-snapshot"
      );
      if (picture && html2canvas) {
        const canvas: HTMLCanvasElement = await html2canvas(picture);
        const imgData: string = canvas.toDataURL("image/jpeg");

        if (imgData !== "data:,") {
          const file: Blob = dataURItoBlob(imgData);
          imageToUpload.current = file;
        }
      }
    }
  };

  const updateImage = (
    id: string,
    imageFile?: Blob,
    isImageSnapshot?: boolean
  ) => {
    const image = imageFile || imageToUpload.current;
    const isSnapshot = isImageSnapshot === undefined ? true : isImageSnapshot;
    setImage({ image: "udpated", isSnapshot });

    if (isSnapshot) {
      setImage({ image: "blob", isSnapshot: true });
    }

    if (image.size > 0 && isLoggedIn) {
      setDocumentImage({
        variables: {
          id,
          image,
          isSnapshot
        }
      }).catch(e => {
        return setError(e);
      });
    }
  };

  const debouncedUpdate = useCallback(
    debounce(async (document: any) => {
      saveImage();
      await updateDocument({ variables: { ...document, id } }).catch(e => {
        return setError(e);
      });
      refetch();
    }, 1000),
    [id]
  );

  useEffect(() => {
    setImage(data && data.document && data.document.image);
  }, [data]);

  const update = async (document: any) => {
    setDocument(document);

    if (!isLoggedIn) {
      return;
    }

    if (isNew) {
      const saveFolder = folder === "local" ? user.rootFolder : folder;
      const result = await createDocument({
        variables: {
          ...document,
          folder: saveFolder,
          title: document.title || t("untitled-project")
        }
      }).catch(e => {
        return setError(e);
      });
      if (result) {
        const {
          data: {
            createDocument: { id: newId }
          }
        } = result;
        const href = "/app/edit-document/[folder]/[type]/[id]";
        const as = `/app/edit-document/${saveFolder}/${type}/${newId}`;
        Router.replace(href, as, { shallow: true });
      }
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

  const documentType = documentTypes[type] || {};

  const onEditTitle = useCallback(() => {
    setIsEditTitleVisible(true);
  }, []);

  const onTabChange = useCallback((tabIndex: number) => {
    setTabIndex(tabIndex);
  }, []);

  const onSaveDocument = () => {
    const documentJSON = {
      type,
      title: title || `document${type}`,
      description: description || `bitbloq ${type} document`,
      content,
      advancedMode,
      image: {
        image: "",
        isSnapshot: true
      }
    };

    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });

    saveAs(blob, `${documentJSON.title}.bitbloq`);
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

  if (loading) return <Loading color={documentType.color} />;
  if (error) return <GraphQLErrorMessage apolloError={error!} />;

  const location = window.location;
  const publicUrl = `${location.protocol}//${location.host}/app/public-document/${type}/${id}`;

  const EditorComponent = documentType.editorComponent;

  const onSaveTitle = (title: string) => {
    update({ ...document, title: title || t("untitled-project") });
    setIsEditTitleVisible(false);
  };

  const onChangePublic = (isPublic: boolean, isExample: boolean) => {
    if (publish) {
      publish(isPublic, isExample);
    }
  };

  const infoTab: IDocumentTab = {
    icon: <Icon name="info" />,
    label: t("tab-project-info"),
    content: (
      <DocumentInfoForm
        title={title}
        description={description}
        image={image ? image.image : ""}
        onChange={({ title, description, image }) => {
          const newDocument = {
            ...document,
            title: title || t("untitled-project"),
            description: description || t("document-body-description")
          };
          if (image) {
            updateImage(document.id, image, false);
          }
          update(newDocument);
        }}
      />
    )
  };

  const headerRightContent = (
    <HeaderRightContent>
      {isLoggedIn ? (
        <UserInfo name={user.name} />
      ) : (
        <EnterButton onClick={() => setShowLoginModal(true)}>
          {t("document-enter-button")}
        </EnterButton>
      )}
    </HeaderRightContent>
  );

  const onMenuOptionClick = option => {};

  return (
    <>
      <EditorComponent
        document={document}
        onDocumentChange={(document: IDocument) => update(document)}
        baseTabs={[infoTab]}
        baseMenuOptions={menuOptions}
      >
        {documentProps => (
          <Document
            brandColor={documentType.color}
            title={title}
            onEditTitle={onEditTitle}
            icon={<Icon name={documentType.icon} />}
            tabIndex={tabIndex}
            onTabChange={onTabChange}
            headerRightContent={headerRightContent}
            onMenuOptionClick={onMenuOptionClick}
            preMenuContent={
              isPublisher && (
                <PublishBar
                  isPublic={isPublic}
                  isExample={isExample}
                  onChange={onChangePublic}
                  url={isPublic ? publicUrl : ""}
                />
              )
            }
            backCallback={() => Router.push("/")}
            {...documentProps}
          />
        )}
      </EditorComponent>
      {isEditTitleVisible && (
        <EditTitleModal
          title={title}
          onCancel={() => setIsEditTitleVisible(false)}
          onSave={onSaveTitle}
          modalTitle="Cambiar nombre del documento"
          modalText="Nombre del documento"
          placeholder="Documento sin título"
          saveButton="Cambiar"
        />
      )}
      <DocumentLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />
    </>
  );
};

export default EditDocument;

const EnterButton = styled(Button)`
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.57;
  padding: 0 20px;
`;
