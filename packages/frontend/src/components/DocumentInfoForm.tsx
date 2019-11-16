import React, { FC, useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  colors,
  FileSelectButton,
  Input,
  TextArea,
  DialogModal,
  useTranslate
} from "@bitbloq/ui";
import ResourcesBox from "./ResourcesBox";
import { isValidName } from "../util";
import { IResource, ResourcesTypes } from "../types";

export interface IDocumentInfoFormProps {
  title?: string;
  description?: string;
  documentId: string;
  image: string;
  resourceAdded: (id: string) => void;
  resourceDeleted: (id: string) => void;
  resources?: IResource[];
  resourcesTypesAccepted: ResourcesTypes[];
  onChange: (newValues: {
    title: string;
    description: string;
    image?: File;
  }) => void;
}

const maxImageSize = 2097152;

const DocumentInfoForm: FC<IDocumentInfoFormProps> = ({
  title,
  description,
  documentId,
  image,
  resourceAdded,
  resourceDeleted,
  resources = [],
  resourcesTypesAccepted,
  onChange
}) => {
  const [imageError, setImageError] = useState("");
  const [titleInput, setTitle] = useState(title);
  const [titleError, setTitleError] = useState(false);
  const [titleFocused, setTitleFocused] = useState(false);
  const t = useTranslate();

  useEffect(() => {
    if (!titleFocused) {
      setTitle(title);
    }
  }, [title, titleFocused]);

  const onFileSelected = (file: File) => {
    if (file.type.indexOf("image/") !== 0) {
      setImageError(t("document-info.errors.image-ext"));
    } else if (file.size > maxImageSize) {
      setImageError(t("document-info.errors.image-size"));
    } else {
      onChange({
        title: title || "title",
        description: description || "description",
        image: file
      });
    }
  };

  return (
    <Container>
      <Panel>
        <Header>{t("document-info.title")}</Header>
        <Form>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.title")}</label>
            </FormLabel>
            <FormInput>
              <Input
                value={titleInput}
                placeholder={t("document-info.placeholders.title")}
                onChange={e => {
                  const value: string = e.target.value;
                  if (isValidName(value)) {
                    setTitleError(false);
                    onChange({
                      title: value,
                      description: description || "description"
                    });
                  } else {
                    setTitleError(true);
                  }
                  setTitle(value);
                }}
                error={titleError}
                onFocus={() => setTitleFocused(true)}
                onBlur={() => setTitleFocused(false)}
              />
            </FormInput>
          </FormRow>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.description")}</label>
            </FormLabel>
            <FormInput>
              <TextArea
                value={description}
                placeholder={t("document-info.placeholders.description")}
                onChange={e => {
                  onChange({
                    title: title || "title",
                    description: e.target.value
                  });
                }}
                rows={3}
              />
            </FormInput>
          </FormRow>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.image")}</label>
              <FormSubLabel>{t("document-info.sublabels.image")}</FormSubLabel>
            </FormLabel>
            <FormInput>
              <Image src={image} />
              <ImageButton
                accept="image/*"
                tertiary
                onFileSelected={onFileSelected}
              >
                {t("document-info.buttons.image")}
              </ImageButton>
            </FormInput>
          </FormRow>
        </Form>
        <Form>
          <FormRow>
            <FormLabel>
              <label>{t("document-info.labels.resources")}</label>
              <FormSubLabel>
                {t("document-info.sublabels.resources")}
              </FormSubLabel>
            </FormLabel>
            <FormInput>
              <ResourcesBox
                documentId={documentId}
                resourceAdded={resourceAdded}
                resourceDeleted={resourceDeleted}
                resources={resources}
                resourcesTypesAccepted={resourcesTypesAccepted}
              />
            </FormInput>
          </FormRow>
        </Form>
      </Panel>
      <DialogModal
        title="Aviso"
        isOpen={!!imageError}
        text={imageError}
        okText="Aceptar"
        onOk={() => setImageError("")}
      />
    </Container>
  );
};

export default DocumentInfoForm;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const Panel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-height: 100%;
  max-width: 900px;
  overflow: scroll;
`;

const Header = styled.div`
  background-color: #fff;
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  position: sticky;
  height: 50px;
  top: 0;
  display: flex;
  align-items: center;
`;

const Form = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  padding: 20px 30px;

  &:last-of-type {
    border-bottom: none;
  }
`;

const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;

  &:last-of-type {
    margin-bottom: 0;
  }
`;

const FormLabel = styled.div`
  flex: 1;
  font-size: 14px;
  margin-right: 30px;

  label {
    min-height: 35px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
`;

const FormSubLabel = styled.div`
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
`;

const FormInput = styled.div`
  flex: 2;
  max-width: 66%;
`;

const Image = styled.div<{ src: string }>`
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  width: 250px;
  height: 160px;
  margin-bottom: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ImageButton = styled(FileSelectButton)`
  width: 250px;
`;
