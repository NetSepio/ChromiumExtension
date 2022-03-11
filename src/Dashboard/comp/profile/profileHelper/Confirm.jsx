import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';

export default function Confirm({
  open,
  setOpen,
  flag,
  setFlag,
  confirmData,
  setLoader,
}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <div>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">
          {'Signature Request'}
        </DialogTitle>
        <Divider />
        <Typography variant="body1" align="center" sx={{ mt: 1 }} color="gray">
          You are signing:
        </Typography>
        <DialogContent>
          <DialogContentText>
            <Typography variant="body1" color="gray">
              Message:
            </Typography>
            <Typography variant="body2">
              {confirmData?.eula}
              {confirmData?.flowId}
            </Typography>
          </DialogContentText>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Button
            onClick={() => {
              setOpen(false);
              setLoader(false);
            }}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              setFlag('move');
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
