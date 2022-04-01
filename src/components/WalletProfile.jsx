import React, { useState } from 'react';
import styles from '../styles/commonStyles.js';
import { Grid, Typography, Tabs, Tab, Box } from '@mui/material';
import NewWallet from './NewWallet.jsx';
import ExistingWallet from './ExistingWallet.jsx';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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
const WalletProfile = () => {
  const classes = styles();
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Grid
      container
      className={classes.container}
      style={{ marginTop: '6rem' }}
      direction="column"
    >
      <Grid item style={{ marginBottom: '1rem', paddingLeft: 15 }}>
        <Typography variant="h5" className={classes.text}>Create Wallet</Typography>
      </Grid>
      <Grid item container>
        <Grid item>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Create New" />
            <Tab label="Import Existing" />
          </Tabs>
        </Grid>
        <Grid item container>
          <TabPanel value={value} index={0}>
            <NewWallet />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ExistingWallet />
          </TabPanel>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default WalletProfile;
