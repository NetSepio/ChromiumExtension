import React from 'react';
import Home from './pages/Home';
import { Router, Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Header from './common/Header';
import Wallet from './pages/Wallet';
import Dashboard from './Dashboard/Dashboard';



const history = createMemoryHistory();
const App = () => {
  return (
    <Router history={history}>
      {/* <Header /> */}
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route path="/create">
          <Wallet />
        </Route>
        <Route path="/dashboard">
          <Dashboard/>
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
