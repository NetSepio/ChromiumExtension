import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const NewWallet = () => {
  const [loading, setLoading] = React.useState(false);
  function handleClick() {
    setLoading(true);
  }
  return (
    <Grid container direction="column">
      <Grid item style={{ marginBottom: '1rem' }}>
        <Typography variant="h6">Generate Mnemonic</Typography>
      </Grid>
      <Grid item style={{ marginBottom: '1rem' }}>
        <Typography variant="body1">
          Create an new Ethereum wallet. Make sure to save the seed words as you
          won't be able to recover your wallet if you lose it.
        </Typography>
      </Grid>
      <Grid item>
        <LoadingButton
          color="primary"
          onClick={handleClick}
          loading={loading}
          loadingPosition="start"
          startIcon={<AccountBalanceWalletIcon />}
          variant="contained"
        >
          Create Wallet
        </LoadingButton>
      </Grid>
    </Grid>
  );
};

export default NewWallet;
