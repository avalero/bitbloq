import { IResource } from "@bitbloq/api";
import { DropDown, Icon, useTranslate } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useLayoutEffect, useRef, useState } from "react";
import DocumentCardMenu from "./DocumentCardMenu";
import MenuButton from "./MenuButton";

interface IResourceCardProps extends IResource {
  addAllow?: boolean;
  addCallback?: (id: string, ext: string) => void;
  className?: string;
  importResource: boolean;
  moveToTrash?: (id: string) => void;
  restoreFromTrash?: (id: string) => void;
  selectResource?: (id: string) => void;
}

const ResourceCard: FC<IResourceCardProps> = ({
  addAllow,
  addCallback,
  className,
  deleted,
  id,
  importResource,
  moveToTrash,
  restoreFromTrash,
  selectResource,
  thumbnail,
  title,
  type
}) => {
  const t = useTranslate();
  const titleExt = title!.split(".").pop();
  const titleName = title!
    .replace(new RegExp(`.${titleExt}$`), "")
    .substring(0, 64);

  const [firstTitle, setFirsTitle] = useState<string>(
    titleName.substring(0, titleName.length - 3)
  );
  const [secondTitle, setSecondTitle] = useState<string>(
    `${titleName.substring(titleName.length - 3)}.${titleExt}`
  );

  const titleRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (titleRef.current!.clientHeight > 50) {
      setFirsTitle(firstTitle.substring(0, firstTitle.length - 1));
    }
  });

  useLayoutEffect(() => {
    if (titleRef.current!.clientHeight > 50) {
      setSecondTitle(`...${secondTitle}`);
    }
  }, []);

  return (
    <ResourceContainer
      className={className}
      addAllow={addAllow}
      importResource={importResource}
      isOpen={true}
      onClick={() =>
        (importResource || addAllow) &&
        addCallback &&
        addCallback(id!, titleExt!)
      }
    >
      <DropDown
        attachmentPosition="top left"
        constraints={[
          {
            attachment: "together",
            to: "window"
          }
        ]}
        offset="-50px 210px"
        targetPosition="top right"
      >
        {(isOpen: boolean) => (
          <CardMenuButton isOpen={isOpen} onClick={e => e.stopPropagation()} />
        )}
        <ResourceCardMenu
          options={[
            {
              iconName: "description",
              label: t("cloud.options.details"),
              onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                e.stopPropagation();
                if (selectResource) {
                  selectResource(id!);
                }
              }
            },
            {
              iconName: deleted ? "undo" : "trash",
              label: deleted
                ? t("cloud.options.recover")
                : t("cloud.options.trash"),
              onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
                e.stopPropagation();
                if (deleted && restoreFromTrash) {
                  restoreFromTrash(id!);
                } else if (!deleted && moveToTrash) {
                  moveToTrash(id!);
                }
              }
            }
          ]}
        />
      </DropDown>
      <ImageContainer>
        {thumbnail ? (
          <Image imageUrl={thumbnail} />
        ) : (
          <Icon name={`resource-${type}`} />
        )}
      </ImageContainer>
      <Title ref={titleRef}>
        {firstTitle}
        {secondTitle}
      </Title>
    </ResourceContainer>
  );
};

export default ResourceCard;

const CardMenuButton = styled(MenuButton)`
  height: 32px;
  position: absolute;
  right: 10px;
  top: 10px;
  visibility: ${props => (props.isOpen ? "visible" : "hidden")};
  width: 32px;
`;

const Image = styled.div<{ imageUrl: string }>`
  background: url(${props => props.imageUrl}) center/cover;
  height: 100%;
  width: 100%;
`;

const ImageContainer = styled.div`
  align-items: center;
  border-bottom: solid 1px #ccc;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;
  overflow: hidden;

  svg {
    color: #c0c3c9;
    height: 40px;
    width: 40px;
  }
`;

const ResourceCardMenu = styled(DocumentCardMenu)`
  min-width: 200px;
`;

const ResourceContainer = styled.div<{
  addAllow?: boolean;
  importResource?: boolean;
  isOpen?: boolean;
}>`
  background-color: #fff;
  border: solid 1px #ccc;
  border-radius: 4px;
  cursor: ${props =>
    props.importResource || props.addAllow ? "pointer" : "default"};
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;

  &:hover {
    background-color: ${props =>
      props.importResource || props.addAllow ? "#f1f1f1" : "#fff"};
    border: solid 1px #373b44;

    ${CardMenuButton} {
      visibility: ${props =>
        props.isOpen && !props.importResource ? "visible" : "hidden"};
    }

    ${ImageContainer} {
      border-bottom: solid 1px #373b44;

      svg {
        color: #373b44;
      }
    }
  }
`;

const Title = styled.div`
  color: #474749;
  font-size: 14px;
  padding: 10px;
  overflow-wrap: break-word;
  text-align: center;
  word-wrap: break-word;
`;
