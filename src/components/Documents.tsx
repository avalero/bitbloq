import * as React from 'react';
import {navigate} from 'gatsby';
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

const Documents = () => (
  <Query
    query={gql`
      query {
        documents {
          type,
          tittle
        }
      }
    `}>
    {({loading, error, data}) => {
      if (loading) return <p>Loading...</p>;
      if (error) return <p>Error :(</p>;

      const documents = [
        {
          id: '123123123',
          type: '3d',
          title: 'Document 1'
        }
      ];

      return (
        <div>
          <h1>Documents</h1>
          <ul>
            {documents.map(({title, id, type}) => (
              <li key={id} onClick={() => navigate(`/app/${type}/${id}`)}>
                {title}
              </li>
            ))}
          </ul>
        </div>
      );
    }}
  </Query>
);

export default Documents;
