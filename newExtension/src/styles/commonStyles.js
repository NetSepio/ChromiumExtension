import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  toolBar: {
    //   marginBottom:'10rem !important'
  },
  container: {
    minWidth: '100%',
    minHeight: '80vh',
    height: '100%',
    [theme.breakpoints.down('sm')]: {
      minHeight: '25rem',
      minWidth: '20rem',
    },
  },
}));
