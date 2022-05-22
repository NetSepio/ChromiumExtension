/* eslint-disable */
import React, { useState } from 'react';
import { Grid, Avatar } from '@mui/material';
import Input from '../../../common/Input/Input.jsx';
import { shortenAddress } from '../../../utils/commonUtils';
import { useSelector } from 'react-redux';
import UserStyles from './UserStyles';
import { ethers } from 'ethers';
import { contractAddress, abi } from '../../../utils/constants';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import { useSnackbar } from 'notistack';
import Loader from '../../../common/Loader';
import { Input as NewInput } from '@mui/material';
import InputStyles from '../../../common/Input/InputStyles';
import Confirm from './profileHelper/Confirm.jsx';
import { ProfileService } from '../../../services/profileService';
import { useQuery } from '@apollo/react-hooks';
import { FETCH_ROLE } from '../../../graphql/Query/Query';
import { useEffect } from 'react';
import { NODE_URL } from '../../../services/helper/config.js';

const _ProfileService = new ProfileService();
const UserProfile = () => {
  const styles = UserStyles();
  const classes = InputStyles();
  const [open, setOpen] = useState(false);
  const [flag, setFlag] = useState('cancel');
  const [confirmData, setConfirmData] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { walletAddress, privateKey } = useSelector(
    (state) => state?.project
  );
  let val = '';
  let id = walletAddress?.toLowerCase();
  const { data } = useQuery(FETCH_ROLE, {
    variables: { id },
  });
  const [loader, setLoader] = useState(false);
  if (walletAddress?.length) {
    val = shortenAddress(walletAddress);
  }

  const provider = new ethers.providers.JsonRpcProvider(
    NODE_URL
  );
  const signer = new ethers.Wallet(privateKey, provider);
  const transactionContract = new ethers.Contract(contractAddress, abi, signer);
  const handleRole = async () => {
    try {
      setLoader(true);
      let val = await transactionContract?.NETSEPIO_VOTER_ROLE();
      const { data } = await _ProfileService.fetchRoleById(val);
      setConfirmData(data?.payload);
      setOpen(true);
    } catch (error) {
      console.log(error);
      enqueueSnackbar('Something went wrong', {
        variant: 'error',
      });
    }
  };

  useEffect(() => {
    const grantRole = async () => {
      try {
        let signatureVal = await signer.signMessage(
          `${confirmData?.eula}${confirmData?.flowId}`
        );
        const { data } = await _ProfileService.createRole({
          flowId: confirmData?.flowId,
          signature: signatureVal,
        });
        if (data?.status === 200) {
          let val = await transactionContract?.NETSEPIO_VOTER_ROLE();
          if (val === data?.payload?.transactionHash) {
            console.log('completed');
          }
          enqueueSnackbar('Role successfully claimed', {
            variant: 'success',
          });
          setLoader(false);
          setFlag('cancel');
          setConfirmData({});
        } else {
          enqueueSnackbar('Something went wrong', {
            variant: 'success',
          });
          setLoader(false);
          setFlag('cancel');
          setConfirmData({});
        }
      } catch (error) {
        console.log(error);
        setLoader(false);
        enqueueSnackbar('Something went wrong', {
          variant: 'error',
        });
      }
    };
    if (flag === 'move') {
      grantRole();
    } else {
      setLoader(false);
    }
  }, [flag]);
  return (
    <Grid container justifyContent="center" alignItems="center">
      {loader && <Loader />}
      <Grid item lg={8} xs={12}>
        <Grid container justifyContent="center">
          <Grid item>
            <Avatar
              alt="Remy Sharp"
              src="/static/images/avatar/1.jpg"
              sx={{ width: 56, height: 56, marginBottom: '1rem' }}
            />
          </Grid>
        </Grid>
        <div className={styles.item}>
          <Input name="name" placeholder="Name" value={'Account1'} />
        </div>
        <div className={styles.item}>
          <Input
            name="walletAddress"
            label=""
            placeholder="Wallet Address"
            value={walletAddress}
            disabled
          />
        </div>
        <div className={styles.item}>
          <NewInput
            variant="outlined"
            className={classes.input}
            sx={{ color: '#fff' }}
            endAdornment={
              // <Tooltip title="Claim Role" arrow>
              <HowToVoteOutlinedIcon
                onClick={handleRole}
                sx={{ cursor: 'pointer' }}
              />
              // </Tooltip>
            }
            value={data?.user?.roles?.length?"Voter":""}
          />
        </div>
        <div className={styles.item}>
          <Input
            name="karmaPoints"
            label=""
            placeholder="Karma Points"
            value={''}
            disabled
          />
        </div>
        <Input
          name="Status"
          label=""
          placeholder="Status"
          value={''}
          disabled
        />
      </Grid>
      <Confirm
        open={open}
        setOpen={setOpen}
        flag={flag}
        setFlag={setFlag}
        confirmData={confirmData}
        setLoader={setLoader}
      />
    </Grid>
  );
};

export default UserProfile;
