import React, { FC, useEffect, useRef } from "react";
import colors from "../colors";
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
    [editorBackground]: "#ffffff",
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

interface IRange {
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
}

interface ICodeEditorProps {
  code: string;
  onChange?: (newCode: string) => void;
  errors?: IError[];
  readOnly?: boolean;
  disableMinimap?: boolean;
  selectedRange?: IRange;
}

const CodeEditor: FC<ICodeEditorProps> = ({
  code,
  onChange,
  errors = [],
  readOnly = false,
  disableMinimap = false,
  selectedRange
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.ICodeEditor | null>(null);
  const decorationsRef = useRef<string[]>([]);

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
    if (readOnly && editorRef.current) {
      editorRef.current.getModel()?.setValue(code);
    }
  }, [code]);

  useEffect(() => {
    if (containerRef.current) {
      const editor = monaco.editor.create(containerRef.current, {
        value: code,
        language: "cpp",
        fontFamily: "Roboto Mono",
        theme: "bitbloqTheme",
        automaticLayout: true,
        scrollBeyondLastLine: false,
        readOnly,
        minimap: {
          enabled: !disableMinimap
        }
      });

      const subscription = editor.onDidChangeModelContent(event => {
        onChange && onChange(editor.getValue());
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

    setSelection(selectedRange);
  }, [errors, editorRef.current]);

  useEffect(() => {
    setSelection(selectedRange);
  }, [selectedRange]);

  const setSelection = (range?: IRange) => {
    if (editorRef.current) {
      decorationsRef.current = editorRef.current.deltaDecorations(
        decorationsRef.current,
        range
          ? [
              {
                range: new monaco.Range(
                  range.startLine,
                  range.startColumn,
                  range.endLine,
                  range.endColumn
                ),
                options: {
                  inlineClassName: "selected-range"
                }
              }
            ]
          : []
      );
    }
  };

  return <Container ref={containerRef} key="editor" />;
};

export default CodeEditor;

const Container = styled.div`
  flex: 1;

  .selected-range {
    background-color: ${colors.black};
    color: white;
  }
`;
