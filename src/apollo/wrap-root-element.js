import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import {client} from './client';

export const wrapRootElement = isBrowser => ({element}) => (
  <ApolloProvider client={client(isBrowser)}>
    {element}
  </ApolloProvider>
);


