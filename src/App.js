/*global chrome*/
import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import { Router, Switch, Route } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import Wallet from './pages/Wallet';
import Dashboard from './Dashboard/Dashboard.jsx';
import Password from './Dashboard/comp/Password.jsx';
import UserProfile from './Dashboard/comp/profile/UserProfile.jsx';
import { useDispatch } from 'react-redux';
import LockWallet from './Dashboard/comp/lockWallet/LockWallet.jsx';

const history = createMemoryHistory();
const App = () => {
  const [tabId, setTabId] = useState('');
  const [dynamicURL, setDynamicURL] = useState('');
  const [domain, setDomain] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      setTabId(activeInfo?.tabId);
    });
  }, []);

  useEffect(() => {
    function getActiveTab() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        var tab = tabs[0]?.url;
        if (tab) {
          setDynamicURL(tab)
          let val = tab?.split('/');
          let result = val[0] + '//' + val[2];
          setDomain(result);
        }
      });
    }
    getActiveTab();
  }, [tabId]);
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
          <Dashboard dynamicURL={dynamicURL} domain={domain}/>
        </Route>
        <Route path="/change">
          <Password />
        </Route>
        <Route path="/profile">
          <UserProfile />
        </Route>
        <Route path="/lock">
          <LockWallet />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
