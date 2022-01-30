import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import HomeStyles from '../styles/HomeStyles';
import Review from './Review';

const Home = () => {
  const classes = HomeStyles();
  const [val, setVal] = useState(0);
  return (
    <Grid container justifyContent="center" style={{ minWidth: '100%' }}>
      {val === 0 ? (
        <Grid item container direction="column" alignItems="center">
          <Grid item style={{ marginBottom: '3rem' }}>
            <Typography variant="h4">$.00</Typography>
          </Grid>
          <Grid item style={{ marginBottom: '2rem' }}>
            <img
              src="/images/icon-box.png"
              alt="logo"
              className={classes.img}
            />
          </Grid>
          <Grid item>
            <Button variant="outlined" onClick={() => setVal(1)}>
              Report website
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Review goBack={()=>setVal(0)}/>
      )}
    </Grid>
  );
};

export default Home;
