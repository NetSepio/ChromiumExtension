import React, { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import {
  DialogTitle,
  DialogContent,
  DialogContentText,
  Typography,
  Button,
  Dialog,
} from '@mui/material';
import DialogStyles from './DialogStyles';
import MainDialogue from './MainDialogue';
import { useDispatch } from 'react-redux';
import { updateStep } from '../../redux/projects/projectSlice';

const LandingDialogue = ({ open, handleClose }) => {
  const styles = DialogStyles();
  const dispatch=useDispatch()
  const [mainDialogue, setMainDialogue] = useState(false);
  const [activeExisting, setActiveExisting] = useState(false);

  const handleCloseMainDialogue = () => {
    setMainDialogue(false);
  };

  useEffect(()=>{
    setActiveExisting(false)
  },[])
  return (
    <Dialog
      open={open}
      // TransitionComponent={Transition}
      keepMounted
      // onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      PaperProps={{
        style: {
          backgroundColor: '#222222',
          padding: '0px 1rem 1rem 1rem',
          borderRadius: 10,
        },
      }}
      maxWidth="xs"
      fullWidth
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          <Grid container direction="column" alignItems="center">
            <Grid item className={styles.commonMargin}>
              <img src="/images/icon.png" alt="img" className={styles.logo} />
            </Grid>
            <Grid item>
              <Typography align="center" variant="h5" className={styles.typo1}>
                Net Sapio
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                align="center"
                variant="h6"
                className={styles.textTypo}
              >
                A crypto wallet for NFTs
              </Typography>
            </Grid>
            <Grid
              item
              container
              style={{ marginTop: '50%' }}
              direction="column"
            >
              <Grid item xs={12} className={styles.commonMargin}>
                <Button
                  variant="contained"
                  color="primary"
                  className={styles.btn}
                  onClick={() => {
                    handleClose();
                    setActiveExisting(false);
                    setMainDialogue(true);
                  }}
                >
                  Create New Wallet
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  className={styles.btn}
                  onClick={() => {
                    handleClose();
                    setActiveExisting(true);
                    setMainDialogue(true);
                    dispatch(updateStep({ data: 0 }));
                  }}
                >
                  Import Existing
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </DialogContentText>
      </DialogContent>
      <MainDialogue
        open={mainDialogue}
        handleClose={handleCloseMainDialogue}
        activeExisting={activeExisting}
      />
    </Dialog>
  );
};

export default LandingDialogue;
