import React, {
  forwardRef,
  RefForwardingComponent,
  useImperativeHandle,
  useRef
} from "react";

export interface IOpenDocumentInputHandle {
  open: () => any;
}
const OpenDocumentInput: RefForwardingComponent<IOpenDocumentInputHandle> = (
  _,
  ref
) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  }));

  const onFileSelected = (file?: File | null) => {
    if (file) {
      window.open(`/app/edit-document/local/open/new`);
      const reader = new FileReader();
      reader.onload = e => {
        const document = JSON.parse(reader.result as string);
        const channel = new BroadcastChannel("bitbloq-documents");
        channel.onmessage = event => {
          if (event.data.command === "open-document-ready") {
            channel.postMessage({ document, command: "open-document" });
            channel.close();
          }
        };
      };
      reader.readAsText(file);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <input
      ref={fileInputRef}
      type="file"
      onChange={e => onFileSelected(e.target.files && e.target.files[0])}
      style={{ display: "none" }}
    />
  );
};

export default forwardRef(OpenDocumentInput);
