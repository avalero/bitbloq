import * as React from 'react';
import {Query, Mutation} from 'react-apollo';
import debounce from 'lodash.debounce';
import {ThreeD} from '@bitbloq/3d';
import gql from 'graphql-tag';

const DOCUMENT_QUERY = gql`
  query Document($id: String!) {
    documentByID(id: $id) {
      id
      type
      title
      content
    }
  }
`;

const UPDATE_DOCUMENT_MUTATION = gql`
  mutation UpdateDocument($id: String!, $title: String!, $content: String!) {
    updateDocument(id: $id, title: $title, content: $content) {
      content
    }
  }
`;

const ThreeDDocument = ({id}) => (
  <Query query={DOCUMENT_QUERY} variables={{id}}>
    {({loading, error, data}) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const document = data.documentByID[0];
      const {id, title} = document;
      let content = [];
      try {
        content = JSON.parse(document.content);
      } catch (e) {
        console.warn('Error parsing document content', e);
      }

      return (
        <Mutation mutation={UPDATE_DOCUMENT_MUTATION}>
        {updateDocument => {
          const update = debounce(updateDocument, 1000);
          return (
            <ThreeD
              initialContent={content}
              onContentChange={content =>
                update({
                  variables: {id, title, content: JSON.stringify(content)},
                })
              }
            />
          );
        }}
        </Mutation>
      );
    }}
  </Query>
);

export default ThreeDDocument;
