import React from 'react';
import { SnackbarProvider } from 'notistack';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import snackbarStyles from './SnackbarStyles';
const CustomSnackbar = (props) => {
  const styles = snackbarStyles();
  return (
    <SnackbarProvider
      maxSnack={4}
      classes={{
        variantSuccess: styles.success,
        variantError: styles.error,
        variantWarning: styles.warning,
        variantInfo: styles.info,
      }}
      style={{
        minWidth: 'max-content',
        borderRadius: 4,
        font: 'normal normal bold 16px/20px Nunito',
        // paddingLeft: 30,
        marginRight:'20px !important',
        boxShadow: 'unset',
        marginBottom: '.5rem',
        zIndex: 99999999,
      }}
      autoHideDuration={3000}
      anchorOrigin={{
        vertical: 'top',
        horizontal:'right'
      }}
      hideIconVariant
      action={(key) => (
        <Button onClick={() => props.closeSnackbar(key)} id={key}>
          <CloseIcon />
        </Button>
      )}
    >
      {props.children}
    </SnackbarProvider>
  );
};

export default CustomSnackbar;
