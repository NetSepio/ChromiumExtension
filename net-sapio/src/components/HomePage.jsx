import React, { useState, useEffect } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import Loader from '../common/Loader';
import { lanuages } from './data/data';
import Dropdown from '../common/Dropdown';
import { useHistory } from 'react-router-dom';
import LandingDialogue from './popup/LandingDialogue';
import { useDispatch,useSelector } from 'react-redux';
import { updateStep } from '../redux/projects/projectSlice';


const useStyles = makeStyles((theme) => ({
  mainContainer: {
    minWidth: '100%',
    minHeight: '90vh',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: '35rem',
      minWidth: '24rem',
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
  const dispatch=useDispatch()
  const loggedIn=useSelector(state=>state?.project?.hashedMnem)
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(lanuages[0]);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    // setLoading(true);
    // setTimeout(() => {
    //   setLoading(false);
    // }, 2000);
    dispatch(updateStep({ data: 0 }));
  }, []);


  useEffect(()=>{
    if(loggedIn?.length){
      history.push("/dashboard")
    }
  },[loggedIn])
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      className={classes.mainContainer}
      // style={{minHeight:'100%',minWidth:'100%'}}
    >
      {loading && <Loader />}
      <Grid item style={{ marginBottom: '1rem', marginTop: '2rem' }}>
        <Typography variant="h5">Select Languages</Typography>
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
          // onClick={() => history.push('/create')}
          onClick={() => {setOpen(true)}}
          
        >
          Continue
        </Button>
      </Grid>
      <LandingDialogue
        open={open}
        handleClose={() => setOpen(!open)}
      />
    </Grid>
  );
};

export default HomePage;
