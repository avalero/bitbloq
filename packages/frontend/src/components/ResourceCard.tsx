import { Icon } from "@bitbloq/ui";
import styled from "@emotion/styled";
import React, { FC, useLayoutEffect, useRef, useState } from "react";
import { IResource } from "../types";

interface IResourceCardProps extends IResource {
  className?: string;
}

const ResourceCard: FC<IResourceCardProps> = ({
  className,
  image,
  title,
  type
}) => {
  const extTitle = title.split(".").pop();
  const titleName = title.replace(`.${extTitle}`, "");

  const [firstTitle, setFirsTitle] = useState<string>(
    titleName.substring(0, titleName.length - 3)
  );
  const [secondTitle, setSecondTitle] = useState<string>(
    `${titleName.substring(titleName.length - 3)}.${extTitle}`
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
    <ResourceContainer className={className}>
      <Image imageUrl={image}>{!image && <Icon name={type} />}</Image>
      <Title ref={titleRef}>
        {firstTitle}
        {secondTitle}
      </Title>
    </ResourceContainer>
  );
};

export default ResourceCard;

const Image = styled.div<{ imageUrl?: string }>`
  align-items: center;
  background: url(${props => props.imageUrl}) center/cover;
  border-bottom: solid 1px #ccc;
  display: flex;
  flex: 1;
  height: 100%;
  justify-content: center;

  svg {
    color: #c0c3c9;
    height: 40px;
    width: 40px;
  }
`;

const ResourceContainer = styled.div`
  border: solid 1px #ccc;
  border-radius: 4px;
  display: flex;
  flex-flow: column nowrap;
  height: 100%;
  width: 100%;

  &:hover {
    border: solid 1px #373b44;

    ${Image} {
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
