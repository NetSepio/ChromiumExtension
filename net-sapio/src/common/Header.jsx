import React from 'react';
import { AppBar, Box, Toolbar, Typography, IconButton,Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import styles from '../styles/commonStyles';
import Drawer from '../components/drawer/Drawer';

const Header = () => {
  const classes = styles();
  const handleClick = () => {
    return <Drawer />;
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar >
          <Grid container  alignItems="center" spacing={2} >
            <Grid item>
              <Drawer />
            </Grid>
            <Grid item>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Net Sapio
              </Typography>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <div className style={{ marginBottom: '4.5rem' }} />
    </Box>
  );
};

export default Header;
