import React, { useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import Input from '../../common/Input/Input.jsx';
import SendTokenStyles from '../styles/SendTokenStyles';

const SendTokens = () => {
  const classes = SendTokenStyles();
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  return (
    <Grid container direction="column" alignItems="flex-start">
      <Grid container justifyContent="center">
        <Grid item className={classes.subContainer}>
          <Grid item className={classes.item} xs={12}>
            <Typography>Send Tokens</Typography>
          </Grid>
          <Grid item className={classes.item} xs={12}>
            <Input
              name="url"
              label=""
              placeholder="Wallet Address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
            />
          </Grid>
          <Grid item className={classes.item} xs={12}>
            <Input
              name="url"
              label=""
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography align="center">
              <Button variant="outlined">Send</Button>
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SendTokens;
