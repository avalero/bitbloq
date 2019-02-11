import * as React from "react";
import styled from "@emotion/styled";
import saveAs from 'file-saver';
import { Query, Mutation } from "react-apollo";
import debounce from "lodash.debounce";
import { ThreeD } from "@bitbloq/3d";
import { colors, Document, Icon, Spinner, withTranslate } from "@bitbloq/ui";
import gql from "graphql-tag";
import DocumentInfoForm from "./DocumentInfoForm";
import {addShapeGroups} from "../config";

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
        title: $title,
        content: $content,
        description: $description,
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

const getMenuOptions = (baseMenuOptions, t) => (
  [
    {
      id: 'file',
      label: t('menu-file'),
      children: [
        {
          id: 'download-document',
          label: t('menu-download-document'),
          icon: <Icon name="download" />
        },
        {
          id: 'download-stl',
          label: t('menu-download-stl'),
          icon: <Icon name="threed" />
        },
      ],
    },
    ...baseMenuOptions
  ]
);

class ThreeDEditor extends React.Component {
  private currentContent: any;
  threedRef = React.createRef<ThreeD>();

  onEditTitle(document) {}

  onMenuOptionClick = (option, document) => {
    const { type, title, description, content, image } = document;
    switch (option.id) {
      case 'download-document':
        const documentJSON = {
          type,
          title,
          description,
          content,
          image
        };
        var blob = new Blob(
          [JSON.stringify(documentJSON)],
          {type: "text/json;charset=utf-8"}
        )
        saveAs(blob, `${title}.3d.bitbloq`);
        return;

      case 'download-stl':
        this.threedRef.current.exportToSTL();
        return;

      default:
        onMenuOptionClick && onMenuOptionClick(option)
        return;
    }
  }

  renderInfoTab(document) {
    const { t, updateDocument } = this.props;
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
            updateDocument({
              variables: { id, title, content, description, image },
              refetchQueries: [
                {
                  query: DOCUMENT_QUERY,
                  variables: { id }
                }
              ]
            })
          }
        />
      </Document.Tab>
    );
  }

  render() {
    const { id, updateDocument, t } = this.props;

    return (
      <Query query={DOCUMENT_QUERY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <Loading />;
          if (error) return <p>Error :(</p>;

          const { document } = data;
          const { id, title } = document;
          let content = [];
          try {
            content = JSON.parse(document.content);
          } catch (e) {
            console.warn("Error parsing document content", e);
          }

          this.currentContent = content;

          return (
            <ThreeD
              ref={this.threedRef}
              initialContent={content}
              title={title}
              canEditTitle
              onEditTitle={() => this.onEditTitle(document)}
              menuOptions={base => getMenuOptions(base, t)}
              addShapeGroups={base => ([...base, ...addShapeGroups])}
              onMenuOptionClick={option => this.onMenuOptionClick(option, document)}
              onContentChange={content => {
                this.currentContent = content;
                updateDocument({
                  variables: {
                    id,
                    title,
                    content: JSON.stringify(content)
                  },
                  refetchQueries: [{ query: DOCUMENT_QUERY, variables: { id } }]
                });
              }}
            >
              {mainTab => [mainTab, this.renderInfoTab(document)]}
            </ThreeD>
          );
        }}
      </Query>
    );
  }
}

const withUpdateDocument = Component => props => (
  <Mutation mutation={UPDATE_DOCUMENT_MUTATION}>
    {mutate => <Component updateDocument={debounce(mutate, 1000)} {...props} />}
  </Mutation>
);

export default withTranslate(withUpdateDocument(ThreeDEditor));

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
