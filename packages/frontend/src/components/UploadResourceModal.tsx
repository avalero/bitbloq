import React, {
  FC,
  useEffect,
  useMemo,
  useRef,
  useState,
  ChangeEvent
} from "react";
import STLViewer from "stl-viewer";
import { useMutation } from "@apollo/react-hooks";
import { Button, DialogModal, Modal, Input, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import CloudModal from "./CloudModal";
import UploadResourceTabs, { TabType } from "./UploadResourceTabs";
import {
  ADD_RESOURCE_TO_DOCUMENT,
  UPLOAD_CLOUD_RESOURCE
} from "../apollo/queries";
import { ResourcesTypes } from "../types";
import { dataURItoBlob, isValidName } from "../util";

const acceptedFiles = {
  image: [".png", ".gif", ".jpg", ".jpeg", "webp"],
  video: [".mp4", ".webm"],
  sound: [".mp3", ".ocg"],
  object3D: [".stl"]
};

enum Errors {
  extError,
  noError,
  sizeError
}

export interface IUploadResourceModalProps {
  acceptedTypes?: ResourcesTypes[];
  addedCallback?: (id: string, fileName?: string, publicUrl?: string) => void;
  documentId: string;
  isOpen: boolean;
  onClose?: () => void;
}

const UploadResourceModal: FC<IUploadResourceModalProps> = ({
  acceptedTypes = [],
  addedCallback,
  documentId,
  isOpen,
  onClose
}) => {
  const accept = useMemo(
    () => acceptedTypes.flatMap(type => acceptedFiles[type]),
    []
  );
  const [addResource] = useMutation(ADD_RESOURCE_TO_DOCUMENT);
  const [uploadResource] = useMutation(UPLOAD_CLOUD_RESOURCE);
  const canvasRef = useRef<STLViewer>(null);
  const [cameraX, setCameraX] = useState<number>(0);
  const [cameraY, setCameraY] = useState<number>(0);
  const [cameraZ, setCameraZ] = useState<number | null>(null);
  const [error, setError] = useState<Errors>(Errors.noError);
  const [file, setFile] = useState<File | undefined>(undefined);
  const [fileArray, setFileArray] = useState<ArrayBuffer | undefined>(
    undefined
  );
  const [nameFile, setNameFile] = useState<string>("");
  const [openCloud, setOpenCloud] = useState<boolean>(false);
  const [tab, setTab] = useState<TabType>(TabType.import);
  const t = useTranslate();

  const isValidExt = (ext: string): boolean => accept.indexOf(`.${ext}`) > -1;

  const onAddResource = async (id: string, ext?: string) => {
    if (ext && !isValidExt(ext)) {
      setError(Errors.extError);
    } else {
      const { data } = await addResource({
        variables: {
          documentID: documentId,
          resourceID: id
        }
      });
      const { filename, id: newId, publicUrl } = data.addResourceToDocument;
      if (addedCallback) {
        addedCallback(newId, filename, publicUrl);
      }
      onCloseModal();
    }
  };

  const onCloseModal = () => {
    setError(Errors.noError);
    setFile(undefined);
    setOpenCloud(false);
    setTab(TabType.import);
    if (onClose) {
      onClose();
    }
  };

  const onSendResource = async (fileToSend: File) => {
    let variables = {};
    if (fileArray) {
      const canvasCollection = document.getElementsByTagName("canvas");
      const canvas = canvasCollection[canvasCollection.length - 1];
      const thumbnailImage: Blob = dataURItoBlob(
        canvas.toDataURL("image/jpeg")
      );
      variables = { ...variables, thumbnail: thumbnailImage };
    }

    const resourceBlob = fileToSend.slice(0, fileToSend.size, fileToSend.type);
    const resourceFile = new File(
      [resourceBlob],
      fileToSend.name.replace(/.+(\.\w+$)/, `${nameFile}$1`),
      { type: fileToSend.type }
    );
    variables = { ...variables, file: resourceFile };
    const { data } = await uploadResource({
      variables
    });
    const { id } = data.uploadCloudResource;
    onAddResource(id);
    onCloseModal();
  };

  const onSetFile = (newFile: File) => {
    const extFile = newFile.name.split(".").pop();
    if (!isValidExt(extFile!)) {
      setError(Errors.extError);
    } else if (newFile.size > 10000000) {
      setError(Errors.sizeError);
    } else {
      setNameFile(
        newFile.name.replace(new RegExp(`\.${extFile}$`), "").substring(0, 64)
      );
      if (extFile === "stl") {
        const reader = new FileReader();
        reader.readAsArrayBuffer(newFile);
        reader.onload = () => {
          setFileArray(reader.result as ArrayBuffer);
        };
      }
      setFile(newFile);
    }
  };

  useEffect(() => {
    if (fileArray && canvasRef && canvasRef.current) {
      setCameraX(
        -4 *
          Math.max(
            canvasRef.current.paint.xDims,
            canvasRef.current.paint.yDims,
            canvasRef.current.paint.zDims
          )
      );
      setCameraY(
        -2 *
          Math.max(
            canvasRef.current.paint.xDims,
            canvasRef.current.paint.yDims,
            canvasRef.current.paint.zDims
          )
      );
      setCameraZ(canvasRef.current.paint.zDims / 2);
    }
  }, [canvasRef, fileArray]);

  return openCloud && file === undefined && error === Errors.noError ? (
    <CloudModal
      acceptedExt={accept}
      addAllow
      addCallback={onAddResource}
      isOpen={true}
      onClose={onCloseModal}
      setFile={onSetFile}
    />
  ) : error !== Errors.noError ? (
    <DialogModal
      isOpen={true}
      onCancel={onCloseModal}
      onOk={onCloseModal}
      text={
        error === Errors.extError
          ? t("cloud.upload.warning-ext")
          : t("cloud.upload.warning-size")
      }
      okText={t("general-accept-button")}
      title={t("cloud.upload.warning-title")}
    />
  ) : (
    <Modal
      isOpen={isOpen}
      onClose={onCloseModal}
      title={t("cloud.upload.title")}
    >
      <UploadResourceModalBody input={file !== undefined}>
        {file === undefined ? (
          <UploadResourceTabs
            acceptedExt={accept}
            acceptedTypes={acceptedTypes}
            addCallback={onAddResource}
            setFile={onSetFile}
            setTab={setTab}
            tab={tab}
          />
        ) : (
          <>
            <FormGroup>
              <label>{t("cloud.upload.name")}</label>
              <Input
                error={!isValidName(nameFile)}
                onChange={(e: ChangeEvent) =>
                  setNameFile((e.target as HTMLInputElement).value)
                }
                value={nameFile}
              />
            </FormGroup>
            {fileArray && (
              <ObjViewer
                backgroundColor="#fff"
                cameraX={cameraX}
                cameraY={cameraY}
                cameraZ={cameraZ}
                height={280}
                lights={[[0, 1, 0], [-1, -1, -1], [1, 1, 1]]}
                model={fileArray}
                ref={canvasRef}
                rotate={false}
                width={164}
              />
            )}
          </>
        )}
        <Buttons>
          <ResourceModalButton onClick={onCloseModal} tertiary>
            {t("general-cancel-button")}
          </ResourceModalButton>
          {tab === TabType.add && file === undefined && (
            <ResourceModalButton onClick={() => setOpenCloud(true)} tertiary>
              {t("cloud.buttons.see-more")}
            </ResourceModalButton>
          )}
          {file !== undefined && (
            <ResourceModalButton
              disabled={!isValidName(nameFile)}
              onClick={() => onSendResource(file)}
            >
              {t("general-add-button")}
            </ResourceModalButton>
          )}
        </Buttons>
      </UploadResourceModalBody>
    </Modal>
  );
};

export default UploadResourceModal;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const FormGroup = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  height: 61px;
  justify-content: space-between;
  margin: 20px 0;
  width: 100%;

  label {
    color: #323843;
    font-size: 14px;
    margin-bottom: 10px;
  }
`;

const ObjViewer = styled(STLViewer)`
  /*display: none;*/
  transform: rotate(-90deg);
`;

const ResourceModalButton = styled(Button)<{ tertiary?: boolean }>`
  color: ${props => (props.tertiary ? "#373b44" : "#fff")};
  font-family: Roboto;
  font-weight: bold;
  line-height: 1.43;
  padding: 10px 20px;
`;

const UploadResourceModalBody = styled.div<{ input?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  padding: 20px 30px 30px;
  width: ${props => (props.input ? 500 : 720)}px;
`;
