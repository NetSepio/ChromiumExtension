import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import theme from './Theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import CustomSnackbar from '../src/common/snackbar/CustomSnackbar';

const client = new ApolloClient({
  // uri: 'https://query.graph.lazarus.network/subgraphs/name/NetSepio',
  uri: 'https://gateway.netsepio.com/api/v1.0/delegateReviewCreation',
  cache: new InMemoryCache(),
});
console.log(client);
export default (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CustomSnackbar>
        <App />
      </CustomSnackbar>
    </ThemeProvider>
  </ApolloProvider>
);
