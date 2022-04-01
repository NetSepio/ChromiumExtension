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
  walletText: {
    fontSize: '1rem',
    resize: 'none',
    width: '98%',
    backgroundColor: '#181818',
    color: '#fff',
    lineHeight: '150%',
    borderRadius: 1,
    textAlign: 'left',
  },
  item: {
    marginBottom: '1rem !important',
  },
  domain: {
    // marginTop: '16px !important',
    backgroundColor: '#DEDEDE',
    borderRadius: 28,
    padding: 8,
  },
  ratings: {
    // marginTop: '16px !important',
    marginLeft: '10px !important',
    padding: '3px 14px 3px 14px',
    backgroundColor: '#3EDB3B',
    borderRadius: 24,
  },
  text: {
    textTransform: 'capitalize',
  },
}));
