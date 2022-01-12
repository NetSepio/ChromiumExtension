import { Grid, Typography, Checkbox, FormControlLabel ,Button} from '@mui/material';
import React, { useState } from 'react';
import LoginStyles from './LoginStyles';
import Input from '../input/Input';

const Login = () => {
  const styles = LoginStyles();
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
        <Button variant="contained" color="primary" style={{ width: '100%' }}>
          Continue
        </Button>
      </Grid>
    </Grid>
  );
};

export default Login;
