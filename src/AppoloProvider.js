import React from 'react';
import App from './App';
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import theme from './Theme/theme';
import { ThemeProvider } from '@mui/material/styles';
import CustomSnackbar from './common/snackbar/CustomSnackbar.jsx';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_APOLLO_URL,
  // uri: 'https://gateway.netsepio.com/api/v1.0/delegateReviewCreation',
  cache: new InMemoryCache(),
});
export default (
  <ApolloProvider client={client}>
    <ThemeProvider theme={theme}>
      <CustomSnackbar>
        <App />
      </CustomSnackbar>
    </ThemeProvider>
  </ApolloProvider>
);
