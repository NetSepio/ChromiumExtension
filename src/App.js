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

const history = createMemoryHistory();
const App = () => {
  const [tabId, setTabId] = useState('');
  const [dynamicURL, setDynamicURL] = useState('')
  const dispatch = useDispatch();

  useEffect(() => {
    chrome.tabs.onActivated.addListener(function (activeInfo) {
      setTabId(activeInfo?.tabId);
    });
  }, []);

  useEffect(() => {
    function getActiveTab() {
      chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
        console.log(tabs, ';;;;;');
        var tab = tabs[0]?.url;
        if (tab) {
          let val = tab?.split('/');
          let result = val[0] + '//' + val[2];
          setDynamicURL(result)
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
          <Dashboard dynamicURL={dynamicURL}/>
        </Route>
        <Route path="/change">
          <Password />
        </Route>
        <Route path="/profile">
          <UserProfile />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
