import * as React from 'react';
import { Query } from 'react-apollo';
import { ThreeD } from "@bitbloq/3d";
import gql from "graphql-tag";

const SUBMISSION_QUERY = gql`
  query Submission($id: ObjectID!) {
    submission(id: $id) {
      title
      studentNick
      content
    }
  }
`;

class ThreeDSubmission extends React.Component {
  render() {
    const { id } = this.props;

    return (
      <Query query={SUBMISSION_QUERY} variables={{ id }}>
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const { submission } = data;
          const { title, studentNick } = submission;
          let content = [];
          try {
            content = JSON.parse(submission.content);
          } catch (e) {
            console.warn("Error parsing document content", e);
          }

          return (
            <ThreeD
              initialContent={content}
              title={`${title} (${studentNick})`}
            />
          );
        }}
      </Query>
    );
  }
}

export default ThreeDSubmission;
