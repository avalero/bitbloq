import React from 'react';
import styled from '@emotion/styled';
import {connect} from 'react-redux';

const Pre = styled('pre')`
  flex: 1;
  background-color: #1e1e1e;
  color: white;
  box-sizing: border-box;
  margin: 0px;
  display: flex;
`;

const Code = styled('code')`
  padding-left: 80px;
`;

const SimpleCodeEditor = ({code}) => (
  <Pre style={{ flex: 1 }}>
    <Code>{code}</Code>
  </Pre>
);

const mapStateToProps = ({software}) => ({
  code: software.code,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(SimpleCodeEditor);
