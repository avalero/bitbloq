import { ApolloError } from "apollo-client";
import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import Router from "next/router";
import styled from "@emotion/styled";
import { saveAs } from "file-saver";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
  Document,
  IDocumentTab,
  Icon,
  Button,
  useTranslate
} from "@bitbloq/ui";
import useUserData from "../lib/useUserData";
import useServiceWorker from "../lib/useServiceWorker";
import CloudModal from "./CloudModal";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import PublishBar from "./PublishBar";
import HeaderRightContent from "./HeaderRightContent";
import UserSession from "./UserSession";
import Loading from "./Loading";
import DocumentLoginModal from "./DocumentLoginModal";
import {
  ADD_RESOURCE_TO_EXERCISES,
  DELETE_RESOURCE_FROM_EXERCISES,
  DOCUMENT_QUERY,
  CREATE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION,
  PUBLISH_DOCUMENT_MUTATION,
  SET_DOCUMENT_IMAGE_MUTATION
} from "../apollo/queries";
import { documentTypes } from "../config";
import { dataURItoBlob } from "../util";
import { IDocumentImage, IResource } from "../types";
import debounce from "lodash/debounce";
import GraphQLErrorMessage from "./GraphQLErrorMessage";

interface IEditDocumentProps {
  folder?: string;
  id: string;
  type: string;
}

const EditDocument: FC<IEditDocumentProps> = ({
  folder,
  id,
  type: initialType
}) => {
  const t = useTranslate();

  const user = useUserData();
  const isLoggedIn = !!user;
  const prevIsLoggedIn = useRef(isLoggedIn);

  const [type, setType] = useState(initialType);

  const isPublisher = user && user.publisher;

  const isNew = id === "new";

  const [cloudModalOpen, setCloudModalOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [isEditTitleVisible, setIsEditTitleVisible] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [opening, setOpening] = useState(type === "open");
  const [error, setError] = useState<ApolloError | null>(null);
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
  const [exercisesResources, setExercisesResources] = useState<IResource[]>([]);
  const [image, setImage] = useState<IDocumentImage>();
  const imageToUpload = useRef<Blob | null>(null);
  const serviceWorker = useServiceWorker();

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

  const onBeforeUnload = useCallback(() => {
    console.log("beforeunload");
    if (
      imageToUpload.current &&
      imageToUpload.current.size > 0 &&
      serviceWorker
    ) {
      console.log("Envía mensaje");
      serviceWorker.postMessage({
        documentId: document.id,
        image: imageToUpload.current,
        type: "upload-image"
      });
    }
  }, [imageToUpload.current, serviceWorker]);

  useEffect(() => {
    if (isLoggedIn && !prevIsLoggedIn.current) {
      update({ content, title, description, type, advancedMode });
    }
    prevIsLoggedIn.current = isLoggedIn;
  }, [isLoggedIn]);

  useEffect(() => {
    window.removeEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [onBeforeUnload]);

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
      const { document: openDocument, command } = e.data;
      if (command === "open-document") {
        setType(openDocument.type);
        delete openDocument.image;
        updateRef.current(openDocument);
        setOpening(false);
        channel.close();
      }
    };
  }, []);

  const [addResourceToExercises] = useMutation(ADD_RESOURCE_TO_EXERCISES);
  const [createDocument] = useMutation(CREATE_DOCUMENT_MUTATION);
  const [deleteResourceFromExercises] = useMutation(
    DELETE_RESOURCE_FROM_EXERCISES
  );
  const [updateDocument] = useMutation(UPDATE_DOCUMENT_MUTATION);
  const [publishDocument] = useMutation(PUBLISH_DOCUMENT_MUTATION);
  const [setDocumentImage] = useMutation(SET_DOCUMENT_IMAGE_MUTATION);

  const saveImage = async () => {
    if (!image || image.isSnapshot) {
      const canvasCollection = window.document.getElementsByTagName("canvas");
      const canvas = canvasCollection[0];
      if (canvas) {
        const imgData: string = canvas.toDataURL("image/jpeg");

        if (imgData !== "data:,") {
          const file: Blob = dataURItoBlob(imgData);
          imageToUpload.current = file;
        }
      }
    }
  };

  const updateImage = (
    documentId: string,
    imageFile?: Blob,
    isImageSnapshot?: boolean
  ) => {
    const newImage = imageFile || imageToUpload.current;
    const isSnapshot = isImageSnapshot === undefined ? true : isImageSnapshot;
    setImage({ image: "udpated", isSnapshot });

    if (isSnapshot) {
      setImage({ image: "blob", isSnapshot: true });
    }

    if (newImage && newImage.size > 0 && isLoggedIn) {
      setDocumentImage({
        variables: {
          id: documentId,
          image: newImage,
          isSnapshot
        }
      }).catch(e => {
        return setError(e);
      });
    }
  };

  const debouncedUpdate = useCallback(
    debounce(async (newDocument: any) => {
      saveImage();
      await updateDocument({ variables: { ...newDocument, id } }).catch(e => {
        return setError(e);
      });
      refetch();
    }, 1000),
    [id]
  );

  useEffect(() => {
    setImage(data && data.document && data.document.image);
    setExercisesResources(
      data && data.document && data.document.exercisesResources
    );
  }, [data]);

  const update = async (updatedDocument: any) => {
    delete updatedDocument.image;
    setDocument(updatedDocument);

    if (!isLoggedIn) {
      return;
    }
    if (isNew) {
      const saveFolder = folder === "local" ? user.rootFolder : folder;
      const result = await createDocument({
        variables: {
          ...updatedDocument,
          folder: saveFolder,
          title: updatedDocument.title || t("untitled-project")
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
      debouncedUpdate(updatedDocument);
    }
  };
  const updateRef = useRef(update);
  updateRef.current = update;

  const publish = async (newIsPublic: boolean, newIsExample: boolean) => {
    if (!isNew) {
      setDocument({ ...document, public: newIsPublic, example: newIsExample });
      await publishDocument({
        variables: { id, public: newIsPublic, example: newIsExample }
      });
      refetch();
    }
  };

  const documentType = documentTypes[type] || {};

  const onEditTitle = useCallback(() => {
    setIsEditTitleVisible(true);
  }, []);

  const onResourceAdded = async (resourceId: string) => {
    await addResourceToExercises({
      variables: {
        documentID: document.id,
        resourceID: resourceId
      }
    });
    refetch();
  };

  const onResourceDeleted = async (resourceId: string) => {
    await deleteResourceFromExercises({
      variables: {
        documentID: document.id,
        resourceID: resourceId
      }
    });
    refetch();
  };

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

    const blob = new Blob([JSON.stringify(documentJSON)], {
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

  if (loading) {
    return <Loading color={documentType.color} />;
  }
  if (error) {
    return <GraphQLErrorMessage apolloError={error!} />;
  }

  const location = window.location;
  const publicUrl = `${location.protocol}//${location.host}/app/public-document/${type}/${id}`;

  const EditorComponent = documentType.editorComponent;

  const onSaveTitle = (newTitle: string) => {
    update({ ...document, title: newTitle || t("untitled-project") });
    setIsEditTitleVisible(false);
  };

  const onChangePublic = (newIsPublic: boolean, newIsExample: boolean) => {
    if (publish) {
      publish(newIsPublic, newIsExample);
    }
  };

  const infoTab: IDocumentTab = {
    icon: <Icon name="info" />,
    label: t("tab-project-info"),
    content: (
      <DocumentInfoForm
        title={title}
        description={description}
        documentId={document.id}
        resourceAdded={onResourceAdded}
        resourceDeleted={onResourceDeleted}
        resources={exercisesResources}
        resourcesTypesAccepted={documentType.acceptedResourcesTypes}
        image={image ? image.image : ""}
        isTeacher={user && user.teacher}
        onChange={({
          title: newTitle,
          description: newDescription,
          image: newImage
        }) => {
          const newDocument = {
            ...document,
            title: newTitle || t("untitled-project"),
            description: newDescription || t("document-body-description")
          };
          if (newImage) {
            updateImage(document.id, newImage, false);
          }
          update(newDocument);
        }}
      />
    )
  };

  const headerRightContent = (
    <HeaderRightContent>
      {isLoggedIn ? (
        <UserSession cloudClick={() => setCloudModalOpen(true)} />
      ) : (
        <EnterButton onClick={() => setShowLoginModal(true)}>
          {t("document-enter-button")}
        </EnterButton>
      )}
    </HeaderRightContent>
  );

  return (
    <>
      <EditorComponent
        document={document}
        onDocumentChange={update}
        baseTabs={[infoTab]}
        baseMenuOptions={menuOptions}
        user={user}
      >
        {documentProps => (
          <Document
            brandColor={documentType.color}
            title={title}
            onEditTitle={onEditTitle}
            icon={<Icon name={documentType.icon} />}
            tabIndex={tabIndex}
            onTabChange={setTabIndex}
            headerRightContent={headerRightContent}
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
      <CloudModal
        isOpen={cloudModalOpen}
        onClose={() => setCloudModalOpen(false)}
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
