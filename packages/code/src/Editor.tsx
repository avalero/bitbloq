import React, { FC, useEffect, useRef } from "react";
import { colors } from "@bitbloq/ui";
import styled from "@emotion/styled";
import * as monaco from "monaco-editor";
import {
  editorBackground,
  editorForeground
} from "monaco-editor/esm/vs/platform/theme/common/colorRegistry";
import {
  editorActiveLineNumber,
  editorLineNumbers
} from "monaco-editor/esm/vs/editor/common/view/editorColorRegistry";

monaco.editor.defineTheme("bitbloqTheme", {
  base: "vs",
  inherit: true,
  rules: [
    { token: "", foreground: colors.black },
    { token: "keyword", foreground: colors.green, fontStyle: "bold" },
    { token: "comment", foreground: colors.gray4 },
    { token: "number", foreground: colors.brandBlue },
    { token: "string", foreground: colors.brandOrange }
  ],
  colors: {
    [editorBackground]: colors.gray1,
    [editorForeground]: colors.black,
    [editorLineNumbers]: colors.gray5,
    [editorActiveLineNumber]: colors.black
  }
});

interface IError {
  line: number;
  column: number;
  message: string;
}

interface IEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  errors: IError[];
}

const Editor: FC<IEditorProps> = ({ code, onChange, errors }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.ICodeEditor | null>(null);

  useEffect(() => {
    const onWindowResize = () => {
      if (editorRef.current) {
        editorRef.current.layout();
      }
    };

    window.addEventListener("resize", onWindowResize);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  useEffect(() => {
    if (containerRef.current) {
      const editor = monaco.editor.create(containerRef.current, {
        value: code,
        language: "cpp",
        fontFamily: "Roboto Mono",
        theme: "bitbloqTheme",
        automaticLayout: true
      });

      const subscription = editor.onDidChangeModelContent(event => {
        onChange(editor.getValue());
      });

      editorRef.current = editor;

      return () => {
        editor.dispose();
        const model = editor.getModel();
        if (model) {
          model.dispose();
        }
        subscription.dispose();
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    const editor = editorRef.current;
    const model = editor && editor.getModel();

    if (model) {
      monaco.editor.setModelMarkers(
        model,
        "compile",
        errors.map(error => ({
          ...error,
          startLineNumber: error.line,
          endLineNumber: error.line,
          startColumn: error.column,
          endColumn: error.column + 1,
          severity: monaco.MarkerSeverity.Error
        }))
      );
    }
  }, [errors, editorRef.current]);

  return <Container ref={containerRef} key="editor" />;
};

export default Editor;

const Container = styled.div`
  flex: 1;
`;
