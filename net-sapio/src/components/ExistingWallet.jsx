import React, { useState } from 'react';
import { Grid, Typography, TextField, Button } from '@mui/material';
import { ethers } from 'ethers';

const ExistingWallet = () => {
  const [val, setVal] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const handleExistingWallet = async() => {
    const mnemonicWallet = ethers.Wallet.fromMnemonic(val);
    let foundWallet = await mnemonicWallet.getAddress();
    setWalletAddress(foundWallet);
  };
  return (
    <Grid container direction="column">
      <Grid item style={{ marginBottom: '1rem' }}>
        <Typography variant="h6">Bring Your Own Wallet</Typography>
      </Grid>
      <Grid item>
        <Typography variant="body1" style={{ marginBottom: '1rem' }}>
          Enter your seed words to import an existing ETH wallet and take
          control of all your Blockchain Transactions.
        </Typography>
      </Grid>
      <Grid item style={{ minWidth: '15rem', marginBottom: '1rem' }}>
        <TextField
          id="outlined-multiline-static"
          label="Seed Words"
          multiline
          rows={4}
          defaultValue=""
          fullWidth
          style={{color:'#fff'}}
          value={val}
          onChange={(e) => setVal(e.target.value)}
        />
      </Grid>
      <Grid item>{walletAddress}</Grid>
      <Grid item>
        <Button variant="contained" onClick={handleExistingWallet}>
          Import Wallet
        </Button>
      </Grid>
    </Grid>
  );
};

export default ExistingWallet;
