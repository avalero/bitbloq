import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import {createClient} from './client';

export const wrapRootElement = isBrowser => ({element}) => {
  const client = createClient(isBrowser);

  return (
    <ApolloProvider client={client}>
      {element}
    </ApolloProvider>
  );
}
