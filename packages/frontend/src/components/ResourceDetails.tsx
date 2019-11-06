import { Button, DropDown, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useEffect, useState } from "react";
import { IResource, ResourcesTypes } from "../types";

interface IResourceDetailsProps extends IResource {
  className?: string;
  returnCallback: () => void;
}

const ResourceDetails: FC<IResourceDetailsProps> = ({
  className,
  preview,
  size,
  title,
  type,
  returnCallback
}) => {
  const t = useTranslate();
  const titleExt = title.split(".").pop();
  const titleName = title.replace(`.${titleExt}`, "");
  const [sizeStr, setSizeStr] = useState<string>("");

  useEffect(() => {
    if (size < 1000) {
      setSizeStr(`${size} B`);
    } else if (size < 1000000) {
      setSizeStr(`${(size / 1000).toFixed(1)} kB`);
    } else if (size < 1000000000) {
      setSizeStr(`${(size / 1000000).toFixed(1)} MB`);
    }
  }, []);

  return (
    <Container className={className}>
      <DataContainer>
        <DataItem>
          <h2>{t("cloud.details.preview")}</h2>
          {!preview ? (
            <PreviewEmpty>
              <Icon name="eye-close" />
              <p>{t("cloud.details.no-preview")}</p>
            </PreviewEmpty>
          ) : type === ResourcesTypes.images ||
            type === ResourcesTypes.objects3D ? (
            <PreviewImage src={preview} />
          ) : type === ResourcesTypes.videos ? (
            <Preview>
              <PreviewVideo controls>
                <source src={preview} type={`video/${titleExt}`} />
              </PreviewVideo>
            </Preview>
          ) : (
            <PreviewEmpty>
              <Icon name="eye-close" />
              <p>{t("cloud.details.no-preview")}</p>
            </PreviewEmpty>
          )}
        </DataItem>
        <DataItem>
          <h2>{t("cloud.details.title")}</h2>
          <p>{titleName}</p>
        </DataItem>
        <DataItem>
          <h2>{t("cloud.details.ext")}</h2>
          <p>{titleExt!.toUpperCase()}</p>
        </DataItem>
        <DataItem>
          <h2>{t("cloud.details.size")}</h2>
          <p>{sizeStr.replace(".", ",")}</p>
        </DataItem>
        <DataItem>
          <h2>{t("cloud.details.date")}</h2>
          <p></p>
        </DataItem>
      </DataContainer>
      <Buttons>
        <ReturnButton onClick={() => returnCallback()} quaternary>
          <Icon name="arrow" />
          {t("cloud.details.return")}
        </ReturnButton>
      </Buttons>
    </Container>
  );
};

export default ResourceDetails;

const Buttons = styled.div`
  height: 40px;
  width: 100%;
`;

const Container = styled.div`
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  justify-content: space-between;
  width: 100%;
`;

const DataContainer = styled.div`
  display: flex;
  flex-flow: column wrap;
  height: 337px;
  width: 100%;
`;

const DataItem = styled.div`
  width: calc(100% - 360px);

  h2 {
    color: #474749;
    font-size: 14px;
    font-weight: bold;
    height: 16px;
    margin-bottom: 10px;
  }

  p {
    color: #474749;
    font-size: 14px;
    margin-bottom: 20px;
    min-height: 16px;
    padding-left: 10px;
  }

  &:first-of-type {
    height: 100%;
    padding-right: 20px;
    width: 340px;
  }
`;

const Preview = styled.div`
  border: solid 1px #979797;
  border-radius: 4px;
  height: calc(100% - 26px);
  width: 100%;
`;

const PreviewEmpty = styled(Preview)`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  p {
    color: #373b44;
    font-family: Roboto;
    font-size: 14px;
    font-style: italic;
    height: 32px;
    margin: 0 30px;
    text-align: center;
  }

  svg {
    height: 60px;
    margin-bottom: 10px;
    width: 60px;
  }
`;

const PreviewImage = styled(Preview)<{ src: string }>`
  background: url(${props => props.src}) center/cover;
`;

const PreviewVideo = styled.video`
  height: 100%;
  width: 100%;

  &:focus {
    outline: none;
  }
`;

const ReturnButton = styled(Button)`
  color: #474749;
  font-family: Roboto;
  font-size: 14px;
  font-weight: bold;
  padding: 0 20px;
  text-align: center;

  svg {
    height: 13px;
    padding-right: 6px;
    width: 13px;
  }
`;
