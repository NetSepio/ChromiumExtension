import React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Grid,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from '../styles/commonStyles';
import Drawer from '../components/drawer/Drawer.jsx';

const Header = () => {
  const classes = styles();
  const handleClick = () => {
    return <Drawer />;
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar style={{ minHeight: 50 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Drawer />
            </Grid>
            <Grid item container xs alignItems="center">
              <Grid item sm={11}>
                <Typography variant="h6">http://localhost:3000/</Typography>
              </Grid>
              <Grid item container xs={1}>
                <Typography variant="body1" className={classes.ratings}>
                  4.5/5
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className style={{ marginBottom: '4.5rem' }} />
    </Box>
  );
};

export default Header;

// await walletMnemonic.signMessage("Hello World")
// // '0x14280e5885a19f60e536de50097e96e3738c7acae4e9e62d67272d794b8127d31c03d9cd59781d4ee31fb4e1b893bd9b020ec67dfa65cfb51e2bdadbb1de26d91c'

//  pass EULA +flow_id
