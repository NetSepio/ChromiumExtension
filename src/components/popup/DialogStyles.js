import { makeStyles } from '@mui/styles';
export default makeStyles((theme) => ({
  dialogContainer: {
    minHeight: '25rem',
    minWidth: '24rem',
    maxHeight: '25rem',
    maxWidth: '24rem',
    backgroundColor: '#222222 !important',
    padding: '0px 1rem 1rem 1rem',
    borderRadius: 10,
    border: '1px solid red',
  },
  logo: {
    height: '4rem',
  },
  commonMargin: {
    marginBottom: '0.75rem !important',
  },
  typo1: {
    color: '#fff',
    marginBottom: '0.9rem',
  },
  textTypo: {
    color: '#999999',
  },
  btn: {
    minWidth: '100% !important',
    textTransform: 'capitalize !important',
  },
}));
