import { makeStyles } from '@mui/styles';

export default makeStyles((theme) => ({
  img: {
    borderRadius: '50%',
    height: '15rem',
    width: '15rem',
    [theme.breakpoints.down('sm')]: {
      height: '8rem',
      width: '8rem',
    },
  },
  status: {
    marginLeft: 16,
  },
  commonStatus: {
    display: 'flex',
    alignItems: 'center',
  },
  flagContainer: {
    backgroundColor: '#DEDEDE',
    paddingTop: 10,
    marginBottom: '1rem !important',
    marginTop: '1rem !important',
  },
}));
