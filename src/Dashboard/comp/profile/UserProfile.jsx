import React from 'react';
import { Grid, Avatar, Typography, Button } from '@mui/material';
import Input from '../../../common/Input/Input';
import { shortenAddress } from '../../../utils/commonUtils';
import { useSelector, useDispatch } from 'react-redux';
import UserStyles from './UserStyles';
import { ethers } from 'ethers';
import { contractAddress, abi } from '../../../utils/constants';
import HowToVoteOutlinedIcon from '@mui/icons-material/HowToVoteOutlined';
import Tooltip from '@mui/material/Tooltip';
import { requestFlowIdForRole } from '../../../redux/actions';

const UserProfile = () => {
  const styles = UserStyles();
  const dispatch = useDispatch();
  const { walletAddress, privateKey, flow } = useSelector(
    (state) => state?.project
  );
  let val = '';
  if (walletAddress?.length) {
    val = shortenAddress(walletAddress);
  }

  const handleRole = async () => {
    const provider = new ethers.providers.JsonRpcProvider(
      process.env.REACT_APP_API_NODE_URL
    );
    const signer = new ethers.Wallet(privateKey, provider);
    const transactionContract = new ethers.Contract(
      contractAddress,
      abi,
      signer
    );
    console.log(transactionContract)
    // let v=await transactionContract?.hasRole(walletAddress)
    // console.log(v,"role")
    let val = await transactionContract?.NETSEPIO_VOTER_ROLE();
    dispatch(
      requestFlowIdForRole({
        val: val,
        privateKey: privateKey,
        token: flow?.token,
      })
    );
  };
  return (
    <Grid container justifyContent="center" alignItems="center">
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
        <Grid container alignItems="center" spacing={1} className={styles.item}>
          <Grid item xs={10}>
            <Input
              name="role"
              label=""
              placeholder="Role"
              value={''}
              disabled
            />
          </Grid>
          <Grid item xs={2}>
            <Tooltip title="Get Role" arrow>
              <Button
                variant="contained"
                onClick={handleRole}
                sx={{ minWidth: '90%', height: '35px' }}
              >
                <HowToVoteOutlinedIcon />
              </Button>
            </Tooltip>
          </Grid>
        </Grid>
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
    </Grid>
  );
};

export default UserProfile;
