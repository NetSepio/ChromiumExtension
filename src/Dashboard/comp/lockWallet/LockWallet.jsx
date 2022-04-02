import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import DashboardStyles from '../../DashboardStyles';
import LockIcon from '@mui/icons-material/Lock';
import Input from '../../../common/Input/Input.jsx';
import { useDispatch, useSelector } from 'react-redux';
import crypto from 'crypto-js';
import { Button } from '@mui/material';
import { useHistory } from 'react-router';
import { updateTab } from '../../../redux/projects/projectSlice';

const LockWallet = () => {
  const styles = DashboardStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [password, setPassword] = useState('');
  const [isDescrypted, setIsDescrypted] = useState('');
  const hashed = useSelector((state) => state.project.hashedMnem);

  const handleClick = () => {
    try {
      const decrypted = crypto.AES.decrypt(hashed, password).toString(
        crypto.enc.Utf8
      );
      setIsDescrypted(decrypted);
      if (decrypted?.length) {
        dispatch(updateTab({ data: 4 }));
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (isDescrypted?.length) {
      history.push('/dashboard');
    }
  }, [isDescrypted]);
  return (
    <Grid
      container
      direction="column"
      className={styles.mainContainer}
      justifyContent="center"
      alignItems="center"
    >
      <Grid item>
        <LockIcon fontSize="large" />
      </Grid>
      <Grid item style={{ marginBottom: '1rem' }}>
        <Input
          name="password"
          label=""
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />
      </Grid>
      <Grid item align="center">
        <Typography>
          <Button variant="contained" onClick={handleClick}>
            Unlock
          </Button>
        </Typography>
      </Grid>
    </Grid>
  );
};

export default LockWallet;
