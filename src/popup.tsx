import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "./assets/tailwind.css";
import App from "./app/App";
import { BrowserRouter } from "react-router-dom";

let persistor = persistStore(store);
const client = new ApolloClient({
  uri: "https://gateway.netsepio.com/api/v1.0/delegateReviewCreation",
  cache: new InMemoryCache(),
});

const index = (
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ApolloProvider client={client}>
            <App />
          </ApolloProvider>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

const container = document.createElement("div");
document.body.appendChild(container);
const root = createRoot(container);
root.render(index);
