import React from 'react';
import {connect} from 'react-redux';
import MonacoEditor from 'react-monaco-editor';

class CodeEditor extends React.Component {
  render() {
    const {code} = this.props;
    return (
      <MonacoEditor
        width="50%"
        height="100%"
        language="c"
        theme="vs-dark"
        value={code}
      />
    );
  }
}

const mapStateToProps = ({software}) => ({
  code: software.code,
});

const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(CodeEditor);
