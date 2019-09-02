import * as React from 'react';
import styled from "@emotion/styled";
import { Query } from 'react-apollo';
import { ThreeD } from "@bitbloq/3d";
import { colors, Spinner } from "@bitbloq/ui";
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
          if (loading) return <Loading />;
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
