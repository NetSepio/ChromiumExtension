import React from 'react';
import Home from './pages/Home';
import { Router, Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from './common/Header';
import Wallet from './pages/Wallet';



const history = createMemoryHistory();
const App = () => {
  return (
    <Router history={history}>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/create">
          <Wallet />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
