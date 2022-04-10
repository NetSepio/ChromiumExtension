/* eslint-disable */
import React, { useState } from 'react';
import { Grid, Typography, Button,Paper } from '@mui/material';
import DashboardStyles from '../DashboardStyles';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import { useHistory } from 'react-router';
import Password from './Password.jsx';
import ShowRecovery from './ShowRecovery.jsx';

const Settings = () => {
  const styles = DashboardStyles();
  const history = useHistory();
  //   password specific
  const [open, setOpen] = React.useState(false);
  const [openRecovery, setOpenRecovery] = useState(false)

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  //Recovery specific
  const handleClickRecovery = () => {
    setOpenRecovery(true);
  };

  const handleCloseRecovery = () => {
    setOpenRecovery(false);
  };
  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      className={styles.settingsContainer}
    >
      <Typography component="span" variant="h6" style={{ marginBottom: '1rem' }}>
        Wallet123
      </Typography>
      {/* 1 */}
      <Grid
        item
        className={styles.accordionContainer}
        style={{ marginBottom: '0.8rem' }}
        component={Paper}
        elevation={10}
      >
        <Grid container>
          <Grid item container direction="column" xs={11} onClick={handleClickOpen}>
            <Grid item>Change Password</Grid>
            <Grid item>
              <Typography color="GrayText" style={{ fontSize: 14 }}>
                Change your lock screen password
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <ChevronRightOutlinedIcon />
          </Grid>
        </Grid>
      </Grid>
      {/* 2 */}
      <Grid
        item
        className={styles.accordionContainer}
        style={{ marginBottom: '0.8rem' }}
        component={Paper}
        elevation={10}
      >
        <Grid container>
          <Grid item container direction="column" xs={11}>
            <Grid item>Auto Lock Timer</Grid>
            <Grid item>
              <Typography color="GrayText" style={{ fontSize: 14 }}>
                Change your auto-lock timer duration
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <ChevronRightOutlinedIcon />
          </Grid>
        </Grid>
      </Grid>
      {/* 3 */}
      <Grid
        item
        className={styles.accordionContainer}
        style={{ marginBottom: '0.8rem' }}
        component={Paper}
        elevation={10}
      >
        <Grid container>
          <Grid item container direction="column" xs={11}>
            <Grid item>Change Network</Grid>
            <Grid item>
              <Typography color="GrayText" style={{ fontSize: 14 }}>
                Configure your network settings
              </Typography>
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <ChevronRightOutlinedIcon />
          </Grid>
        </Grid>
      </Grid>
      {/* 4 */}
      <Grid
        item
        className={styles.btnContainer}
        style={{ marginBottom: '1rem' }}
        onClick={handleClickRecovery}
      >
        <Button variant="contained" style={{ width: '100%' }}>
          Show Secret Recovery Phase
        </Button>
      </Grid>
      {/* 5 */}
      {/* <Grid
        item
        className={styles.btnContainer}
        style={{ marginBottom: '1rem' }}
      >
        <Button variant="contained" style={{ width: '100%' }}>
          Remove Wallet
        </Button>
      </Grid> */}
      {/* 6 */}
      <Grid item className={styles.btnContainer}>
        <Button variant="contained" style={{ width: '100%' }}>
          Reset Secret Recovery Phase
        </Button>
      </Grid>
      <Password open={open} handleClose={handleClose}/>
      <ShowRecovery open={openRecovery} handleClose={handleCloseRecovery}/>
    </Grid>
  );
};

export default Settings;
