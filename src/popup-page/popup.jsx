import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';
import ApolloProvider from '../AppoloProvider';
let persistor = persistStore(store);

render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {ApolloProvider}
    </PersistGate>
  </Provider>,
  document.getElementById('popup')
);
