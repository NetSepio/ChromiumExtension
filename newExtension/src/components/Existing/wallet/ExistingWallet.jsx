import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { ethers } from 'ethers';
import commonStyles from '../../../styles/commonStyles';

const NewWallet = () => {
  const styles = commonStyles();
  const [loading, setLoading] = React.useState(false);
  const [defaultAccount, setDefaultAccount] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const handleExistingWallet = () => {};
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
          readOnly
          className={styles.walletText}
          value={mnemonic}
          onChange={(e) => setMnemonic(e.target.value)}
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
