import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import { Grid } from '@mui/material';
import Input from '../../common/Input/Input';
import DashboardStyles from '../DashboardStyles';
import { Button } from '@mui/material';
import crypto from 'crypto-js'
import { saveHashedMnemonic } from '../../redux/projects/projectSlice';
import { useDispatch,useSelector } from 'react-redux';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Password = ({ open, handleClose }) => {
  const styles = DashboardStyles();
  const dispatch=useDispatch()
  const hashed = useSelector((state) => state.project.hashedMnem);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const onChange = (e) => {
    switch (e.target.name) {
      case 'currentPassword':
        setCurrentPassword(e.target.value);
        break;
      case 'newPassword':
        setNewPassword(e.target.value);
        break;
      case 'confirmNewPassword':
        setConfirmNewPassword(e.target.value);
        break;
      default:
        break;
    }
  };

  const handleChangePassword = () => {
    try {
      const decrypted = crypto.AES.decrypt(hashed, currentPassword).toString(
        crypto.enc.Utf8
      );
      if (decrypted) {
        const hashed = crypto.AES.encrypt(decrypted, newPassword).toString();
        dispatch(saveHashedMnemonic({ data: hashed }));
        setCurrentPassword("")
        setNewPassword("")
        setConfirmNewPassword("")
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          backgroundColor: '#2c2d30',
        },
      }}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Grid container justifyContent="center">
        <Grid item style={{ minWidth: '15rem' }}>
          <Grid container direction="column">
            <Grid item style={{ marginTop: '1rem', marginBottom: '1rem' }}>
              <Typography variant="h5" color="gainsboro" align="center">
                Change Password
              </Typography>
            </Grid>
            <Grid item style={{ marginBottom: '1rem' }}>
              <Input
                name="currentPassword"
                label=""
                placeholder="Current password"
                value={currentPassword}
                onChange={onChange}
                type="password"
              />
            </Grid>
            <Grid item style={{ marginBottom: '1rem' }}>
              <Input
                name="newPassword"
                label=""
                placeholder="New password"
                value={newPassword}
                onChange={onChange}
                type="password"
              />
            </Grid>
            <Grid item style={{ marginBottom: '1rem' }}>
              <Input
                name="confirmNewPassword"
                label=""
                placeholder="Confirm new password"
                value={confirmNewPassword}
                onChange={onChange}
                type="password"
              />
            </Grid>
            <Grid item>
              <Typography align="center">
                <Button variant="contained" onClick={()=>{handleChangePassword();handleClose()}}>
                  Submit
                </Button>
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
};
export default Password;
