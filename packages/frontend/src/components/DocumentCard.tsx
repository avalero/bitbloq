import React, { FC } from "react";
import styled from "@emotion/styled";
import { colors } from "@bitbloq/ui";
import DocumentTypeTag from "./DocumentTypeTag";

export interface DocumentCardProps {
  document: any;
  className?: string;
  onClick?: (e: React.MouseEvent) => any;
}

const DocumentCard: FC<DocumentCardProps> = ({
  document,
  className,
  onClick,
  children
}) => {
  return (
    <Container onClick={onClick} className={className}>
      <Image src={document.image} />
      <Info>
        <DocumentTypeTag small document={document} />
        <Title>{document.title}</Title>
      </Info>
      {children}
    </Container>
  );
};

export default DocumentCard;

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
  background-color: ${colors.gray2};
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;
