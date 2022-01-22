import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { ethers } from 'ethers';
import commonStyles from '../styles/commonStyles';
import { addMnemonic } from '../redux/projects/projectSlice';
import {useDispatch,useSelector} from 'react-redux'
import { updateStep } from '../redux/projects/projectSlice';

const NewWallet = () => {
  const styles=commonStyles()
  const dispatch=useDispatch()
  const myMnemonic=useSelector(state=>state.project.mnemonic)
  const activeStep = useSelector((state) => state.project.activeStep);
  const [loading, setLoading] = React.useState(false);
  const [defaultAccount, setDefaultAccount] = useState('');
  const [mnemonic, setMnemonic] = useState('');

  const handleClick = async () => {
    let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setMnemonic(mnemonic);
    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let walletAddress = await mnemonicWallet.getAddress();
    console.log(walletAddress + ' ' + mnemonicWallet.privateKey);
    setDefaultAccount(walletAddress);
  };

  useEffect(() => {
    const getMnemonic = async () => {
      let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
      setMnemonic(mnemonic);
      let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
      let walletAddress = await mnemonicWallet.getAddress();
      console.log(walletAddress + ' ' + mnemonicWallet.privateKey);
      setDefaultAccount(walletAddress);
      dispatch(addMnemonic({data:mnemonic}))
      
    };
    myMnemonic?.length===0 && getMnemonic();
  }, []);
  return (
    <Grid container direction="column">
      <Grid item className={styles.item}>
        <Typography variant="h5" align="center" style={{ color: '#fff' }}>
          Secret Recovery Phrase
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Typography variant="body1" align="center" style={{ color: '#ffdc62' }}>
          This is the only way you will be able to recover your account. Please
          store it somewhere safe!
        </Typography>
      </Grid>
      <Grid item style={{ marginBottom: '4rem' }}>
        <textarea
          rows="3"
          readOnly
          className={styles.walletText}
          value={myMnemonic}
        />
      </Grid>
      <Grid item container xs justifyContent="center">
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            style={{ width: '100%' }}
            onClick={()=> dispatch(updateStep({ data: activeStep + 1 }))}
            disabled={myMnemonic?.length===0}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default NewWallet;
