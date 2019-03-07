import * as React from "react";
import styled from "@emotion/styled";
import saveAs from "file-saver";
import { Query, Mutation } from "react-apollo";
import debounce from "lodash.debounce";
import { colors, Document, Icon, Spinner, withTranslate } from "@bitbloq/ui";
import ThreeDEditor from "./ThreeDEditor";
import { navigate } from "gatsby";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import {
  DOCUMENT_QUERY,
  CREATE_DOCUMENT_MUTATION,
  UPDATE_DOCUMENT_MUTATION
} from "../apollo/queries";
import { documentTypes } from "../config";

class State {
  readonly isEditTitleVisible: boolean = false;
  readonly tabIndex: number = 0;
}

interface EditDocumentProps {
  type: string;
  t: (key: string) => string;
  updateDocument: (any) => any;
  document: any;
}

class EditDocument extends React.Component<EditDocumentProps, State> {
  readonly state = new State();

  onEditTitle = () => {
    const { document } = this.props;
    this.setState({ isEditTitleVisible: true });
  };

  onSaveTitle = title => {
    const { updateDocument, document } = this.props;
    updateDocument({ ...document, title, image: undefined });
    this.setState({ isEditTitleVisible: false });
  };

  onSaveDocument = () => {
    const { document } = this.props;
    const { type, title, description, content, image } = document;
    const documentJSON = {
      type,
      title,
      description,
      content,
      image
    };
    var blob = new Blob([JSON.stringify(documentJSON)], {
      type: "text/json;charset=utf-8"
    });
    saveAs(blob, `${title}.${type}.bitbloq`);
  };

  renderInfoTab() {
    const { t, document, updateDocument } = this.props;
    const { id, title, description, content, image } = document;

    return (
      <Document.Tab
        key="info"
        icon={<Icon name="info" />}
        label={t("tab-project-info")}
      >
        <DocumentInfoForm
          title={title}
          description={description}
          image={image}
          onChange={({ title, description, image }) => {
            const newDocument = { ...document, title, description, image };
            if (!image || typeof image === 'string') {
              delete newDocument.image;
            }
            updateDocument(newDocument);
          }}
        />
      </Document.Tab>
    );
  }

  render() {
    const { isEditTitleVisible, tabIndex } = this.state;
    const { document, updateDocument, type } = this.props;

    const documentType = documentTypes[type];

    const { id, title } = document;
    let content = [];
    try {
      content = JSON.parse(document.content);
    } catch (e) {
      console.warn("Error parsing document content", e);
    }

    const EditorComponent = documentType.editorComponent;

    return (
      <>
        <EditorComponent
          brandColor={documentType.color}
          canEditTitle={true}
          content={content}
          tabIndex={tabIndex}
          onTabChange={tabIndex => this.setState({ tabIndex })}
          getTabs={mainTabs => [...mainTabs, this.renderInfoTab()]}
          title={title}
          onEditTitle={this.onEditTitle}
          onSaveDocument={this.onSaveDocument}
          onContentChange={content =>
            updateDocument({
              ...document,
              content: JSON.stringify(content),
              image: undefined
            })
          }
        />
        {isEditTitleVisible && (
          <EditTitleModal
            title={title}
            onCancel={() => this.setState({ isEditTitleVisible: false })}
            onSave={this.onSaveTitle}
          />
        )}
      </>
    );
  }
}

const EditDocumentWithData = props => {
  const { type } = props;
  const documentType = documentTypes[type];

  if (props.id === "new") {
    return (
      <Mutation
        mutation={CREATE_DOCUMENT_MUTATION}
        onCompleted={({ createDocument: { id, type } }) =>
          navigate(`/app/document/${type}/${id}`)
        }
      >
        {(createDocument, { loading }) => {
          if (loading) return <Loading color={documentType.color} />;

          return (
            <EditDocument
              {...props}
              document={{
                content: "[]",
                title: "",
                description: "",
                type: props.type
              }}
              updateDocument={document =>
                createDocument({ variables: document })
              }
            />
          );
        }}
      </Mutation>
    );
  } else {
    return (
      <Query query={DOCUMENT_QUERY} variables={{ id: props.id }}>
        {({ loading, error, data }) => {
          if (loading) return <Loading color={documentType.color} />;
          if (error) return <p>Error :(</p>;

          return (
            <Mutation mutation={UPDATE_DOCUMENT_MUTATION}>
              {mutate => (
                <EditDocument
                  {...props}
                  document={data.document}
                  updateDocument={debounce(document => {
                    mutate({
                      variables: document,
                      refetchQueries: [
                        {
                          query: DOCUMENT_QUERY,
                          variables: { id: props.id }
                        }
                      ]
                    });
                  }, 1000)}
                />
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
};

export default withTranslate(EditDocumentWithData);

/* styled components */

interface LoadingProps {
  color: string;
}
const Loading = styled(Spinner)<LoadingProps>`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${props => props.color};
`;
