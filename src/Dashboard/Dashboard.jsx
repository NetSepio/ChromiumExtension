/* eslint-disable */
import React, { useEffect } from 'react';
import { Grid } from '@mui/material';
import DashboardStyles from './DashboardStyles';
import Header from '../common/Header.jsx';
import { Tabs, Tab, Box, Typography, AppBar, Toolbar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Home from './comp/Home.jsx';
import Settings from './comp/Settings.jsx';
import SendTokens from './comp/SendTokens.jsx';
import UserProfile from './comp/profile/UserProfile.jsx';
import Feedback from './comp/feedback/Feedback.jsx';
import { updateTab } from '../redux/projects/projectSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component="span">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Dashboard = ({ dynamicURL, domain }) => {
  const styles = DashboardStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { tab } = useSelector((state) => state.project);

  const handleChange = (event, newValue) => {
    dispatch(updateTab({ data: newValue }));
  };

  useEffect(() => {
    if (tab === 6) {
      history.push('/lock');
    }
  }, [tab]);
  return (
    <Grid container className={styles.mainContainer}>
      <Grid item>
        <Header domain={domain} dynamicURL={dynamicURL} />
      </Grid>
      <Grid item container style={{ marginTop: '2rem' }}>
        <TabPanel value={tab} index={0} style={{ minWidth: '100%' }}>
          <Home dynamicURL={dynamicURL} domain={domain} />
        </TabPanel>
        <TabPanel value={tab} index={1} style={{ minWidth: '100%' }}>
          <SendTokens />
        </TabPanel>
        <TabPanel value={tab} index={2} style={{ minWidth: '100%' }}>
          <Settings goBackToSettings={() => dispatch(updateTab({ data: 2 }))} />
        </TabPanel>
        <TabPanel value={tab} index={3} style={{ minWidth: '100%' }}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={tab} index={4} style={{ minWidth: '100%' }}>
          <UserProfile />
        </TabPanel>
        <TabPanel value={tab} index={5} style={{ minWidth: '100%' }}>
          <Feedback />
        </TabPanel>
        {/* <TabPanel value={tab} index={6} style={{ minWidth: '100%' }}>
          <LockWallet />
        </TabPanel> */}
      </Grid>
      <AppBar
        position="fixed"
        sx={{ top: 'auto', bottom: 0, backgroundColor: '#2c2d30' }}
      >
        <Toolbar>
          <div style={{ width: '100%' }}>
            <Tabs
              value={tab}
              onChange={handleChange}
              aria-label="icon tabs example"
            >
              <Tab
                icon={<ReviewsOutlinedIcon />}
                aria-label="phone"
                className={styles.tab}
              />
              <Tab
                icon={<AttachMoneyIcon />}
                aria-label="favorite"
                className={styles.tab}
              />
              <Tab
                icon={<SettingsOutlinedIcon />}
                aria-label="person"
                className={styles.tab}
              />
            </Tabs>
          </div>
        </Toolbar>
      </AppBar>
    </Grid>
  );
};

export default Dashboard;
