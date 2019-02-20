import * as React from "react";
import styled from "@emotion/styled";
import { colors, FileSelectButton, Input, TextArea } from "@bitbloq/ui";

export interface DocumentInfoFormProps {
  title: string;
  description: string;
  image: string;
  onChange: (any) => void;
}

class State {
  readonly title: string;
  readonly description: string;

  constructor(title, description) {
    this.title = title;
    this.description = description;
  }
}

class DocumentInfoForm extends React.Component<DocumentInfoFormProps, State> {
  readonly state: State;

  constructor(props) {
    super(props);

    this.state = new State(props.title || '', props.description || '');
  }

  componentDidUpdate(prevProps) {
    const { title, description } = this.props;
    if (title !== prevProps.title || description !== prevProps.description) {
      this.setState({
        title,
        description
      });
    }
  }

  render() {
    const { onChange, image } = this.props;
    const { title, description } = this.state;
    return (
      <Container>
        <Panel>
          <Header>Información del documento</Header>
          <Form>
            <FormRow>
              <FormLabel>
                <label>Nombre del documento</label>
              </FormLabel>
              <FormInput>
                <Input
                  value={title}
                  placeholder="Nombre del documento"
                  onChange={e => {
                    this.setState({
                      title: e.target.value
                    });
                    onChange({ title: e.target.value, description });
                  }}
                />
              </FormInput>
            </FormRow>
            <FormRow>
              <FormLabel>
                <label>Descripción del documento</label>
              </FormLabel>
              <FormInput>
                <TextArea
                  value={description}
                  placeholder="Descripción del documento"
                  onChange={e => {
                    this.setState({
                      description: e.target.value
                    });
                    onChange({ title, description: e.target.value });
                  }}
                  rows="3"
                />
              </FormInput>
            </FormRow>
            <FormRow>
              <FormLabel>
                <label>Imagen del documento</label>
                <FormSubLabel>
                  Tamaño mínimo 600x400 px en formato jpg, png. Peso máximo 1Mb.
                </FormSubLabel>
              </FormLabel>
              <FormInput>
                <Image src={image} />
                <ImageButton
                  tertiary
                  onFileSelected={image =>
                    onChange({ title, description, image })
                  }
                >
                  Seleccionar imagen
                </ImageButton>
              </FormInput>
            </FormRow>
          </Form>
        </Panel>
      </Container>
    );
  }
}

export default DocumentInfoForm;

/* styled components */

const Container = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  justify-content: center;
  padding: 40px;
  background-color: ${colors.gray1};
`;

const Panel = styled.div`
  align-self: flex-start;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 3px 0 #c7c7c7;
  background-color: white;
  width: 100%;
  max-width: 900px;
`;

const Header = styled.div`
  border-bottom: 1px solid ${colors.gray2};
  font-size: 16px;
  font-weight: bold;
  padding: 0px 30px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const Form = styled.div`
  padding: 20px 30px;
`;

const FormRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`;

const FormLabel = styled.div`
  flex: 1;
  font-size: 14px;
  margin-right: 30px;

  label {
    min-height: 35px;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }
`;

const FormSubLabel = styled.div`
  font-size: 12px;
  font-style: italic;
  margin-top: 10px;
`;

const FormInput = styled.div`
  flex: 2;
`;

interface ImageProps {
  src: string;
}
const Image = styled.div<ImageProps>`
  border: 1px solid ${colors.gray3};
  border-radius: 4px;
  width: 250px;
  height: 160px;
  margin-bottom: 10px;
  background-image: url(${props => props.src});
  background-size: cover;
  background-position: center;
`;

const ImageButton = styled(FileSelectButton)`
  width: 250px;
`;
