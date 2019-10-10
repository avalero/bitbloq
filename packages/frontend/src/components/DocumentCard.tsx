import React, { FC } from "react";
import styled from "@emotion/styled";
import DocumentTypeTag from "./DocumentTypeTag";
import { colors } from "@bitbloq/ui";

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

const DocumentMenu = styled.div`
  width: 179px;
  height: 143px;
  border-radius: 4px;
  box-shadow: 0 3px 7px 0 rgba(0, 0, 0, 0.5);
  border: solid 1px #cfcfcf;
  background-color: white;
  position: absolute;
  margin-right: 14px;
  margin-left: 87px;
  margin-top: 53px;
`;

const DocumentMenuOption = styled.div`
  width: 179px;
  height: 35px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebebeb;
  font-size: 14px;
  cursor: pointer;
  padding: 0px 20px;

  &:hover {
    background-color: #ebebeb;
  }

  &:last-child {
    border: none;
  }
`;

const DocumentMenuButton = styled.div<{ isOpen: boolean }>`
  position: absolute;
  right: 14px;
  top: 14px;
  width: 34px;
  height: 34px;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  border: 1px solid ${colors.gray3};
  background-color: white;
  display: none;

  &:hover {
    background-color: ${colors.gray1};
    border-color: ${colors.gray4};
  }

  ${props =>
    props.isOpen &&
    css`
      border: solid 1px #dddddd;
      background-color: #e8e8e8;
    `} svg {
    transform: rotate(90deg);
  }
`;
