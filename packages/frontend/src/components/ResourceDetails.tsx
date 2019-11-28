import { Button, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useEffect, useRef, useState } from "react";
import STLViewer from "stl-viewer";
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
  thumbnail,
  title,
  type,
  returnCallback
}) => {
  const t = useTranslate();
  const titleExt = title.split(".").pop();
  const titleName = title.replace(new RegExp(`\.${titleExt}$`), "");
  const canvasRef = useRef<STLViewer>(null);
  const [cameraY, setCameraY] = useState<number>(0);
  const [cameraZ, setCameraZ] = useState<number | null>(null);
  const [showSTL, setShowSTL] = useState<boolean>(false);
  const [sizeStr, setSizeStr] = useState<string>("");

  const onClickSTL = () => {
    if (canvasRef && canvasRef.current) {
      const { xDims, yDims, zDims } = canvasRef.current.paint;
      setCameraY(-2 * Math.max(xDims, yDims, zDims));
      setCameraZ(zDims / 2);
      setTimeout(() => setShowSTL(true), 300);
    }
  };

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
          ) : type === ResourcesTypes.image ? (
            <Preview>
              <PreviewImage show={true} src={preview} />
            </Preview>
          ) : type === ResourcesTypes.object3D ? (
            <Preview>
              <PreviewImage
                onMouseDown={onClickSTL}
                show={!showSTL}
                src={thumbnail!}
              >
                <Icon name="threed" />
              </PreviewImage>
              <PreviewObject
                backgroundColor="#fff"
                cameraX={0}
                cameraY={cameraY}
                cameraZ={cameraZ}
                height={311}
                lights={[[0, 1, 0], [-1, -1, -1], [1, 1, 1]]}
                model={preview}
                ref={canvasRef}
                rotate={true}
                show={showSTL}
                url={preview}
                width={340}
              />
            </Preview>
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
  overflow: hidden;
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

const PreviewImage = styled(Preview)<{ show: boolean; src: string }>`
  background: url(${props => props.src}) center/cover;
  border: none;
  cursor: pointer;
  display: ${props => (props.show ? "inherit" : "none")};
  height: 100%;

  &:hover {
    svg {
      color: #eee;
    }
  }

  svg {
    color: rgba(238, 238, 238, 0.7);
    height: 60px;
    width: 60px;
  }
`;

const PreviewObject = styled(STLViewer)<{ show: boolean }>`
  cursor: all-scroll;
  display: ${props => (props.show ? "initial" : "none")};
  height: 100%;
  width: 100%;
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
