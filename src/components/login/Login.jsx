import { Grid, Typography, Checkbox, FormControlLabel ,Button} from '@mui/material';
import React, { useState } from 'react';
import LoginStyles from './LoginStyles';
import Input from '../input/Input';
import crypto from 'crypto-js'
import { useSelector } from 'react-redux';
import { addMnemonic, saveHashedMnemonic, updateStep } from '../../redux/projects/projectSlice';
import { useDispatch } from 'react-redux';

const Login = () => {
  const styles = LoginStyles();
  const dispatch=useDispatch()
  const myMnemonic=useSelector(state=>state.project.mnemonic)
  const activeStep=useSelector(state=>state.project.activeStep)
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [checked, setChecked] = React.useState(true);

  const onChange = (e) => {
    switch (e.target.name) {
      case 'password':
        setPassword(e.target.value);
        break;
      case 'confirmPassword':
        setConfirmPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleChangeChecked = (event) => {
    setChecked(event.target.checked);
  };

  const handleContinue=()=>{
    const hashed=crypto.AES.encrypt(myMnemonic,password).toString();
    dispatch(saveHashedMnemonic({data:hashed}))
    dispatch(updateStep({data:activeStep+1}))
    dispatch(addMnemonic({date:''}))
    // const decrypted=crypto.AES.decrypt(hashed,'vicky29@').toString(crypto.enc.Utf8)
    // console.log(decrypted,"m decrypted")
  }

  return (
    <Grid container direction="column">
      <Grid item style={{marginBottom:'0.45rem'}}>
        <Typography variant="h5" align="center" style={{ color: '#fff' }}>
          Create a password
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Typography
          variant="body1"
          align="center"
          style={{ opacity: 0.5, color: '#fff' }}
        >
          You will use this to unlock your wallet
        </Typography>
      </Grid>
      <Grid item className={styles.item}>
        <Input
          label="Password"
          name="password"
          value={password}
          onChange={onChange}
          type="password"
        />
      </Grid>
      <Grid item className={styles.item}>
        <Input
          label="Confirm Password"
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          type="password"
        />
      </Grid>
      <Grid item className={styles.item}>
        <FormControlLabel
          label={
            <p style={{ color: '#999999' }}>
              I agree to the
              <label style={{ color: '#8a81f8', marginLeft: 8 }}>
                Terms of Service
              </label>
            </p>
          }
          control={
            <Checkbox checked={checked} onChange={handleChangeChecked} />
          }
        />
      </Grid>

      <Grid item className={styles.item} xs={12}>
        <Button variant="contained" color="primary" style={{ width: '100%' }}
          onClick={handleContinue}
          disabled={password.length<6||confirmPassword.length<6||!checked}
        >
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
