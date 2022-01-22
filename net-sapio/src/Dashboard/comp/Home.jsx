import React from 'react';
import { Grid, Typography } from '@mui/material';

const Home = () => {
  return (
    <Grid container justifyContent="center" style={{ minWidth: '100%' }}>
      <Grid item>
        <Typography variant="h4">$.00</Typography>
      </Grid>
    </Grid>
  );
};

export default Home;
