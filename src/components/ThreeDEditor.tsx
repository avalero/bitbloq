import * as React from "react";
import styled from "@emotion/styled";
import saveAs from "file-saver";
import { Query, Mutation } from "react-apollo";
import debounce from "lodash.debounce";
import { ThreeD } from "@bitbloq/3d";
import { colors, Document, Icon, Spinner, withTranslate } from "@bitbloq/ui";
import gql from "graphql-tag";
import { navigate } from "gatsby";
import DocumentInfoForm from "./DocumentInfoForm";
import EditTitleModal from "./EditTitleModal";
import BrowserVersionWarning from "./BrowserVersionWarning";
import { addShapeGroups } from "../config";
import { getChromeVersion } from "../util";

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      content
      image
    }
  }
`;

const CREATE_DOCUMENT_MUTATION = gql`
  mutation CreateDocument(
    $type: String!
    $title: String!
    $description: String
    $content: String
    $image: String
  ) {
    createDocument(
      input: {
        type: $type
        title: $title
        description: $description
        content: $content
        imageUrl: $image
      }
    ) {
      id
      type
    }
  }
`;

const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $title: String!
    $content: String
    $description: String
    $image: Upload
  ) {
    updateDocument(
      id: $id
      input: {
        title: $title
        content: $content
        description: $description
        image: $image
      }
    ) {
      id
      type
      content
      image
    }
  }
`;

const getMenuOptions = (baseMenuOptions, t) => [
  {
    id: "file",
    label: t("menu-file"),
    children: [
      {
        id: "download-document",
        label: t("menu-download-document"),
        icon: <Icon name="download" />
      },
      {
        id: "download-stl",
        label: t("menu-download-stl"),
        icon: <Icon name="threed" />
      }
    ]
  },
  ...baseMenuOptions
];

class State {
  readonly isEditTitleVisible: boolean = false;
  readonly tabIndex: number = 0;
}

class ThreeDEditor extends React.Component<any, State> {
  readonly state = new State();
  private currentContent: any;
  threedRef = React.createRef<ThreeD>();

  onEditTitle = () => {
    const { document } = this.props;
    this.setState({ isEditTitleVisible: true });
  };

  onSaveTitle = title => {
    const { updateDocument, document } = this.props;
    updateDocument({ ...document, title });
    this.setState({ isEditTitleVisible: false });
  };

  onMenuOptionClick = option => {
    const { document } = this.props;
    const { type, title, description, content, image } = document;
    switch (option.id) {
      case "download-document":
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
        saveAs(blob, `${title}.3d.bitbloq`);
        return;

      case "download-stl":
        this.threedRef.current.exportToSTL();
        return;

      default:
        return;
    }
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
          onChange={({ title, description, image }) =>
            updateDocument({ ...document, title, description, image })
          }
        />
      </Document.Tab>
    );
  }

  render() {
    const { isEditTitleVisible, tabIndex } = this.state;
    const { document, updateDocument, t } = this.props;

    if (getChromeVersion() < 69) {
      return <BrowserVersionWarning version={69} color={colors.brandBlue} />;
    }

    const { id, title } = document;
    let content = [];
    try {
      content = JSON.parse(document.content);
    } catch (e) {
      console.warn("Error parsing document content", e);
    }

    this.currentContent = content;

    return (
      <>
        <ThreeD
          ref={this.threedRef}
          initialContent={content}
          tabIndex={tabIndex}
          onTabChange={tabIndex => this.setState({ tabIndex })}
          title={title}
          canEditTitle
          onEditTitle={this.onEditTitle}
          menuOptions={base => getMenuOptions(base, t)}
          addShapeGroups={base => [...base, ...addShapeGroups]}
          onMenuOptionClick={this.onMenuOptionClick}
          onContentChange={content => {
            this.currentContent = content;
            updateDocument({ ...document, content: JSON.stringify(content) });
          }}
        >
          {mainTab => [mainTab, this.renderInfoTab()]}
        </ThreeD>
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

const ThreeDEditorWithData = props =>
  props.id === "new" ? (
    <Mutation
      mutation={CREATE_DOCUMENT_MUTATION}
      onCompleted={({ createDocument: { id, type } }) =>
        navigate(`/app/document/${type}/${id}`)
      }
    >
      {(createDocument, { loading }) => {
        if (loading) return <Loading />;

        return (
          <ThreeDEditor
            {...props}
            document={{ content: "[]", title: "", description: "", type: "3d" }}
            updateDocument={document => createDocument({ variables: document })}
          />
        );
      }}
    </Mutation>
  ) : (
    <Query query={DOCUMENT_QUERY} variables={{ id: props.id }}>
      {({ loading, error, data }) => {
        if (loading) return <Loading />;
        if (error) return <p>Error :(</p>;

        return (
          <Mutation mutation={UPDATE_DOCUMENT_MUTATION}>
            {mutate => (
              <ThreeDEditor
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

export default withTranslate(ThreeDEditorWithData);

/* styled components */

const Loading = styled(Spinner)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  color: white;
  background-color: ${colors.brandBlue};
`;
