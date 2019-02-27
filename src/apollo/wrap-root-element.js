import * as React from 'react';
import {ApolloProvider} from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import {createClient} from './client';

export const wrapRootElement = isBrowser => ({element}) => {
  const client = createClient(isBrowser);

  return (
    <ApolloProvider client={client}>
      <ApolloHooksProvider client={client}>
        {element}
      </ApolloHooksProvider>
    </ApolloProvider>
  );
}
