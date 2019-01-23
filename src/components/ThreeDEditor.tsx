import * as React from "react";
import styled from "@emotion/styled";
import { Query, Mutation } from "react-apollo";
import debounce from "lodash.debounce";
import { ThreeD } from "@bitbloq/3d";
import {
  colors,
  Document,
  Icon,
  withTranslate
} from "@bitbloq/ui";
import gql from "graphql-tag";
import DocumentInfoForm from './DocumentInfoForm';

const DOCUMENT_QUERY = gql`
  query Document($id: ObjectID!) {
    document(id: $id) {
      id
      type
      title
      description
      content
    }
  }
`;

const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument(
    $id: ObjectID!
    $title: String!
    $content: String
    $description: String
  ) {
    updateDocument(
      id: $id
      input: { title: $title, content: $content, description: $description }
    ) {
      content
    }
  }
`;

class ThreeDEditor extends React.Component {
  onEditTitle(document) {}

  renderInfoTab(document) {
    const { t } = this.props;
    const { id, title, description } = document;

    return (
      <Document.Tab
        key="info"
        icon={<Icon name="info" />}
        label={t("tab-project-info")}
      >
        <DocumentInfoForm
          title={title}
          description={description}
        />
      </Document.Tab>
    );
  }

  render() {
    const { id, updateDocument } = this.props;

    return (
      <Query query={DOCUMENT_QUERY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const { document } = data;
          const { id, title } = document;
          let content = [];
          try {
            content = JSON.parse(document.content);
          } catch (e) {
            console.warn("Error parsing document content", e);
          }

          return (
            <ThreeD
              initialContent={content}
              title={title}
              canEditTitle
              onEditTitle={() => this.onEditTitle(document)}
              onContentChange={content =>
                updateDocument({
                  variables: {
                    id,
                    title,
                    content: JSON.stringify(content)
                  },
                  refetchQueries: [{ query: DOCUMENT_QUERY, variables: { id } }]
                })
              }
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

