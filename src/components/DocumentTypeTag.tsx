import * as React from 'react';
import styled from '@emotion/styled';
import {documentTypeLabels, documentTypeColors} from '../config';

const DocumentTypeTag = ({document, small}) => (
  <Container color={documentTypeColors[document.type]} small={small}>
    {documentTypeLabels[document.type]}
  </Container>
);

export default DocumentTypeTag;

interface ContainerProps {
  color: string;
  small?: boolean;
}
const Container = styled.div<ContainerProps>`
  border-width: 2px;
  border-style: solid;
  border-color: ${props => props.color};
  color: ${props => props.color};
  height: ${props => (props.small ? '24px' : '30px')};
  display: inline-flex;
  align-items: center;
  padding: 0px 10px;
  font-size: ${props => (props.small ? '12px' : '14px')};
  box-sizing: border-box;
`;
