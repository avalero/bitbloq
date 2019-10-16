import React, { FC } from "react";
import { useDrag } from "react-dnd";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import folderImg from "../images/folder.svg";

export interface FolderCardProps {
  draggable?: boolean;
  folder: any;
  className?: string;
  onClick?: (e: React.MouseEvent) => any;
}

const FolderCard: FC<FolderCardProps> = ({
  draggable,
  folder,
  className,
  onClick,
  children
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "folder" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return (
    <Container
      ref={draggable ? drag : null}
      onClick={onClick}
      className={className}
      isDragging={isDragging && draggable}
    >
      <Image src={folderImg} />
      <Info>
        <Title>{folder.name}</Title>
      </Info>
      {children}
    </Container>
  );
};

export default FolderCard;

interface ContainerProps {
  isDragging: boolean | undefined;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid
    ${(props: ContainerProps) =>
      props.isDragging ? colors.gray4 : colors.gray3};
  cursor: pointer;
  background-color: white;
  position: relative;
  visibility: ${(props: ContainerProps) =>
    props.isDragging ? "hidden" : "visible"};

  &:hover {
    border-color: ${colors.gray4};
  }
`;

interface ImageProps {
  src: string;
}
const Image = styled.div<ImageProps>`
  flex: 1;
  background-color: ${colors.white};
  background-image: url(${props => props.src});
  background-size: 60px 60px;
  background-position: center;
  background-repeat: no-repeat;
  object-fit: contain;
  border-bottom: 1px solid ${colors.gray3};
`;

const Info = styled.div`
  padding: 14px;
  font-weight: 500;
  box-sizing: border-box;
  align-items: center;
  display: flex;
`;

const Title = styled.div`
  font-size: 16px;
  text-overflow: ellipsis;
  overflow: hidden;
`;
