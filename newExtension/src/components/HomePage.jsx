import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../common/Loader';
import { lanuages } from './data/data';
import Dropdown from '../common/Dropdown';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minWidth: '100%',
    minHeight: '80vh',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: '25rem',
      minWidth: '20rem',
    },
  },
  btn: {
    backgroundColor: `${theme.palette.primary.main} !important`,
    // color: '#fff !important',
  },
}));
const HomePage = () => {
  const classes = useStyles();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(lanuages[0]);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);
  return (
    <Grid
      container
      direction="column"
      // justifyContent="center"
      alignItems="center"
      className={classes.mainContainer}
    >
      {loading && <Loader />}
      <Grid item style={{ marginBottom: '1rem', marginTop: '2rem' }}>
        <Typography variant="h5">Select Language</Typography>
      </Grid>
      <Grid item style={{ marginBottom: '1rem', minWidth: '15rem' }}>
        <Dropdown
          width="100%"
          value={selected}
          onChange={handleChange}
          arr={lanuages}
          disabled={false}
        />
      </Grid>
      <Grid item>
        <Button
          variant="filled"
          className={classes.btn}
          onClick={() => history.push('/create')}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default HomePage;
