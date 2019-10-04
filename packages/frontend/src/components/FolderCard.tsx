import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import DocumentTypeTag from "./DocumentTypeTag";
import folderImg from "../images/folder.svg";

export interface FolderCardProps {
  folder: any;
  className?: string;
  onClick?: (e: React.MouseEvent) => any;
}

const FolderCard: FC<FolderCardProps> = ({
  folder,
  className,
  onClick,
  children
}) => {
  return (
    <Container onClick={onClick} className={className}>
      <Image src={folderImg} />
      <Info>
        <Title>{folder.name}</Title>
      </Info>
      {children}
    </Container>
  );
};

export default FolderCard;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  cursor: pointer;
  background-color: white;
  overflow: hidden;
  position: relative;

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
  height: 80px;
  padding: 14px;
  font-weight: 500;
  box-sizing: border-box;
`;

const Title = styled.div`
  margin-top: 10px;
  font-size: 16px;
`;
