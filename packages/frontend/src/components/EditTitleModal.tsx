import * as React from "react";
import styled from "@emotion/styled";
import { Button, Input, Modal } from "@bitbloq/ui";

interface EditTitleModalProps {
  title: string;
  onSave: (title: string) => any;
  onCancel: () => any;
}

class State {
  readonly title: string = "";

  constructor(title) {
    this.title = title;
  }
}

class EditTitleModal extends React.Component<EditTitleModalProps> {
  readonly state: State;
  private titleInput = React.createRef<HTMLInputElement>();

  constructor(props) {
    super(props);

    this.state = new State(props.title);
  }

  componentDidMount() {
    this.titleInput.current.focus();
  }

  render() {
    const { title } = this.state;
    const { onCancel, onSave } = this.props;

    return (
      <Modal
        isOpen={true}
        title="Cambiar el nombre del proyecto"
        onClose={onCancel}
      >
        <Content>
          <form
            onSubmit={e => {
              e.preventDefault();
              onSave(title);
            }}
          >
            <p>Introduce un nuevo nombre para el proyecto</p>
            <Input
              value={title}
              ref={this.titleInput}
              onChange={e => this.setState({ title: e.target.value })}
            />
            <Buttons>
              <Button onClick={() => onSave(title)}>Guardar</Button>
              <Button
                tertiary
                onClick={e => {
                  e.preventDefault();
                  onCancel();
                }}
              >
                Cancelar
              </Button>
            </Buttons>
          </form>
        </Content>
      </Modal>
    );
  }
}

export default EditTitleModal;

/* styled components */

const Content = styled.div`
  padding: 30px;
  width: 500px;
  box-sizing: border-box;

  p {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

const Buttons = styled.div`
  display: flex;
  margin-top: 50px;

  ${Button} {
    height: 50px;
    width: 170px;
    margin-right: 20px;
  }
`;
