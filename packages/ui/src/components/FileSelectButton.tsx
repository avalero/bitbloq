import * as React from "react";
import Button, { IButtonProps } from "./Button";

export interface IFileSelectButtonProps {
  onFileSelected: (file: File) => void;
}

class FileSelectButton extends React.Component<
  IFileSelectButtonProps & IButtonProps & React.HTMLProps<HTMLButtonElement>
> {
  private input = React.createRef<HTMLInputElement>();

  public render(): React.ReactNode {
    const { onFileSelected, accept, ...restProps } = this.props;
    return (
      <>
        <Button {...restProps} onClick={this.onClick} type="button" />
        <input
          type="file"
          style={{ display: "none" }}
          ref={this.input}
          accept={accept}
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

  private onClick = () => {
    if (this.input.current) {
      this.input.current.click();
    }
  };
}

export default FileSelectButton;
