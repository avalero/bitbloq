import * as React from 'react';
import Button from './Button';

export interface FileSelectButtonProps {
  onFileSelected: (file: File) => void;
}

class FileSelectButton extends React.Component<
  FileSelectButtonProps & React.HTMLProps<HTMLButtonElement>
> {
  input = React.createRef();

  onClick = () => {
    this.input.current.click();
  };

  render() {
    const {onFileSelected} = this.props;
    return (
      <>
        <Button {...this.props} onClick={this.onClick} />
        <input
          type="file"
          style={{display: 'none'}}
          ref={this.input}
          onChange={(e: React.FormEvent<HTMLInputElement>) =>
            onFileSelected(e.target.files[0])
          }
        />
      </>
    );
  }
}

export default FileSelectButton;
