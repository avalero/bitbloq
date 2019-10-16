import React, { FC, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import folderImg from "../images/folder.svg";

export interface FolderCardProps {
  beginFunction?: () => void;
  draggable?: boolean;
  folder: any;
  className?: string;
  dropDocumentCallback?: () => void;
  dropFolderCallback?: () => void;
  endFunction?: () => void;
  onClick?: (e: React.MouseEvent) => any;
}

const FolderCard: FC<FolderCardProps> = ({
  beginFunction,
  draggable,
  folder,
  className,
  onClick,
  dropDocumentCallback,
  dropFolderCallback,
  endFunction,
  children
}) => {
  const [hidden, setHidden] = useState(false);
  const [{ isDragging }, drag, preview] = useDrag({
    item: { type: "folder" },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    }),
    canDrag: monitor => {
      return !!draggable;
    },
    begin: monitor => {
      beginFunction && beginFunction();
    },
    end: (item, monitor) => {
      if (monitor.didDrop()) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      endFunction && endFunction();
    }
  });

  const [{ isOver }, drop] = useDrop({
    accept: ["document", "folder"],
    drop: item => {
      if (item.type === "document" && dropDocumentCallback) {
        dropDocumentCallback();
      } else if (item.type === "folder" && dropFolderCallback) {
        dropFolderCallback();
      }
    },
    collect: monitor => ({
      isOver: !!monitor.isOver()
    })
  });

  return hidden ? (
    <></>
  ) : (
    <Container
      ref={drag}
      onClick={onClick}
      className={className}
      isDragging={isDragging}
      isOver={isOver}
    >
      <DropContainer ref={drop} />
      <Image src={folderImg} />
      <Info>
        <Title>
          {folder.name === " " ? "Carpeta sin título" : folder.name}
        </Title>
      </Info>
      {children}
    </Container>
  );
};

export default FolderCard;

interface ContainerProps {
  isDragging?: boolean | undefined;
  isOver?: boolean | undefined;
}
const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid
    ${(props: ContainerProps) =>
      props.isDragging || props.isOver ? colors.gray4 : colors.gray3};
  cursor: pointer;
  background-color: white;
  position: relative;
  visibility: ${(props: ContainerProps) =>
    props.isDragging ? "hidden" : "visible"};

  &:hover {
    border-color: ${colors.gray4};
  }
`;

const DropContainer = styled.div`
  background-color: rgba(0, 0, 0, 0);
  height: 100%;
  position: absolute;
  width: 100%;
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
