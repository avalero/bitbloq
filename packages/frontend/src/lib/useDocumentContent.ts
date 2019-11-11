import { useState, useCallback, useRef, useEffect } from "react";
import { IDocument } from "../types";

const useDocumentContent = (
  document: IDocument,
  onDocumentChange: (document: IDocument) => any
) => {
  const documentRef = useRef<IDocument>(document);
  const [initialContent, setInitialContent] = useState<any | null>(null);

  useEffect(() => {
    documentRef.current = document;
  }, [document]);

  useEffect(() => {
    try {
      setInitialContent(JSON.parse(document.content));
    } catch (e) {
      console.warn("Error parsing document content", e);
    }
  }, []);

  const onContentChange = useCallback(
    (newContent: any) =>
      onDocumentChange({
        ...documentRef.current,
        content: JSON.stringify(newContent)
      }),
    [documentRef]
  );

  return [initialContent, onContentChange];
};

export default useDocumentContent;
