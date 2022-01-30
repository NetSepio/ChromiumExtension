import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import { ethers } from 'ethers';
import commonStyles from '../../../styles/commonStyles';
import { useDispatch, useSelector } from 'react-redux';
import { addMnemonic, updateStep } from '../../../redux/projects/projectSlice';

const NewWallet = () => {
  const styles = commonStyles();
  const dispatch = useDispatch();
  const activeStep=useSelector(state=>state.project.activeStep)
  // const [loading, setLoading] = React.useState(false);
  // const [defaultAccount, setDefaultAccount] = useState('');
  const [mannual, setMannual] = useState('');

  const handleExistingWallet = async () => {
    try {
      const mnemonicWallet = ethers.Wallet.fromMnemonic(mannual);
      let foundWallet = await mnemonicWallet.getAddress();
      if (foundWallet.length > 0) {
        dispatch(addMnemonic({ data: mannual }));
        dispatch(updateStep({data:activeStep+1}))
      }
    } catch (error) {
      console.log(error, 'wallet found');
    }
  };
  return (
    <Grid container direction="column">
      <Grid item className={styles.item}>
        <Typography variant="h5" align="center" style={{ color: '#fff' }}>
          Secret Recovery Phrase
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Typography variant="body1" align="center" style={{ color: '#ffdc62' }}>
          Restore an existing wallet with your 12 or 24-word secret recovery
          phrase
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: '4rem' }}>
        <textarea
          rows="3"
          className={styles.walletText}
          value={mannual}
          onChange={(e) => setMannual(e.target.value)}
        />
      </Grid>
      <Grid item container xs justifyContent="center">
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
            onClick={handleExistingWallet}
          >
            Import secret recovery phrase
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewWallet;
