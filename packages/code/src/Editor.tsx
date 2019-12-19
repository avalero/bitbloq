import React, { FC, useEffect, useRef } from "react";
import { colors } from "@bitbloq/ui";
import styled from "@emotion/styled";
import "monaco-editor/esm/vs/editor/browser/controller/coreCommands.js";
import "monaco-editor/esm/vs/editor/contrib/find/findController.js";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api.js";
import "monaco-editor/esm/vs/basic-languages/cpp/cpp.contribution.js";
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

interface IEditorProps {
  code: string;
  onChange: (newCode: string) => void;
}

const Editor: FC<IEditorProps> = ({ code, onChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<monaco.editor.ICodeEditor | null>(null);

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
    if (!editor) {
      return;
    }
    const model = editor.getModel();
    if (model && code !== model.getValue()) {
      editor.setValue(code);
    }
  }, [code]);

  return <Container ref={containerRef} />;
};

export default Editor;

const Container = styled.div`
  flex: 1;
`;
