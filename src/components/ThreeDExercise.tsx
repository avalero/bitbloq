import * as React from 'react';
import {Query, Mutation} from 'react-apollo';
import {ThreeD} from '@bitbloq/3d';
import gql from 'graphql-tag';

const EXERCISE_QUERY = gql`
  query Exercise($id: ObjectID!) {
    exerciseByID(id: $id) {
      id
      type
      title
      content
    }
  }
`;

class ThreeDExercise extends React.Component {
  render() {
    const {id} = this.props;

    return (
      <Query query={EXERCISE_QUERY} variables={{id}}>
        {({loading, error, data}) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :(</p>;

          const exercise = data.exerciseByID;
          const {id, title} = exercise;
          let content = [];
          try {
            content = JSON.parse(exercise.content);
          } catch (e) {
            console.warn('Error parsing document content', e);
          }

          return (
            <ThreeD initialContent={content} />
          );
        }}
      </Query>
    );
  }
}

export default ThreeDExercise;
