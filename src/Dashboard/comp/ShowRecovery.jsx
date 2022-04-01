import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Grid, TextField } from '@mui/material';
import Input from '../../common/Input/Input.jsx';
import DashboardStyles from '../DashboardStyles';
import { Button } from '@mui/material';
import crypto from 'crypto-js';
import { useSelector } from 'react-redux';
import ShowMnem from './ShowMnem.jsx';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ShowRecovery = ({ open, handleClose }) => {
  const styles = DashboardStyles();
  const [password, setPassword] = useState('');
  const [isDescrypted, setIsDescrypted] = useState('');
  const hashed = useSelector((state) => state.project.hashedMnem);

  const handleCheckPassword = () => {
    try {
      const decrypted = crypto.AES.decrypt(hashed, password).toString(
        crypto.enc.Utf8
      );
      console.log(decrypted, 'm decrypted');
     setIsDescrypted(decrypted)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(()=>{
    setIsDescrypted("")
    setPassword("")
  },[open])
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: '#2c2d30',
        },
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {isDescrypted?.length > 0 ? (
        <ShowMnem val={isDescrypted} />
      ) : (
        <Grid
          container
          justifyContent="center"
          style={{ paddingLeft: '12px', paddingRight: '12px' }}
        >
          <Grid item>
            <Grid container direction="column">
              <Grid item style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <Typography variant="h5" color="gainsboro" align="center">
                  Show Secret Recovery Phase
                </Typography>
              </Grid>
              <Grid
                item
                className={styles.warningContainer}
                style={{ marginBottom: '1rem' }}
              >
                <Typography color="InfoBackground">
                  Do not share your secret phase ! 
                  <Typography >
                    if someone has your secret phrase they will have full
                    control of your wallet
                  </Typography>
                </Typography>
              </Grid>
              <Grid item style={{ marginBottom: '1rem' }}>
                <Input
                  name="password"
                  label=""
                  placeholder="Passwrd"
                  value={password}
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Grid>
              <Grid item>
                <Typography align="center">
                  <Button
                    variant="contained"
                    onClick={() => handleCheckPassword()}
                  >
                    Submit
                  </Button>
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      )}
    </Dialog>
  );
};
export default ShowRecovery;
