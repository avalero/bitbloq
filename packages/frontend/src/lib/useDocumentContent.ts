import { useState, useCallback, useRef, useEffect } from "react";
import { IDocument } from "@bitbloq/api";

const useDocumentContent = (
  document: IDocument,
  onDocumentChange: (document: IDocument) => any,
  newContent: any,
  advancedMode?: boolean
) => {
  const documentRef = useRef(document);
  const onDocumentChangeRef = useRef(onDocumentChange);
  const [initialContent, setInitialContent] = useState<any | null>(null);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);
  useEffect(() => {
    onDocumentChangeRef.current = onDocumentChange;
  }, [onDocumentChange]);

  useEffect(() => {
    try {
      setInitialContent(
        document.content ? JSON.parse(document.content) : newContent
      );
    } catch (e) {
      console.warn("Error parsing document content", e);
    }
  }, []);

  const onContentChange = useCallback(
    (newContent: any) =>
      onDocumentChangeRef.current({
        ...documentRef.current,
        advancedMode,
        content: JSON.stringify(newContent)
      }),
    [advancedMode, documentRef, onDocumentChangeRef]
  );

  return [initialContent, onContentChange];
};

export default useDocumentContent;
