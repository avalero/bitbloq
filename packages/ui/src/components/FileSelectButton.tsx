import * as React from "react";
import Button from "./Button";

export interface FileSelectButtonProps {
  onFileSelected: (file: File) => void;
}

class FileSelectButton extends React.Component<
  FileSelectButtonProps & React.HTMLProps<HTMLButtonElement>
> {
  input = React.createRef<HTMLInputElement>();

  onClick = () => {
    if (this.input.current) {
      this.input.current.click();
    }
  };

  render() {
    const { onFileSelected, type, ...restProps } = this.props;
    return (
      <>
        <Button {...restProps} onClick={this.onClick} />
        <input
          type="file"
          style={{ display: "none" }}
          ref={this.input}
          onChange={(e: React.FormEvent<HTMLInputElement>) => {
            const files = (e.target as HTMLInputElement).files;
            if (files && files[0]) {
              onFileSelected(files[0]);
            }
          }}
        />
      </>
    );
  }
}

export default FileSelectButton;
