import { Button, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useEffect, useState } from "react";
import { IResource, ResourcesTypes } from "../types";

interface IResourceDetailsProps extends IResource {
  className?: string;
  returnCallback: () => void;
}

const ResourceDetails: FC<IResourceDetailsProps> = ({
  className,
  createdAt,
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
    if (!size) {
      setSizeStr("-");
    } else if (size < 1000) {
      setSizeStr(`${size} B`);
    } else if (size < 1000000) {
      setSizeStr(`${(size / 1000).toFixed(1)} kB`);
    } else if (size < 1000000000) {
      setSizeStr(`${(size / 1000000).toFixed(1)} MB`);
    }
  }, [size]);

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
          ) : type === ResourcesTypes.image ||
            type === ResourcesTypes.object3D ? (
            <PreviewImage src={preview} />
          ) : type === ResourcesTypes.video ? (
            <Preview>
              <PreviewVideo controls>
                <source src={preview} type={`video/${titleExt}`} />
              </PreviewVideo>
            </Preview>
          ) : type === ResourcesTypes.sound ? (
            <Preview>
              <PreviewAudio controls>
                <source src={preview} type={`audio/${titleExt}`} />
              </PreviewAudio>
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
          <p>
            {new Date(createdAt).toLocaleString(undefined, {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })}
          </p>
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
  align-items: center;
  border: solid 1px #979797;
  border-radius: 4px;
  display: flex;
  height: calc(100% - 26px);
  justify-content: center;
  width: 100%;
`;

const PreviewAudio = styled.audio`
  width: 320px;

  &:focus {
    outline: none;
  }
`;

const PreviewEmpty = styled(Preview)`
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;

  p {
    color: #373b44;
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
