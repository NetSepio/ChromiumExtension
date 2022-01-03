import React, { useEffect, useState } from 'react';
import { Grid, Typography, Button } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import {ethers} from 'ethers'

const NewWallet = () => {
  const [loading, setLoading] = React.useState(false);
  const [defaultAccount, setDefaultAccount] = useState('')
  // const [provider, setProvider] = useState(null)
  // const [signer, setSigner] = useState(null)
  // const [contract, setContract] = useState(null)
  // function handleClick() {
  //   setLoading(true);
  //   if(window.ethereum){
  //     window.ethereum.request({method:'eth_requestAccounts'}).
  //     then(res=>{
  //       accountChangeHandler(res[0])
  //     })
  //   }else{
  //     console.log("found nothing")
  //   }
  // }

  // const accountChangeHandler=(newAccount)=>{
  //   setDefaultAccount(newAccount)
  //   updateEhters()
  // }

  // const updateEhters=()=>{
  //   let tempProvider=new ethers.providers.Web3Provider(window.ethereum)
  //   setProvider(tempProvider)
  //   let tempSigner=tempProvider.getSigner()
  //   setSigner(tempSigner)

  //   let tempContract=new ethers.Contract(contractAddress,SimpleStore_abi,tempSigner)
  //   setContract(tempContract)
  // }
  const handleClick=async()=>{
    let mnemonic = ethers.Wallet.createRandom().mnemonic.phrase

    let mnemonicWallet = ethers.Wallet.fromMnemonic(mnemonic);
    let walletAddress = await mnemonicWallet.getAddress();
    console.log(walletAddress + " " + mnemonicWallet.privateKey);
    setDefaultAccount(walletAddress)
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
        <p>{defaultAccount}</p>
      </Grid>
    </Grid>
  );
};

export default NewWallet;
