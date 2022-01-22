import React from 'react';
import { Grid } from '@mui/material';
import DashboardStyles from './DashboardStyles';
import Header from '../common/Header';
import { Tabs, Tab, Box, Typography, AppBar, Toolbar } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Home from './comp/Home';
import Review from './comp/Review';
import Settings from './comp/Settings';

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
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const Dashboard = () => {
  const styles = DashboardStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid container className={styles.mainContainer}>
      <Grid item>
        <Header />
      </Grid>
      <Grid item container style={{ marginTop: '3.3rem' }}>
        <TabPanel value={value} index={0} style={{ minWidth: '100%' }}>
          <Home />
        </TabPanel>
        <TabPanel value={value} index={1} style={{ minWidth: '100%' }}>
          <Review />
        </TabPanel>
        <TabPanel value={value} index={2} style={{ minWidth: '100%' }}>
          <Settings />
        </TabPanel>
      </Grid>
      <AppBar position="fixed" sx={{ top: 'auto', bottom: 0,backgroundColor:'#2c2d30' }}>
        <Toolbar>
          <div style={{width:'100%'}}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="icon tabs example"
          >
            <Tab
              icon={<AttachMoneyIcon />}
              aria-label="phone"
              className={styles.tab}
            />
            <Tab
              icon={<ReviewsOutlinedIcon />}
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
